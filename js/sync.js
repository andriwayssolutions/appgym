/* ==========================================================================
   AppGym — sync.js
   Sincronización del progreso entre dispositivos con Supabase (Auth + Postgres).
   --------------------------------------------------------------------------
   - La app SIEMPRE funciona sólo con localStorage. La nube es un extra:
     sin login, sin red o sin config, todo sigue igual.
   - Primera sincronización tras loguearse: si la nube está vacía, SUBE el
     localStorage actual tal cual (nunca lo pisa con vacío).
   - Merge a nivel de campo: une history / custom / done / log / rms por clave;
     nunca borra una serie ni un día ya registrado.
   - Hooks: app.js y program.js llaman window.AppGymSync.onLocalChange() en su
     save(), y exponen exportState() / importState() para recargar desde afuera.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.AppGymConfig || {};
  var SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/dist/umd/supabase.js";
  var META_KEY = "appgym:sync:v1";
  var APP_KEY = "appgym:v1";
  var PROGRAM_KEY = "appgym:program:v1";
  var PUSH_DEBOUNCE = 2500;

  var AGS = (window.AppGymSync = {
    applying: false, // true mientras aplicamos estado remoto → los save() no re-disparan sync
    onLocalChange: onLocalChange,
    syncNow: function () { scheduleSync(0, "manual"); },
    signIn: signIn,
    signOut: signOut,
    getStatus: function () { return status; }
  });

  var sb = null;
  var user = null;
  var status = "loading"; // loading | nocfg | signedout | syncing | synced | pending | offline | error
  var meta = loadMeta();
  var pushTimer = null;
  var running = false;
  var rerun = false;
  var panelOpen = false;

  /* ------------------------------------------------------------------ meta */
  function loadMeta() {
    try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveMeta() {
    try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch (e) { /* noop */ }
  }

  /* ------------------------------------------------------------------ boot */
  var booted = false;

  function boot() {
    if (booted) return;
    booted = true;
    injectStyles();
    buildUI();
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) { setStatus("nocfg"); return; }
    loadScript(SDK_URL, function (ok) {
      if (!ok || !window.supabase) { setStatus("error"); return; }
      initClient();
    });
  }

  function loadScript(src, cb) {
    var s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = function () { cb(true); };
    s.onerror = function () { cb(false); };
    document.head.appendChild(s);
  }

  function initClient() {
    sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    sb.auth.getSession().then(function (res) {
      var session = res && res.data && res.data.session;
      if (session && session.user) { user = session.user; setStatus("pending"); scheduleSync(0, "boot"); }
      else setStatus("signedout");
      renderPanel();
    });

    sb.auth.onAuthStateChange(function (event, session) {
      if (event === "SIGNED_OUT") {
        user = null;
        setStatus("signedout");
      } else if (session && session.user) {
        var had = user && user.id;
        user = session.user;
        if (!had) { setStatus("pending"); scheduleSync(0, "signin"); }
      }
      renderPanel();
    });

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && user) scheduleSync(400, "visible");
    });
    window.addEventListener("focus", function () { if (user) scheduleSync(600, "focus"); });
    window.addEventListener("online", function () { if (user) scheduleSync(200, "online"); });
    window.addEventListener("offline", function () { if (user) setStatus("offline"); });
  }

  /* ------------------------------------------------------------------ auth */
  function signIn() {
    if (!sb) return;
    sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: location.origin + location.pathname }
    });
  }
  function signOut() {
    if (!sb) { return; }
    sb.auth.signOut().then(function () {
      user = null;
      setStatus("signedout");
      renderPanel();
    });
  }

  /* --------------------------------------------------------------- engine */
  function onLocalChange() {
    meta.localMutatedAt = Date.now();
    saveMeta();
    if (!user) return;
    if (status === "synced" || status === "syncing" || status === "loading") setStatus("pending");
    scheduleSync(PUSH_DEBOUNCE, "local");
  }

  function scheduleSync(delay, reason) {
    if (!user || !sb) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { runSync(reason); }, delay);
  }

  function runSync(reason) {
    if (!user || !sb) return;
    if (!navigator.onLine) { setStatus("offline"); return; }
    if (running) { rerun = true; return; }
    running = true;
    if (status !== "pending") setStatus("syncing");

    var local = readLocal();

    sb.from("user_state").select("app,program,updated_at").eq("user_id", user.id).maybeSingle()
      .then(function (res) {
        if (res.error) throw res.error;
        var data = res.data;
        if (!data) {
          // La nube no tiene fila todavía → subimos el localStorage actual tal cual.
          return doPush(local.app, local.program);
        }
        var remoteMs = Date.parse(data.updated_at) || 0;
        var remoteNewer = remoteMs > (meta.localMutatedAt || 0);
        var mApp = mergeApp(local.app, data.app || {}, remoteNewer);
        var mProg = mergeProgram(local.program, data.program || {}, remoteNewer);
        applyLocal(mApp, mProg);
        if (!eq(mApp, data.app) || !eq(mProg, data.program)) {
          return doPush(mApp, mProg);
        }
      })
      .then(function () {
        meta.localMutatedAt = Date.now();
        meta.lastSyncAt = Date.now();
        saveMeta();
        finishSync("synced");
      })
      .catch(function (err) {
        console.warn("[sync]", (err && err.message) || err);
        finishSync("error");
      });
  }

  function doPush(app, program) {
    return sb.from("user_state")
      .upsert({ user_id: user.id, app: app, program: program }, { onConflict: "user_id" })
      .then(function (res) { if (res.error) throw res.error; });
  }

  function finishSync(st) {
    running = false;
    setStatus(st);
    if (rerun) { rerun = false; scheduleSync(300, "rerun"); }
  }

  /* --------------------------------------------------- local read / apply */
  function safeParse(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; }
  }
  function readLocal() {
    return {
      app: (window.AppGym && window.AppGym.exportState) ? window.AppGym.exportState() : safeParse(APP_KEY),
      program: (window.AppGymProgram && window.AppGymProgram.exportState) ? window.AppGymProgram.exportState() : safeParse(PROGRAM_KEY)
    };
  }
  function applyLocal(app, program) {
    AGS.applying = true;
    try {
      if (window.AppGym && window.AppGym.importState) window.AppGym.importState(app);
      else { try { localStorage.setItem(APP_KEY, JSON.stringify(app)); } catch (e) {} }
      if (window.AppGymProgram && window.AppGymProgram.importState) window.AppGymProgram.importState(program);
      else { try { localStorage.setItem(PROGRAM_KEY, JSON.stringify(program)); } catch (e) {} }
    } finally {
      AGS.applying = false;
    }
  }

  /* -------------------------------------------------------- merge helpers */
  function eq(a, b) { try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return false; } }
  function has(v) { return v !== undefined && v !== null; }
  function pick(primary, secondary) { return has(primary) ? primary : secondary; }

  // Une dos listas por una clave de identidad. Ante conflicto gana el primer
  // argumento (list "a").
  function unionById(a, b, key) {
    var map = {}, order = [];
    [b, a].forEach(function (list) {
      (list || []).forEach(function (x) {
        if (!x || x[key] == null) return;
        if (!(x[key] in map)) order.push(x[key]);
        map[x[key]] = x;
      });
    });
    return order.map(function (k) { return map[k]; });
  }

  function mergeApp(a, b, remoteNewer) {
    a = a || {}; b = b || {};
    var s = remoteNewer ? b : a; // "scalarSrc": lado más nuevo para campos escalares
    var o = remoteNewer ? a : b;
    var out = {
      rep: s.rep || o.rep,
      set: s.set || o.set,
      sound: pick(s.sound, o.sound),
      theme: s.theme || o.theme,
      history: unionById(a.history, b.history, "id").sort(function (x, y) { return (x.ts || 0) - (y.ts || 0); }),
      custom: unionById(s.custom, o.custom, "id")
    };
    Object.keys(out).forEach(function (k) { if (out[k] === undefined) delete out[k]; });
    return out;
  }

  function mergeProgram(a, b, remoteNewer) {
    a = a || {}; b = b || {};
    var s = remoteNewer ? b : a;
    var o = remoteNewer ? a : b;
    var d = mergeDone(a.done, a.doneAt, b.done, b.doneAt);
    return {
      unit: s.unit || o.unit || "kg",
      startDate: s.startDate || o.startDate || null,
      rms: Object.assign({}, o.rms, s.rms),
      done: d.done,
      doneAt: d.doneAt,
      log: mergeLog(a.log, b.log, remoteNewer)
    };
  }

  // "done" se resuelve por día con last-write-wins usando doneAt (marca de
  // tiempo del último marcar/desmarcar en cada dispositivo). Si no hay marca de
  // tiempo en ninguno de los dos lados (datos viejos, previos a esta versión)
  // se cae al comportamiento anterior: OR, para no perder progreso ya hecho.
  function mergeDone(aDone, aAt, bDone, bAt) {
    aDone = aDone || {}; bDone = bDone || {}; aAt = aAt || {}; bAt = bAt || {};
    var done = {}, doneAt = {}, cids = {};
    [aDone, bDone, aAt, bAt].forEach(function (m) {
      Object.keys(m).forEach(function (k) { cids[k] = 1; });
    });
    Object.keys(cids).forEach(function (cid) {
      var ta = aAt[cid] || 0, tb = bAt[cid] || 0;
      var isDone, at;
      if (ta === 0 && tb === 0) { isDone = !!aDone[cid] || !!bDone[cid]; at = 0; }
      else if (ta >= tb) { isDone = !!aDone[cid]; at = ta; }
      else { isDone = !!bDone[cid]; at = tb; }
      if (isDone) done[cid] = true;
      if (at) doneAt[cid] = at;
    });
    return { done: done, doneAt: doneAt };
  }

  function mergeLog(a, b, remoteNewer) {
    a = a || {}; b = b || {};
    var out = {}, keys = {};
    Object.keys(a).forEach(function (k) { keys[k] = 1; });
    Object.keys(b).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (k) {
      if (!a[k]) out[k] = b[k];
      else if (!b[k]) out[k] = a[k];
      else out[k] = mergeLogEntry(a[k], b[k], remoteNewer);
    });
    return out;
  }

  function mergeLogEntry(a, b, remoteNewer) {
    var p = remoteNewer ? b : a;
    var s = remoteNewer ? a : b;
    var entry = {
      date: a.date || b.date || null,
      sets: mergeSets(a.sets, b.sets),
      finishers: Object.assign({}, s.finishers, p.finishers),
      warmup: Object.assign({}, s.warmup, p.warmup),
      note: (p.note && String(p.note).trim()) ? p.note : (s.note || ""),
      timer: mergeTimer(a.timer, b.timer, remoteNewer)
    };
    var total = Math.max(a.totalSec || 0, b.totalSec || 0);
    if (total) entry.totalSec = total;
    return entry;
  }

  // Series de un ejercicio: array posicional de {w,r,ts,m}. Nos quedamos con la
  // versión más completa (más series); a igualdad, la de timestamp más reciente.
  function mergeSets(a, b) {
    a = a || {}; b = b || {};
    var out = {}, keys = {};
    Object.keys(a).forEach(function (k) { keys[k] = 1; });
    Object.keys(b).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (k) {
      var la = a[k] || [], lb = b[k] || [];
      if (la.length !== lb.length) out[k] = la.length > lb.length ? la : lb;
      else out[k] = maxTs(la) >= maxTs(lb) ? la : lb;
    });
    return out;
  }
  function maxTs(list) {
    return (list || []).reduce(function (m, x) { return Math.max(m, (x && x.ts) || 0); }, 0);
  }

  // Cronómetro de la sesión ({accum, startedAt}). Antes "el que corre gana", lo
  // que revertía una pausa: si la nube tenía un startedAt viejo, el reloj local
  // pausado se reanudaba solo. Ahora manda el lado más nuevo a nivel de fila
  // (pausar hace save() → bumpea meta.localMutatedAt, así que el local gana
  // recién pausado). Si son iguales, el que tenga más tiempo acumulado.
  function mergeTimer(a, b, remoteNewer) {
    if (!a) return b || undefined;
    if (!b) return a || undefined;
    if (eq(a, b)) return a;
    return remoteNewer ? b : a;
  }

  /* -------------------------------------------------------------- UI */
  function injectStyles() {
    if (document.getElementById("syncStyles")) return;
    var css = [
      "#btnSync{position:relative}",
      "#btnSync svg{width:1.15em;height:1.15em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      "#btnSync .sync-dot{position:absolute;top:5px;right:5px;width:7px;height:7px;border-radius:50%;background:var(--text-faint);border:1.5px solid var(--surface);transition:background .2s}",
      "#btnSync[data-sync='synced'] .sync-dot{background:var(--success)}",
      "#btnSync[data-sync='syncing'] .sync-dot,#btnSync[data-sync='pending'] .sync-dot{background:var(--accent)}",
      "#btnSync[data-sync='error'] .sync-dot{background:var(--danger)}",
      "#btnSync[data-sync='offline'] .sync-dot{background:var(--text-faint)}",
      ".sync-panel{position:fixed;top:calc(var(--header-h) + 8px);right:12px;z-index:120;width:min(300px,calc(100vw - 24px));background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);box-shadow:var(--shadow);padding:15px;font-family:var(--font-body);color:var(--text)}",
      ".sync-panel h4{margin:0 0 6px;font-size:14px;font-weight:700}",
      ".sync-panel p{margin:0 0 10px;font-size:12.5px;color:var(--text-muted);line-height:1.45}",
      ".sync-panel .sync-email{display:block;font-weight:600;font-size:13px;color:var(--text);word-break:break-all;margin-bottom:2px}",
      ".sync-panel button{width:100%;margin-top:8px;padding:9px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font:inherit;font-size:13px;font-weight:600;cursor:pointer}",
      ".sync-panel button:active{transform:scale(.98)}",
      ".sync-panel button.primary{background:var(--accent);border-color:var(--accent);color:#fff}",
      ".sync-panel button:disabled{opacity:.5;cursor:default}",
      ".sync-line{display:flex;align-items:center;gap:7px;font-size:12.5px;margin:4px 0 2px}",
      ".sync-line i{width:8px;height:8px;border-radius:50%;background:var(--text-faint);flex:none}",
      ".sync-line.synced i{background:var(--success)}",
      ".sync-line.syncing i,.sync-line.pending i{background:var(--accent)}",
      ".sync-line.error i{background:var(--danger)}"
    ].join("");
    var st = document.createElement("style");
    st.id = "syncStyles";
    st.textContent = css;
    document.head.appendChild(st);
  }

  var CLOUD = '<svg viewBox="0 0 24 24"><path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.6-1.6A3.5 3.5 0 0 1 18 18z"/></svg>';

  function buildUI() {
    var btn = document.getElementById("btnSync");
    if (!btn) {
      var host = document.querySelector(".header-actions");
      if (!host) return;
      btn = document.createElement("button");
      btn.id = "btnSync";
      btn.className = "icon-btn";
      host.insertBefore(btn, host.firstChild);
    }
    btn.innerHTML = CLOUD + '<span class="sync-dot"></span>';
    btn.title = "Cuenta y sincronización";
    btn.setAttribute("aria-label", "Cuenta y sincronización");
    btn.addEventListener("click", function (e) { e.stopPropagation(); togglePanel(); });

    var panel = document.createElement("div");
    panel.className = "sync-panel";
    panel.id = "syncPanel";
    panel.hidden = true;
    panel.addEventListener("click", function (e) { e.stopPropagation(); });
    document.body.appendChild(panel);

    document.addEventListener("click", function () { if (panelOpen) closePanel(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panelOpen) closePanel(); });

    applyStatusToButton();
  }

  function togglePanel() { panelOpen ? closePanel() : openPanel(); }
  function openPanel() {
    panelOpen = true;
    var p = document.getElementById("syncPanel");
    if (p) { p.hidden = false; }
    renderPanel();
    if (user) scheduleSync(0, "panel");
  }
  function closePanel() {
    panelOpen = false;
    var p = document.getElementById("syncPanel");
    if (p) p.hidden = true;
  }

  var STATUS_TEXT = {
    loading: "Cargando…",
    nocfg: "Sync no configurado",
    signedout: "Sin conexión con la nube",
    syncing: "Sincronizando…",
    synced: "Sincronizado",
    pending: "Cambios sin subir…",
    offline: "Sin internet — se subirá luego",
    error: "Error al sincronizar"
  };

  function setStatus(s) {
    status = s;
    applyStatusToButton();
    if (panelOpen) renderPanel();
  }
  function applyStatusToButton() {
    var btn = document.getElementById("btnSync");
    if (btn) btn.setAttribute("data-sync", status);
  }

  function fmtAgo(ts) {
    if (!ts) return "";
    var s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return "hace instantes";
    if (s < 3600) return "hace " + Math.round(s / 60) + " min";
    if (s < 86400) return "hace " + Math.round(s / 3600) + " h";
    return "hace " + Math.round(s / 86400) + " días";
  }

  function renderPanel() {
    var p = document.getElementById("syncPanel");
    if (!p) return;
    var lineCls = status === "synced" ? "synced"
      : (status === "syncing" || status === "pending") ? "syncing"
      : status === "error" ? "error" : "";

    if (status === "nocfg") {
      p.innerHTML = "<h4>Sincronización</h4><p>Falta configurar Supabase en <code>js/config.js</code>.</p>";
      return;
    }

    if (!user) {
      p.innerHTML =
        "<h4>Sincronizá tu progreso</h4>" +
        "<p>Entrá con Google para tener tus entrenamientos y tu programa en todos tus dispositivos. Sin login, la app sigue funcionando sólo en este equipo.</p>" +
        "<button class='primary' id='syncSignIn'>Entrar con Google</button>";
      var b = document.getElementById("syncSignIn");
      if (b) b.addEventListener("click", signIn);
      return;
    }

    var email = (user.email || (user.user_metadata && user.user_metadata.email) || "conectado");
    p.innerHTML =
      "<h4>Cuenta</h4>" +
      "<span class='sync-email'>" + escapeHtml(email) + "</span>" +
      "<div class='sync-line " + lineCls + "'><i></i><span>" + (STATUS_TEXT[status] || status) + "</span></div>" +
      (meta.lastSyncAt ? "<p style='margin-top:4px'>Última sync: " + fmtAgo(meta.lastSyncAt) + "</p>" : "<p style='margin-top:4px'>&nbsp;</p>") +
      "<button id='syncNow'" + (status === "syncing" ? " disabled" : "") + ">Sincronizar ahora</button>" +
      "<button id='syncOut'>Cerrar sesión</button>";
    var n = document.getElementById("syncNow");
    if (n) n.addEventListener("click", function () { scheduleSync(0, "manual"); });
    var o = document.getElementById("syncOut");
    if (o) o.addEventListener("click", signOut);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ------------------------------------------------------------------ go */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
