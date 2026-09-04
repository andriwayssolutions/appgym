/* ==========================================================================
   AppGym — Lógica principal
   Contador configurable, series, rutinas (CrossFit + personalizadas),
   runner paso a paso y cronómetro.
   ========================================================================== */

(function () {
  "use strict";

  /* ====================== Iconos SVG ====================== */
  const ICONS = {
    dumbbell: '<svg viewBox="0 0 24 24"><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/></svg>',
    counter: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>',
    timer: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6M12 2v3"/></svg>',
    help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.8 2.1c-.8.5-1.3 1-1.3 2"/><path d="M12 17h.01"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="7" cy="17" r="2"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    reset: '<svg viewBox="0 0 24 24"><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 4"/><path d="M3.5 4v5h5"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 7"/></svg>',
    undo: '<svg viewBox="0 0 24 24"><path d="M9 8H4V3M4 8l4-4"/><path d="M4 8h7a6 6 0 0 1 0 12H7"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
    stop: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1"/></svg>',
    flag: '<svg viewBox="0 0 24 24"><path d="M6 21V4"/><path d="M6 4c4.5-2 8.5 2 13 0v9c-4.5 2-8.5-2-13 0"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></svg>',
    clipboard: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 17z"/><path d="M13.5 6.5l3 3"/></svg>',
    "sound-on": '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8a4 4 0 0 1 0 8M18.5 6a7 7 0 0 1 0 12"/></svg>',
    "sound-off": '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9l5 6M21 9l-5 6"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    expand: '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    compress: '<svg viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>'
  };
  const FILL = new Set(["play", "stop"]);

  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach((el) => {
      const name = el.dataset.icon;
      el.innerHTML = ICONS[name] || ICONS.help;
      el.classList.toggle("fill", FILL.has(name));
    });
  }
  function setIcon(el, name) {
    el.dataset.icon = name;
    el.innerHTML = ICONS[name] || ICONS.help;
    el.classList.toggle("fill", FILL.has(name));
  }

  /* ====================== Utilidades ====================== */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const STORE_KEY = "appgym:v1";

  const DEFAULTS = {
    rep: { value: 0, label: "Repeticiones", step: 1, goal: 0, autoSet: false, sound: true },
    set: { label: "Series", goal: 0, sound: true },
    history: [],
    custom: [],
    sound: true,
    theme: "dark"
  };

  let state = load();

  function load() {
    try {
      const base = JSON.parse(JSON.stringify(DEFAULTS));
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      return deepMerge(base, JSON.parse(raw));
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }
  // Fusiona lo guardado sobre los valores por defecto sin perder campos nuevos
  // anidados (state.rep / state.set). Los arrays se reemplazan tal cual.
  function deepMerge(base, extra) {
    if (Array.isArray(extra)) return extra.slice();
    if (extra && typeof extra === "object") {
      const out = (base && typeof base === "object" && !Array.isArray(base)) ? Object.assign({}, base) : {};
      Object.keys(extra).forEach((k) => { out[k] = deepMerge(out[k], extra[k]); });
      return out;
    }
    return extra === undefined ? base : extra;
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* noop */ }
  }

  function uid() {
    return "c_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
  }

  /* ====================== Sonido ====================== */
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }
  function beep(freq, dur, vol, type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol || 0.14, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur + 0.02);
  }
  function sound(kind) {
    if (!state.sound) return;
    ensureAudio();
    switch (kind) {
      case "tap": beep(720, 0.05, 0.08); break;
      case "tick": beep(980, 0.08, 0.1); break;
      case "end": beep(1150, 0.18, 0.14); break;
      case "success": beep(880, 0.09, 0.12); setTimeout(() => beep(1320, 0.12, 0.12), 110); break;
      default: beep(720, 0.06, 0.1);
    }
  }

  /* ====================== Toast ====================== */
  let toastTimer = null;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => { t.hidden = true; }, 260);
    }, 2200);
  }

  /* ====================== Navegación ====================== */
  function switchView(name) {
    $$(".view").forEach((v) => v.classList.remove("is-active"));
    $$(".tab").forEach((t) => t.classList.remove("is-active"));
    $("#view-" + name).classList.add("is-active");
    const tab = $$(".tab").find((t) => t.dataset.view === name);
    if (tab) tab.classList.add("is-active");
  }

  /* ====================== Tema día/noche ====================== */
  function applyTheme() {
    const light = state.theme === "light";
    document.body.classList.toggle("light", light);
    setIcon($("#btnTheme"), light ? "moon" : "sun");
  }

  /* ====================== Animación de bump ====================== */
  function bump(el, cls) {
    el.classList.remove("bump", "bump-down");
    void el.offsetWidth;
    el.classList.add(cls || "bump");
  }

  /* ==========================================================================
     CONTADOR
     ========================================================================== */
  function repValue() { return state.rep.value; }
  function setValue() { return state.history.length; }

  // Contador "activo": decide si las flechas ↑/↓ y Espacio actúan sobre reps o series
  let activeCounter = "rep";

  function setActiveCounter(name) {
    activeCounter = name;
    const repCard = $("#repCard");
    const setCard = $("#setCard");
    if (repCard) repCard.classList.toggle("is-active", name === "rep");
    if (setCard) setCard.classList.toggle("is-active", name === "set");
  }

  function repIncrement() {
    const prev = state.rep.value;
    const step = state.rep.step || 1;
    state.rep.value = Math.max(0, state.rep.value + step);
    if (state.rep.goal > 0 && prev < state.rep.goal && state.rep.value >= state.rep.goal) {
      flashCard("#repCard");
      if (state.rep.sound) sound("success");
      if (state.rep.autoSet) {
        setTimeout(() => { if (state.rep.value >= state.rep.goal) registerSeries(); }, 420);
      } else {
        toast("¡Meta de repeticiones alcanzada!");
      }
    } else if (state.sound) {
      sound("tap");
    }
    save();
    renderCounter();
    bump($("#repNumber"), "bump");
  }

  function repDecrement() {
    state.rep.value = Math.max(0, state.rep.value - (state.rep.step || 1));
    save();
    renderCounter();
    bump($("#repNumber"), "bump-down");
  }

  function repReset() {
    state.rep.value = 0;
    save();
    renderCounter();
    bump($("#repNumber"), "bump-down");
  }

  function registerSeries() {
    state.history.push({ id: uid(), reps: state.rep.value, ts: Date.now() });
    state.rep.value = 0;
    save();
    renderCounter();
    renderHistory();
    bump($("#setNumber"), "bump");
    if (state.set.goal > 0 && state.history.length >= state.set.goal) {
      flashCard("#setCard");
      if (state.set.sound) sound("success");
      toast("¡Meta de series alcanzada!");
    } else if (state.set.sound) {
      sound("end");
    }
  }

  function unregisterSeries() {
    if (!state.history.length) return;
    state.history.pop();
    save();
    renderCounter();
    renderHistory();
    bump($("#setNumber"), "bump-down");
  }

  function clearHistory() {
    state.history = [];
    save();
    renderCounter();
    renderHistory();
  }

  function flashCard(sel) {
    const el = $(sel);
    el.animate(
      [{ boxShadow: "0 0 0 0 rgba(255,106,42,0)" }, { boxShadow: "0 0 0 6px rgba(255,106,42,0.35)" }, { boxShadow: "0 0 0 0 rgba(255,106,42,0)" }],
      { duration: 600, easing: "ease-out" }
    );
  }

  function renderCounter() {
    $("#repNumber").textContent = state.rep.value;
    $("#setNumber").textContent = setValue();
    $("#repTitle").textContent = state.rep.label;
    $("#setTitle").textContent = state.set.label;
    // meta de reps
    const hint = $("#repCard .meta-hint");
    hint.innerHTML = state.rep.goal > 0
      ? "Meta: <strong>" + state.rep.goal + "</strong> reps · " + state.rep.value + "/" + state.rep.goal + " · ↑/↓ para sumar/restar"
      : "↑/↓ = ±" + state.rep.step + " &nbsp;·&nbsp; Espacio = +" + state.rep.step + " &nbsp;·&nbsp; R = reiniciar";
    // chip de series
    const chip = $("#setChip");
    chip.textContent = state.set.goal > 0 ? "Meta: " + state.set.goal : "Ilimitadas";
    chip.classList.toggle("chip-live", state.set.goal > 0 && setValue() >= state.set.goal);
  }

  function renderHistory() {
    const list = $("#historyList");
    if (!state.history.length) {
      list.innerHTML =
        '<div class="empty-state"><span class="empty-icon" data-icon="clipboard"></span>' +
        "<p>Aquí verás cada serie que registres,<br />con sus repeticiones y la hora.</p></div>";
      hydrateIcons(list);
      return;
    }
    list.innerHTML = state.history.map((h, i) => {
      const t = new Date(h.ts);
      const time = t.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
      return (
        '<div class="history-item">' +
        '<div class="history-item-main"><span class="history-reps">' + h.reps + '<small> reps</small></span>' +
        '<span class="history-time">Serie ' + (i + 1) + " · " + time + "</span></div>" +
        '<button class="history-del" data-del="' + h.id + '" aria-label="Eliminar serie"><span data-icon="trash"></span></button>' +
        "</div>"
      );
    }).join("");
    hydrateIcons(list);
  }

  /* ====================== Configuración de contador ====================== */
  let cfgTarget = "rep";

  function openCounterConfig(target) {
    cfgTarget = target;
    const isRep = target === "rep";
    const cfg = isRep ? state.rep : state.set;

    $("#modalCounterTitle").textContent = "Configurar: " + cfg.label;
    $("#cfgLabel").value = cfg.label;
    $("#cfgStep").value = String(isRep ? (cfg.step || 1) : 1);
    $("#cfgGoal").value = cfg.goal || 0;
    $("#cfgAuto").checked = isRep ? !!cfg.autoSet : false;
    $("#cfgSound").checked = !!cfg.sound;

    // campos específicos
    $("#cfgStep").closest(".field").style.display = isRep ? "" : "none";
    $("#cfgGoalLabel").textContent = isRep ? "Meta de reps por serie (0 = sin límite)" : "Meta de series (0 = sin límite)";
    $("#cfgAutoRow").style.display = isRep ? "" : "none";

    openModal("modalCounter");
  }

  function saveCounterConfig() {
    const isRep = cfgTarget === "rep";
    const cfg = isRep ? state.rep : state.set;
    cfg.label = $("#cfgLabel").value.trim() || (isRep ? "Repeticiones" : "Series");
    cfg.goal = Math.max(0, parseInt($("#cfgGoal").value, 10) || 0);
    cfg.sound = $("#cfgSound").checked;
    if (isRep) {
      cfg.step = parseInt($("#cfgStep").value, 10) || 1;
      cfg.autoSet = $("#cfgAuto").checked;
    }
    save();
    renderCounter();
    closeModal("modalCounter");
    toast("Contador configurado");
  }

  /* ==========================================================================
     RUTINAS
     ========================================================================== */
  const TYPE_LABEL = {
    "for-time": "Por tiempo",
    rounds: "Rondas fijas",
    amrap: "AMRAP",
    emom: "EMOM"
  };

  function expandWod(wod) {
    const steps = [];
    for (const b of wod.blocks) {
      if (b.kind === "rounds") {
        const arr = Array.isArray(b.rounds) ? b.rounds : Array.from({ length: b.rounds }, () => null);
        arr.forEach((rv, ri) => {
          b.items.forEach((it) => {
            const reps = (it.reps === null || it.reps === undefined) ? rv : it.reps;
            steps.push({ title: it.name, detail: it.detail || "", reps: reps || 0, round: ri + 1 });
          });
        });
      } else if (b.kind === "single") {
        b.items.forEach((it) => steps.push({ title: it.name, detail: it.detail || "", reps: it.reps || 0, round: null }));
      }
    }
    return steps;
  }

  function resolvePreset(wod) {
    if (wod.type === "amrap") {
      const block = wod.blocks.find((b) => b.kind === "amrap");
      return { name: wod.name, type: "amrap", timeCap: wod.timeCap, circuit: (block ? block.items : []).map(normItem) };
    }
    if (wod.type === "emom") {
      const block = wod.blocks.find((b) => b.kind === "emom");
      return { name: wod.name, type: "emom", timeCap: wod.timeCap, circuit: (block ? block.items : []).map(normItem) };
    }
    return { name: wod.name, type: "linear", steps: expandWod(wod), timeCap: wod.timeCap };
  }

  function normItem(it) {
    return { title: it.name, detail: it.detail || "", reps: it.reps || 0 };
  }

  function resolveCustom(r) {
    const timeCap = (r.timeCap || 0) * 60;
    if (r.type === "amrap") {
      return { name: r.name, type: "amrap", timeCap, circuit: r.steps.map((s) => ({ title: s.name, detail: s.detail || "", reps: s.reps || 0 })) };
    }
    if (r.type === "emom") {
      return { name: r.name, type: "emom", timeCap, circuit: r.steps.map((s) => ({ title: s.name, detail: s.detail || "", reps: s.reps || 0 })) };
    }
    let steps = r.steps.map((s) => ({ title: s.name, detail: s.detail || "", reps: s.reps || 0, round: null }));
    if (r.type === "rounds" && (r.rounds || 1) > 1) {
      const base = steps;
      steps = [];
      for (let i = 1; i <= r.rounds; i++) {
        base.forEach((s) => steps.push({ ...s, round: i }));
      }
    }
    return { name: r.name, type: "linear", steps, timeCap };
  }

  function summaryOf(resolved) {
    let stepsCount = resolved.steps ? resolved.steps.length : resolved.circuit.length;
    let timeCapText = resolved.timeCap ? Math.round(resolved.timeCap / 60) + " min" : null;
    return { stepsCount, timeCapText };
  }

  let routineFilter = "all";
  let currentDetail = null;

  function renderRoutines() {
    const grid = $("#routineGrid");
    const items = [];

    if (routineFilter === "all" || routineFilter === "benchmark" || routineFilter === "hero") {
      window.WODS.forEach((wod) => {
        if (routineFilter !== "all" && wod.category !== routineFilter) return;
        const resolved = resolvePreset(wod);
        const s = summaryOf(resolved);
        items.push({
          key: wod.id, kind: "preset", category: wod.category, name: wod.name,
          typeLabel: TYPE_LABEL[wod.type] || wod.type, desc: wod.description,
          stepsCount: s.stepsCount, timeCapText: s.timeCapText, ref: wod
        });
      });
    }
    if (routineFilter === "all" || routineFilter === "custom") {
      state.custom.forEach((r) => {
        const resolved = resolveCustom(r);
        const s = summaryOf(resolved);
        items.push({
          key: r.id, kind: "custom", category: "custom", name: r.name,
          typeLabel: TYPE_LABEL[r.type] || r.type, desc: r.steps.map((x) => x.name).join(" · "),
          stepsCount: s.stepsCount, timeCapText: s.timeCapText, ref: r
        });
      });
    }

    if (!items.length) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1"><span class="empty-icon" data-icon="list"></span>' +
        "<p>No hay rutinas en esta categoría.<br />Crea una nueva con el botón «Nueva rutina».</p></div>";
      hydrateIcons(grid);
      return;
    }

    grid.innerHTML = items.map((it) => {
      const badge = {
        benchmark: '<span class="routine-badge badge-benchmark">Benchmark</span>',
        hero: '<span class="routine-badge badge-hero">Héroe</span>',
        custom: '<span class="routine-badge badge-custom">Personalizada</span>'
      }[it.category];
      const meta =
        '<span data-icon="list"></span> ' + it.stepsCount + " pasos" +
        (it.timeCapText ? ' · <span data-icon="timer"></span> ' + it.timeCapText : "");
      const actions = it.kind === "custom"
        ? '<div class="routine-actions">' +
          '<button class="icon-btn" data-edit="' + it.key + '" aria-label="Editar"><span data-icon="edit"></span></button>' +
          '<button class="icon-btn" data-del="' + it.key + '" aria-label="Eliminar"><span data-icon="trash"></span></button>' +
          "</div>"
        : "";
      return (
        '<div class="routine-card" data-start="' + it.key + '" data-kind="' + it.kind + '">' +
        actions + badge +
        '<div class="routine-name">' + escapeHtml(it.name) + "</div>" +
        '<div class="routine-type">' + escapeHtml(it.typeLabel) + "</div>" +
        '<div class="routine-desc">' + escapeHtml(it.desc) + "</div>" +
        '<div class="routine-meta">' + meta + "</div>" +
        "</div>"
      );
    }).join("");
    hydrateIcons(grid);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function findCustom(id) { return state.custom.find((r) => r.id === id); }

  function stepItemHtml(idx, title, detail, reps, round) {
    const repsText = reps > 0 ? reps + " reps" : "—";
    const roundTxt = round ? ' <small>(ronda ' + round + ")</small>" : "";
    const detailTxt = detail ? '<span class="rd-step-detail">' + escapeHtml(detail) + "</span>" : "";
    return (
      '<div class="rd-step">' +
      '<span class="rd-step-idx">' + idx + "</span>" +
      '<span class="rd-step-name">' + escapeHtml(title) + roundTxt + "</span>" +
      '<span class="rd-step-reps">' + repsText + "</span>" +
      detailTxt +
      "</div>"
    );
  }

  function openRoutineDetail(detail) {
    currentDetail = detail;
    $("#rdName").textContent = detail.name;
    $("#rdType").textContent = detail.typeLabel;
    const cap = detail.resolved.timeCap ? Math.round(detail.resolved.timeCap / 60) + " min" : null;
    $("#rdTimeCap").hidden = !cap;
    $("#rdTimeCap").textContent = cap || "";
    $("#rdDesc").textContent = detail.desc || "";

    let html = "";
    if (detail.resolved.type === "amrap") {
      html = '<div class="rd-note">AMRAP — repite este circuito hasta agotar el tiempo:</div>';
      (detail.resolved.circuit || []).forEach((s, i) => { html += stepItemHtml(i + 1, s.title, s.detail, s.reps); });
    } else if (detail.resolved.type === "emom") {
      html = '<div class="rd-note">EMOM — cada minuto realiza:</div>';
      (detail.resolved.circuit || []).forEach((s, i) => { html += stepItemHtml(i + 1, s.title, s.detail, s.reps); });
    } else {
      (detail.resolved.steps || []).forEach((s, i) => { html += stepItemHtml(i + 1, s.title, s.detail, s.reps, s.round); });
    }
    $("#rdSteps").innerHTML = html;
    openModal("modalRoutineDetail");
  }

  /* ====================== Constructor de rutinas ====================== */
  let editingId = null;

  function openRoutineBuilder(editId) {
    editingId = editId || null;
    const r = editId ? findCustom(editId) : null;

    $("#modalRoutineTitle").textContent = r ? "Editar rutina" : "Nueva rutina";
    $("#routineName").value = r ? r.name : "";
    $("#routineType").value = r ? r.type : "for-time";
    $("#routineTimeCap").value = r ? (r.timeCap || 0) : 0;
    $("#routineRounds").value = r ? (r.rounds || 3) : 3;
    toggleRoundsField();

    const steps = r ? r.steps : [{ name: "", detail: "", reps: 0 }];
    renderStepRows(steps);
    openModal("modalRoutine");
  }

  function toggleRoundsField() {
    $("#roundsField").hidden = $("#routineType").value !== "rounds";
  }

  function renderStepRows(steps) {
    const box = $("#stepBuilder");
    box.innerHTML = steps.map((s, i) => stepRowHtml(s, i)).join("");
    hydrateIcons(box);
  }

  function stepRowHtml(s, i) {
    return (
      '<div class="step-row" data-idx="' + i + '">' +
      '<input type="text" class="step-name" list="exerciseList" placeholder="Ejercicio" value="' + escapeHtml(s.name || "") + '" />' +
      '<input type="text" class="step-detail" placeholder="Peso/dist" value="' + escapeHtml(s.detail || "") + '" />' +
      '<input type="number" class="step-reps" min="0" max="9999" placeholder="Reps" value="' + (s.reps || 0) + '" />' +
      '<button class="step-del" data-remove="' + i + '" aria-label="Quitar paso"><span data-icon="close"></span></button>' +
      "</div>"
    );
  }

  function addStepRow() {
    const box = $("#stepBuilder");
    const idx = box.children.length;
    const div = document.createElement("div");
    div.innerHTML = stepRowHtml({ name: "", detail: "", reps: 0 }, idx);
    box.appendChild(div.firstChild);
    hydrateIcons(box);
    $(".step-name", box.lastChild).focus();
  }

  function readStepsFromBuilder() {
    return $$(".step-row", $("#stepBuilder")).map((row) => ({
      name: $(".step-name", row).value.trim(),
      detail: $(".step-detail", row).value.trim(),
      reps: Math.max(0, parseInt($(".step-reps", row).value, 10) || 0)
    })).filter((s) => s.name !== "");
  }

  function saveRoutine() {
    const name = $("#routineName").value.trim();
    if (!name) { toast("Ponle un nombre a la rutina"); $("#routineName").focus(); return; }
    const steps = readStepsFromBuilder();
    if (!steps.length) { toast("Añade al menos un paso"); return; }

    const type = $("#routineType").value;
    const timeCap = Math.max(0, parseInt($("#routineTimeCap").value, 10) || 0);
    if ((type === "amrap" || type === "emom") && timeCap <= 0) {
      toast("Indica un tope de tiempo para " + (type === "amrap" ? "AMRAP" : "EMOM"));
      $("#routineTimeCap").focus();
      return;
    }

    const data = {
      name,
      type,
      timeCap,
      rounds: Math.max(1, parseInt($("#routineRounds").value, 10) || 1),
      steps
    };

    if (editingId) {
      const i = state.custom.findIndex((r) => r.id === editingId);
      if (i >= 0) state.custom[i] = { ...state.custom[i], ...data };
    } else {
      state.custom.push({ id: uid(), ...data });
    }
    save();
    closeModal("modalRoutine");
    renderRoutines();
    toast("Rutina guardada");
  }

  function deleteCustom(id) {
    state.custom = state.custom.filter((r) => r.id !== id);
    save();
    renderRoutines();
    toast("Rutina eliminada");
  }

  /* ==========================================================================
     RUNNER (paso a paso)
     ========================================================================== */
  let runner = null;
  let runnerTimer = null;
  let runnerBodyTemplate = "";

  function startRunner(resolved) {
    runner = {
      _resolved: resolved,
      name: resolved.name,
      type: resolved.type,
      steps: resolved.steps || [],
      circuit: resolved.circuit || [],
      timeCap: resolved.timeCap || 0,
      mode: resolved.type === "amrap" ? "amrap" : resolved.type === "emom" ? "emom" : "linear",
      stepIndex: 0,
      roundsCompleted: 0,
      currentReps: 0,
      currentRound: 1,
      waiting: false,
      completed: false,
      startMs: Date.now()
    };

    // Configurar timer según el modo
    runnerTimer = new window.TimerEngine({
      onTick: runnerTick,
      onBeep: runnerBeep,
      onFinish: runnerTimerFinish
    });

    if (runner.mode === "amrap") {
      runnerTimer.configure({ mode: "countdown", durationSec: runner.timeCap });
    } else if (runner.mode === "emom") {
      runnerTimer.configure({ mode: "emom", intervalSec: 60, durationSec: runner.timeCap });
    } else {
      runnerTimer.configure({ mode: "stopwatch" });
    }

    $("#runner").hidden = false;
    $("#runnerWodName").textContent = runner.name;
    $("#runnerBody").innerHTML = runnerBodyTemplate;
    hydrateIcons($("#runnerBody"));
    runnerTimer.start();
    updateRunnerStep();
  }

  function exitRunner() {
    if (runnerTimer) { runnerTimer.reset(); runnerTimer = null; }
    runner = null;
    $("#runner").hidden = true;
    renderRoutines();
  }

  function runnerTick(st) {
    if (!runner) return;
    $("#runnerTimer").textContent = st.display;
    if (st.round) runner.currentRound = st.round;
    if (st.finished && runner.mode === "amrap") {
      finishRunner();
    }
  }

  function runnerBeep(kind) {
    if (!runner) return;
    if (kind === "tick") { if (state.sound) sound("tick"); }
    else if (kind === "end") {
      if (state.sound) sound("end");
      // En EMOM, al cambiar de minuto se reinicia el circuito
      if (runner.mode === "emom" && runner.waiting) {
        runner.waiting = false;
        runner.stepIndex = 0;
        runner.currentReps = 0;
        updateRunnerStep();
      }
    }
  }

  function runnerTimerFinish() {
    if (runner && runner.mode === "amrap") finishRunner();
  }

  function currentRunnerStep() {
    if (runner.mode === "linear") return runner.steps[runner.stepIndex] || null;
    if (runner.waiting) return null;
    return runner.circuit[runner.stepIndex] || null;
  }

  function updateRunnerVideo(step) {
    const box = $("#runnerVideo");
    const frame = $("#runnerVideoFrame");
    if (!box || !frame) return;
    const vid = step && typeof window.resolveMovementVideo === "function"
      ? window.resolveMovementVideo(step.title)
      : null;
    if (vid && vid.id) {
      const nextSrc = "https://www.youtube-nocookie.com/embed/" + vid.id + "?rel=0&playsinline=1";
      box.hidden = false;
      box.classList.toggle("vertical", !!vid.vertical);
      // Solo recargar el iframe si cambia el vídeo (evita reiniciarlo en cada rep)
      if (frame.getAttribute("src") !== nextSrc) frame.setAttribute("src", nextSrc);
    } else {
      box.hidden = true;
      box.classList.remove("vertical");
      if (frame.getAttribute("src")) frame.removeAttribute("src");
    }
  }

  function updateRunnerStep() {
    if (!runner) return;

    const step = currentRunnerStep();

    if (runner.mode === "linear") {
      const total = runner.steps.length;
      $("#runnerProgressLabel").textContent = "Paso " + (runner.stepIndex + 1) + " de " + total;
      $("#runnerProgressFill").style.width = ((runner.stepIndex) / total * 100) + "%";
      $("#runnerRoundBadge").hidden = true;
    } else if (runner.mode === "amrap") {
      const total = runner.circuit.length;
      const round = runner.roundsCompleted + 1;
      $("#runnerProgressLabel").textContent = "Ronda " + round + " · Paso " + (runner.stepIndex + 1) + " de " + total;
      const remaining = Math.max(0, runner.timeCap - (runnerTimer ? runnerTimer.elapsedMs : 0));
      $("#runnerProgressFill").style.width = ((remaining / runner.timeCap) * 100) + "%";
      $("#runnerRoundBadge").hidden = false;
      $("#runnerRoundBadge").textContent = "Ronda " + round;
    } else if (runner.mode === "emom") {
      const round = runner.currentRound || 1;
      const total = runner.circuit.length;
      $("#runnerRoundBadge").hidden = false;
      $("#runnerRoundBadge").textContent = "Minuto " + round;
      if (runner.waiting) {
        $("#runnerProgressLabel").textContent = "Espera el siguiente minuto…";
        $("#runnerProgressFill").style.width = "100%";
      } else {
        $("#runnerProgressLabel").textContent = "Minuto " + round + " · Paso " + (runner.stepIndex + 1) + " de " + total;
        $("#runnerProgressFill").style.width = (((runner.stepIndex) / total) * 100) + "%";
      }
    }

    // Cuerpo
    if (!step) {
      // estado de espera EMOM
      $("#runnerMovement").textContent = "Preparado";
      $("#runnerDetail").textContent = "El siguiente minuto comienza en breve…";
      $("#runnerCount").textContent = "—";
      $("#runnerTarget").textContent = "";
      $("#runnerCounter").classList.remove("done");
      $("#runnerNextLabel").textContent = "Listo";
      $("#runnerNext").disabled = true;
      updateRunnerVideo(null);
      return;
    }

    $("#runnerMovement").textContent = step.title;
    $("#runnerDetail").textContent = step.detail || "";
    $("#runnerNext").disabled = false;
    updateRunnerVideo(step);

    const target = step.reps || 0;
    const isSingle = target <= 1;
    $("#runnerCount").textContent = isSingle ? (runner.currentReps >= 1 ? "✓" : "0") : runner.currentReps;
    $("#runnerTarget").textContent = target > 1 ? "de " + target + " reps" : (target === 1 ? "1 rep / hecho" : "libre");

    const done = target > 0 && runner.currentReps >= target;
    $("#runnerCounter").classList.toggle("done", done);

    // Botón siguiente
    if (runner.mode === "linear") {
      $("#runnerNextLabel").textContent = runner.stepIndex >= runner.steps.length - 1 ? "Finalizar" : "Siguiente paso";
    } else if (runner.mode === "amrap") {
      $("#runnerNextLabel").textContent = runner.stepIndex >= runner.circuit.length - 1 ? "Completar ronda" : "Siguiente paso";
    } else {
      $("#runnerNextLabel").textContent = runner.stepIndex >= runner.circuit.length - 1 ? "Terminar minuto" : "Siguiente paso";
    }
  }

  function runnerPlus() {
    if (!runner || runner.completed) return;
    const step = currentRunnerStep();
    if (!step) return;
    runner.currentReps++;
    if (state.sound) sound("tap");
    bump($("#runnerCount"), "bump");
    updateRunnerStep();
  }

  function runnerMinus() {
    if (!runner || runner.completed) return;
    runner.currentReps = Math.max(0, runner.currentReps - 1);
    updateRunnerStep();
  }

  function runnerNext() {
    if (!runner || runner.completed) return;
    if (runner.waiting) return;

    if (runner.mode === "linear") {
      runner.stepIndex++;
      if (runner.stepIndex >= runner.steps.length) { finishRunner(); return; }
    } else if (runner.mode === "amrap") {
      runner.stepIndex++;
      if (runner.stepIndex >= runner.circuit.length) {
        runner.roundsCompleted++;
        runner.stepIndex = 0;
      }
    } else if (runner.mode === "emom") {
      runner.stepIndex++;
      if (runner.stepIndex >= runner.circuit.length) {
        runner.waiting = true;
        runner.stepIndex = -1;
      }
    }
    runner.currentReps = 0;
    updateRunnerStep();
  }

  function runnerPrev() {
    if (!runner || runner.completed) return;
    if (runner.mode === "linear") {
      if (runner.stepIndex > 0) { runner.stepIndex--; runner.currentReps = 0; }
    } else {
      if (runner.stepIndex > 0) { runner.stepIndex--; runner.currentReps = 0; }
    }
    updateRunnerStep();
  }

  function finishRunner() {
    if (!runner || runner.completed) return;
    runner.completed = true;
    if (runnerTimer) runnerTimer.pause();
    if (state.sound) sound("success");

    const body = $("#runnerBody");
    const elapsedSec = Math.round((Date.now() - runner.startMs) / 1000);
    const timeStr = window.fmtTime(elapsedSec * 1000);
    let extra = "";
    if (runner.mode === "amrap") {
      const partial = runner.stepIndex > 0 ? " + " + runner.stepIndex + " pasos" : "";
      extra = '<div class="runner-stat">' + runner.roundsCompleted + " rondas" + partial + "</div>";
    } else if (runner.mode === "emom") {
      extra = '<div class="runner-stat">' + (runner.currentRound || 1) + " minutos</div>";
    }

    body.innerHTML =
      '<div class="runner-finish">' +
      '<h2>¡Rutina completada!</h2>' +
      '<p>' + escapeHtml(runner.name) + "</p>" +
      '<div class="runner-stat">Tiempo: ' + timeStr + "</div>" +
      extra +
      '<div style="margin-top:22px;display:flex;gap:10px;justify-content:center">' +
      '<button class="btn btn-ghost" id="runnerRepeat"><span data-icon="reset"></span> Repetir</button>' +
      '<button class="btn btn-primary" id="runnerClose"><span data-icon="check"></span> Hecho</button>' +
      "</div></div>";
    hydrateIcons(body);
  }

  function resolveCurrentAgain() {
    // Guarda una referencia a la rutina en curso para poder repetirla
    return runner._resolved;
  }

  /* ==========================================================================
     CRONÓMETRO (vista)
     ========================================================================== */
  const mainTimer = new window.TimerEngine({
    onTick: mainTick,
    onBeep: (k) => { if (k === "tick") sound("tick"); else if (k === "end") sound("end"); },
    onFinish: () => { sound("success"); }
  });

  let mainMode = "stopwatch";
  let lastAutoRound = 0;
  let lastMainRunning = null;

  function mainTick(st) {
    $("#timerTime").textContent = st.display;
    const stateEl = $("#timerState");
    stateEl.textContent = st.finished ? "Terminado" : st.running ? (st.phase || "En marcha") : "Listo";
    stateEl.classList.toggle("is-running", st.running && !st.finished);
    $("#timerFace").classList.toggle("is-finished", st.finished);
    if (lastMainRunning !== st.running) {
      lastMainRunning = st.running;
      setIcon($("#timerToggle"), st.running ? "pause" : "play");
    }

    if (st.running && (st.mode === "tabata" || st.mode === "emom") && st.round && st.round !== lastAutoRound) {
      lastAutoRound = st.round;
      addLap("Ronda " + st.round, st.display, true);
    }
  }

  function renderTimerConfig() {
    const box = $("#timerConfig");
    const f = (label, id, val, min) =>
      '<label class="field"><span class="field-label">' + label + '</span>' +
      '<input type="number" id="' + id + '" min="' + (min || 0) + '" value="' + val + '" /></label>';

    switch (mainMode) {
      case "countdown":
        box.innerHTML = f("Minutos", "tMin", 1, 0) + f("Segundos", "tSec", 0, 0);
        break;
      case "amrap":
        box.innerHTML = f("Minutos", "tMin", 20, 1);
        break;
      case "emom":
        box.innerHTML = f("Minutos (duración)", "tMin", 10, 1) + f("Intervalo (seg)", "tInt", 60, 5);
        break;
      case "tabata":
        box.innerHTML = f("Trabajo (seg)", "tWork", 20, 1) + f("Descanso (seg)", "tRest", 10, 1) + f("Rondas", "tRounds", 8, 1);
        break;
      default:
        box.innerHTML = '<span class="field-label" style="color:var(--text-faint)">Cuenta el tiempo transcurrido. Pulsa ▶ para empezar.</span>';
    }
  }

  function readTimerConfig() {
    const num = (id, def) => { const el = $("#" + id); return el ? (parseInt(el.value, 10) || def) : def; };
    switch (mainMode) {
      case "countdown":
        return { mode: "countdown", durationSec: num("tMin", 0) * 60 + num("tSec", 0) };
      case "amrap":
        return { mode: "countdown", durationSec: num("tMin", 1) * 60 };
      case "emom":
        return { mode: "emom", intervalSec: num("tInt", 60), durationSec: num("tMin", 1) * 60 };
      case "tabata":
        return { mode: "tabata", workSec: num("tWork", 20), restSec: num("tRest", 10), tabataRounds: num("tRounds", 8) };
      default:
        return { mode: "stopwatch" };
    }
  }

  function applyTimerConfig() {
    const cfg = readTimerConfig();
    mainTimer.configure(cfg);
    lastAutoRound = 0;
    $("#timerFace").classList.remove("is-finished");
  }

  function clearLaps() {
    lastAutoRound = 0;
    renderLaps();
  }

  function addLap(label, value, isRound) {
    const list = $("#lapsList");
    // elimina empty state si existe
    const empty = $(".empty-state", list);
    if (empty) empty.remove();
    const div = document.createElement("div");
    div.className = "lap-item";
    div.innerHTML = '<span class="lap-idx">' + label + '</span><span class="lap-val' + (isRound ? " is-best" : "") + '">' + value + "</span>";
    list.prepend(div);
  }

  function renderLaps() {
    const list = $("#lapsList");
    list.innerHTML =
      '<div class="empty-state"><span class="empty-icon" data-icon="flag"></span>' +
      "<p>Las rondas de AMRAP/EMOM/Tabata<br />y las vueltas aparecerán aquí.</p></div>";
    hydrateIcons(list);
  }

  /* ==========================================================================
     Modales
     ========================================================================== */
  function openModal(id) {
    const m = $("#" + id);
    m.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal(id) {
    const m = $("#" + id);
    m.hidden = true;
    document.body.style.overflow = "";
  }

  /* ==========================================================================
     Atajos de teclado
     ========================================================================== */
  function isTyping(e) {
    const t = e.target;
    return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
  }

  function onKeydown(e) {
    const runnerOpen = runner && !$("#runner").hidden;
    const modalOpen = $$(".modal").some((m) => !m.hidden);

    if (e.key === "Escape") {
      if (runnerOpen) { exitRunner(); return; }
      $$(".modal").forEach((m) => { if (!m.hidden) closeModal(m.id); });
      return;
    }
    if (isTyping(e)) return;
    // Con un modal abierto, los atajos del contador no deben actuar por detrás
    if (modalOpen && !runnerOpen) return;

    if (e.code === "Space") {
      e.preventDefault();
      ensureAudio();
      if (runnerOpen) runnerPlus();
      else if (activeCounter === "set") registerSeries();
      else repIncrement();
    } else if (e.key === "-" || e.key === "_") {
      if (runnerOpen) runnerMinus();
      else if (activeCounter === "set") unregisterSeries();
      else repDecrement();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      ensureAudio();
      if (runnerOpen) runnerPlus();
      else if (activeCounter === "set") registerSeries();
      else repIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (runnerOpen) runnerMinus();
      else if (activeCounter === "set") unregisterSeries();
      else repDecrement();
    } else if (e.key === "r" || e.key === "R") {
      if (runnerOpen) { runner.currentReps = 0; updateRunnerStep(); }
      else repReset();
    } else if (e.key === "s" || e.key === "S") {
      if (!runnerOpen) registerSeries();
    } else if (e.key === "Enter") {
      if (runnerOpen) runnerNext();
    } else if (e.key === "ArrowRight") {
      if (runnerOpen) { e.preventDefault(); runnerNext(); }
    } else if (e.key === "ArrowLeft") {
      if (runnerOpen) { e.preventDefault(); runnerPrev(); }
    }
  }

  /* ==========================================================================
     Init
     ========================================================================== */
  function init() {
    // Iconos estáticos
    hydrateIcons(document);
    setIcon($("#btnSound"), state.sound ? "sound-on" : "sound-off");
    applyTheme();
    setIcon($("#btnFullscreen"), document.fullscreenElement ? "compress" : "expand");

    // Plantilla del cuerpo del runner (para restaurar tras finalizar)
    runnerBodyTemplate = $("#runnerBody").innerHTML;

    // Datalist de ejercicios para el constructor de rutinas
    const dl = document.createElement("datalist");
    dl.id = "exerciseList";
    window.EXERCISES.forEach((ex) => {
      const o = document.createElement("option");
      o.value = ex.name;
      o.label = ex.cat;
      dl.appendChild(o);
    });
    document.body.appendChild(dl);

    renderCounter();
    setActiveCounter("rep");
    renderHistory();
    renderRoutines();
    renderTimerConfig();
    renderLaps();
    switchView("counter");

    // Navegación
    $("#tabbar").addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (tab) switchView(tab.dataset.view);
    });

    // Contador
    $("#repPlus").addEventListener("click", () => { setActiveCounter("rep"); ensureAudio(); repIncrement(); });
    $("#repMinus").addEventListener("click", () => { setActiveCounter("rep"); repDecrement(); });
    $("#repReset").addEventListener("click", () => { setActiveCounter("rep"); repReset(); });
    $("#repDisplay").addEventListener("click", () => { setActiveCounter("rep"); ensureAudio(); repIncrement(); });
    $("#setPlus").addEventListener("click", () => { setActiveCounter("set"); ensureAudio(); registerSeries(); });
    $("#setMinus").addEventListener("click", () => { setActiveCounter("set"); unregisterSeries(); });
    $("#setReset").addEventListener("click", () => { setActiveCounter("set"); clearHistory(); });
    $("#setDisplay").addEventListener("click", () => { setActiveCounter("set"); ensureAudio(); registerSeries(); });
    $("#historyClear").addEventListener("click", clearHistory);
    $("#repConfig").addEventListener("click", () => { setActiveCounter("rep"); openCounterConfig("rep"); });
    $("#setConfig").addEventListener("click", () => { setActiveCounter("set"); openCounterConfig("set"); });

    // Historial (delegación)
    $("#historyList").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-del]");
      if (btn) {
        state.history = state.history.filter((h) => h.id !== btn.dataset.del);
        save();
        renderCounter();
        renderHistory();
      }
    });

    // Configuración de contador
    $("#btnSaveCounter").addEventListener("click", saveCounterConfig);

    // Rutinas
    $("#routineFilter").addEventListener("click", (e) => {
      const seg = e.target.closest(".seg");
      if (!seg) return;
      routineFilter = seg.dataset.filter;
      $$("#routineFilter .seg").forEach((s) => s.classList.remove("is-active"));
      seg.classList.add("is-active");
      renderRoutines();
    });
    $("#btnNewRoutine").addEventListener("click", () => openRoutineBuilder(null));
    $("#routineGrid").addEventListener("click", (e) => {
      const startEl = e.target.closest("[data-start]");
      const editEl = e.target.closest("[data-edit]");
      const delEl = e.target.closest("[data-del]");
      if (editEl) { openRoutineBuilder(editEl.dataset.edit); return; }
      if (delEl) { deleteCustom(delEl.dataset.del); return; }
      if (startEl) {
        const kind = startEl.dataset.kind;
        const key = startEl.dataset.start;
        let resolved, name, desc, typeLabel;
        if (kind === "preset") {
          const wod = window.WODS.find((w) => w.id === key);
          resolved = resolvePreset(wod);
          name = wod.name;
          desc = wod.description;
          typeLabel = TYPE_LABEL[wod.type] || wod.type;
        } else {
          const r = findCustom(key);
          resolved = resolveCustom(r);
          name = r.name;
          desc = r.steps.map((x) => x.name).join(" · ");
          typeLabel = TYPE_LABEL[r.type] || r.type;
        }
        openRoutineDetail({ resolved, name, desc, typeLabel });
      }
    });

    // Constructor de rutinas
    $("#routineType").addEventListener("change", toggleRoundsField);
    $("#btnAddStep").addEventListener("click", addStepRow);
    $("#stepBuilder").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove]");
      if (!btn) return;
      const row = btn.closest(".step-row");
      if ($("#stepBuilder").children.length <= 1) {
        // limpia en vez de borrar el último
        $(".step-name", row).value = "";
        $(".step-detail", row).value = "";
        $(".step-reps", row).value = "0";
        return;
      }
      row.remove();
    });
    $("#btnSaveRoutine").addEventListener("click", saveRoutine);

    // Detalle de rutina (antes de comenzar)
    $("#rdStart").addEventListener("click", () => {
      if (!currentDetail) return;
      const d = currentDetail.resolved;
      d._resolved = d;
      closeModal("modalRoutineDetail");
      startRunner(d);
    });

    // Runner (delegación de eventos sobre el contenedor estable)
    $("#runner").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      switch (b.id) {
        case "runnerExit": exitRunner(); break;
        case "runnerPlus": ensureAudio(); runnerPlus(); break;
        case "runnerMinus": runnerMinus(); break;
        case "runnerUndo": runnerPrev(); break;
        case "runnerNext": runnerNext(); break;
        case "runnerClose": exitRunner(); break;
        case "runnerRepeat": startRunner(resolveCurrentAgain()); break;
      }
    });

    // Cronómetro
    $("#timerModes").addEventListener("click", (e) => {
      const seg = e.target.closest(".seg");
      if (!seg) return;
      mainMode = seg.dataset.mode;
      $$("#timerModes .seg").forEach((s) => s.classList.remove("is-active"));
      seg.classList.add("is-active");
      renderTimerConfig();
      applyTimerConfig();
    });
    $("#timerConfig").addEventListener("change", applyTimerConfig);
    $("#timerToggle").addEventListener("click", () => { ensureAudio(); mainTimer.toggle(); });
    $("#timerReset").addEventListener("click", () => { applyTimerConfig(); clearLaps(); });
    $("#timerLap").addEventListener("click", () => {
      if (mainTimer.running) addLap("Vuelta", mainTimer.elapsedMs ? window.fmtTime(mainTimer.elapsedMs) : "00:00", false);
    });
    $("#lapsClear").addEventListener("click", clearLaps);

    // Sonido
    $("#btnSound").addEventListener("click", () => {
      state.sound = !state.sound;
      save();
      setIcon($("#btnSound"), state.sound ? "sound-on" : "sound-off");
      toast(state.sound ? "Sonido activado" : "Sonido desactivado");
      if (state.sound) sound("tap");
    });

    // Tema día/noche
    $("#btnTheme").addEventListener("click", () => {
      state.theme = state.theme === "light" ? "dark" : "light";
      save();
      applyTheme();
    });

    // Pantalla completa
    $("#btnFullscreen").addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => toast("Pantalla completa no disponible en este navegador"));
      } else {
        toast("Pantalla completa no disponible en este navegador");
      }
    });
    document.addEventListener("fullscreenchange", () => {
      setIcon($("#btnFullscreen"), document.fullscreenElement ? "compress" : "expand");
    });

    // Ayuda
    $("#btnHelp").addEventListener("click", () => openModal("modalHelp"));

    // Cierre de modales
    document.addEventListener("click", (e) => {
      const closer = e.target.closest("[data-close]");
      if (closer) closeModal(closer.dataset.close);
    });

    // Teclado
    document.addEventListener("keydown", onKeydown);

    // Re-render periódico para mantener "hace X tiempo" (opcional, ligero)
    window.addEventListener("beforeunload", save);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
