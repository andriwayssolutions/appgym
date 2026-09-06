/* ==========================================================================
   AppGym — Módulo "Programa"
   Plan de pesas ATHLEAN Inferno / Max-Size — 12 semanas, 3 fases + cierre.
     · Fase 1 (sem 1-4)  — IGNITION, método XV-10 ("10-by"), pesos por %1RM.
     · Fase 2 (sem 5-8)  — AX-RSON: superserie + drop→iso + series rectas, por RM.
     · Fase 3 (sem 9-11) — BACKFIRE: tempos 1/1/5 y 5/1/1, 50 / 25 reps.
     · Semana 12         — retos de cierre (Fireman's Carry, Towering Inferno).
   Estado propio en localStorage ("appgym:program:v1"), independiente del resto
   de la app. Reusa TimerEngine (descanso / reloj de finisher) y
   window.AppGym.startWodById para los retos.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const STORE_KEY = "appgym:program:v1";
  const LB_PER_KG = 2.2046226;

  const PROGRAM = { id: "ax-max-size", name: "ATHLEAN Inferno · Max/Size", totalWeeks: 12 };

  /* ======================================================================
     Fase 1 — ejercicios base (se pide el 1RM en el onboarding)
     ====================================================================== */
  const LIFTS = [
    { id: "incline-bench",     name: "Press Inclinado (barra o mancuernas)",      muscle: "Pecho" },
    { id: "underhand-row",     name: "Remo con Barra Supino",                     muscle: "Espalda" },
    { id: "squat",             name: "Sentadilla con Barra",                      muscle: "Cuádriceps" },
    { id: "deadlift",          name: "Peso Muerto",                               muscle: "Isquios" },
    { id: "bb-curl",           name: "Curl con Barra",                            muscle: "Bíceps" },
    { id: "lying-tri-ext",     name: "Extensión de Tríceps Tumbado (Barra EZ/DB)", muscle: "Tríceps" },
    { id: "db-shoulder-press", name: "Press Militar con Mancuernas",              muscle: "Hombros" },
    { id: "db-high-pull",      name: "High Pull con Mancuernas",                  muscle: "Trapecios" }
  ];
  const DAY_PAIRS = [
    { day: "mon", a: "incline-bench",     b: "underhand-row" },
    { day: "tue", a: "squat",             b: "deadlift" },
    { day: "thu", a: "bb-curl",           b: "lying-tri-ext" },
    { day: "fri", a: "db-shoulder-press", b: "db-high-pull" }
  ];

  const MUSCLE_SHORT = {
    "Pecho": "Pecho", "Espalda": "Espalda", "Cuádriceps": "Cuádr.", "Isquios": "Isquios",
    "Bíceps": "Bíceps", "Tríceps": "Tríceps", "Hombros": "Hombro", "Trapecios": "Trapec."
  };

  // Finishers de Fase 1 por músculo.
  //   proPain  (sem 1-2): máx reps de `reps` al fallo → 2× ese nº en 4:30.
  //   isoProPain (sem 3-4): hold de `iso` 60 s → completar el nº de reps de `reps`
  //                         del PRO-PAIN en 9 min; cada descanso retoma con hold 30 s.
  const F1_FINISHERS = {
    "Pecho":      { reps: "Flexiones (push-ups)",       iso: "hold en la posición baja de la flexión" },
    "Espalda":    { reps: "Inverted rows",              iso: "Inverted Row Hold (arriba, escápulas juntas)" },
    "Cuádriceps": { reps: "Prisoner jump squats",       iso: "Wall sit (sentadilla isométrica apoyado en la pared)" },
    "Isquios":    { reps: "Curl femoral en fitball",    iso: "plancha de glúteos con piernas extendidas (long-leg glute bridge hold)" },
    "Bíceps":     { reps: "Inverted chin rows",         iso: "Inverted Chin Curl Hold",
                    beginner: "Principiantes: hacé Inverted Chinups al fallo (en vez de Inverted Chin Rows) y el hold es Inverted Chin Row Hold." },
    "Tríceps":    { reps: "Fondos en banco (bench dips)", iso: "hold en el punto bajo del fondo en banco" },
    "Hombros":    { reps: "Press militar neutro DB",    iso: "Side Lateral 45° Hold (con la mitad del peso habitual de elevaciones laterales)",
                    load: "PRO-PAIN: al 50% del 12RM · ISO: peso habitual de elevaciones laterales" },
    "Trapecios":  { reps: "Encogimientos DB sentado",   iso: "Seated DB Shrug Hold (usá el 12RM de Press Militar DB)",
                    load: "PRO-PAIN: al 50% del 12RM · ISO principiante: pies apoyados en el piso" }
  };
  function f1Finisher(muscle, week) {
    const f = F1_FINISHERS[muscle];
    const iso = week >= 3;
    let protocol;
    if (iso) {
      protocol = "Hold de «" + f.iso + "» 60 s. Después, en 9 min, completá el nº de reps de «" + f.reps +
        "» que lograste al fallo en tu PRO-PAIN. Cada vez que descansás, retomás con un hold de 30 s — el reloj no para.";
      if (f.beginner) protocol += " " + f.beginner;
    } else {
      protocol = "Máx repeticiones de «" + f.reps + "» al fallo. Al terminar la última rep, arrancá el reloj de 4:30 y completá 2× ese número.";
    }
    if (f.load) protocol += " (Carga: " + f.load + ".)";
    return {
      key: slug(muscle) + "-fin", kind: "propain", muscle: muscle,
      movement: f.reps + (iso ? " · hold: " + f.iso : ""),
      protocol: protocol, clockSec: iso ? 540 : 270, label: iso ? "ISO-PRO-PAIN" : "PRO-PAIN"
    };
  }

  /* ======================================================================
     Fase 2 — AX-RSON (por músculo)
     ====================================================================== */
  const F2_MUSCLES = {
    "Pecho": {
      superset: ["Floor Flys", "Press Inclinado"], dropIso: "Floor Flys", straight: "Press de Banca",
      finisher: { name: "Pec Purgatory", protocol: "3 rondas — DB Incline Bench (midrange) ×F ⇒ Lower Dip Stretch Hold 30 s ⇒ Cable Cross Contraction (burnout)" }
    },
    "Tríceps": {
      superset: ["DB Inverted Kickbacks", "Extensión de Tríceps en Banco Inclinado (DB)"], dropIso: "Extensión de Tríceps en Banco Inclinado (DB)", straight: "Press Cerrado (Close Grip Bench)",
      finisher: { name: "Steel Moving", protocol: "Triceps Pushdowns (12RM) ×F ⇒ 1½× ese número sin soltar" }
    },
    "Cuádriceps": {
      superset: ["Bulgarian Split Squat (hold al fallo / pierna)", "Sentadilla con Barra"], dropIso: "Sentadilla con Barra", straight: "Zancadas Inversas Alternas (DB)",
      finisher: { name: "Liquid Legs", protocol: "DB Goblet Squat ×100 total · Wall Sit 1 min en cada minuto par" }
    },
    "Isquios": {
      superset: ["Physioball Glute-Ham Raise", "Hip Thrust con Barra"], dropIso: "Hip Thrust con Barra", straight: "Peso Muerto Rumano (piernas rígidas)",
      finisher: { name: "Asses to Ashes", protocol: "KB Swings ×100 · Long-Legged Bridge Hold 1 min en minuto par" }
    },
    "Hombros": {
      superset: ["DB Scaptions", "Press Militar (DB)"], dropIso: "Press Militar (DB)", straight: "Clean and Press con Barra",
      finisher: { name: "Cannonball Run", protocol: "DB Side Laterals (8RM) ×F bajando el rack hasta 10 lb ⇒ DB Shoulder Press ×F subiendo" }
    },
    "Trapecios": {
      superset: ["Encogimientos con Barra", "Face Pulls"], dropIso: "Face Pulls", straight: "High Pulls (DB)",
      finisher: { name: "Inferno Crossfire", protocol: "3 rondas — Overhead Trap Raises ×30 ⇒ Band Pull-Aparts ×30 ⇒ DB Shrug Holds 30 s" }
    },
    "Espalda": {
      superset: ["Straight-Arm Pushdowns", "Jalón al Pecho (Lat Pulldown)"], dropIso: "Jalón al Pecho (Lat Pulldown)", straight: "Remo con Barra",
      finisher: { name: "Alphabet Arson", protocol: "3 rondas — Prone Incline DB Y's (15RM) ×F ⇒ T's ×F ⇒ I's ×F ⇒ Hiperextensiones ×F" }
    },
    "Bíceps": {
      superset: ["DB Spider Curls", "Curl con Barra Recta (DB)"], dropIso: "Curl con Barra Recta (DB)", straight: "Curl Martillo (DB)",
      finisher: { name: "Hang 'Em, Bang 'Em or Burn", protocol: "Standing DB Curls (12RM) ×F ⇒ 1½× ese número sin soltar" }
    }
  };
  const F2_DAYS = [
    { day: "mon", muscles: ["Pecho", "Tríceps"] },
    { day: "tue", muscles: ["Cuádriceps", "Isquios"] },
    { day: "thu", muscles: ["Hombros", "Trapecios"] },
    { day: "fri", muscles: ["Espalda", "Bíceps"] }
  ];

  /* ======================================================================
     Fase 3 — BACKFIRE (tempos)
     ====================================================================== */
  const F3_DAYS = {
    mon: { title: "Empuje · Concéntrico",  block: "push",  mode: "conc" },
    tue: { title: "Empuje · Excéntrico",   block: "push",  mode: "ecc" },
    thu: { title: "Tirón · Concéntrico",   block: "pull",  mode: "conc" },
    fri: { title: "Tirón · Excéntrico",    block: "pull",  mode: "ecc" },
    sun: { title: "Empuje B · Concéntrico", block: "pushB", mode: "conc" }
  };
  const F3_SHORT = {
    mon: "Empuje conc.", tue: "Empuje excén.", thu: "Tirón conc.", fri: "Tirón excén.", sun: "Empuje B"
  };
  const F3_MOVES = {
    push:  ["Press de Banca (DB)", "Fondos (Dips)", "Thrusters (DB)", "Sentadilla Frontal"],
    pull:  ["Jalón Supino al Pecho", "Curl Inclinado Variable (DB)", "Encogimiento Sentado (DB)", "Physioball Glute-Ham Raise"],
    pushB: ["Floor Flys", "Elevaciones Laterales Cruzadas (DB)", "Peso Muerto con Barra", "Phelps Press (DB)"]
  };
  const F3_FINISHERS_W9 = {
    mon: "1 milla de carrera",
    tue: "Circuito de flexibilidad estática",
    thu: "Agility Wheel · 5-8 rondas",
    fri: "Crawl Circuit — Alpine Climbers · Kickthroughs · Scorpions · Crab Stretch",
    sun: "Jump Rope · 800 saltos"
  };
  const F3_PILLARS = "Athletic Pillars — Static Balance · Dynamic Balance · Dynamic Flexibility · Locomotion";

  /* ======================================================================
     Calendario — días / retos / fases
     ====================================================================== */
  const SAT_WOD = {
    1: "ax-burn-ladder", 2: "ax-diabol-x", 3: "ax-fire-ice", 4: "ax-you-in-30-push",
    5: "ax-bump-run", 6: "ax-sprint-ladder", 7: "ax-tracknophobia", 8: "ax-hot-plate"
  };
  const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const DAY_LABEL = { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom" };
  const DAY_FULL  = { mon: "Lunes", tue: "Martes", wed: "Miércoles", thu: "Jueves", fri: "Viernes", sat: "Sábado", sun: "Domingo" };

  function phaseOf(week) { if (week <= 4) return 1; if (week <= 8) return 2; if (week <= 11) return 3; return 12; }
  function phaseTag(week) {
    return { 1: "Fase 1 · Ignition", 2: "Fase 2 · AX-RSON", 3: "Fase 3 · Backfire", 12: "Semana de cierre" }[phaseOf(week)];
  }
  function liftById(id) { return LIFTS.find((l) => l.id === id); }
  function slug(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  /* ======================================================================
     Construcción de sesiones
     ====================================================================== */
  // Fase 1 — XV-10
  function buildF1Session(week, day) {
    const pair = DAY_PAIRS.find((p) => p.day === day);
    if (!pair) return null;
    const swap = week % 2 === 0;
    const alternate = week >= 3;
    const bigId = swap ? pair.b : pair.a;
    const smallId = swap ? pair.a : pair.b;
    const big = liftById(bigId), small = liftById(smallId);

    const grp = (lift, sets, reps, pct, tag) => {
      const ww = workWeight(lift.id, pct);
      return {
        label: tag,
        exercises: [{
          key: lift.id, movementSlug: lift.id, name: lift.name, muscle: lift.muscle,
          sets: sets, reps: reps, restSec: 60,
          loadHint: ww != null ? fmtWeight(ww) : "definí tu 1RM",
          prefillKg: ww != null ? ww : null
        }]
      };
    };
    return {
      id: week + "-" + day, week: week, day: day, phase: 1,
      title: big.muscle + " / " + small.muscle,
      titleShort: MUSCLE_SHORT[big.muscle] + " / " + MUSCLE_SHORT[small.muscle],
      method: alternate ? "XV-10 · alternado" : "XV-10",
      note: alternate
        ? "Alterná una serie de A y una de B hasta completar las 20. Descanso ~1 min entre series."
        : "Terminá las 10 series de A antes de pasar a B. Descanso 1 min dentro de cada 10-by, 3-5 min entre los dos.",
      groups: [grp(big, 10, 10, 0.60, "A · 10 × 10 @ 60%"), grp(small, 10, 5, 0.75, "B · 10 × 5 @ 75% (8RM)")],
      finishers: [f1Finisher(big.muscle, week), f1Finisher(small.muscle, week)]
    };
  }

  // Fase 2 — AX-RSON
  function buildF2Session(week, day) {
    const dd = F2_DAYS.find((d) => d.day === day);
    if (!dd) return null;
    const groups = [];
    const finishers = [];

    dd.muscles.forEach((m) => {
      const x = F2_MUSCLES[m];
      const base = week + "-" + day + "-" + slug(m);
      groups.push({
        label: "Superserie · " + m, note: "6-9RM cada uno · 2 min descanso",
        exercises: x.superset.map((n, i) => ({
          key: base + "-ss" + i, movementSlug: slug(n), name: n,
          sets: 2, restSec: 120, loadHint: "6-9RM"
        }))
      });
      groups.push({
        label: "Drop → iso · " + m, note: "10RM ×8 reps → hold isométrico al fallo · 90 s",
        exercises: [{
          key: base + "-drop", movementSlug: slug(x.dropIso), name: x.dropIso,
          sets: 3, reps: 8, restSec: 90, loadHint: "10RM → hold"
        }]
      });
      groups.push({
        label: "Series rectas · " + m, note: "6-9RM · 60 s",
        exercises: [{
          key: base + "-str", movementSlug: slug(x.straight), name: x.straight,
          sets: 5, restSec: 60, loadHint: "6-9RM"
        }]
      });
      if (week <= 6) {
        finishers.push({ key: slug(m) + "-fin", kind: "note", name: x.finisher.name, muscle: m, protocol: x.finisher.protocol });
      } else {
        finishers.push({
          key: slug(m) + "-fin", kind: "note", name: "Finisher de " + m + " · Semana " + week, muscle: m,
          protocol: "El handoff no detalla los finishers de las semanas 7-8. Elegí el del PDF (Smoldering Shoulders, Entrapment, Ladder 8, Fire Pit, Fire on the Floor, Tri-al by Fire, Blast Off, 3rd Degree Lunges…)."
        });
      }
    });

    return {
      id: week + "-" + day, week: week, day: day, phase: 2,
      title: dd.muscles.join(" / "),
      titleShort: dd.muscles.map((m) => MUSCLE_SHORT[m]).join(" / "),
      method: "AX-RSON",
      note: "Por cada músculo: superserie ×2 (6-9RM, 2 min) · drop→iso ×3 (10RM×8 → hold, 90 s) · series rectas ×5 (6-9RM, 60 s). Registrá el peso real de cada serie.",
      groups: groups, finishers: finishers
    };
  }

  // Fase 3 — BACKFIRE (tempos)
  function buildF3Session(week, day) {
    const d = F3_DAYS[day];
    if (!d) return null;
    const conc = d.mode === "conc";
    const target = conc ? 50 : 25;
    const tempo = conc ? "1 / 1 / 5" : "5 / 1 / 1";
    const loadHint = conc ? "12RM" : "6RM";
    const restNote = conc ? "60 s de estiramiento" : "60 s de flexión (flexing)";
    const moves = F3_MOVES[d.block];

    const exercises = moves.map((n, i) => ({
      key: week + "-" + day + "-" + i, movementSlug: slug(n), name: n,
      targetReps: target, tempo: tempo, loadHint: loadHint, restSec: 60, restNote: restNote
    }));

    const finText = week === 9 ? F3_FINISHERS_W9[day] : F3_PILLARS;

    return {
      id: week + "-" + day, week: week, day: day, phase: 3,
      title: d.title, titleShort: F3_SHORT[day],
      method: "Backfire · tempo " + tempo,
      note: loadHint + " · tempo " + tempo + " · " + target + " reps por ejercicio · descanso: " + restNote + ".",
      groups: [{
        label: (conc ? "Concéntrico" : "Excéntrico") + " · " + moves.length + " ejercicios",
        note: target + " reps c/u",
        exercises: exercises
      }],
      finishers: [{ key: week + "-" + day + "-fin", kind: "note", name: "Finisher", protocol: finText }]
    };
  }

  function buildSession(week, day) {
    const ph = phaseOf(week);
    if (ph === 1) return buildF1Session(week, day);
    if (ph === 2) return buildF2Session(week, day);
    if (ph === 3) return buildF3Session(week, day);
    return null;
  }

  // Plan de una semana: 7 celdas
  function weekPlan(week) {
    const ph = phaseOf(week);
    return DAY_ORDER.map((day) => {
      if (ph === 12) {
        if (day === "thu") return { day: day, kind: "challenge", wodId: "ax-firemans-carry", label: "Reto final" };
        if (day === "fri") return { day: day, kind: "challenge", wodId: "ax-towering-inferno", label: "Reto final" };
        return { day: day, kind: "off", label: "Descanso" };
      }
      if (ph === 3) {
        if (day === "wed" || day === "sat") return { day: day, kind: "off", label: "Descanso" };
        const s = buildF3Session(week, day);
        return { day: day, kind: "lift", label: s.title, labelShort: s.titleShort, sessionId: s.id };
      }
      if (day === "wed" || day === "sun") return { day: day, kind: "off", label: "Descanso" };
      if (day === "sat") return { day: day, kind: "challenge", wodId: SAT_WOD[week], label: "Reto" };
      const s = ph === 1 ? buildF1Session(week, day) : buildF2Session(week, day);
      return { day: day, kind: "lift", label: s.title, labelShort: s.titleShort, sessionId: s.id };
    });
  }

  function cellId(week, day) { return week + "-" + day; }
  function isActionable(cell) { return cell.kind === "lift" || cell.kind === "challenge"; }

  /* ======================================================================
     Estado
     ====================================================================== */
  const DEFAULTS = { unit: "kg", startDate: null, rms: {}, done: {}, log: {} };
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
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); } catch (e) { /* noop */ } }

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
  function workWeight(liftId, pct) {
    const rmKg = st.rms[liftId];
    if (!rmKg || rmKg <= 0) return null;
    return roundStep(kgToDisplay(rmKg * pct));
  }
  function hasAllRMs() { return LIFTS.every((l) => st.rms[l.id] > 0); }

  /* ======================================================================
     Fechas
     ====================================================================== */
  function parseISO(s) { if (!s) return null; const p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function toISO(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function thisWeekMonday() {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
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
    if (days <= 0) return "hoy"; if (days === 1) return "ayer"; return "hace " + days + " días";
  }

  /* ======================================================================
     Progreso / navegación
     ====================================================================== */
  function allCells() {
    const out = [];
    for (let w = 1; w <= PROGRAM.totalWeeks; w++) {
      weekPlan(w).forEach((c) => out.push(Object.assign({ week: w }, c)));
    }
    return out;
  }
  function nextCell() {
    return allCells().find((c) => isActionable(c) && !st.done[cellId(c.week, c.day)]) || null;
  }
  // Día accionable anterior / siguiente al que está abierto (para navegar en la sesión).
  function siblingCell(dir) {
    if (!sessionRef) return null;
    const list = allCells().filter(isActionable);
    const i = list.findIndex((c) => cellId(c.week, c.day) === sessionRef.id);
    if (i < 0) return null;
    return list[i + dir] || null;
  }
  function progress() {
    const cells = allCells().filter(isActionable);
    const done = cells.filter((c) => st.done[cellId(c.week, c.day)]).length;
    return { done: done, total: cells.length, pct: cells.length ? Math.round((done / cells.length) * 100) : 0 };
  }

  /* ======================================================================
     Helpers de app.js
     ====================================================================== */
  function hydrate(root) { if (window.AppGym && window.AppGym.hydrateIcons) window.AppGym.hydrateIcons(root); }
  function toast(msg) { if (window.AppGym && window.AppGym.toast) window.AppGym.toast(msg); }
  function sound(kind) { if (window.AppGym && window.AppGym.sound) window.AppGym.sound(kind); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ======================================================================
     Timers
     ====================================================================== */
  let restTimer = null, restLeft = "", restDone = false;
  function ensureRestTimer() {
    if (restTimer) return;
    restTimer = new window.TimerEngine({
      onTick: (s) => { restLeft = s.display; paintRestBar(); },
      onBeep: (k) => { if (k === "tick") sound("tick"); else if (k === "end") sound("end"); },
      onFinish: () => { restDone = true; sound("success"); paintRestBar(); }
    });
  }
  function startRest(sec) {
    ensureRestTimer(); restDone = false;
    restTimer.configure({ mode: "countdown", durationSec: sec });
    restTimer.start(); paintRestBar();
  }
  function stopRest() { if (restTimer) restTimer.reset(); restDone = false; restLeft = ""; paintRestBar(); }
  function restActive() { return !!restTimer && (restTimer.running || restDone); }
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

  let finTimer = null, finState = null;
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
    finTimer.start(); render();
  }
  function stopFinClock() { if (finTimer) finTimer.reset(); finState = null; }
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
  let screen = "calendar";
  let sessionRef = null;
  let editing = null;            // { key, index }
  let confirmingReset = false;

  function root() { return $("#view-program"); }

  function go(next) {
    if (screen === "session" && next !== "session") { stopRest(); stopFinClock(); }
    editing = null;
    confirmingReset = false;
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

  /* ---------- Onboarding ---------- */
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
      '<p class="pg-sub">La Fase 1 calcula los pesos con el 60% y el 75% de tu 1RM. Las Fases 2 y 3 se registran por sensación (RM objetivo), no hace falta cargar nada más.</p></div>' +
      (hasAllRMs() ? '<button class="btn btn-ghost btn-sm" id="pgToCal"><span data-icon="undo"></span> Volver</button>' : "") +
      "</div>" +

      '<div class="pg-card">' +
      '<div class="pg-field-inline"><span class="field-label">Unidad</span>' +
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
    const curWeek = nc ? nc.week : PROGRAM.totalWeeks;
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const weeks = [];
    for (let w = 1; w <= PROGRAM.totalWeeks; w++) {
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
        '<span class="pg-phase-tag">' + esc(phaseTag(w)) + "</span></div>" +
        '<div class="pg-week-grid">' + cells + "</div>" +
        "</div>"
      );
    }

    let cta;
    if (nc) {
      const label = nc.kind === "challenge"
        ? "Reto — Semana " + nc.week
        : (nc.labelShort || nc.label) + " — Semana " + nc.week;
      cta = '<button class="btn btn-primary btn-block" id="pgContinue"><span data-icon="play"></span> Continuar: ' + esc(label) + "</button>";
    } else {
      cta = '<div class="pg-done-banner"><span data-icon="check"></span> ¡Programa completo! 12 semanas.</div>';
    }

    const rmWarn = hasAllRMs() ? "" :
      '<div class="pg-warn"><span data-icon="clock"></span> Cargá tus 1RM para ver los pesos de la Fase 1. <button class="pg-link" id="pgEditRM">Hacerlo ahora</button></div>';

    const resetBtns = confirmingReset
      ? '<button class="btn btn-danger btn-sm" id="pgResetYes">Borrar progreso</button>' +
        '<button class="btn btn-ghost btn-sm" id="pgResetNo">Cancelar</button>'
      : '<button class="btn btn-ghost btn-sm" id="pgReset"><span data-icon="reset"></span> Reiniciar</button>';

    return (
      '<div class="pg-wrap">' +
      '<div class="pg-head">' +
      '<div><h2 class="pg-title">' + esc(PROGRAM.name) + "</h2>" +
      '<p class="pg-sub">Semana ' + curWeek + " de " + PROGRAM.totalWeeks + " · " + esc(phaseTag(curWeek)) + " · " + pr.done + "/" + pr.total + " sesiones hechas</p></div>" +
      '<div class="pg-head-actions">' +
      '<button class="btn btn-ghost btn-sm" id="pgEditRM"><span data-icon="edit"></span> RMs</button>' +
      resetBtns +
      "</div>" +
      "</div>" +
      '<div class="pg-progress"><div class="pg-progress-fill" style="width:' + pr.pct + '%"></div></div>' +
      (confirmingReset ? '<div class="pg-warn"><span data-icon="reset"></span> Se borran los días hechos y el registro de series. Tus 1RM y la fecha de inicio se mantienen.</div>' : "") +
      rmWarn +
      cta +
      '<div class="pg-weeks">' + weeks.join("") + "</div>" +
      '<p class="pg-foot">Fase 1 (sem 1-4): XV-10, pesos por %1RM. Fase 2 (sem 5-8): AX-RSON, superserie + drop→iso + series rectas por RM. ' +
      "Fase 3 (sem 9-11): Backfire, tempos 1/1/5 y 5/1/1. Los retos (sábados + cierre) están en Rutinas → Retos.</p>" +
      "</div>"
    );
  }

  /* ---------- Sesión ---------- */
  function openSession(cid) {
    const p = cid.split("-");
    const week = +p[0], day = p[1];
    const plan = weekPlan(week).find((c) => c.day === day);
    if (plan && plan.kind === "challenge") {
      if (plan.wodId && window.AppGym && window.AppGym.startWodById) {
        toast("Al terminar el reto, marcá el día como hecho en el calendario.");
        window.AppGym.startWodById(plan.wodId);
      } else { toast("Reto no disponible."); }
      return;
    }
    const s = buildSession(week, day);
    if (!s) { toast("Sin sesión para ese día."); return; }
    if (phaseOf(week) === 1 && !hasAllRMs()) { toast("Primero cargá tus 1RM."); go("onboarding"); return; }
    sessionRef = s;
    editing = null;
    go("session");
  }

  function sessionLog() {
    const cid = sessionRef.id;
    if (!st.log[cid]) st.log[cid] = { date: toISO(new Date()), sets: {}, finishers: {} };
    if (!st.log[cid].sets) st.log[cid].sets = {};
    if (!st.log[cid].finishers) st.log[cid].finishers = {};
    return st.log[cid];
  }
  function setsFor(key) {
    const lg = st.log[sessionRef.id];
    return (lg && lg.sets && lg.sets[key]) ? lg.sets[key] : [];
  }
  function lastTimeFor(movementSlug, exKey) {
    let best = null;
    Object.keys(st.log).forEach((cid) => {
      const sets = st.log[cid].sets || {};
      Object.keys(sets).forEach((k) => {
        (sets[k] || []).forEach((rec) => {
          const match = rec.m === movementSlug || k === movementSlug;
          const sameSlot = cid === (sessionRef && sessionRef.id) && k === exKey;
          if (match && !sameSlot) {
            if (!best || rec.ts > best.ts) best = { w: rec.w, r: rec.r, ts: rec.ts, count: (sets[k] || []).length };
          }
        });
      });
    });
    return best;
  }

  function slotTotal(ex) { return ex.targetReps ? 1 : ex.sets; }
  function slotDone(ex) {
    const n = setsFor(ex.key).length;
    return ex.targetReps ? (n > 0 ? 1 : 0) : Math.min(ex.sets, n);
  }
  function sessionProgress() {
    let done = 0, total = 0;
    sessionRef.groups.forEach((g) => g.exercises.forEach((ex) => { total += slotTotal(ex); done += slotDone(ex); }));
    return { done: done, total: total };
  }

  function exCardChips(ex) {
    const logged = setsFor(ex.key);
    const firstPending = logged.length;
    const allDone = logged.length >= ex.sets;
    const last = lastTimeFor(ex.movementSlug, ex.key);

    const chips = Array.from({ length: ex.sets }, (_, i) => {
      const rec = logged[i];
      let c = "pg-set";
      if (rec) c += " is-done";
      else if (i === firstPending) c += " is-next";
      if (editing && editing.key === ex.key && editing.index === i) c += " is-editing";
      const inner = rec
        ? '<span class="pg-set-w">' + rec.w + '</span><span class="pg-set-r">×' + rec.r + "</span>"
        : '<span class="pg-set-n">' + (i + 1) + "</span>";
      // Toda serie es tocable: pendiente para registrarla, hecha para corregirla.
      return '<button class="' + c + '" data-set="' + ex.key + "|" + i + '">' + inner + "</button>";
    }).join("");

    let editor = "";
    if (editing && editing.key === ex.key) {
      const cur = logged[editing.index];
      const prefW = cur ? cur.w
        : (logged.length ? logged[logged.length - 1].w : (last ? last.w : (ex.prefillKg != null ? ex.prefillKg : "")));
      const prefR = cur ? cur.r : (ex.reps || "");
      editor =
        '<div class="pg-set-editor">' +
        '<div class="pg-set-editor-title">' + (cur ? "Corregir serie " : "Serie ") + (editing.index + 1) + " de " + ex.sets + " · " + esc(ex.loadHint) + "</div>" +
        '<div class="pg-set-editor-fields">' +
        '<label class="field"><span class="field-label">Peso (' + U() + ')</span>' +
        '<input type="number" inputmode="decimal" step="' + stepFor() + '" id="pgSetW" value="' + prefW + '" /></label>' +
        '<label class="field"><span class="field-label">Reps</span>' +
        '<input type="number" inputmode="numeric" id="pgSetR" value="' + prefR + '" /></label>' +
        "</div>" +
        '<div class="pg-set-editor-actions">' +
        '<button class="btn btn-ghost btn-sm" id="pgSetCancel">Cancelar</button>' +
        (cur ? '<button class="btn btn-danger btn-sm" id="pgSetDelete"><span data-icon="trash"></span> Borrar</button>' : "") +
        '<button class="btn btn-primary btn-sm" id="pgSetSave"><span data-icon="check"></span> Guardar serie</button>' +
        "</div></div>";
    }

    const lastTxt = last
      ? '<div class="pg-last">Última vez: ' + last.count + " series · " + last.w + " " + U() + " × " + last.r + " (" + relativeDays(last.ts) + ")</div>"
      : "";

    return (
      '<div class="pg-ex' + (allDone ? " is-complete" : "") + '">' +
      '<div class="pg-ex-head"><span class="pg-ex-tag">' + esc(ex.loadHint) + '</span>' +
      '<span class="pg-ex-count">' + logged.length + "/" + ex.sets + "</span></div>" +
      '<h3 class="pg-ex-name">' + esc(ex.name) + "</h3>" +
      lastTxt +
      '<div class="pg-set-grid">' + chips + "</div>" +
      editor +
      "</div>"
    );
  }

  function exCardTempo(ex) {
    const logged = setsFor(ex.key);
    const rec = logged[0];
    const done = rec && rec.r >= ex.targetReps;
    const last = lastTimeFor(ex.movementSlug, ex.key);
    const lastTxt = last
      ? '<div class="pg-last">Última vez: ' + last.w + " " + U() + " × " + last.r + " reps (" + relativeDays(last.ts) + ")</div>"
      : "";
    return (
      '<div class="pg-ex pg-ex-tempo' + (rec ? " is-complete" : "") + '">' +
      '<div class="pg-ex-head"><span class="pg-ex-tag">Tempo ' + esc(ex.tempo) + ' · ' + esc(ex.loadHint) + '</span>' +
      '<span class="pg-ex-count">' + (rec ? (done ? "✓" : rec.r + "/" + ex.targetReps) : "—") + "</span></div>" +
      '<h3 class="pg-ex-name">' + esc(ex.name) + "</h3>" +
      '<div class="pg-ex-target">Objetivo: <strong>' + ex.targetReps + " reps</strong> · descanso " + esc(ex.restNote) + "</div>" +
      lastTxt +
      '<div class="pg-tempo-fields">' +
      '<label class="field"><span class="field-label">Peso (' + U() + ')</span>' +
      '<input type="number" inputmode="decimal" step="' + stepFor() + '" data-tw="' + ex.key + '" value="' + (rec ? rec.w : (last ? last.w : "")) + '" /></label>' +
      '<label class="field"><span class="field-label">Reps hechas</span>' +
      '<input type="number" inputmode="numeric" data-tr="' + ex.key + '" value="' + (rec ? rec.r : "") + '" placeholder="' + ex.targetReps + '" /></label>' +
      '<button class="btn btn-primary btn-sm" data-tsave="' + ex.key + '"><span data-icon="check"></span> Guardar</button>' +
      (rec ? '<button class="btn btn-ghost btn-sm" data-tclear="' + ex.key + '"><span data-icon="trash"></span></button>' : "") +
      "</div>" +
      "</div>"
    );
  }

  function viewSession() {
    const s = sessionRef;
    const d = cellDate(s.week, s.day);
    const dateTxt = " · " + DAY_FULL[s.day] + (d ? " " + fmtDayMonth(d) : "");

    const groupsHtml = s.groups.map((g) => {
      const ex = g.exercises.map((e) => (e.targetReps ? exCardTempo(e) : exCardChips(e))).join("");
      return (
        '<div class="pg-group">' +
        '<div class="pg-group-head">' + esc(g.label) + (g.note ? ' <span class="pg-group-note">' + esc(g.note) + "</span>" : "") + "</div>" +
        ex +
        "</div>"
      );
    }).join("");

    const finHtml = s.finishers.map((f) => {
      const lg = st.log[s.id];
      const rec = lg && lg.finishers ? lg.finishers[f.key] : null;

      if (f.kind === "propain") {
        const goalTxt = rec && rec.fail
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
          '<input type="number" inputmode="numeric" data-fin="' + f.key + '" value="' + (rec && rec.fail ? rec.fail : "") + '" placeholder="—" /></label>' +
          '<button class="btn btn-ghost btn-sm" data-finsave="' + f.key + '"><span data-icon="check"></span> ' + (rec && rec.fail ? "Actualizar" : "Guardar") + "</button>" +
          (rec && rec.fail ? '<button class="btn btn-ghost btn-sm" data-finclear="' + f.key + '"><span data-icon="trash"></span></button>' : "") +
          '<button class="btn btn-ghost btn-sm" data-finclock="' + f.key + '|' + f.clockSec + '"><span data-icon="clock"></span> Reloj</button>' +
          "</div>" +
          (goalTxt ? '<div class="pg-fin-goal">' + goalTxt + "</div>" : "") +
          clock +
          "</div>"
        );
      }

      // kind "note"
      const isDone = rec && rec.done;
      return (
        '<div class="pg-fin' + (isDone ? " is-complete" : "") + '">' +
        '<div class="pg-ex-head"><span class="pg-ex-tag">Finisher</span>' +
        (f.muscle ? '<span class="pg-fin-muscle">' + esc(f.muscle) + "</span>" : "") + "</div>" +
        '<div class="pg-fin-move">' + esc(f.name) + "</div>" +
        '<p class="pg-fin-protocol">' + esc(f.protocol) + "</p>" +
        '<div class="pg-fin-row">' +
        '<button class="btn ' + (isDone ? "btn-success" : "btn-ghost") + ' btn-sm" data-fintoggle="' + f.key + '">' +
        '<span data-icon="check"></span> ' + (isDone ? "Hecho" : "Marcar hecho") + "</button>" +
        '<button class="btn btn-ghost btn-sm" id="pgOpenTimer"><span data-icon="timer"></span> Cronómetro</button>' +
        "</div></div>"
      );
    }).join("");

    const pr = sessionProgress();
    const prev = siblingCell(-1), next = siblingCell(1);
    const navLabel = (c) => (c.kind === "challenge" ? "Reto" : (c.labelShort || c.label)) + " · Sem " + c.week;
    const nav =
      '<div class="pg-session-nav">' +
      (prev
        ? '<button class="btn btn-ghost btn-sm" data-navcell="' + cellId(prev.week, prev.day) + '">← ' + esc(navLabel(prev)) + "</button>"
        : "<span></span>") +
      (next
        ? '<button class="btn btn-ghost btn-sm" data-navcell="' + cellId(next.week, next.day) + '">' + esc(navLabel(next)) + " →</button>"
        : "<span></span>") +
      "</div>";

    return (
      '<div class="pg-wrap pg-session">' +
      '<div class="pg-session-top">' +
      '<button class="btn btn-ghost btn-sm" id="pgBack"><span data-icon="undo"></span> Calendario</button>' +
      '<span class="pg-session-meta">Semana ' + s.week + dateTxt + "</span>" +
      "</div>" +
      '<h2 class="pg-title">' + esc(s.title) + "</h2>" +
      '<div class="pg-method-chip">' + esc(s.method) + "</div>" +
      '<div class="pg-note"><span data-icon="clock"></span> ' + esc(s.note) + "</div>" +
      groupsHtml +
      '<h3 class="pg-section-h">Finishers</h3>' +
      finHtml +
      '<button class="btn btn-primary btn-block" id="pgFinish"><span data-icon="check"></span> ' +
      (pr.done >= pr.total ? "Finalizar sesión" : "Finalizar sesión (" + pr.done + "/" + pr.total + ")") + "</button>" +
      nav +
      '<div class="pg-rest-bar" id="pgRestBar" hidden></div>' +
      "</div>"
    );
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
    toast(hasAllRMs() ? "Listo — pesos de la Fase 1 calculados" : "Guardado (faltan algunos RM)");
    go("calendar");
  }

  function switchUnit(unit) {
    if (unit === st.unit) return;
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

  function currentEx(key) {
    let found = null;
    sessionRef.groups.forEach((g) => g.exercises.forEach((e) => { if (e.key === key) found = e; }));
    return found;
  }

  function saveSet(key, index) {
    const w = parseFloat($("#pgSetW").value);
    const r = parseInt($("#pgSetR").value, 10);
    if (!(w >= 0) || !(r > 0)) { toast("Poné peso y reps"); return; }
    const ex = currentEx(key);
    const lg = sessionLog();
    if (!lg.sets[key]) lg.sets[key] = [];
    const isNew = index >= lg.sets[key].length;
    lg.sets[key][index] = { w: Math.round(w * 100) / 100, r: r, ts: Date.now(), m: ex ? ex.movementSlug : key };
    lg.sets[key] = lg.sets[key].filter(Boolean);
    editing = null;
    save();
    sound("tap");
    // El countdown de descanso solo arranca al registrar una serie nueva, no al corregir.
    if (isNew && ex && lg.sets[key].length < ex.sets) startRest(ex.restSec);
    render();
  }

  function deleteSet(key, index) {
    const lg = sessionLog();
    if (lg.sets[key]) {
      lg.sets[key].splice(index, 1);
      if (!lg.sets[key].length) delete lg.sets[key];
    }
    editing = null;
    save();
    toast("Serie borrada");
    render();
  }

  function clearTempo(key) {
    const lg = sessionLog();
    delete lg.sets[key];
    save();
    render();
  }

  function saveTempo(key) {
    const w = parseFloat($('[data-tw="' + key + '"]').value);
    const r = parseInt($('[data-tr="' + key + '"]').value, 10);
    if (!(w >= 0) || !(r > 0)) { toast("Poné peso y reps hechas"); return; }
    const ex = currentEx(key);
    const lg = sessionLog();
    lg.sets[key] = [{ w: Math.round(w * 100) / 100, r: r, ts: Date.now(), m: ex ? ex.movementSlug : key }];
    save();
    sound("tap");
    if (ex) startRest(ex.restSec);
    render();
  }

  function saveFinisher(key) {
    const inp = $('[data-fin="' + key + '"]');
    const v = parseInt(inp && inp.value, 10);
    if (!(v > 0)) { toast("Poné el nº de reps al fallo"); return; }
    const lg = sessionLog();
    lg.finishers[key] = Object.assign({}, lg.finishers[key], { fail: v, ts: Date.now() });
    save();
    sound("success");
    render();
  }

  function toggleFinisher(key) {
    const lg = sessionLog();
    lg.finishers[key] = Object.assign({}, lg.finishers[key]);
    lg.finishers[key].done = !lg.finishers[key].done;
    save();
    render();
  }

  function finishSession() {
    const cid = sessionRef.id;
    st.done[cid] = true;
    const lg = st.log[cid];
    if (lg && !lg.date) lg.date = toISO(new Date());
    save();
    stopRest(); stopFinClock();
    toast("Sesión marcada como completa");
    go("calendar");
  }

  function toggleDone(cid) { st.done[cid] = !st.done[cid]; save(); render(); }

  function resetProgress() {
    st.done = {}; st.log = {};
    confirmingReset = false;
    save();
    toast("Progreso reiniciado");
    render();
  }

  /* ======================================================================
     Eventos
     ====================================================================== */
  function onClick(e) {
    const t = e.target;

    const unit = t.closest("[data-unit]");
    if (unit) { switchUnit(unit.dataset.unit); return; }
    if (t.closest("#pgSaveRM")) { saveOnboarding(); return; }
    if (t.closest("#pgToCal")) { go("calendar"); return; }

    if (t.closest("#pgEditRM")) { go("onboarding"); return; }
    if (t.closest("#pgContinue")) { const nc = nextCell(); if (nc) openSession(cellId(nc.week, nc.day)); return; }
    if (t.closest("#pgReset")) { confirmingReset = true; render(); return; }
    if (t.closest("#pgResetNo")) { confirmingReset = false; render(); return; }
    if (t.closest("#pgResetYes")) { resetProgress(); return; }
    const toggle = t.closest("[data-toggle]");
    if (toggle) { e.stopPropagation(); toggleDone(toggle.dataset.toggle); return; }
    const open = t.closest("[data-open]");
    if (open) { openSession(open.dataset.open); return; }

    if (t.closest("#pgBack")) { go("calendar"); return; }
    if (t.closest("#pgFinish")) { finishSession(); return; }
    if (t.closest("#pgRestSkip")) { stopRest(); return; }
    const navCell = t.closest("[data-navcell]");
    if (navCell) { openSession(navCell.dataset.navcell); return; }
    if (t.closest("#pgOpenTimer")) {
      const tab = document.querySelector('.tab[data-view="timer"]');
      if (tab) tab.click();
      return;
    }

    const setBtn = t.closest("[data-set]");
    if (setBtn) {
      const p = setBtn.dataset.set.split("|");
      editing = { key: p[0], index: +p[1] };
      render();
      const wEl = $("#pgSetW");
      if (wEl) { wEl.focus(); wEl.select(); }
      return;
    }
    if (t.closest("#pgSetCancel")) { editing = null; render(); return; }
    if (t.closest("#pgSetDelete")) { if (editing) deleteSet(editing.key, editing.index); return; }
    if (t.closest("#pgSetSave")) { if (editing) saveSet(editing.key, editing.index); return; }

    const tSave = t.closest("[data-tsave]");
    if (tSave) { saveTempo(tSave.dataset.tsave); return; }
    const tClear = t.closest("[data-tclear]");
    if (tClear) { clearTempo(tClear.dataset.tclear); return; }

    const finSave = t.closest("[data-finsave]");
    if (finSave) { saveFinisher(finSave.dataset.finsave); return; }
    const finClear = t.closest("[data-finclear]");
    if (finClear) {
      const lg = sessionLog();
      if (lg.finishers[finClear.dataset.finclear]) delete lg.finishers[finClear.dataset.finclear].fail;
      save(); render(); return;
    }
    const finToggle = t.closest("[data-fintoggle]");
    if (finToggle) { toggleFinisher(finToggle.dataset.fintoggle); return; }
    const finClock = t.closest("[data-finclock]");
    if (finClock) { const p = finClock.dataset.finclock.split("|"); startFinClock(p[0], +p[1]); return; }
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
    screen = hasAllRMs() ? "calendar" : "onboarding";
    render();

    const tabbar = $("#tabbar");
    if (tabbar) {
      tabbar.addEventListener("click", (e) => {
        const tab = e.target.closest('.tab[data-view="program"]');
        if (!tab) return;
        if (screen !== "session") screen = hasAllRMs() ? "calendar" : "onboarding";
        render();
      });
    }
    window.addEventListener("beforeunload", () => { stopRest(); stopFinClock(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.AppGymProgram = {
    reset: function () { st = JSON.parse(JSON.stringify(DEFAULTS)); save(); screen = "onboarding"; render(); }
  };
})();
