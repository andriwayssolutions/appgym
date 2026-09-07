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
     Entrada en calor / rehabilitación — bloque previo por día
     (mon→d1, tue→d2, thu→d3, fri→d4, retos→d5, sun→d1)
     ====================================================================== */
  const INFO_RESET_CUELLO =
    "Protocolo de descarga e inhibición del trapecio superior y los escalenos (sobre todo del lado derecho). " +
    "De pie o sentado erguido, con ligera retracción de barbilla (papada). " +
    "1) Deprimí conscientemente ambos hombros hacia el piso, alejándolos de las orejas. " +
    "2) Llevá la oreja izquierda hacia el hombro izquierdo (inclinación lateral suave) para estirar el lado derecho del cuello. " +
    "3) Manteniendo esa inclinación, extendé el brazo derecho a 45° hacia abajo y atrás, con pequeñas rotaciones externas de la mano (como si abrieras un pomo de puerta). " +
    "Hacé 8 a 10 respiraciones diafragmáticas lentas por lado.";
  const INFO_ABDUCCION_ARCO =
    "Movilidad de cadera y control lumbopélvico: desasocia el movimiento de la cadera para no compensar con el cuadrado lumbar (QL). " +
    "En cuadrupedia (manos bajo hombros, rodillas bajo caderas). Extendé una pierna completamente hacia el lateral, a la altura de la cadera, " +
    "apoyando la planta o el canto interno del pie. Con la columna neutra y el abdomen contraído, despegá el pie unos centímetros y dibujá un arco " +
    "en el aire llevando la pierna hacia atrás y de vuelta al lateral, como un compás. La pelvis no rota y la lumbar no se arquea; " +
    "si se enciende el QL o la espalda baja, reducí la altura del despegue.";
  const INFO_VERNON =
    "Secuencia dinámica de Vernon Griffith para abrir la cadera en todos sus planos (flexión, abducción, rotación) y activar el glúteo medio. " +
    "En cuadrupedia: 1) Clam / Fire Hydrant — rodilla a 90°, abducí la cadera elevando la rodilla hacia el lateral sin rotar el torso. " +
    "2) Círculos de cadera (Hip CARs) — desde la posición lateral, círculos amplios con la rodilla hacia atrás (extensión) y de vuelta al centro. " +
    "3) Patada trasera en arco — extendé la pierna completamente hacia atrás y hacé toques alternados cruzando por detrás de la pierna de apoyo y abriéndola al lateral. " +
    "Aplicación asimétrica: más volumen al lado izquierdo (ej. 12 reps izquierda vs. 8 derecha) para igualar el déficit del glúteo medio izquierdo.";

  const WARMUPS = {
    d1: {
      title: "Entrada en calor · Pecho / Espalda",
      items: [
        { n: "Rotación Torácica en Cuadrupedia / Cat-Cow", d: "1 × 10 por lado" },
        { n: "Empujes de Serrato Unilateral (o Push-up Plus)", d: "2 × 12 · énfasis en protracción" },
        { n: "Wall Slides (frente a la pared)", d: "2 × 10 · deprimiendo hombros para inhibir el trapecio superior derecho" },
        { n: "Plancha Lateral Derecha", d: "2 × 30 s · oblicuo/serrato derecho sin sobrecargar el QL" },
        { n: "Reseteo de Cuello / Escápula", d: "1 × 8 lentas", info: INFO_RESET_CUELLO },
        { n: "Retracción Escapular Colgado", d: "2 × 8-10" },
        { n: "Flexiones en Cuadrupedia Apoyando Dedos", d: "2 × 8" },
        { n: "Isometría de Extensión de Muñeca con Banda", d: "2 × 15 s · mano débil" },
        { n: "Abdominales Colgado (Hanging Knee Raises)", d: "2 × 10" }
      ]
    },
    d2: {
      title: "Entrada en calor · Piernas",
      items: [
        { n: "Dorsiflexión Dinámica de Tobillo en Pared", d: "2 × 10-12 por pierna" },
        { n: "Transiciones Activas de Cadera 90-90 (Variante 1 o 2)", d: "2 × 8 por lado" },
        { n: "Elevaciones Laterales de Pierna (lado izquierdo)", d: "2 × 15 · activación del glúteo medio débil" },
        { n: "Puente Glúteo Unilateral (lado derecho)", d: "2 × 10 · foco en glúteo para inhibir el QL derecho" },
        { n: "Abducción en Cuadrupedia con Pierna Extendida (arco)", d: "1 × 8 por lado", info: INFO_ABDUCCION_ARCO },
        { n: "Abdominales Colgado (Hanging Knee Raises / pelota entre rodillas)", d: "2 × 10" }
      ]
    },
    d3: {
      title: "Entrada en calor · Brazos",
      items: [
        { n: "Aperturas en \"T\" boca abajo", d: "2 × 12" },
        { n: "Face-Pull con banda o polea liviana", d: "2 × 12" },
        { n: "Elevaciones \"Niño de Yoga\"", d: "2 × 10" },
        { n: "Liberación y Estiramiento Activo de QL Derecho", d: "2 × 25-30 s" },
        { n: "Flexiones en Cuadrupedia Apoyando Dedos", d: "2 × 10" },
        { n: "Caminata en Cuadrupedia (nudillos a palmas) + Extensión Movilizada", d: "2 × 8 · muñeca débil" },
        { n: "Retracción Escapular Colgado", d: "2 × 8" },
        { n: "Abdominales Colgado (Hanging Knee Raises / L-Sit Tuck)", d: "2 × 8-10" }
      ]
    },
    d4: {
      title: "Entrada en calor · Hombros / Trapecios",
      items: [
        { n: "Elevaciones \"Niño de Yoga\"", d: "2 × 12" },
        { n: "Rotación Externa / Press Cubano (peso muy liviano o corporal)", d: "2 × 12" },
        { n: "Wall Slides (espalda a la pared)", d: "2 × 10" },
        { n: "Push-up Plus o Empuje de Serrato", d: "2 × 12" },
        { n: "Reseteo de Cuello / Escápulas", d: "1 × 10", info: INFO_RESET_CUELLO },
        { n: "Retracción Escapular Colgado", d: "2 × 8" },
        { n: "Flexiones en Cuadrupedia Apoyando Dedos", d: "2 × 8" },
        { n: "Isometría de Extensión de Muñeca", d: "2 × 15 s · mano débil" },
        { n: "Abdominales Colgado (Hanging Knee Raises)", d: "2 × 10" }
      ]
    },
    d5: {
      title: "Entrada en calor · Reto / Full Body",
      items: [
        { n: "Circuito de Movilidad Vernon Griffith (asimétrico, lado izquierdo)", d: "2 rondas", info: INFO_VERNON },
        { n: "Peso Muerto Rumano Unilateral con Mancuerna en Mano Derecha", d: "1 × 10 por lado · foco en pierna izquierda" },
        { n: "Plancha Lateral Derecha", d: "1 × 40 s" },
        { n: "Dorsiflexión Dinámica de Tobillo", d: "1 × 10 por lado" },
        { n: "Retracción Escapular Colgado + Hold", d: "2 × 6 · 3 s de pausa arriba" },
        { n: "Flexiones en Cuadrupedia Apoyando Dedos", d: "2 × 10" },
        { n: "Abdominales Colgado (Hanging Knee Raises / Toes to Bar regresionado)", d: "2 × 10" }
      ]
    }
  };
  function warmupKeyFor(sess) {
    if (!sess) return null;
    if (sess.isChallenge) return "d5";
    return { mon: "d1", tue: "d2", thu: "d3", fri: "d4", sun: "d1" }[sess.day] || null;
  }

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
          sets: sets, reps: reps, restSec: 60, restAfterSec: 240, restAfterLabel: "3-5 min entre los dos 10-by",
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
          sets: 2, restSec: 120, restAfterSec: 120, loadHint: "6-9RM"
        }))
      });
      groups.push({
        label: "Drop → iso · " + m, note: "10RM ×8 reps → hold isométrico al fallo · 90 s",
        exercises: [{
          key: base + "-drop", movementSlug: slug(x.dropIso), name: x.dropIso,
          sets: 3, reps: 8, restSec: 90, restAfterSec: 120, loadHint: "10RM → hold"
        }]
      });
      groups.push({
        label: "Series rectas · " + m, note: "6-9RM · 60 s",
        exercises: [{
          key: base + "-str", movementSlug: slug(x.straight), name: x.straight,
          sets: 5, restSec: 60, restAfterSec: 150, loadHint: "6-9RM"
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
      targetReps: target, tempo: tempo, loadHint: loadHint, restSec: 60, restAfterSec: 60, restNote: restNote
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

  // --- Anillo circular de cuenta atrás (reusable) ---
  const RING_R = 52;
  const RING_C = 2 * Math.PI * RING_R;
  function ringHtml(id, label) {
    return (
      '<div class="pg-ring" id="' + id + '">' +
      '<svg viewBox="0 0 120 120" class="pg-ring-svg">' +
      '<circle class="pg-ring-bg" cx="60" cy="60" r="' + RING_R + '"></circle>' +
      '<circle class="pg-ring-fg" cx="60" cy="60" r="' + RING_R + '" stroke-dasharray="' + RING_C.toFixed(1) + '" stroke-dashoffset="0"></circle>' +
      "</svg>" +
      '<div class="pg-ring-center"><span class="pg-ring-time">0:00</span>' +
      '<span class="pg-ring-label">' + esc(label || "") + "</span></div>" +
      "</div>"
    );
  }
  function paintRing(id, remainMs, totalMs, done, label) {
    const box = document.getElementById(id);
    if (!box) return;
    const fg = box.querySelector(".pg-ring-fg");
    const frac = totalMs > 0 ? Math.max(0, Math.min(1, remainMs / totalMs)) : 0;
    if (fg) fg.style.strokeDashoffset = (RING_C * (1 - frac)).toFixed(1);
    const tEl = box.querySelector(".pg-ring-time");
    if (tEl) tEl.textContent = window.fmtTime(Math.max(0, remainMs));
    if (label != null) { const l = box.querySelector(".pg-ring-label"); if (l) l.textContent = label; }
    box.classList.toggle("is-done", !!done);
  }

  // --- Descanso (entre series / entre ejercicios) ---
  let restTimer = null, restTotalMs = 0, restLabel = "descanso", restDone = false;
  function ensureRestTimer() {
    if (restTimer) return;
    restTimer = new window.TimerEngine({
      onTick: () => paintRest(),
      onBeep: (k) => { if (k === "tick") sound("tick"); else if (k === "end") sound("end"); },
      onFinish: () => { restDone = true; sound("success"); paintRest(); }
    });
  }
  function startRest(sec, label) {
    ensureRestTimer();
    restDone = false;
    restTotalMs = sec * 1000;
    restLabel = label || "descanso";
    restTimer.configure({ mode: "countdown", durationSec: sec });
    restTimer.start();
    paintRest();
  }
  function stopRest() { if (restTimer) restTimer.reset(); restDone = false; restTotalMs = 0; paintRest(); }
  function restActive() { return !!restTimer && (restTimer.running || restDone); }
  function restRemainMs() {
    if (!restTimer || restDone) return 0;
    return Math.max(0, restTotalMs - restTimer.elapsedMs);
  }
  function paintRest() {
    paintRestBar();
    paintRing("pgSetRing", restRemainMs(), restTotalMs, restDone, restDone ? "listo" : restLabel);
  }
  function paintRestBar() {
    const bar = $("#pgRestBar");
    if (!bar) return;
    if (!restActive()) { bar.hidden = true; return; }
    bar.hidden = false;
    bar.classList.toggle("is-done", restDone);
    bar.innerHTML = restDone
      ? '<span class="pg-rest-label"><span data-icon="check"></span> Descanso listo</span>' +
        '<button class="btn btn-ghost btn-sm" id="pgRestSkip">Ocultar</button>'
      : '<span class="pg-rest-label"><span data-icon="clock"></span> ' + esc(restLabel) + " <strong>" + window.fmtTime(restRemainMs()) + "</strong></span>" +
        '<button class="btn btn-ghost btn-sm" id="pgRestSkip">Saltar</button>';
    hydrate(bar);
  }

  // --- Reloj del finisher (cuenta atrás pura, sin contador de reps) ---
  let finTimer = null, finState = null, finTotalMs = 0;
  function ensureFinTimer() {
    if (finTimer) return;
    finTimer = new window.TimerEngine({
      onTick: () => paintFinRing(),
      onBeep: (k) => { if (k === "tick") sound("tick"); else if (k === "end") sound("end"); },
      onFinish: () => { if (finState) { finState.done = true; finState.running = false; sound("end"); render(); } }
    });
  }
  function startFinClock(key, sec) {
    ensureFinTimer();
    finTotalMs = sec * 1000;
    finState = { key: key, running: true, done: false };
    finTimer.configure({ mode: "countdown", durationSec: sec });
    finTimer.start();
    render();
  }
  function stopFinClock() { if (finTimer) finTimer.reset(); finState = null; finTotalMs = 0; }
  function finRemainMs() {
    if (!finTimer || !finState || finState.done) return 0;
    return Math.max(0, finTotalMs - finTimer.elapsedMs);
  }
  function finUsedSec() { return Math.round((finTotalMs - finRemainMs()) / 1000); }
  function paintFinRing() {
    paintRing("pgFinRing", finRemainMs(), finTotalMs, finState && finState.done,
      finState && finState.done ? "¡tiempo!" : "en marcha");
  }

  // --- Cronómetro total de la sesión (arranca antes del 1er movimiento) ---
  let sessionClockInt = null;
  function sTimer() { const lg = sessionRef && st.log[sessionRef.id]; return lg && lg.timer; }
  function sessionElapsedMs() {
    const t = sTimer();
    if (!t) return 0;
    return (t.accum || 0) + (t.startedAt ? Date.now() - t.startedAt : 0);
  }
  function sessionRunning() { const t = sTimer(); return !!(t && t.startedAt); }
  function sessionStarted() { const t = sTimer(); return !!(t && (t.startedAt || t.accum)); }
  function startSessionTimer() {
    const lg = sessionLog();
    if (!lg.timer) lg.timer = { accum: 0, startedAt: null };
    if (!lg.timer.startedAt) { lg.timer.startedAt = Date.now(); save(); }
    ensureSessionClockInterval();
    paintSessionClock();
  }
  function pauseSessionTimer() {
    const lg = sessionRef && st.log[sessionRef.id];
    if (lg && lg.timer && lg.timer.startedAt) {
      lg.timer.accum = (lg.timer.accum || 0) + (Date.now() - lg.timer.startedAt);
      lg.timer.startedAt = null;
      save();
    }
    paintSessionClock();
  }
  function toggleSessionTimer() {
    if (sessionRunning()) pauseSessionTimer(); else startSessionTimer();
    render();
  }
  function ensureSessionClockInterval() {
    if (!sessionClockInt) sessionClockInt = setInterval(paintSessionClock, 1000);
  }
  function clearSessionClockInterval() {
    if (sessionClockInt) { clearInterval(sessionClockInt); sessionClockInt = null; }
  }
  function paintSessionClock() {
    const el = $("#pgSessionClock");
    if (el) el.textContent = window.fmtTime(sessionElapsedMs());
  }

  function leaveSession() {
    pauseSessionTimer();
    stopRest();
    stopFinClock();
    clearSessionClockInterval();
  }

  /* ======================================================================
     Vistas
     ====================================================================== */
  let screen = "calendar";
  let sessionRef = null;
  let editing = null;            // { key, index }
  let confirmingReset = false;
  let finManual = null;          // key del finisher en modo "registro a mano"
  let warmupCollapsed = false;
  let warmupInfoOpen = null;     // índice del ítem con la explicación abierta

  function root() { return $("#view-program"); }

  function go(next) {
    if (screen === "session" && next !== "session") leaveSession();
    editing = null;
    confirmingReset = false;
    finManual = null;
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
    if (screen === "session") {
      paintRest();
      paintSessionClock();
      if (sessionRunning()) ensureSessionClockInterval();
      if (finState) paintFinRing();
      if (editing) { const w = $("#pgSetW"); if (w) { w.focus(); w.select(); } }
    }
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
    let s;
    if (plan && plan.kind === "challenge") {
      const wod = window.WODS && window.WODS.find((w) => w.id === plan.wodId);
      s = {
        id: cid, week: week, day: day, phase: phaseOf(week), isChallenge: true,
        wodId: plan.wodId,
        title: wod ? wod.name : (plan.label || "Reto"),
        titleShort: "Reto",
        method: plan.label === "Reto final" ? "Reto de cierre" : "Reto",
        wodDesc: wod ? (wod.description || "") : "",
        note: "", groups: [], finishers: []
      };
    } else {
      s = buildSession(week, day);
      if (!s) { toast("Sin sesión para ese día."); return; }
      if (phaseOf(week) === 1 && !hasAllRMs()) { toast("Primero cargá tus 1RM."); go("onboarding"); return; }
    }
    if (screen === "session") leaveSession(); // pausa el cronómetro del día que dejo
    sessionRef = s;
    editing = null;
    confirmingReset = false;
    finManual = null;
    warmupCollapsed = false;
    warmupInfoOpen = null;
    screen = "session";
    render();
    if (sessionRunning()) ensureSessionClockInterval();
    root().scrollIntoView({ block: "start" });
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
      "</div>"
    );
  }

  // Bloque de entrada en calor / rehabilitación (checklist).
  function warmupBlock(s) {
    const wk = warmupKeyFor(s);
    if (!wk || !WARMUPS[wk]) return "";
    const w = WARMUPS[wk];
    const lg = st.log[s.id] || {};
    const wd = lg.warmup || {};
    const doneCount = w.items.filter((it, i) => wd[i]).length;
    const total = w.items.length;

    const rows = warmupCollapsed ? "" : w.items.map((it, i) => {
      const done = !!wd[i];
      return (
        '<div class="pg-wu-item' + (done ? " is-done" : "") + '" data-wu="' + i + '">' +
        '<span class="pg-wu-check"><span data-icon="' + (done ? "check" : "circle") + '"></span></span>' +
        '<div class="pg-wu-body">' +
        '<span class="pg-wu-name">' + esc(it.n) + "</span>" +
        '<span class="pg-wu-detail">' + esc(it.d) + "</span>" +
        (it.info && warmupInfoOpen === i ? '<p class="pg-wu-info">' + esc(it.info) + "</p>" : "") +
        "</div>" +
        (it.info ? '<button class="pg-wu-i" data-wuinfo="' + i + '" aria-label="Cómo se hace">?</button>' : "") +
        "</div>"
      );
    }).join("");

    return (
      '<div class="pg-wu' + (doneCount >= total ? " is-complete" : "") + '">' +
      '<button class="pg-wu-head" id="pgWuToggle">' +
      '<span data-icon="dumbbell"></span> ' + esc(w.title) +
      '<span class="pg-wu-count">' + doneCount + "/" + total + "</span>" +
      '<span class="pg-wu-chevron">' + (warmupCollapsed ? "▼" : "▲") + "</span></button>" +
      rows +
      "</div>"
    );
  }

  // Popup para registrar / corregir una serie (con anillo de descanso).
  function viewSetModal() {
    if (!editing) return "";
    const ex = currentEx(editing.key);
    if (!ex || ex.targetReps) return "";
    const logged = setsFor(ex.key);
    const cur = logged[editing.index];
    const last = lastTimeFor(ex.movementSlug, ex.key);
    const prefW = cur ? cur.w
      : (logged.length ? logged[logged.length - 1].w : (last ? last.w : (ex.prefillKg != null ? ex.prefillKg : "")));
    const prefR = cur ? cur.r : (ex.reps || "");
    return (
      '<div class="pg-modal" id="pgSetModal">' +
      '<div class="pg-modal-backdrop" data-pgclose></div>' +
      '<div class="pg-modal-card" role="dialog" aria-modal="true">' +
      '<button class="pg-modal-x" data-pgclose aria-label="Cerrar"><span data-icon="close"></span></button>' +
      '<div class="pg-modal-title">' + esc(ex.name) + "</div>" +
      '<div class="pg-modal-sub">' + (cur ? "Corregir serie " : "Serie ") + (editing.index + 1) + " de " + ex.sets + " · " + esc(ex.loadHint) + "</div>" +
      (restActive() ? ringHtml("pgSetRing", restDone ? "listo" : restLabel) : "") +
      '<div class="pg-modal-fields">' +
      '<label class="field"><span class="field-label">Peso (' + U() + ')</span>' +
      '<input type="number" inputmode="decimal" step="' + stepFor() + '" id="pgSetW" value="' + prefW + '" /></label>' +
      '<label class="field"><span class="field-label">Reps</span>' +
      '<input type="number" inputmode="numeric" id="pgSetR" value="' + prefR + '" /></label>' +
      "</div>" +
      '<div class="pg-modal-actions">' +
      (cur ? '<button class="btn btn-danger btn-sm" id="pgSetDelete"><span data-icon="trash"></span> Borrar</button>' : "") +
      '<button class="btn btn-primary" id="pgSetSave"><span data-icon="check"></span> Guardar serie</button>' +
      "</div></div></div>"
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

  function sessionTop(s, dateTxt) {
    return (
      '<div class="pg-session-top">' +
      '<button class="btn btn-ghost btn-sm" id="pgBack"><span data-icon="undo"></span> Calendario</button>' +
      '<span class="pg-session-meta">Semana ' + s.week + dateTxt + "</span>" +
      "</div>"
    );
  }
  function sessionNav(s) {
    const prev = siblingCell(-1), next = siblingCell(1);
    const navLabel = (c) => (c.kind === "challenge" ? "Reto" : (c.labelShort || c.label)) + " · Sem " + c.week;
    return (
      '<div class="pg-session-nav">' +
      (prev ? '<button class="btn btn-ghost btn-sm" data-navcell="' + cellId(prev.week, prev.day) + '">← ' + esc(navLabel(prev)) + "</button>" : "<span></span>") +
      (next ? '<button class="btn btn-ghost btn-sm" data-navcell="' + cellId(next.week, next.day) + '">' + esc(navLabel(next)) + " →</button>" : "<span></span>") +
      "</div>"
    );
  }
  function dayNoteField(s) {
    const noteVal = (st.log[s.id] || {}).note || "";
    return (
      '<label class="field pg-note-field"><span class="field-label">Nota del día (opcional)</span>' +
      '<textarea id="pgDayNote" rows="2" placeholder="Cómo te sentiste, molestias, ajustes para la próxima…">' + esc(noteVal) + "</textarea></label>"
    );
  }

  function viewSession() {
    const s = sessionRef;
    const d = cellDate(s.week, s.day);
    const dateTxt = " · " + DAY_FULL[s.day] + (d ? " " + fmtDayMonth(d) : "");

    if (s.isChallenge) {
      const done = !!st.done[s.id];
      const firstLine = (s.wodDesc || "").split("\n").filter((l) => l.trim())[0] || "";
      return (
        '<div class="pg-wrap pg-session">' +
        sessionTop(s, dateTxt) +
        '<h2 class="pg-title">' + esc(s.title) + "</h2>" +
        '<div class="pg-method-chip">' + esc(s.method) + " · Semana " + s.week + "</div>" +
        warmupBlock(s) +
        (firstLine ? '<div class="pg-note"><span data-icon="clock"></span> ' + esc(firstLine) + " (mirá el detalle completo al empezar)</div>" : "") +
        '<button class="btn btn-primary btn-block" id="pgStartChallenge"><span data-icon="play"></span> Empezar el reto</button>' +
        dayNoteField(s) +
        '<button class="btn ' + (done ? "btn-success" : "btn-ghost") + ' btn-block" id="pgFinish"><span data-icon="check"></span> ' +
        (done ? "Día marcado como hecho" : "Marcar el día como hecho") + "</button>" +
        sessionNav(s) +
        '<div class="pg-rest-bar" id="pgRestBar" hidden></div>' +
        "</div>"
      );
    }

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
        const head =
          '<div class="pg-ex-head"><span class="pg-ex-tag">' + f.label + '</span><span class="pg-fin-muscle">' + esc(f.muscle) + "</span></div>" +
          '<div class="pg-fin-move">' + esc(f.movement) + "</div>" +
          '<p class="pg-fin-protocol">' + esc(f.protocol) + "</p>";
        const goal = rec && rec.fail ? (f.label === "PRO-PAIN" ? rec.fail * 2 : rec.fail) : null;
        const registered = rec && rec.done != null;
        const clockLive = finState && finState.key === f.key;
        const clockLen = window.fmtTime((f.clockSec || 270) * 1000);
        let body;

        if (registered) {
          body =
            '<div class="pg-fin-goal"><strong>' + rec.done + " reps</strong> en " + window.fmtTime((rec.usedSec || 0) * 1000) +
            (goal != null ? " · objetivo " + goal : "") + " (fallo: " + (rec.fail || "—") + ")</div>" +
            '<div class="pg-fin-row">' +
            '<button class="btn btn-ghost btn-sm" data-finredo="' + f.key + '"><span data-icon="reset"></span> Rehacer</button>' +
            '<button class="btn btn-ghost btn-sm" data-finclear="' + f.key + '"><span data-icon="trash"></span></button>' +
            "</div>";
        } else if (clockLive) {
          body =
            ringHtml("pgFinRing", finState.done ? "¡tiempo!" : "en marcha") +
            '<div class="pg-fin-row">' +
            '<label class="field"><span class="field-label">' + (finState.done ? "¿Cuántas reps hiciste?" : "Reps logradas (frena el reloj)") + "</span>" +
            '<input type="number" inputmode="numeric" data-findone="' + f.key + '" value="" placeholder="' + (goal != null ? goal : "") + '" /></label>' +
            '<button class="btn btn-primary btn-sm" data-finreg="' + f.key + '"><span data-icon="check"></span> Registrar</button>' +
            "</div>" +
            (finState.done ? "" : '<button class="pg-link" data-finstop="' + f.key + '">cancelar reloj</button>');
        } else if (finManual === f.key) {
          body =
            '<div class="pg-fin-manual">' +
            '<div class="pg-fin-row">' +
            '<label class="field"><span class="field-label">Reps al fallo</span>' +
            '<input type="number" inputmode="numeric" data-fmfail="' + f.key + '" value="' + (rec && rec.fail ? rec.fail : "") + '" placeholder="19" /></label>' +
            '<label class="field"><span class="field-label">Reps logradas</span>' +
            '<input type="number" inputmode="numeric" data-fmdone="' + f.key + '" value="' + (rec && rec.done != null ? rec.done : "") + '" placeholder="' + (goal != null ? goal : "38") + '" /></label>' +
            '<label class="field"><span class="field-label">Tiempo (m:ss)</span>' +
            '<input type="text" inputmode="numeric" data-fmtime="' + f.key + '" value="' + (rec && rec.usedSec ? window.fmtTime(rec.usedSec * 1000) : "") + '" placeholder="' + clockLen + '" /></label>' +
            "</div>" +
            '<div class="pg-fin-row">' +
            '<button class="btn btn-primary btn-sm" data-fmsave="' + f.key + '"><span data-icon="check"></span> Registrar</button>' +
            '<button class="btn btn-ghost btn-sm" data-fmcancel="' + f.key + '">Cancelar</button>' +
            "</div></div>";
        } else {
          body =
            '<div class="pg-fin-row">' +
            '<label class="field"><span class="field-label">Reps al fallo</span>' +
            '<input type="number" inputmode="numeric" data-fin="' + f.key + '" value="' + (rec && rec.fail ? rec.fail : "") + '" placeholder="—" /></label>' +
            '<button class="btn btn-primary btn-sm" data-finsave="' + f.key + '"><span data-icon="clock"></span> ' +
            (rec && rec.fail ? "Reiniciar" : "Iniciar") + " " + clockLen + "</button>" +
            (rec && rec.fail ? '<button class="btn btn-ghost btn-sm" data-finclear="' + f.key + '"><span data-icon="trash"></span></button>' : "") +
            "</div>" +
            (rec && rec.fail ? '<div class="pg-fin-goal">Objetivo: <strong>' + goal + " reps</strong> en " + clockLen + " · el reloj arranca al confirmar</div>" : "") +
            '<button class="pg-link" data-fmopen="' + f.key + '">ya lo hice — registrar a mano</button>';
        }

        return '<div class="pg-fin' + (registered ? " is-complete" : "") + '">' + head + body + "</div>";
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
    const clockRow = sessionStarted()
      ? '<button class="pg-sclock' + (sessionRunning() ? " is-running" : " is-paused") + '" id="pgSessionToggle">' +
        '<span data-icon="clock"></span> <span id="pgSessionClock">' + window.fmtTime(sessionElapsedMs()) + "</span>" +
        '<span class="pg-sclock-hint">' + (sessionRunning() ? "toca para pausar" : "en pausa") + "</span></button>"
      : '<button class="btn btn-primary btn-block" id="pgSessionToggle"><span data-icon="play"></span> Iniciar cronómetro de la sesión</button>';

    const lg0 = st.log[s.id] || {};
    const totalTxt = lg0.totalSec ? '<div class="pg-session-total"><span data-icon="clock"></span> Tiempo total registrado: <strong>' + window.fmtTime(lg0.totalSec * 1000) + "</strong></div>" : "";

    return (
      '<div class="pg-wrap pg-session">' +
      sessionTop(s, dateTxt) +
      '<h2 class="pg-title">' + esc(s.title) + "</h2>" +
      '<div class="pg-method-chip">' + esc(s.method) + "</div>" +
      clockRow +
      warmupBlock(s) +
      '<div class="pg-note"><span data-icon="clock"></span> ' + esc(s.note) + "</div>" +
      '<button class="pg-link pg-fill-link" id="pgFillAll">Completar las series que falten con lo pautado</button>' +
      groupsHtml +
      '<h3 class="pg-section-h">Finishers</h3>' +
      finHtml +
      dayNoteField(s) +
      totalTxt +
      '<button class="btn btn-primary btn-block" id="pgFinish"><span data-icon="check"></span> ' +
      (pr.done >= pr.total ? "Finalizar sesión" : "Finalizar sesión (" + pr.done + "/" + pr.total + ")") + "</button>" +
      sessionNav(s) +
      '<div class="pg-rest-bar" id="pgRestBar" hidden></div>' +
      viewSetModal() +
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
    save();
    sound("tap");
    startSessionTimer(); // arranca el cronómetro de la sesión si aún no

    if (isNew && ex) {
      const doneCount = lg.sets[key].length;
      if (doneCount < ex.sets) {
        startRest(ex.restSec, "descanso");
        editing = { key: key, index: doneCount }; // abre el popup de la siguiente serie
      } else {
        // última serie del ejercicio → descanso largo entre ejercicios
        startRest(ex.restAfterSec || ex.restSec, ex.restAfterLabel || "entre ejercicios");
        editing = null;
      }
    } else {
      editing = null; // corrección: no toca el reloj
    }
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
    startSessionTimer();
    if (ex) startRest(ex.restAfterSec || ex.restSec, ex.restNote || "descanso");
    render();
  }

  function finisherDef(key) {
    return sessionRef.finishers.find((x) => x.key === key);
  }

  // Confirmá las reps al fallo → arranca YA el reloj del finisher.
  function saveFinisher(key) {
    const inp = $('[data-fin="' + key + '"]');
    const v = parseInt(inp && inp.value, 10);
    if (!(v > 0)) { toast("Poné el nº de reps al fallo"); return; }
    const lg = sessionLog();
    lg.finishers[key] = { fail: v, ts: Date.now() }; // reinicia done/usedSec si estabas rehaciendo
    save();
    sound("success");
    startSessionTimer();
    const f = finisherDef(key);
    startFinClock(key, (f && f.clockSec) || 270);
  }

  // Frená el reloj con las reps totales (o respondé cuando llegó a 0).
  function registerFinisher(key) {
    const inp = $('[data-findone="' + key + '"]');
    const v = parseInt(inp && inp.value, 10);
    if (!(v >= 0)) { toast("Poné cuántas reps hiciste"); return; }
    const usedSec = finUsedSec();
    const lg = sessionLog();
    lg.finishers[key] = Object.assign({}, lg.finishers[key], { done: v, usedSec: usedSec, ts: Date.now() });
    stopFinClock();
    save();
    sound("success");
    const f = finisherDef(key);
    startRest((f && f.restAfterSec) || 150, "después del finisher");
    render();
  }

  function redoFinisher(key) {
    const lg = sessionLog();
    if (lg.finishers[key]) { delete lg.finishers[key].done; delete lg.finishers[key].usedSec; }
    stopFinClock();
    save();
    render();
  }

  // Registro a mano de un finisher ya hecho (reps + tiempo m:ss).
  function parseMMSS(str) {
    const m = String(str || "").trim().match(/^(\d+)\s*:\s*(\d{1,2})$/);
    if (m) return (+m[1]) * 60 + (+m[2]);
    const n = parseInt(str, 10);
    return n > 0 ? n : 0;
  }
  function registerFinisherManual(key) {
    const fail = parseInt($('[data-fmfail="' + key + '"]').value, 10);
    const done = parseInt($('[data-fmdone="' + key + '"]').value, 10);
    const usedSec = parseMMSS($('[data-fmtime="' + key + '"]').value);
    if (!(fail > 0) || !(done >= 0)) { toast("Poné reps al fallo y reps logradas"); return; }
    const lg = sessionLog();
    lg.finishers[key] = { fail: fail, done: done, usedSec: usedSec, ts: Date.now() };
    finManual = null;
    stopFinClock();
    save();
    sound("success");
    render();
  }

  // Completa las series pendientes con los valores pautados (no pisa lo ya cargado).
  function fillPrescribed() {
    const lg = sessionLog();
    sessionRef.groups.forEach((g) => g.exercises.forEach((ex) => {
      const last = lastTimeFor(ex.movementSlug, ex.key);
      const w = ex.prefillKg != null ? ex.prefillKg : (last ? last.w : 0);
      if (ex.targetReps) {
        if (!lg.sets[ex.key] || !lg.sets[ex.key].length) {
          lg.sets[ex.key] = [{ w: w, r: ex.targetReps, ts: Date.now(), m: ex.movementSlug }];
        }
      } else {
        if (!lg.sets[ex.key]) lg.sets[ex.key] = [];
        const r = ex.reps || (last ? last.r : 8);
        while (lg.sets[ex.key].length < ex.sets) {
          lg.sets[ex.key].push({ w: w, r: r, ts: Date.now(), m: ex.movementSlug });
        }
      }
    }));
    save();
    toast("Series completadas con los valores pautados");
    render();
  }

  function saveDayNote(val) {
    const lg = sessionLog();
    lg.note = String(val || "").trim();
    save();
  }

  function toggleWarmup(i) {
    const lg = sessionLog();
    if (!lg.warmup) lg.warmup = {};
    lg.warmup[i] = !lg.warmup[i];
    save();
    render();
  }
  function startChallenge() {
    if (sessionRef && sessionRef.wodId && window.AppGym && window.AppGym.startWodById) {
      toast("Al terminar, marcá el día como hecho.");
      window.AppGym.startWodById(sessionRef.wodId);
    } else { toast("Reto no disponible."); }
  }

  function toggleFinisher(key) {
    const lg = sessionLog();
    lg.finishers[key] = Object.assign({}, lg.finishers[key]);
    lg.finishers[key].done = !lg.finishers[key].done;
    save();
    startSessionTimer();
    if (lg.finishers[key].done) {
      const f = finisherDef(key);
      startRest((f && f.restAfterSec) || 150, "después del finisher");
    }
    render();
  }

  function finishSession() {
    const cid = sessionRef.id;
    pauseSessionTimer();
    const total = sessionElapsedMs();
    st.done[cid] = true;
    const lg = st.log[cid];
    if (lg) {
      if (!lg.date) lg.date = toISO(new Date());
      lg.totalSec = Math.round(total / 1000);
    }
    save();
    stopRest(); stopFinClock(); clearSessionClockInterval();
    toast(total > 0 ? "Sesión completa · " + window.fmtTime(total) : "Sesión marcada como completa");
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
    if (t.closest("#pgSessionToggle")) { toggleSessionTimer(); return; }
    if (t.closest("#pgFillAll")) { fillPrescribed(); return; }
    if (t.closest("#pgStartChallenge")) { startChallenge(); return; }
    if (t.closest("#pgWuToggle")) { warmupCollapsed = !warmupCollapsed; render(); return; }
    const wuInfo = t.closest("[data-wuinfo]");
    if (wuInfo) { const i = +wuInfo.dataset.wuinfo; warmupInfoOpen = warmupInfoOpen === i ? null : i; render(); return; }
    const wu = t.closest("[data-wu]");
    if (wu) { toggleWarmup(+wu.dataset.wu); return; }
    const navCell = t.closest("[data-navcell]");
    if (navCell) { openSession(navCell.dataset.navcell); return; }
    if (t.closest("#pgOpenTimer")) {
      const tab = document.querySelector('.tab[data-view="timer"]');
      if (tab) tab.click();
      return;
    }

    if (t.closest("[data-pgclose]")) { editing = null; render(); return; }

    const setBtn = t.closest("[data-set]");
    if (setBtn) {
      const p = setBtn.dataset.set.split("|");
      editing = { key: p[0], index: +p[1] };
      render();
      return;
    }
    if (t.closest("#pgSetDelete")) { if (editing) deleteSet(editing.key, editing.index); return; }
    if (t.closest("#pgSetSave")) { if (editing) saveSet(editing.key, editing.index); return; }

    const tSave = t.closest("[data-tsave]");
    if (tSave) { saveTempo(tSave.dataset.tsave); return; }
    const tClear = t.closest("[data-tclear]");
    if (tClear) { clearTempo(tClear.dataset.tclear); return; }

    const finSave = t.closest("[data-finsave]");
    if (finSave) { saveFinisher(finSave.dataset.finsave); return; }
    const fmOpen = t.closest("[data-fmopen]");
    if (fmOpen) { finManual = fmOpen.dataset.fmopen; render(); return; }
    const fmCancel = t.closest("[data-fmcancel]");
    if (fmCancel) { finManual = null; render(); return; }
    const fmSave = t.closest("[data-fmsave]");
    if (fmSave) { registerFinisherManual(fmSave.dataset.fmsave); return; }
    const finReg = t.closest("[data-finreg]");
    if (finReg) { registerFinisher(finReg.dataset.finreg); return; }
    const finStop = t.closest("[data-finstop]");
    if (finStop) { stopFinClock(); render(); return; }
    const finRedo = t.closest("[data-finredo]");
    if (finRedo) { redoFinisher(finRedo.dataset.finredo); return; }
    const finClear = t.closest("[data-finclear]");
    if (finClear) {
      const lg = sessionLog();
      delete lg.finishers[finClear.dataset.finclear];
      stopFinClock();
      save(); render(); return;
    }
    const finToggle = t.closest("[data-fintoggle]");
    if (finToggle) { toggleFinisher(finToggle.dataset.fintoggle); return; }
  }

  /* ======================================================================
     Init
     ====================================================================== */
  function init() {
    const el = root();
    if (!el) return;
    el.addEventListener("click", onClick);
    el.addEventListener("change", (e) => {
      if (e.target && e.target.id === "pgDayNote") saveDayNote(e.target.value);
    });
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
    window.addEventListener("beforeunload", () => { pauseSessionTimer(); stopRest(); stopFinClock(); clearSessionClockInterval(); });
    document.addEventListener("visibilitychange", () => {
      // Al volver a la pestaña, re-sincroniza el cronómetro visible.
      if (!document.hidden && screen === "session") { paintSessionClock(); paintRest(); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.AppGymProgram = {
    reset: function () { st = JSON.parse(JSON.stringify(DEFAULTS)); save(); screen = "onboarding"; render(); }
  };
})();
