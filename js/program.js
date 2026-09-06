/* ==========================================================================
   AppGym — Módulo "Programa"
   Plan de pesas ATHLEAN Inferno / Max-Size. MVP = Fase 1 (semanas 1-4, XV-10).
   Estado propio en localStorage (clave "appgym:program:v1"), independiente
   del resto de la app. Reusa TimerEngine (descanso / reloj de finisher) y
   window.AppGym.startWodById para los retos del sábado.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const STORE_KEY = "appgym:program:v1";
  const LB_PER_KG = 2.2046226;

  /* ======================================================================
     Definición del programa (Fase 1 · método XV-10 / "10-by")
     ====================================================================== */
  const PROGRAM = {
    id: "ax-max-size",
    name: "ATHLEAN Inferno · Max/Size",
    totalWeeks: 12,
    mvpWeeks: 4
  };

  // Ejercicios base — se pide el 1RM de cada uno en el onboarding.
  const LIFTS = [
    { id: "incline-bench",     name: "Press Inclinado (barra o mancuernas)", muscle: "Pecho",       finisher: "Flexiones al fallo" },
    { id: "underhand-row",     name: "Remo con Barra Supino",                muscle: "Espalda",     finisher: "Inverted rows al fallo" },
    { id: "squat",             name: "Sentadilla con Barra",                 muscle: "Cuádriceps",  finisher: "Prisoner jump squats al fallo" },
    { id: "deadlift",          name: "Peso Muerto",                          muscle: "Isquios",     finisher: "Curl femoral en fitball al fallo" },
    { id: "bb-curl",           name: "Curl con Barra",                       muscle: "Bíceps",      finisher: "Inverted chin rows al fallo" },
    { id: "lying-tri-ext",     name: "Extensión de Tríceps Tumbado (EZ/DB)", muscle: "Tríceps",     finisher: "Fondos en banco al fallo" },
    { id: "db-shoulder-press", name: "Press Militar con Mancuernas",         muscle: "Hombros",     finisher: "Press neutro DB al 50% del 12RM" },
    { id: "db-high-pull",      name: "High Pull con Mancuernas",             muscle: "Trapecios",   finisher: "Encogimientos DB sentado al 50% del 12RM" }
  ];

  // Pares musculares por día (orden fijo Sem 1). A = 10×10, B = 10×5.
  const DAY_PAIRS = [
    { day: "mon", a: "incline-bench", b: "underhand-row" },
    { day: "tue", a: "squat",         b: "deadlift" },
    { day: "thu", a: "bb-curl",       b: "lying-tri-ext" },
    { day: "fri", a: "db-shoulder-press", b: "db-high-pull" }
  ];

  // Reto del sábado por semana (ya cargados en window.WODS como categoría "inferno").
  const SAT_WOD = { 1: "ax-burn-ladder", 2: "ax-diabol-x", 3: "ax-fire-ice", 4: "ax-you-in-30-push" };

  const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const DAY_LABEL = { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom" };
  const DAY_FULL  = { mon: "Lunes", tue: "Martes", wed: "Miércoles", thu: "Jueves", fri: "Viernes", sat: "Sábado", sun: "Domingo" };

  function liftById(id) { return LIFTS.find((l) => l.id === id); }

  const MUSCLE_SHORT = {
    "Pecho": "Pecho", "Espalda": "Espalda", "Cuádriceps": "Cuádr.", "Isquios": "Isquios",
    "Bíceps": "Bíceps", "Tríceps": "Tríceps", "Hombros": "Hombro", "Trapecios": "Trapec."
  };

  const PRO_PAIN = "Máx repeticiones al fallo. Al terminar la última rep, arrancá el reloj de 4:30 y completá 2× ese número.";
  const ISO_PRO_PAIN = "Hold isométrico 60 s. Después completá el nº de reps de tu fallo original en 9 min; cada vez que descansás, retomás con un hold de 30 s.";

  // Construye la sesión de pesas de un día (semanas 1-4).
  function buildSession(week, day) {
    const pair = DAY_PAIRS.find((p) => p.day === day);
    if (!pair) return null;
    const swap = week % 2 === 0;          // Sem 2 y 4: se invierte A/B
    const alternate = week >= 3;          // Sem 3 y 4: series alternadas
    const bigId = swap ? pair.b : pair.a; // el que hace 10×10
    const smallId = swap ? pair.a : pair.b;
    const big = liftById(bigId);
    const small = liftById(smallId);
    const isoWeek = week >= 3;

    return {
      id: week + "-" + day,
      week: week,
      day: day,
      title: big.muscle + " / " + small.muscle,
      titleShort: MUSCLE_SHORT[big.muscle] + " / " + MUSCLE_SHORT[small.muscle],
      method: alternate ? "XV-10 · series alternadas" : "XV-10",
      note: alternate
        ? "Alterná una serie de A y una de B hasta completar las 20. Descanso ~1 min entre series."
        : "Terminá las 10 series de A antes de pasar a B. Descanso 1 min dentro de cada 10-by, 3-5 min entre los dos.",
      exercises: [
        { liftId: bigId,   name: big.name,   muscle: big.muscle,   sets: 10, reps: 10, loadPct: 0.60, restSec: 60, tag: "A · 10 × 10 @ 60%" },
        { liftId: smallId, name: small.name, muscle: small.muscle, sets: 10, reps: 5,  loadPct: 0.75, restSec: 60, tag: "B · 10 × 5 @ 75% (8RM)" }
      ],
      finishers: [
        { key: bigId + "-fin",   muscle: big.muscle,   movement: big.finisher,   protocol: isoWeek ? ISO_PRO_PAIN : PRO_PAIN, clockSec: isoWeek ? 540 : 270, label: isoWeek ? "ISO-PRO-PAIN" : "PRO-PAIN" },
        { key: smallId + "-fin", muscle: small.muscle, movement: small.finisher, protocol: isoWeek ? ISO_PRO_PAIN : PRO_PAIN, clockSec: isoWeek ? 540 : 270, label: isoWeek ? "ISO-PRO-PAIN" : "PRO-PAIN" }
      ]
    };
  }

  // Plan de una semana: 7 celdas (lift / off / challenge).
  function weekPlan(week) {
    return DAY_ORDER.map((day) => {
      if (day === "wed" || day === "sun") return { day: day, kind: "off", label: "Descanso" };
      if (day === "sat") return { day: day, kind: "challenge", wodId: SAT_WOD[week], label: "Reto" };
      const s = buildSession(week, day);
      return { day: day, kind: "lift", label: s.title, labelShort: s.titleShort, sessionId: s.id };
    });
  }

  function cellId(week, day) { return week + "-" + day; }
  function isActionable(cell) { return cell.kind === "lift" || cell.kind === "challenge"; }

  /* ======================================================================
     Estado
     ====================================================================== */
  const DEFAULTS = {
    unit: "kg",        // "kg" | "lb" — solo afecta la visualización
    startDate: null,   // ISO "YYYY-MM-DD" del lunes de la semana 1
    rms: {},           // { liftId: kg }  (siempre guardado en kg)
    done: {},          // { "1-mon": true }
    log: {}            // { "1-mon": { date, sets: { liftId: [{w,r,ts}] }, finishers: { key: {fail} } } }
  };

  let st = load();

  function load() {
    const base = JSON.parse(JSON.stringify(DEFAULTS));
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      return Object.assign(base, saved, {
        rms: Object.assign({}, saved.rms),
        done: Object.assign({}, saved.done),
        log: Object.assign({}, saved.log)
      });
    } catch (e) { return base; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); } catch (e) { /* noop */ }
  }

  /* ======================================================================
     Unidades y pesos de trabajo
     ====================================================================== */
  const U = () => st.unit;
  const stepFor = () => (st.unit === "lb" ? 5 : 2.5);

  function kgToDisplay(kg) { return st.unit === "lb" ? kg * LB_PER_KG : kg; }
  function displayToKg(v) { return st.unit === "lb" ? v / LB_PER_KG : v; }
  function roundStep(v) { const s = stepFor(); return Math.round(v / s) * s; }
  function fmtWeight(v) {
    const n = Math.round(v * 10) / 10;
    return (Number.isInteger(n) ? n : n.toFixed(1)) + " " + U();
  }

  // Peso de trabajo mostrado (en la unidad activa) para un lift a cierto %.
  function workWeight(liftId, pct) {
    const rmKg = st.rms[liftId];
    if (!rmKg || rmKg <= 0) return null;
    return roundStep(kgToDisplay(rmKg * pct));
  }

  function hasAllRMs() { return LIFTS.every((l) => st.rms[l.id] > 0); }

  /* ======================================================================
     Fechas del calendario
     ====================================================================== */
  function parseISO(s) {
    if (!s) return null;
    const p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function toISO(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function thisWeekMonday() {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    const dow = (d.getDay() + 6) % 7; // lun = 0
    d.setDate(d.getDate() - dow);
    return d;
  }
  function cellDate(week, day) {
    const base = parseISO(st.startDate);
    if (!base) return null;
    const d = new Date(base);
    d.setDate(d.getDate() + (week - 1) * 7 + DAY_ORDER.indexOf(day));
    return d;
  }
  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function fmtDayMonth(d) { return d.getDate() + "/" + (d.getMonth() + 1); }

  function relativeDays(ts) {
    const days = Math.floor((Date.now() - ts) / 86400000);
    if (days <= 0) return "hoy";
    if (days === 1) return "ayer";
    return "hace " + days + " días";
  }

  /* ======================================================================
     Progreso / navegación
     ====================================================================== */
  function allCells() {
    const out = [];
    for (let w = 1; w <= PROGRAM.mvpWeeks; w++) {
      weekPlan(w).forEach((c) => out.push(Object.assign({ week: w }, c)));
    }
    return out;
  }
  function nextCell() {
    return allCells().find((c) => isActionable(c) && !st.done[cellId(c.week, c.day)]) || null;
  }
  function progress() {
    const cells = allCells().filter(isActionable);
    const done = cells.filter((c) => st.done[cellId(c.week, c.day)]).length;
    return { done: done, total: cells.length, pct: cells.length ? Math.round((done / cells.length) * 100) : 0 };
  }

  /* ======================================================================
     Iconos (reusa el hidratador de app.js)
     ====================================================================== */
  function hydrate(root) {
    if (window.AppGym && typeof window.AppGym.hydrateIcons === "function") window.AppGym.hydrateIcons(root);
  }
  function toast(msg) {
    if (window.AppGym && typeof window.AppGym.toast === "function") window.AppGym.toast(msg);
  }
  function sound(kind) {
    if (window.AppGym && typeof window.AppGym.sound === "function") window.AppGym.sound(kind);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ======================================================================
     Timers (descanso entre series + reloj de finisher)
     ====================================================================== */
  let restTimer = null;
  let restLeft = "";
  let restDone = false;

  function ensureRestTimer() {
    if (restTimer) return;
    restTimer = new window.TimerEngine({
      onTick: (s) => { restLeft = s.display; paintRestBar(); },
      onBeep: (k) => { if (k === "tick") sound("tick"); else if (k === "end") sound("end"); },
      onFinish: () => { restDone = true; sound("success"); paintRestBar(); }
    });
  }
  function startRest(sec) {
    ensureRestTimer();
    restDone = false;
    restTimer.configure({ mode: "countdown", durationSec: sec });
    restTimer.start();
    paintRestBar();
  }
  function stopRest() {
    if (restTimer) restTimer.reset();
    restDone = false;
    restLeft = "";
    paintRestBar();
  }
  function restActive() {
    return !!restTimer && (restTimer.running || restDone);
  }
  function paintRestBar() {
    const bar = $("#pgRestBar");
    if (!bar) return;
    if (!restActive()) { bar.hidden = true; return; }
    bar.hidden = false;
    bar.classList.toggle("is-done", restDone);
    bar.innerHTML = restDone
      ? '<span class="pg-rest-label"><span data-icon="check"></span> Descanso listo — a la siguiente serie</span>' +
        '<button class="btn btn-ghost btn-sm" id="pgRestSkip">Ocultar</button>'
      : '<span class="pg-rest-label"><span data-icon="clock"></span> Descanso <strong>' + restLeft + "</strong></span>" +
        '<button class="btn btn-ghost btn-sm" id="pgRestSkip">Saltar</button>';
    hydrate(bar);
  }

  let finTimer = null;
  let finState = null; // { key, left, count, running, done }

  function ensureFinTimer() {
    if (finTimer) return;
    finTimer = new window.TimerEngine({
      onTick: (s) => { if (finState) { finState.left = s.display; paintFinClock(); } },
      onBeep: (k) => { if (k === "tick") sound("tick"); else if (k === "end") sound("end"); },
      onFinish: () => { if (finState) { finState.done = true; finState.running = false; sound("success"); paintFinClock(); } }
    });
  }
  function startFinClock(key, sec) {
    ensureFinTimer();
    finState = { key: key, left: window.fmtTime(sec * 1000), count: 0, running: true, done: false };
    finTimer.configure({ mode: "countdown", durationSec: sec });
    finTimer.start();
    render();
  }
  function stopFinClock() {
    if (finTimer) finTimer.reset();
    finState = null;
  }
  function paintFinClock() {
    const box = $("#pgFinClock");
    if (!box || !finState) return;
    box.querySelector(".pg-finclock-time").textContent = finState.left;
    box.querySelector(".pg-finclock-count").textContent = finState.count;
    box.classList.toggle("is-done", finState.done);
  }

  /* ======================================================================
     Vistas
     ====================================================================== */
  let screen = "calendar";      // "onboarding" | "calendar" | "session"
  let sessionRef = null;        // sesión abierta
  let editing = null;           // { liftId, index } — serie en edición

  function root() { return $("#view-program"); }

  function go(next) {
    if (screen === "session" && next !== "session") { stopRest(); stopFinClock(); }
    screen = next;
    render();
    root().scrollIntoView({ block: "start" });
  }

  function render() {
    const el = root();
    if (!el) return;
    if (screen === "onboarding") el.innerHTML = viewOnboarding();
    else if (screen === "session") el.innerHTML = viewSession();
    else el.innerHTML = viewCalendar();
    hydrate(el);
    if (screen === "session") paintRestBar();
  }

  /* ---------- Onboarding de RMs ---------- */
  function viewOnboarding() {
    const rows = LIFTS.map((l) => {
      const rmKg = st.rms[l.id];
      const val = rmKg > 0 ? Math.round(kgToDisplay(rmKg) * 10) / 10 : "";
      const w60 = rmKg > 0 ? fmtWeight(roundStep(kgToDisplay(rmKg * 0.6))) : "—";
      const w75 = rmKg > 0 ? fmtWeight(roundStep(kgToDisplay(rmKg * 0.75))) : "—";
      return (
        '<div class="pg-rm-row">' +
        '<div class="pg-rm-name"><strong>' + esc(l.name) + "</strong><span>" + esc(l.muscle) + "</span></div>" +
        '<label class="pg-rm-input"><input type="number" inputmode="decimal" min="0" step="0.5" ' +
        'data-rm="' + l.id + '" placeholder="1RM" value="' + val + '" /><span>' + U() + "</span></label>" +
        '<div class="pg-rm-calc">60%: <strong>' + w60 + "</strong> · 75%: <strong>" + w75 + "</strong></div>" +
        "</div>"
      );
    }).join("");

    const startVal = st.startDate || toISO(thisWeekMonday());

    return (
      '<div class="pg-wrap">' +
      '<div class="pg-head">' +
      '<div><h2 class="pg-title">Tus marcas (1RM)</h2>' +
      '<p class="pg-sub">La Fase 1 usa el 60% y el 75% de tu 1RM. Cargá lo que levantás hoy — podés ajustarlo cuando quieras.</p></div>' +
      (hasAllRMs() ? '<button class="btn btn-ghost btn-sm" id="pgToCal"><span data-icon="undo"></span> Volver</button>' : "") +
      "</div>" +

      '<div class="pg-card">' +
      '<div class="pg-field-inline">' +
      '<span class="field-label">Unidad</span>' +
      '<div class="segmented pg-unit" id="pgUnit">' +
      '<button class="seg' + (U() === "kg" ? " is-active" : "") + '" data-unit="kg">kg</button>' +
      '<button class="seg' + (U() === "lb" ? " is-active" : "") + '" data-unit="lb">lb</button>' +
      "</div></div>" +
      '<label class="field"><span class="field-label">¿Qué lunes arrancás? (calendario)</span>' +
      '<input type="date" id="pgStart" value="' + startVal + '" /></label>' +
      "</div>" +

      '<div class="pg-card"><div class="pg-rm-list">' + rows + "</div></div>" +

      '<button class="btn btn-primary btn-block" id="pgSaveRM"><span data-icon="check"></span> Guardar y ver el calendario</button>' +
      "</div>"
    );
  }

  /* ---------- Calendario ---------- */
  function viewCalendar() {
    const pr = progress();
    const nc = nextCell();
    const curWeek = nc ? nc.week : PROGRAM.mvpWeeks;
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const weeks = [];
    for (let w = 1; w <= PROGRAM.mvpWeeks; w++) {
      const cells = weekPlan(w).map((c) => {
        const cid = cellId(w, c.day);
        const done = !!st.done[cid];
        const d = cellDate(w, c.day);
        const isToday = sameDay(d, today);
        const dateTxt = d ? '<span class="pg-cell-date">' + fmtDayMonth(d) + "</span>" : "";
        let cls = "pg-cell pg-cell-" + c.kind;
        if (done) cls += " is-done";
        if (isToday) cls += " is-today";
        const toggle = isActionable(c)
          ? '<button class="pg-cell-check" data-toggle="' + cid + '" aria-label="Marcar hecho">' +
            '<span data-icon="' + (done ? "check" : "circle") + '"></span></button>'
          : "";
        const tap = isActionable(c) ? ' data-open="' + cid + '"' : "";
        return (
          '<div class="' + cls + '"' + tap + ">" +
          '<div class="pg-cell-top"><span class="pg-cell-day">' + DAY_LABEL[c.day] + "</span>" + dateTxt + "</div>" +
          '<span class="pg-cell-label">' + esc(c.labelShort || c.label) + "</span>" +
          toggle +
          "</div>"
        );
      }).join("");
      weeks.push(
        '<div class="pg-week">' +
        '<div class="pg-week-head"><span>Semana ' + w + "</span>" +
        (w <= 4 ? '<span class="pg-phase-tag">Fase 1 · Ignition</span>' : "") + "</div>" +
        '<div class="pg-week-grid">' + cells + "</div>" +
        "</div>"
      );
    }

    let cta = "";
    if (nc) {
      const label = nc.kind === "challenge" ? "Reto del sábado (Semana " + nc.week + ")" : nc.label + " — Semana " + nc.week;
      cta = '<button class="btn btn-primary btn-block" id="pgContinue"><span data-icon="play"></span> Continuar: ' + esc(label) + "</button>";
    } else {
      cta = '<div class="pg-done-banner"><span data-icon="check"></span> ¡Fase 1 completa! Fases 2 y 3 (semanas 5-12) próximamente.</div>';
    }

    const rmWarn = hasAllRMs() ? "" :
      '<div class="pg-warn"><span data-icon="clock"></span> Cargá tus 1RM para ver los pesos de trabajo. <button class="pg-link" id="pgEditRM">Hacerlo ahora</button></div>';

    return (
      '<div class="pg-wrap">' +
      '<div class="pg-head">' +
      '<div><h2 class="pg-title">' + esc(PROGRAM.name) + "</h2>" +
      '<p class="pg-sub">Semana ' + curWeek + " de " + PROGRAM.totalWeeks + " · " + pr.done + "/" + pr.total + " sesiones de la Fase 1</p></div>" +
      '<button class="btn btn-ghost btn-sm" id="pgEditRM"><span data-icon="edit"></span> RMs</button>' +
      "</div>" +
      '<div class="pg-progress"><div class="pg-progress-fill" style="width:' + pr.pct + '%"></div></div>' +
      rmWarn +
      cta +
      '<div class="pg-weeks">' + weeks.join("") + "</div>" +
      '<p class="pg-foot">Método XV-10 (“10-by”): un ejercicio a 10×10 (60% 1RM) y otro a 10×5 (75%). ' +
      "Semanas 1-2 en bloque, 3-4 alternando series. Los sábados son los retos (pestaña Rutinas → Retos).</p>" +
      "</div>"
    );
  }

  /* ---------- Sesión de pesas ---------- */
  function openSession(cid) {
    const p = cid.split("-");
    const week = +p[0], day = p[1];
    if (day === "sat") {
      const wodId = SAT_WOD[week];
      if (wodId && window.AppGym && window.AppGym.startWodById) {
        toast("Al terminar el reto, marcá el sábado como hecho en el calendario.");
        window.AppGym.startWodById(wodId);
      } else {
        toast("Reto no disponible.");
      }
      return;
    }
    sessionRef = buildSession(week, day);
    editing = null;
    if (!hasAllRMs()) { toast("Primero cargá tus 1RM."); go("onboarding"); return; }
    go("session");
  }

  function sessionLog() {
    const cid = sessionRef.id;
    if (!st.log[cid]) st.log[cid] = { date: toISO(new Date()), sets: {}, finishers: {} };
    return st.log[cid];
  }
  function setsFor(liftId) {
    const lg = st.log[sessionRef.id];
    return (lg && lg.sets && lg.sets[liftId]) ? lg.sets[liftId] : [];
  }

  // Última vez que se hizo este lift en cualquier sesión previa (para "última vez: …").
  function lastTimeFor(liftId) {
    let best = null;
    Object.keys(st.log).forEach((cid) => {
      if (cid === (sessionRef && sessionRef.id)) return;
      const s = st.log[cid].sets && st.log[cid].sets[liftId];
      if (s && s.length) {
        const last = s[s.length - 1];
        if (!best || last.ts > best.ts) best = { w: last.w, r: last.r, ts: last.ts, count: s.length };
      }
    });
    return best;
  }

  function viewSession() {
    const s = sessionRef;
    const d = cellDate(s.week, s.day);
    const dateTxt = d ? " · " + DAY_FULL[s.day] + " " + fmtDayMonth(d) : " · " + DAY_FULL[s.day];

    const exCards = s.exercises.map((ex) => {
      const ww = workWeight(ex.liftId, ex.loadPct);
      const logged = setsFor(ex.liftId);
      const doneCount = logged.length;
      const allDone = doneCount >= ex.sets;
      const firstPending = doneCount; // índice de la próxima serie
      const last = lastTimeFor(ex.liftId);

      const chips = Array.from({ length: ex.sets }, (_, i) => {
        const rec = logged[i];
        let c = "pg-set";
        if (rec) c += " is-done";
        else if (i === firstPending) c += " is-next";
        const inner = rec
          ? '<span class="pg-set-w">' + rec.w + "</span><span class=\"pg-set-r\">×" + rec.r + "</span>"
          : '<span class="pg-set-n">' + (i + 1) + "</span>";
        const attr = rec ? "" : ' data-set="' + ex.liftId + "|" + i + '"';
        return '<button class="' + c + '"' + attr + ">" + inner + "</button>";
      }).join("");

      let editor = "";
      if (editing && editing.liftId === ex.liftId) {
        const prefW = logged.length ? logged[logged.length - 1].w : (ww != null ? ww : "");
        editor =
          '<div class="pg-set-editor">' +
          '<div class="pg-set-editor-title">Serie ' + (editing.index + 1) + " de " + ex.sets + "</div>" +
          '<div class="pg-set-editor-fields">' +
          '<label class="field"><span class="field-label">Peso (' + U() + ")</span>" +
          '<input type="number" inputmode="decimal" step="' + stepFor() + '" id="pgSetW" value="' + prefW + '" /></label>' +
          '<label class="field"><span class="field-label">Reps</span>' +
          '<input type="number" inputmode="numeric" id="pgSetR" value="' + ex.reps + '" /></label>' +
          "</div>" +
          '<div class="pg-set-editor-actions">' +
          '<button class="btn btn-ghost btn-sm" id="pgSetCancel">Cancelar</button>' +
          '<button class="btn btn-primary btn-sm" id="pgSetSave"><span data-icon="check"></span> Guardar serie</button>' +
          "</div></div>";
      }

      const target = ww != null
        ? ex.sets + " × " + ex.reps + " · <strong>" + fmtWeight(ww) + "</strong> · descanso " + window.fmtTime(ex.restSec * 1000)
        : '<button class="pg-link" id="pgEditRM">Definí tu 1RM de ' + esc(ex.name) + "</button>";

      const lastTxt = last
        ? '<div class="pg-last">Última vez: ' + last.count + " series · " + last.w + " " + U() + " × " + last.r + " (" + relativeDays(last.ts) + ")" +
          (allDone && last && workWeight(ex.liftId, ex.loadPct) != null ? "" : "") + "</div>"
        : "";

      return (
        '<div class="pg-ex' + (allDone ? " is-complete" : "") + '">' +
        '<div class="pg-ex-head">' +
        '<span class="pg-ex-tag">' + esc(ex.tag) + "</span>" +
        '<span class="pg-ex-count">' + doneCount + "/" + ex.sets + "</span>" +
        "</div>" +
        '<h3 class="pg-ex-name">' + esc(ex.name) + "</h3>" +
        '<div class="pg-ex-target">' + target + "</div>" +
        lastTxt +
        '<div class="pg-set-grid">' + chips + "</div>" +
        editor +
        "</div>"
      );
    }).join("");

    const finCards = s.finishers.map((f) => {
      const lg = st.log[s.id];
      const rec = lg && lg.finishers && lg.finishers[f.key];
      const goalTxt = rec
        ? (f.label === "PRO-PAIN"
            ? "Objetivo: <strong>" + (rec.fail * 2) + " reps</strong> en 4:30"
            : "Objetivo: <strong>" + rec.fail + " reps</strong> en 9:00 (holds de 30 s al descansar)")
        : "";
      const clockOpen = finState && finState.key === f.key;
      let clock = "";
      if (clockOpen) {
        clock =
          '<div class="pg-finclock' + (finState.done ? " is-done" : "") + '" id="pgFinClock">' +
          '<div class="pg-finclock-time">' + finState.left + "</div>" +
          '<button class="pg-finclock-count" id="pgFinTap">' + finState.count + "</button>" +
          '<div class="pg-finclock-actions">' +
          '<button class="btn btn-ghost btn-sm" id="pgFinMinus"><span data-icon="minus"></span></button>' +
          '<button class="btn btn-ghost btn-sm" id="pgFinStop">Cerrar reloj</button>' +
          "</div></div>";
      }
      return (
        '<div class="pg-fin">' +
        '<div class="pg-ex-head"><span class="pg-ex-tag">' + f.label + '</span><span class="pg-fin-muscle">' + esc(f.muscle) + "</span></div>" +
        '<div class="pg-fin-move">' + esc(f.movement) + "</div>" +
        '<p class="pg-fin-protocol">' + esc(f.protocol) + "</p>" +
        '<div class="pg-fin-row">' +
        '<label class="field"><span class="field-label">Reps al fallo</span>' +
        '<input type="number" inputmode="numeric" data-fin="' + f.key + '" value="' + (rec ? rec.fail : "") + '" placeholder="—" /></label>' +
        '<button class="btn btn-ghost btn-sm" data-finsave="' + f.key + '"><span data-icon="check"></span> Guardar</button>' +
        '<button class="btn btn-ghost btn-sm" data-finclock="' + f.key + '|' + f.clockSec + '"><span data-icon="clock"></span> Reloj</button>' +
        "</div>" +
        (goalTxt ? '<div class="pg-fin-goal">' + goalTxt + "</div>" : "") +
        clock +
        "</div>"
      );
    }).join("");

    const pr = sessionProgress();

    return (
      '<div class="pg-wrap pg-session">' +
      '<div class="pg-session-top">' +
      '<button class="btn btn-ghost btn-sm" id="pgBack"><span data-icon="undo"></span> Calendario</button>' +
      '<span class="pg-session-meta">Semana ' + s.week + dateTxt + "</span>" +
      "</div>" +
      '<h2 class="pg-title">' + esc(s.title) + "</h2>" +
      '<div class="pg-method-chip">' + esc(s.method) + "</div>" +
      '<div class="pg-note"><span data-icon="clock"></span> ' + esc(s.note) + "</div>" +

      exCards +

      '<h3 class="pg-section-h">Finishers</h3>' +
      finCards +

      '<button class="btn btn-primary btn-block" id="pgFinish"><span data-icon="check"></span> ' +
      (pr.done >= pr.total ? "Finalizar sesión" : "Finalizar sesión (" + pr.done + "/" + pr.total + " series)") + "</button>" +

      '<div class="pg-rest-bar" id="pgRestBar" hidden></div>' +
      "</div>"
    );
  }

  function sessionProgress() {
    let done = 0, total = 0;
    sessionRef.exercises.forEach((ex) => { total += ex.sets; done += Math.min(ex.sets, setsFor(ex.liftId).length); });
    return { done: done, total: total };
  }

  /* ======================================================================
     Acciones
     ====================================================================== */
  function saveOnboarding() {
    const unitBtn = $("#pgUnit .seg.is-active");
    if (unitBtn) st.unit = unitBtn.dataset.unit;
    const startEl = $("#pgStart");
    if (startEl && startEl.value) st.startDate = startEl.value;
    $$("[data-rm]").forEach((inp) => {
      const v = parseFloat(inp.value);
      if (v > 0) st.rms[inp.dataset.rm] = displayToKg(v);
      else delete st.rms[inp.dataset.rm];
    });
    save();
    toast(hasAllRMs() ? "Listo — pesos de trabajo calculados" : "Guardado (faltan algunos RM)");
    go("calendar");
  }

  function switchUnit(unit) {
    if (unit === st.unit) return;
    // Reinterpreta lo que haya escrito en los inputs en la unidad nueva.
    $$("[data-rm]").forEach((inp) => {
      const v = parseFloat(inp.value);
      if (v > 0) {
        const kg = st.unit === "lb" ? v / LB_PER_KG : v;
        inp.value = Math.round((unit === "lb" ? kg * LB_PER_KG : kg) * 10) / 10;
      }
    });
    st.unit = unit;
    save();
    render();
  }

  function saveSet(liftId, index) {
    const w = parseFloat($("#pgSetW").value);
    const r = parseInt($("#pgSetR").value, 10);
    if (!(w >= 0) || !(r > 0)) { toast("Poné peso y reps"); return; }
    const lg = sessionLog();
    if (!lg.sets[liftId]) lg.sets[liftId] = [];
    lg.sets[liftId][index] = { w: Math.round(w * 100) / 100, r: r, ts: Date.now() };
    // compacta huecos (no debería haber, se registran en orden)
    lg.sets[liftId] = lg.sets[liftId].filter(Boolean);
    editing = null;
    save();
    const ex = sessionRef.exercises.find((e) => e.liftId === liftId);
    sound("tap");
    if (ex && lg.sets[liftId].length < ex.sets) startRest(ex.restSec);
    else stopRest();
    render();
  }

  function saveFinisher(key) {
    const inp = $('[data-fin="' + key + '"]');
    const v = parseInt(inp && inp.value, 10);
    if (!(v > 0)) { toast("Poné el nº de reps al fallo"); return; }
    const lg = sessionLog();
    lg.finishers[key] = { fail: v, ts: Date.now() };
    save();
    sound("success");
    render();
  }

  function finishSession() {
    const cid = sessionRef.id;
    st.done[cid] = true;
    const lg = st.log[cid];
    if (lg) lg.date = lg.date || toISO(new Date());
    save();
    stopRest(); stopFinClock();
    toast("Sesión marcada como completa");
    go("calendar");
  }

  function toggleDone(cid) {
    st.done[cid] = !st.done[cid];
    save();
    render();
  }

  /* ======================================================================
     Eventos (delegación sobre #view-program)
     ====================================================================== */
  function onClick(e) {
    const t = e.target;

    // --- Onboarding ---
    const unit = t.closest("[data-unit]");
    if (unit) { switchUnit(unit.dataset.unit); return; }
    if (t.closest("#pgSaveRM")) { saveOnboarding(); return; }
    if (t.closest("#pgToCal")) { go("calendar"); return; }

    // --- Calendario ---
    if (t.closest("#pgEditRM")) { go("onboarding"); return; }
    if (t.closest("#pgContinue")) {
      const nc = nextCell();
      if (nc) openSession(cellId(nc.week, nc.day));
      return;
    }
    const toggle = t.closest("[data-toggle]");
    if (toggle) { e.stopPropagation(); toggleDone(toggle.dataset.toggle); return; }
    const open = t.closest("[data-open]");
    if (open) { openSession(open.dataset.open); return; }

    // --- Sesión ---
    if (t.closest("#pgBack")) { go("calendar"); return; }
    if (t.closest("#pgFinish")) { finishSession(); return; }
    if (t.closest("#pgRestSkip")) { stopRest(); return; }

    const setBtn = t.closest("[data-set]");
    if (setBtn) {
      const p = setBtn.dataset.set.split("|");
      editing = { liftId: p[0], index: +p[1] };
      render();
      const wEl = $("#pgSetW");
      if (wEl) { wEl.focus(); wEl.select(); }
      return;
    }
    if (t.closest("#pgSetCancel")) { editing = null; render(); return; }
    if (t.closest("#pgSetSave")) { if (editing) saveSet(editing.liftId, editing.index); return; }

    const finSave = t.closest("[data-finsave]");
    if (finSave) { saveFinisher(finSave.dataset.finsave); return; }
    const finClock = t.closest("[data-finclock]");
    if (finClock) {
      const p = finClock.dataset.finclock.split("|");
      startFinClock(p[0], +p[1]);
      return;
    }
    if (t.closest("#pgFinTap")) { if (finState) { finState.count++; sound("tap"); paintFinClock(); } return; }
    if (t.closest("#pgFinMinus")) { if (finState) { finState.count = Math.max(0, finState.count - 1); paintFinClock(); } return; }
    if (t.closest("#pgFinStop")) { stopFinClock(); render(); return; }
  }

  /* ======================================================================
     Init
     ====================================================================== */
  function init() {
    const el = root();
    if (!el) return;
    el.addEventListener("click", onClick);

    // Primera vez sin RMs → onboarding directo
    screen = hasAllRMs() ? "calendar" : "onboarding";
    render();

    // Refrescar al entrar en la pestaña
    const tabbar = $("#tabbar");
    if (tabbar) {
      tabbar.addEventListener("click", (e) => {
        const tab = e.target.closest('.tab[data-view="program"]');
        if (tab) { if (screen === "session") { /* mantener */ } else { screen = hasAllRMs() ? "calendar" : "onboarding"; } render(); }
      });
    }

    // Al salir de la app, cortar timers
    window.addEventListener("beforeunload", () => { stopRest(); stopFinClock(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.AppGymProgram = { reset: function () { st = JSON.parse(JSON.stringify(DEFAULTS)); save(); screen = "onboarding"; render(); } };
})();
