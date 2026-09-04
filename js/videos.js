/* ==========================================================================
   AppGym — Vídeos de técnica por movimiento (YouTube)
   ==========================================================================

   CÓMO AÑADIR UN VÍDEO
   --------------------
   1. Abre el vídeo en YouTube y copia su ID:
        https://www.youtube.com/watch?v=RqRX_PfMJ5A   ->  RqRX_PfMJ5A
        https://www.youtube.com/shorts/RqRX_PfMJ5A    ->  RqRX_PfMJ5A
        https://youtu.be/RqRX_PfMJ5A                   ->  RqRX_PfMJ5A
   2. Busca el movimiento en la lista de abajo y pega el ID entre las comillas
      de  id: "".
   3. vertical: true   -> vídeo de móvil (9:16, tipo Shorts)
      (sin vertical)   -> vídeo horizontal normal (16:9)

   Si dejas  id: ""  no pasa nada: la app simplemente no muestra el recuadro
   de vídeo para ese movimiento (sin error).

   NO hace falta que el nombre coincida exactamente con el del entrenamiento:
   la app ignora mayúsculas, acentos, singular/plural, los pesos/distancias
   entre paréntesis y reconoce variantes habituales (mancuernas, KB, HSPU…).
   Si algún movimiento no encuentra su vídeo, añade su nombre exacto en
   MOVEMENT_VIDEO_ALIASES apuntando a la clave correcta.
   ========================================================================== */

window.MOVEMENT_VIDEOS = {
  /* ---- Halterofilia / barra ---- */
  "thruster":            { id: "RqRX_PfMJ5A", vertical: true },
  "snatch":              { id: "" },
  "clean and jerk":      { id: "" },
  "clean":               { id: "" },
  "jerk":                { id: "" },
  "peso muerto":         { id: "" },
  "sentadilla frontal":  { id: "" },
  "sentadilla trasera":  { id: "" },
  "sentadilla overhead": { id: "" },
  "press militar":       { id: "" },
  "push press":          { id: "" },
  "push jerk":           { id: "" },
  "power clean":         { id: "" },
  "power snatch":        { id: "" },
  "hang power clean":    { id: "" },

  /* ---- Gimnasia / peso corporal ---- */
  "dominadas":           { id: "9rckBLbVe8c", vertical: true },
  "dominadas estrictas": { id: "" },
  "muscle-up":           { id: "" },
  "toes-to-bar":         { id: "" },
  "chest-to-bar":        { id: "" },
  "flexiones":           { id: "" },
  "flexiones pino":      { id: "" },
  "fondos en anillas":   { id: "" },
  "sentadillas":         { id: "" },
  "pistols":             { id: "" },
  "zancadas":            { id: "" },
  "burpees":             { id: "" },
  "abdominales":         { id: "" },
  "hollow rock":         { id: "" },
  "salto al cajon":      { id: "" },
  "dobles saltos":       { id: "" },
  "escalada de cuerda":  { id: "" },
  "ring row":            { id: "" },
  "ghd sit-up":          { id: "" },
  "back extension":      { id: "" },

  /* ---- Kettlebell / mancuerna ---- */
  "kb swing":            { id: "" },
  "kb goblet squat":     { id: "" },
  "kb snatch":           { id: "" },
  "kb clean":            { id: "" },
  "turkish get-up":      { id: "" },

  /* ---- Otros ---- */
  "wall ball":           { id: "" },
  "med ball clean":      { id: "" },
  "farmers carry":       { id: "" },
  "sled push":           { id: "" },
  "box step-up":         { id: "" }
};

/* Variantes de nombre -> clave del catálogo de arriba.
   Solo para los casos que la normalización automática no cubre. */
window.MOVEMENT_VIDEO_ALIASES = {
  "thruster con mancuernas":     "thruster",
  "db thruster":                 "thruster",
  "squat clean thruster":        "thruster",
  "db squat clean thruster":     "thruster",
  "kb thruster a un brazo":      "thruster",
  "clean y jerk":                "clean and jerk",
  "clean jerk":                  "clean and jerk",
  "cargada y envion":            "clean and jerk",
  "clean and jerk cargada y envion": "clean and jerk",
  "cargada":                     "clean",
  "squat clean":                 "clean",
  "envion":                      "jerk",
  "arrancada":                   "snatch",
  "deadlift":                    "peso muerto",
  "hspu":                        "flexiones pino",
  "handstand push-ups":          "flexiones pino",
  "push-ups":                    "flexiones",
  "air squats":                  "sentadillas",
  "air squat":                   "sentadillas",
  "pull-ups":                    "dominadas",
  "l pull-ups":                  "dominadas",
  "chin-ups":                    "dominadas",
  "double-unders":               "dobles saltos",
  "box jumps":                   "salto al cajon",
  "box jump":                    "salto al cajon",
  "kettlebell swing":            "kb swing",
  "russian kb swing":            "kb swing",
  "goblet squat":                "kb goblet squat",
  "get-up turco":                "turkish get-up",
  "wall balls":                  "wall ball",
  "rodillas al pecho":           "toes-to-bar",
  "farmer carry":                "farmers carry",
  "lunges":                      "zancadas",
  "burpees sobre la barra":      "burpees",
  "burpee box jump-over":        "burpees",
  "burpee pull-ups":             "burpees"
};

/* ==========================================================================
   Resolución de nombres -> { id, vertical } | null
   ========================================================================== */
(function () {
  "use strict";

  function normalize(name) {
    return String(name || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")             // acentos
      .replace(/\([^)]*\)/g, " ")                                   // "(...)"
      .replace(/\b\d+([.,]\d+)?\s?(m|km|mi|milla|millas|ft|yd|in|cal|kg|lb|s|seg|min|rm|rounds?)\b/g, " ")
      .replace(/\bx\s?\d+\b/g, " ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // quita la "s" final de cada palabra ("dominadas estrictas" -> "dominada estricta")
  function depluralize(s) {
    return s.replace(/(\w)s\b/g, "$1");
  }

  let index = null;

  function buildIndex() {
    index = new Map();
    const put = (rawKey, value) => {
      const k = normalize(rawKey);
      if (!k) return;
      if (!index.has(k)) index.set(k, value);
      const d = depluralize(k);
      if (!index.has(d)) index.set(d, value);
    };
    const catalog = window.MOVEMENT_VIDEOS || {};
    Object.keys(catalog).forEach((key) => {
      const v = catalog[key];
      if (v && v.id) put(key, { id: v.id, vertical: !!v.vertical });
    });
    const aliases = window.MOVEMENT_VIDEO_ALIASES || {};
    Object.keys(aliases).forEach((key) => {
      const target = catalog[aliases[key]];
      if (target && target.id) put(key, { id: target.id, vertical: !!target.vertical });
    });
  }

  window.resolveMovementVideo = function (rawName) {
    if (!rawName) return null;
    if (!index) buildIndex();

    const norm = normalize(rawName);
    if (!norm) return null;

    const tries = [norm, depluralize(norm)];
    const words = norm.split(" ");
    for (let n = Math.min(words.length, 5); n >= 1; n--) {
      const head = words.slice(0, n).join(" ");
      tries.push(head, depluralize(head));
    }

    for (let i = 0; i < tries.length; i++) {
      const t = tries[i];
      if (t && index.has(t)) return index.get(t);
    }
    return null;
  };

  // Permite re-indexar si se editan los catálogos en caliente (consola/tests)
  window.rebuildMovementVideoIndex = buildIndex;
})();
