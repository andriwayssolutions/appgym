/* ==========================================================================
   AppGym — Datos: ejercicios y WODs de CrossFit
   ========================================================================== */

/* Lista de ejercicios (para el constructor de rutinas personalizadas).
   Estructura: { name, cat } */
window.EXERCISES = [
  /* Gimnasia (peso corporal) */
  { name: "Dominadas", cat: "Gimnasia" },
  { name: "Dominadas estrictas", cat: "Gimnasia" },
  { name: "Chin-ups", cat: "Gimnasia" },
  { name: "Muscle-up", cat: "Gimnasia" },
  { name: "Fondos en anillas", cat: "Gimnasia" },
  { name: "Flexiones (push-ups)", cat: "Gimnasia" },
  { name: "Flexiones pino (HSPU)", cat: "Gimnasia" },
  { name: "Sentadillas (air squats)", cat: "Gimnasia" },
  { name: "Pistols (sentadilla a una pierna)", cat: "Gimnasia" },
  { name: "Zancadas (lunges)", cat: "Gimnasia" },
  { name: "Burpees", cat: "Gimnasia" },
  { name: "Burpees sobre cajón", cat: "Gimnasia" },
  { name: "Abdominales (sit-ups)", cat: "Gimnasia" },
  { name: "Toes-to-bar", cat: "Gimnasia" },
  { name: "Rodillas al pecho", cat: "Gimnasia" },
  { name: "Hollow rock", cat: "Gimnasia" },
  { name: "Plancha", cat: "Gimnasia" },
  { name: "Escalada de cuerda", cat: "Gimnasia" },
  { name: "Saltos al cajón (box jumps)", cat: "Gimnasia" },
  { name: "Dobles saltos (double-unders)", cat: "Gimnasia" },
  { name: "Salto a la comba", cat: "Gimnasia" },
  { name: "Dips", cat: "Gimnasia" },
  { name: "GHD sit-up", cat: "Gimnasia" },
  { name: "Back extension", cat: "Gimnasia" },
  { name: "Ring row", cat: "Gimnasia" },

  /* Halterofilia / barra */
  { name: "Snatch (arrancada)", cat: "Halterofilia" },
  { name: "Clean & Jerk (cargada y envión)", cat: "Halterofilia" },
  { name: "Clean (cargada)", cat: "Halterofilia" },
  { name: "Jerk (envión)", cat: "Halterofilia" },
  { name: "Thruster", cat: "Halterofilia" },
  { name: "Peso muerto (deadlift)", cat: "Halterofilia" },
  { name: "Sentadilla frontal", cat: "Halterofilia" },
  { name: "Sentadilla trasera", cat: "Halterofilia" },
  { name: "Sentadilla overhead", cat: "Halterofilia" },
  { name: "Press militar", cat: "Halterofilia" },
  { name: "Push press", cat: "Halterofilia" },
  { name: "Push jerk", cat: "Halterofilia" },
  { name: "Hang power clean", cat: "Halterofilia" },
  { name: "Power snatch", cat: "Halterofilia" },
  { name: "Power clean", cat: "Halterofilia" },
  { name: "Front rack lunge", cat: "Halterofilia" },

  /* Kettlebell / mancuerna */
  { name: "KB swing", cat: "Kettlebell" },
  { name: "KB goblet squat", cat: "Kettlebell" },
  { name: "KB snatch", cat: "Kettlebell" },
  { name: "KB clean", cat: "Kettlebell" },
  { name: "KB press", cat: "Kettlebell" },
  { name: "Press con mancuernas", cat: "Kettlebell" },
  { name: "Remo con mancuerna", cat: "Kettlebell" },
  { name: "Thruster con mancuernas", cat: "Kettlebell" },

  /* Cardio / máquinas */
  { name: "Correr", cat: "Cardio" },
  { name: "Correr hacia atrás", cat: "Cardio" },
  { name: "Remo (row)", cat: "Cardio" },
  { name: "Bicicleta (Assault Bike)", cat: "Cardio" },
  { name: "Bici de aire", cat: "Cardio" },
  { name: "Ski erg", cat: "Cardio" },
  { name: "Nadar", cat: "Cardio" },
  { name: "Caminata", cat: "Cardio" },

  /* Otros */
  { name: "Wall ball", cat: "Otros" },
  { name: "Med ball clean", cat: "Otros" },
  { name: "Farmer carry", cat: "Otros" },
  { name: "Sled push", cat: "Otros" },
  { name: "Descanso", cat: "Otros" },
  { name: "Estiramiento", cat: "Otros" }
];

/* ==========================================================================
   WODs de referencia (benchmarks "Girls" y Héroes)
   Estructura de bloque:
     { kind: 'rounds', rounds: N | [n1, n2, ...], items: [{ name, detail, reps }] }
       -> reps = null => usar el valor de la ronda actual (escaleras 21-15-9)
     { kind: 'single', items: [{ name, detail, reps }] }          -> una pasada
     { kind: 'run', meters, detail?, name? }                       -> carrera
     { kind: 'rest', seconds, detail? }                            -> descanso
     { kind: 'amrap', items: [...] }                               -> circuito AMRAP
     { kind: 'emom', items: [...] }                                -> tarea por minuto
   ========================================================================== */
window.WODS = [
  /* ---------------- Benchmark "Girls" ---------------- */
  {
    id: "fran", name: "Fran", category: "benchmark", type: "for-time", timeCap: null,
    description: "21-15-9 de Thrusters y Dominadas, por tiempo.",
    blocks: [
      { kind: "rounds", rounds: [21, 15, 9], items: [
        { name: "Thrusters", detail: "43/29 kg", reps: null },
        { name: "Dominadas", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "cindy", name: "Cindy", category: "benchmark", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 5 dominadas, 10 flexiones, 15 sentadillas.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Dominadas", detail: "", reps: 5 },
        { name: "Flexiones (push-ups)", detail: "", reps: 10 },
        { name: "Sentadillas (air squats)", detail: "", reps: 15 }
      ]}
    ]
  },
  {
    id: "annie", name: "Annie", category: "benchmark", type: "for-time", timeCap: null,
    description: "50-40-30-20-10 de dobles saltos y abdominales, por tiempo.",
    blocks: [
      { kind: "rounds", rounds: [50, 40, 30, 20, 10], items: [
        { name: "Dobles saltos (double-unders)", detail: "", reps: null },
        { name: "Abdominales (sit-ups)", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "helen", name: "Helen", category: "benchmark", type: "for-time", timeCap: null,
    description: "3 rondas: 400 m de carrera, 21 KB swings, 12 dominadas.",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "KB swing", detail: "24/16 kg", reps: 21 },
        { name: "Dominadas", detail: "", reps: 12 }
      ]}
    ]
  },
  {
    id: "angie", name: "Angie", category: "benchmark", type: "for-time", timeCap: null,
    description: "100 dominadas, 100 flexiones, 100 abdominales, 100 sentadillas, por tiempo.",
    blocks: [
      { kind: "single", items: [
        { name: "Dominadas", detail: "", reps: 100 },
        { name: "Flexiones (push-ups)", detail: "", reps: 100 },
        { name: "Abdominales (sit-ups)", detail: "", reps: 100 },
        { name: "Sentadillas (air squats)", detail: "", reps: 100 }
      ]}
    ]
  },
  {
    id: "barbara", name: "Barbara", category: "benchmark", type: "for-time", timeCap: null,
    description: "5 rondas: 20 dominadas, 30 flexiones, 40 abdominales, 50 sentadillas. Descanso 3 min entre rondas.",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Dominadas", detail: "", reps: 20 },
        { name: "Flexiones (push-ups)", detail: "", reps: 30 },
        { name: "Abdominales (sit-ups)", detail: "", reps: 40 },
        { name: "Sentadillas (air squats)", detail: "", reps: 50 },
        { name: "Descanso", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "grace", name: "Grace", category: "benchmark", type: "for-time", timeCap: null,
    description: "30 clean & jerk, por tiempo.",
    blocks: [
      { kind: "single", items: [
        { name: "Clean & Jerk (cargada y envión)", detail: "60/40 kg", reps: 30 }
      ]}
    ]
  },
  {
    id: "isabel", name: "Isabel", category: "benchmark", type: "for-time", timeCap: null,
    description: "30 snatch, por tiempo.",
    blocks: [
      { kind: "single", items: [
        { name: "Snatch (arrancada)", detail: "60/40 kg", reps: 30 }
      ]}
    ]
  },
  {
    id: "nancy", name: "Nancy", category: "benchmark", type: "for-time", timeCap: null,
    description: "5 rondas: 400 m de carrera y 15 sentadillas overhead.",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Sentadilla overhead", detail: "43/29 kg", reps: 15 }
      ]}
    ]
  },
  {
    id: "diane", name: "Diane", category: "benchmark", type: "for-time", timeCap: null,
    description: "21-15-9 de peso muerto y flexiones pino, por tiempo.",
    blocks: [
      { kind: "rounds", rounds: [21, 15, 9], items: [
        { name: "Peso muerto (deadlift)", detail: "100/70 kg", reps: null },
        { name: "Flexiones pino (HSPU)", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "elizabeth", name: "Elizabeth", category: "benchmark", type: "for-time", timeCap: null,
    description: "21-15-9 de clean y fondos en anillas, por tiempo.",
    blocks: [
      { kind: "rounds", rounds: [21, 15, 9], items: [
        { name: "Clean (cargada)", detail: "60/40 kg", reps: null },
        { name: "Fondos en anillas", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "karen", name: "Karen", category: "benchmark", type: "for-time", timeCap: null,
    description: "150 wall balls, por tiempo.",
    blocks: [
      { kind: "single", items: [
        { name: "Wall ball", detail: "9/6 kg", reps: 150 }
      ]}
    ]
  },
  {
    id: "jackie", name: "Jackie", category: "benchmark", type: "for-time", timeCap: null,
    description: "1000 m de remo, 50 thrusters, 30 dominadas, por tiempo.",
    blocks: [
      { kind: "single", items: [
        { name: "Remo 1000 m", detail: "", reps: 1 },
        { name: "Thrusters", detail: "20/15 kg", reps: 50 },
        { name: "Dominadas", detail: "", reps: 30 }
      ]}
    ]
  },
  {
    id: "mary", name: "Mary", category: "benchmark", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 5 flexiones pino, 10 pistols, 15 dominadas.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Flexiones pino (HSPU)", detail: "", reps: 5 },
        { name: "Pistols (sentadilla a una pierna)", detail: "", reps: 10 },
        { name: "Dominadas", detail: "", reps: 15 }
      ]}
    ]
  },
  {
    id: "eva", name: "Eva", category: "benchmark", type: "for-time", timeCap: null,
    description: "5 rondas: 800 m de carrera, 30 KB swings, 30 dominadas.",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "KB swing", detail: "32/24 kg", reps: 30 },
        { name: "Dominadas", detail: "", reps: 30 }
      ]}
    ]
  },

  /* ---------------- Héroes (lista completa) ---------------- */
  {
    id: "abbate", name: "Abbate", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1 milla de carrera, 21 clean & jerk, 800 m de carrera, 21 clean & jerk, 1 milla de carrera (105 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1 milla", detail: "", reps: 1 },
        { name: "Clean & Jerk", detail: "105 lb", reps: 21 },
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Clean & Jerk", detail: "105 lb", reps: 21 },
        { name: "Carrera 1 milla", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "adambrown", name: "Adambrown", category: "hero", type: "for-time", timeCap: null,
    description: "2 rondas por tiempo: 24 pesos muertos, 24 saltos al cajón, 24 wall balls, 24 press banca, 24 saltos al cajón.",
    blocks: [
      { kind: "rounds", rounds: 2, items: [
        { name: "Peso muerto", detail: "95 lb", reps: 24 },
        { name: "Salto al cajón", detail: "20 in", reps: 24 },
        { name: "Wall ball", detail: "14 lb", reps: 24 },
        { name: "Press banca", detail: "135 lb", reps: 24 },
        { name: "Salto al cajón", detail: "20 in", reps: 24 }
      ]}
    ]
  },
  {
    id: "alexander", name: "Alexander", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 31 sentadillas traseras y 12 power cleans (95/135 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Sentadilla trasera", detail: "95 lb", reps: 31 },
        { name: "Power clean", detail: "125 lb", reps: 12 }
      ]}
    ]
  },
  {
    id: "arnie", name: "Arnie", category: "hero", type: "for-time", timeCap: null,
    description: "Con una sola kettlebell: 21 get-ups turcos (brazo der.), 50 KB swings, 21 sentadillas overhead (brazo izq.), 50 swings, 21 sentadillas overhead (brazo der.).",
    blocks: [
      { kind: "single", items: [
        { name: "Turkish get-up (der.)", detail: "53 lb", reps: 21 },
        { name: "KB swing", detail: "53 lb", reps: 50 },
        { name: "Sentadilla overhead (izq.)", detail: "53 lb", reps: 21 },
        { name: "KB swing", detail: "53 lb", reps: 50 },
        { name: "Sentadilla overhead (der.)", detail: "53 lb", reps: 21 }
      ]}
    ]
  },
  {
    id: "badger", name: "Badger", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 30 squat cleans, 30 dominadas, 800 m de carrera.",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Squat clean", detail: "43/29 kg", reps: 30 },
        { name: "Dominadas", detail: "", reps: 30 },
        { name: "Carrera 800 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "bell", name: "Bell", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 21 pesos muertos, 15 dominadas, 9 sentadillas frontales (125/185 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Peso muerto", detail: "125 lb", reps: 21 },
        { name: "Dominadas", detail: "", reps: 15 },
        { name: "Sentadilla frontal", detail: "125 lb", reps: 9 }
      ]}
    ]
  },
  {
    id: "big-sexy", name: "Big Sexy", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 6 pesos muertos, 6 burpees, 5 cleans, 5 chest-to-bar, 4 thrusters, 4 muscle-ups.",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Peso muerto", detail: "205 lb", reps: 6 },
        { name: "Burpees", detail: "", reps: 6 },
        { name: "Clean", detail: "155 lb", reps: 5 },
        { name: "Chest-to-bar", detail: "", reps: 5 },
        { name: "Thruster", detail: "105 lb", reps: 4 },
        { name: "Muscle-up", detail: "", reps: 4 }
      ]}
    ]
  },
  {
    id: "blake", name: "Blake", category: "hero", type: "for-time", timeCap: null,
    description: "4 rondas por tiempo: 100 ft bear crawl, 100 ft salto de longitud, con 3 burpees cada 5 saltos (chaleco opcional).",
    blocks: [
      { kind: "rounds", rounds: 4, items: [
        { name: "Bear crawl 100 ft", detail: "", reps: 1 },
        { name: "Salto de longitud 100 ft", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "bowen", name: "Bowen", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 800 m de carrera, 7 pesos muertos, 14 KB thrusters a un brazo (7 por lado), 20 saltos al cajón.",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Peso muerto", detail: "185 lb", reps: 7 },
        { name: "KB thruster a un brazo", detail: "35 lb", reps: 14 },
        { name: "Salto al cajón", detail: "20 in", reps: 20 }
      ]}
    ]
  },
  {
    id: "bradshaw", name: "Bradshaw", category: "hero", type: "for-time", timeCap: null,
    description: "10 rondas por tiempo: 3 flexiones pino, 6 pesos muertos, 12 dominadas, 24 dobles saltos (155/225 lb).",
    blocks: [
      { kind: "rounds", rounds: 10, items: [
        { name: "Flexiones pino (HSPU)", detail: "", reps: 3 },
        { name: "Peso muerto", detail: "155 lb", reps: 6 },
        { name: "Dominadas", detail: "", reps: 12 },
        { name: "Dobles saltos", detail: "", reps: 24 }
      ]}
    ]
  },
  {
    id: "bradley", name: "Bradley", category: "hero", type: "for-time", timeCap: null,
    description: "10 rondas por tiempo: sprint 100 m, sprint 100 m, 10 burpees.",
    blocks: [
      { kind: "rounds", rounds: 10, items: [
        { name: "Sprint 100 m", detail: "", reps: 2 },
        { name: "Burpees", detail: "", reps: 10 }
      ]}
    ]
  },
  {
    id: "brehm", name: "Brehm", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 10 escaladas de cuerda, 20 sentadillas traseras, 30 HSPU, 40 cargadas (155/225 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Escalada de cuerda", detail: "15 ft", reps: 10 },
        { name: "Sentadilla trasera", detail: "155 lb", reps: 20 },
        { name: "Flexiones pino (HSPU)", detail: "", reps: 30 },
        { name: "Cargada (clean)", detail: "155 lb", reps: 40 }
      ]}
    ]
  },
  {
    id: "brian", name: "Brian", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 5 escaladas de cuerda, 25 sentadillas traseras (125/185 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Escalada de cuerda", detail: "15 ft", reps: 5 },
        { name: "Sentadilla trasera", detail: "125 lb", reps: 25 }
      ]}
    ]
  },
  {
    id: "bruck", name: "Bruck", category: "hero", type: "for-time", timeCap: null,
    description: "4 rondas por tiempo: 400 m de carrera, 24 sentadillas traseras, 24 jerks (125/185 lb).",
    blocks: [
      { kind: "rounds", rounds: 4, items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Sentadilla trasera", detail: "125 lb", reps: 24 },
        { name: "Jerk", detail: "95 lb", reps: 24 }
      ]}
    ]
  },
  {
    id: "bulger", name: "Bulger", category: "hero", type: "for-time", timeCap: null,
    description: "10 rondas por tiempo: 150 m de carrera, 7 chest-to-bar, 7 sentadillas frontales, 7 flexiones pino (95/135 lb).",
    blocks: [
      { kind: "rounds", rounds: 10, items: [
        { name: "Carrera 150 m", detail: "", reps: 1 },
        { name: "Chest-to-bar", detail: "", reps: 7 },
        { name: "Sentadilla frontal", detail: "95 lb", reps: 7 },
        { name: "Flexiones pino (HSPU)", detail: "", reps: 7 }
      ]}
    ]
  },
  {
    id: "bull", name: "Bull", category: "hero", type: "for-time", timeCap: null,
    description: "2 rondas por tiempo: 200 dobles saltos, 50 dominadas, 1 milla de carrera (95/135 lb).",
    blocks: [
      { kind: "rounds", rounds: 2, items: [
        { name: "Dobles saltos", detail: "", reps: 200 },
        { name: "Dominadas", detail: "", reps: 50 },
        { name: "Carrera 1 milla", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "buriak", name: "Buriak", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 5 squat cleans, 10 burpees sobre la barra, 15 dominadas, 200 m de carrera (135/155 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Squat clean", detail: "135 lb", reps: 5 },
        { name: "Burpees sobre la barra", detail: "", reps: 10 },
        { name: "Dominadas", detail: "", reps: 15 },
        { name: "Carrera 200 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "cameron", name: "Cameron", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 50 zancadas, 25 chest-to-bar, 50 saltos al cajón, 25 triples saltos, 50 back extensions, 25 fondos en anillas, 50 rodillas al pecho, 25 wall balls, 50 abdominales, 5 escaladas de cuerda.",
    blocks: [
      { kind: "single", items: [
        { name: "Zancadas", detail: "", reps: 50 },
        { name: "Chest-to-bar", detail: "", reps: 25 },
        { name: "Salto al cajón", detail: "", reps: 50 },
        { name: "Triples saltos", detail: "", reps: 25 },
        { name: "Back extensions", detail: "", reps: 50 },
        { name: "Fondos en anillas", detail: "", reps: 25 },
        { name: "Rodillas al pecho", detail: "", reps: 50 },
        { name: "Wall balls", detail: "", reps: 25 },
        { name: "Abdominales", detail: "", reps: 50 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 5 }
      ]}
    ]
  },
  {
    id: "capoot", name: "Capoot", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 800 m de carrera, 75 flexiones, 1200 m de carrera, 50 flexiones, 1600 m de carrera, 25 flexiones.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 75 },
        { name: "Carrera 1200 m", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 50 },
        { name: "Carrera 1600 m", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 25 }
      ]}
    ]
  },
  {
    id: "carse", name: "Carse", category: "hero", type: "for-time", timeCap: null,
    description: "21-18-15-12-9-6-3 de squat cleans, dobles saltos, pesos muertos y saltos al cajón; cada ronda comienza con bear crawl de 50 m.",
    blocks: [
      { kind: "rounds", rounds: [21, 18, 15, 12, 9, 6, 3], items: [
        { name: "Squat clean", detail: "95 lb", reps: null },
        { name: "Dobles saltos", detail: "", reps: null },
        { name: "Peso muerto", detail: "125 lb", reps: null },
        { name: "Salto al cajón", detail: "24 in", reps: null }
      ]}
    ]
  },
  {
    id: "chad1000x", name: "CHAD1000X", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1000 box step-ups con peso (35/45 lb, cajón 20 in).",
    blocks: [
      { kind: "single", items: [
        { name: "Box step-ups con peso", detail: "35 lb", reps: 1000 }
      ]}
    ]
  },
  {
    id: "city-100", name: "City 100", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo en pareja: 31 sprints de ida y vuelta (7 m), luego 10 rondas de 7 pesos muertos, 7 hang power cleans y 7 m de lunge overhead.",
    blocks: [
      { kind: "single", items: [
        { name: "Sprint shuttle (7 m)", detail: "", reps: 31 },
        { name: "Peso muerto", detail: "105 lb", reps: 70 },
        { name: "Hang power clean", detail: "105 lb", reps: 70 },
        { name: "Lunge overhead 7 m", detail: "105 lb", reps: 70 }
      ]}
    ]
  },
  {
    id: "clovis", name: "Clovis", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: carrera de 10 millas con dominadas a voluntad.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 10 millas", detail: "", reps: 1 },
        { name: "Dominadas", detail: "a voluntad", reps: 100 }
      ]}
    ]
  },
  {
    id: "coe", name: "Coe", category: "hero", type: "for-time", timeCap: null,
    description: "10 rondas por tiempo: 10 thrusters (95 lb).",
    blocks: [
      { kind: "rounds", rounds: 10, items: [
        { name: "Thruster", detail: "95 lb", reps: 10 }
      ]}
    ]
  },
  {
    id: "coffey", name: "Coffey", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 800 m de carrera, 50 sentadillas traseras, 50 press banca, 800 m de carrera, 35 press banca, 800 m de carrera, 20 sentadillas traseras, 20 press banca (95/135 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Sentadilla trasera", detail: "95 lb", reps: 50 },
        { name: "Press banca", detail: "95 lb", reps: 50 },
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Press banca", detail: "95 lb", reps: 35 },
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Sentadilla trasera", detail: "95 lb", reps: 20 },
        { name: "Press banca", detail: "95 lb", reps: 20 }
      ]}
    ]
  },
  {
    id: "collin", name: "Collin", category: "hero", type: "for-time", timeCap: null,
    description: "6 rondas por tiempo: carga de saco de arena 400 m, 12 push presses, 12 saltos al cajón, 12 sumo deadlift high pulls.",
    blocks: [
      { kind: "rounds", rounds: 6, items: [
        { name: "Carga saco arena 400 m", detail: "35 lb", reps: 1 },
        { name: "Push press", detail: "75 lb", reps: 12 },
        { name: "Salto al cajón", detail: "20 in", reps: 12 },
        { name: "Sumo deadlift high pull", detail: "65 lb", reps: 12 }
      ]}
    ]
  },
  {
    id: "crain", name: "Crain", category: "hero", type: "for-time", timeCap: null,
    description: "2 rondas por tiempo: 34 flexiones, sprint 50 yd, 34 pesos muertos, sprint, 34 saltos al cajón, 34 clean & jerk, sprint, 34 wall balls, sprint, 34 dominadas, sprint.",
    blocks: [
      { kind: "rounds", rounds: 2, items: [
        { name: "Flexiones", detail: "", reps: 34 },
        { name: "Sprint 50 yd", detail: "", reps: 1 },
        { name: "Peso muerto", detail: "95 lb", reps: 34 },
        { name: "Sprint 50 yd", detail: "", reps: 1 },
        { name: "Salto al cajón", detail: "24 in", reps: 34 },
        { name: "Clean & Jerk", detail: "65 lb", reps: 34 },
        { name: "Sprint 50 yd", detail: "", reps: 1 },
        { name: "Wall ball", detail: "14 lb", reps: 34 },
        { name: "Sprint 50 yd", detail: "", reps: 1 },
        { name: "Dominadas", detail: "", reps: 34 },
        { name: "Sprint 50 yd", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "dae-han", name: "Dae Han", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 800 m de carrera con barra vacía, 3 escaladas de cuerda, 12 thrusters (95/135 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Carrera 800 m con barra", detail: "", reps: 1 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 3 },
        { name: "Thruster", detail: "95 lb", reps: 12 }
      ]}
    ]
  },
  {
    id: "dallas-5", name: "Dallas 5", category: "hero", type: "for-time", timeCap: null,
    description: "5 minutos de burpees, 5 minutos de 7 pesos muertos + 7 saltos al cajón, 5 minutos de get-ups turcos, 5 minutos de 7 snatches, 5 minutos de remo (con descansos).",
    blocks: [
      { kind: "single", items: [
        { name: "Burpees (5 min)", detail: "", reps: 50 },
        { name: "Peso muerto + salto cajón (5 min)", detail: "105 lb", reps: 7 },
        { name: "Turkish get-up (5 min)", detail: "30 lb", reps: 5 },
        { name: "Snatch (5 min)", detail: "55 lb", reps: 7 },
        { name: "Remo (5 min)", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "daniel", name: "Daniel", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 50 dominadas, 400 m de carrera, 21 thrusters (95 lb), 800 m de carrera, 21 thrusters, 400 m de carrera, 50 dominadas.",
    blocks: [
      { kind: "single", items: [
        { name: "Dominadas", detail: "", reps: 50 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Thruster", detail: "95 lb", reps: 21 },
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Thruster", detail: "95 lb", reps: 21 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Dominadas", detail: "", reps: 50 }
      ]}
    ]
  },
  {
    id: "daniel-ray", name: "Daniel Ray", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: lunge en front-rack con dos kettlebells 25 ft, 9 dominadas estrictas, carry overhead 50 ft, 16 flexiones, carry front-rack 75 ft, 23 air squats, farmers carry 100 ft, 400 m de carrera.",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Lunge front-rack (2 KB)", detail: "35 lb", reps: 25 },
        { name: "Dominadas estrictas", detail: "", reps: 9 },
        { name: "Carry overhead 50 ft", detail: "35 lb", reps: 1 },
        { name: "Flexiones", detail: "", reps: 16 },
        { name: "Carry front-rack 75 ft", detail: "35 lb", reps: 1 },
        { name: "Air squats", detail: "", reps: 23 },
        { name: "Farmers carry 100 ft", detail: "35 lb", reps: 1 },
        { name: "Carrera 400 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "danny", name: "Danny", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 30 saltos al cajón, 20 push presses, 30 dominadas.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Salto al cajón", detail: "24 in", reps: 30 },
        { name: "Push press", detail: "115 lb", reps: 20 },
        { name: "Dominadas", detail: "", reps: 30 }
      ]}
    ]
  },
  {
    id: "del", name: "Del", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 25 burpees, 400 m de carrera con balón medicinal, 25 dominadas lastradas, 400 m con balón, 400 m con balón, 25 chest-to-bar, 400 m con balón, 25 burpees.",
    blocks: [
      { kind: "single", items: [
        { name: "Burpees", detail: "", reps: 25 },
        { name: "Carrera 400 m (balón)", detail: "14 lb", reps: 1 },
        { name: "Dominadas lastradas", detail: "15 lb", reps: 25 },
        { name: "Carrera 400 m (balón)", detail: "14 lb", reps: 1 },
        { name: "Carrera 400 m (balón)", detail: "14 lb", reps: 1 },
        { name: "Chest-to-bar", detail: "", reps: 25 },
        { name: "Carrera 400 m (balón)", detail: "14 lb", reps: 1 },
        { name: "Burpees", detail: "", reps: 25 }
      ]}
    ]
  },
  {
    id: "desforges", name: "Desforges", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 12 clean & jerks, 20 rodillas al pecho, 20 dominadas (95/135 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Clean & Jerk", detail: "95 lb", reps: 12 },
        { name: "Rodillas al pecho", detail: "", reps: 20 },
        { name: "Dominadas", detail: "", reps: 20 }
      ]}
    ]
  },
  {
    id: "dg", name: "DG", category: "hero", type: "amrap", timeCap: 10 * 60,
    description: "AMRAP 10 min: 8 DB thrusters, 12 zancadas con mancuernas (20/35 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "DB thruster", detail: "20 lb", reps: 8 },
        { name: "Zancadas con mancuernas", detail: "20 lb", reps: 12 }
      ]}
    ]
  },
  {
    id: "dobogai", name: "Dobogai", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 8 muscle-ups, 22 yd farmers carry (35/50 lb).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Muscle-up", detail: "", reps: 8 },
        { name: "Farmers carry 22 yd", detail: "35 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "donny", name: "Donny", category: "hero", type: "for-time", timeCap: null,
    description: "21-15-9-9-15-21 de pesos muertos y burpees (155/225 lb).",
    blocks: [
      { kind: "rounds", rounds: [21, 15, 9, 9, 15, 21], items: [
        { name: "Peso muerto", detail: "155 lb", reps: null },
        { name: "Burpees", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "dork", name: "Dork", category: "hero", type: "for-time", timeCap: null,
    description: "6 rondas por tiempo: 60 dobles saltos, 30 KB swings, 15 burpees (53 lb).",
    blocks: [
      { kind: "rounds", rounds: 6, items: [
        { name: "Dobles saltos", detail: "", reps: 60 },
        { name: "KB swing", detail: "53 lb", reps: 30 },
        { name: "Burpees", detail: "", reps: 15 }
      ]}
    ]
  },
  {
    id: "dragon", name: "Dragon", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: carrera 5K, 4 min para hallar 4RM de peso muerto, carrera 5K, 4 min para hallar 4RM de push jerk.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 5K", detail: "", reps: 1 },
        { name: "Peso muerto 4RM", detail: "", reps: 4 },
        { name: "Carrera 5K", detail: "", reps: 1 },
        { name: "Push jerk 4RM", detail: "", reps: 4 }
      ]}
    ]
  },
  {
    id: "drew", name: "Drew", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo con chaleco: series de carrera, dominadas y flexiones en honor a cada héroe del accidente (Kraus, Scott, Good, Cully, Night Stalkers).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 200-800 m", detail: "chaleco", reps: 1 },
        { name: "Dominadas", detail: "", reps: 30 },
        { name: "Flexiones", detail: "", reps: 30 },
        { name: "Peso muerto", detail: "1.5×PC", reps: 4 }
      ]}
    ]
  },
  {
    id: "dt", name: "DT", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 12 pesos muertos, 9 hang power cleans, 6 push jerks (70/50 kg).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Peso muerto", detail: "70/50 kg", reps: 12 },
        { name: "Hang power clean", detail: "70/50 kg", reps: 9 },
        { name: "Push jerk", detail: "70/50 kg", reps: 6 }
      ]}
    ]
  },
  {
    id: "dunn", name: "Dunn", category: "hero", type: "amrap", timeCap: 19 * 60,
    description: "AMRAP 19 min: 3 muscle-ups, 1 sprint shuttle (5-10-15 yd), 6 burpee box jump-overs (20 in).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Muscle-up", detail: "", reps: 3 },
        { name: "Sprint shuttle", detail: "", reps: 1 },
        { name: "Burpee box jump-over", detail: "20 in", reps: 6 }
      ]}
    ]
  },
  {
    id: "dvb", name: "DVB", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: carrera de 1 milla con balón medicinal, luego 8 rondas de 10 wall balls + 1 escalada de cuerda + 800 m con balón, y 4 rondas de 10 wall balls + 1 escalada de cuerda.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1 milla (balón)", detail: "14 lb", reps: 1 },
        { name: "Wall ball", detail: "14 lb", reps: 80 },
        { name: "Escalada de cuerda", detail: "", reps: 8 },
        { name: "Carrera 800 m (balón)", detail: "14 lb", reps: 1 },
        { name: "Wall ball", detail: "14 lb", reps: 40 },
        { name: "Escalada de cuerda", detail: "", reps: 4 }
      ]}
    ]
  },
  {
    id: "emily", name: "Emily", category: "hero", type: "for-time", timeCap: null,
    description: "10 rondas por tiempo: 30 dobles saltos, 15 dominadas, 30 air squats, sprint 100 m.",
    blocks: [
      { kind: "rounds", rounds: 10, items: [
        { name: "Dobles saltos", detail: "", reps: 30 },
        { name: "Dominadas", detail: "", reps: 15 },
        { name: "Air squats", detail: "", reps: 30 },
        { name: "Sprint 100 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "erin", name: "Erin", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 15 dumbbell split cleans y 21 dominadas (30/40 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "DB split clean", detail: "30 lb", reps: 15 },
        { name: "Dominadas", detail: "", reps: 21 }
      ]}
    ]
  },
  {
    id: "estrada", name: "Estrada", category: "hero", type: "for-time", timeCap: null,
    description: "100 box step-ups con mochila lastrada, luego 3 rondas de 800 m de carrera, 17 cal bici y 25 sentadillas frontales.",
    blocks: [
      { kind: "single", items: [
        { name: "Box step-up (mochila)", detail: "35 lb", reps: 100 },
        { name: "Carrera 800 m", detail: "", reps: 3 },
        { name: "Bici 17 cal", detail: "", reps: 3 },
        { name: "Sentadilla frontal", detail: "135 lb", reps: 75 }
      ]}
    ]
  },
  {
    id: "eva-strong", name: "Eva Strong", category: "hero", type: "for-time", timeCap: null,
    description: "En pareja, 5 rondas por tiempo: 24 dobles saltos (cada uno), 19 toes-to-bar (total), 2 clean & jerk (total), 400 m de carrera juntos (135/205 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Dobles saltos (cada uno)", detail: "", reps: 24 },
        { name: "Toes-to-bar (total)", detail: "", reps: 19 },
        { name: "Clean & Jerk (total)", detail: "135 lb", reps: 2 },
        { name: "Carrera 400 m (juntos)", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "falkel", name: "Falkel", category: "hero", type: "amrap", timeCap: 25 * 60,
    description: "AMRAP 25 min: 8 flexiones pino, 8 saltos al cajón, 1 escalada de cuerda (24 in).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Flexiones pino (HSPU)", detail: "", reps: 8 },
        { name: "Salto al cajón", detail: "24 in", reps: 8 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 1 }
      ]}
    ]
  },
  {
    id: "feeks", name: "Feeks", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: sprints shuttle 2-4-6-8-10-12-14-16 (100 m) con DB squat clean thrusters (45/65 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Sprint shuttle 100 m", detail: "", reps: 2 },
        { name: "DB squat clean thruster", detail: "45 lb", reps: 2 },
        { name: "Sprint shuttle 100 m", detail: "", reps: 4 },
        { name: "DB squat clean thruster", detail: "45 lb", reps: 4 },
        { name: "Sprint shuttle 100 m", detail: "", reps: 6 },
        { name: "DB squat clean thruster", detail: "45 lb", reps: 6 }
      ]}
    ]
  },
  {
    id: "fern", name: "Fern", category: "hero", type: "for-time", timeCap: null,
    description: "Con tope de 60 min: 2 millas de carrera, 9 rondas de 20 cal remo + 20 burpees, 3 rondas de 30 flexiones + 30 dominadas + 30 burpees (con chaleco).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 2 millas", detail: "", reps: 1 },
        { name: "Remo 20 cal", detail: "", reps: 9 },
        { name: "Burpees", detail: "", reps: 180 },
        { name: "Flexiones", detail: "", reps: 90 },
        { name: "Dominadas", detail: "", reps: 90 }
      ]}
    ]
  },
  {
    id: "finseth", name: "Finseth", category: "hero", type: "amrap", timeCap: 18 * 60,
    description: "En 18 min: 83 wall balls, luego AMRAP de 2 power cleans, 18 flexiones, 24 dobles saltos (125/185 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Wall ball", detail: "14 lb", reps: 83 },
        { name: "Power clean", detail: "125 lb", reps: 2 },
        { name: "Flexiones", detail: "", reps: 18 },
        { name: "Dobles saltos", detail: "", reps: 24 }
      ]}
    ]
  },
  {
    id: "foo", name: "Foo", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 13 press banca; luego AMRAP 20 min de 7 chest-to-bar, 77 dobles saltos, 2 squat clean thrusters, 28 abdominales (110/170 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Press banca", detail: "110 lb", reps: 13 },
        { name: "Chest-to-bar", detail: "", reps: 70 },
        { name: "Dobles saltos", detail: "", reps: 770 },
        { name: "Squat clean thruster", detail: "110 lb", reps: 20 },
        { name: "Abdominales", detail: "", reps: 280 }
      ]}
    ]
  },
  {
    id: "forrest", name: "Forrest", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 20 L pull-ups, 30 toes-to-bar, 40 burpees, 800 m de carrera.",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "L pull-ups", detail: "", reps: 20 },
        { name: "Toes-to-bar", detail: "", reps: 30 },
        { name: "Burpees", detail: "", reps: 40 },
        { name: "Carrera 800 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "fournier", name: "Fournier", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 50 shoulder-to-overhead, 50 ft arm-over-arm sled pull, 40 burpees, 50 ft sled pull, 50 ft sled pull, 55 lb sumo deadlift high pull.",
    blocks: [
      { kind: "single", items: [
        { name: "Shoulder-to-overhead", detail: "115 lb", reps: 50 },
        { name: "Arm-over-arm sled pull", detail: "", reps: 1 },
        { name: "Burpees", detail: "", reps: 40 },
        { name: "Sumo deadlift high pull", detail: "85 lb", reps: 55 }
      ]}
    ]
  },
  {
    id: "gale-force", name: "Gale Force", category: "hero", type: "amrap", timeCap: 30 * 60,
    description: "AMRAP 30 min: 20 box step-ups con mochila, 23 burpees sobre la mochila, 19 air squats (35/50 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Box step-up (mochila)", detail: "35 lb", reps: 20 },
        { name: "Burpees sobre mochila", detail: "", reps: 23 },
        { name: "Air squats", detail: "", reps: 19 }
      ]}
    ]
  },
  {
    id: "gallant", name: "Gallant", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1 milla con balón medicinal, 60 burpee pull-ups, 800 m con balón, 30 burpee pull-ups, 400 m con balón, 15 burpee pull-ups.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1 milla (balón)", detail: "14 lb", reps: 1 },
        { name: "Burpee pull-ups", detail: "", reps: 60 },
        { name: "Carrera 800 m (balón)", detail: "14 lb", reps: 1 },
        { name: "Burpee pull-ups", detail: "", reps: 30 },
        { name: "Carrera 400 m (balón)", detail: "14 lb", reps: 1 },
        { name: "Burpee pull-ups", detail: "", reps: 15 }
      ]}
    ]
  },
  {
    id: "garbo", name: "Garbo", category: "hero", type: "amrap", timeCap: 21 * 60,
    description: "En 21 min: 400 m de carrera, luego AMRAP de 10 flexiones, 4 dominadas estrictas, 20 KB swings, 10 goblet squats (35/53 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 10 },
        { name: "Dominadas estrictas", detail: "", reps: 4 },
        { name: "KB swing", detail: "35 lb", reps: 20 },
        { name: "KB goblet squat", detail: "35 lb", reps: 10 }
      ]}
    ]
  },
  {
    id: "garrett", name: "Garrett", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 75 air squats, 25 ring handstand push-ups.",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Air squats", detail: "", reps: 75 },
        { name: "Ring handstand push-ups", detail: "", reps: 25 }
      ]}
    ]
  },
  {
    id: "gator", name: "Gator", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 5 sentadillas frontales, 26 ring push-ups, 5 sentadillas frontales, 26 ring push-ups (125/185 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Sentadilla frontal", detail: "125 lb", reps: 5 },
        { name: "Ring push-ups", detail: "", reps: 26 },
        { name: "Sentadilla frontal", detail: "125 lb", reps: 5 },
        { name: "Ring push-ups", detail: "", reps: 26 }
      ]}
    ]
  },
  {
    id: "gaza", name: "Gaza", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 35 KB swings, 30 flexiones, 25 dominadas, 20 saltos al cajón, 1 milla de carrera (53 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "KB swing", detail: "53 lb", reps: 35 },
        { name: "Flexiones", detail: "", reps: 30 },
        { name: "Dominadas", detail: "", reps: 25 },
        { name: "Salto al cajón", detail: "30 in", reps: 20 },
        { name: "Carrera 1 milla", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "glen", name: "Glen", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 30 clean & jerks, 10 escaladas de cuerda, 100 burpees (95/135 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Clean & Jerk", detail: "95 lb", reps: 30 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 10 },
        { name: "Burpees", detail: "", reps: 100 }
      ]}
    ]
  },
  {
    id: "goose", name: "Goose", category: "hero", type: "for-time", timeCap: null,
    description: "En pareja: 106 pesos muertos, 7 rondas de 3 escaladas de cuerda + 15 thrusters + 15 KB swings, y 400 m de carrera con placa.",
    blocks: [
      { kind: "single", items: [
        { name: "Peso muerto", detail: "95 lb", reps: 106 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 21 },
        { name: "Thruster", detail: "95 lb", reps: 105 },
        { name: "KB swing", detail: "53 lb", reps: 105 },
        { name: "Carrera 400 m (placa)", detail: "25 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "griff", name: "Griff", category: "hero", type: "for-time", timeCap: null,
    description: "2 rondas por tiempo: 800 m de carrera y 400 m de carrera hacia atrás.",
    blocks: [
      { kind: "rounds", rounds: 2, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Carrera 400 m hacia atrás", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "hall", name: "Hall", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 3 cleans, 200 m sprint, 20 KB snatches (10 por brazo); descanso 2 min entre rondas.",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Clean", detail: "225 lb", reps: 3 },
        { name: "Sprint 200 m", detail: "", reps: 1 },
        { name: "KB snatch", detail: "53 lb", reps: 20 }
      ]}
    ]
  },
  {
    id: "hamilton", name: "Hamilton", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: remo 1000 m, 50 flexiones, 1000 m de carrera, 50 dominadas.",
    blocks: [
      { kind: "single", items: [
        { name: "Remo 1000 m", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 50 },
        { name: "Carrera 1000 m", detail: "", reps: 1 },
        { name: "Dominadas", detail: "", reps: 50 }
      ]}
    ]
  },
  {
    id: "hammer", name: "Hammer", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas, cada una por tiempo: 5 power cleans, 5 jerks, 20 dominadas; descanso 90 s entre rondas (95/135 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Power clean", detail: "95 lb", reps: 5 },
        { name: "Jerk", detail: "95 lb", reps: 5 },
        { name: "Dominadas", detail: "", reps: 20 }
      ]}
    ]
  },
  {
    id: "hammy", name: "Hammy", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1200 m de carrera, 80 box step-overs, 40 flexiones, 800 m de carrera, 40 burpees to target, 20 dominadas estrictas, 400 m de carrera, 20 burpee box jumps, 10 ring muscle-ups.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1200 m", detail: "", reps: 1 },
        { name: "Box step-over", detail: "20 in", reps: 80 },
        { name: "Flexiones", detail: "", reps: 40 },
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Burpees to target", detail: "", reps: 40 },
        { name: "Dominadas estrictas", detail: "", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Burpee box jumps", detail: "20 in", reps: 20 },
        { name: "Ring muscle-ups", detail: "", reps: 10 }
      ]}
    ]
  },
  {
    id: "hansen", name: "Hansen", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 30 KB swings, 30 burpees, 30 GHD sit-ups (53/70 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "KB swing", detail: "53 lb", reps: 30 },
        { name: "Burpees", detail: "", reps: 30 },
        { name: "GHD sit-ups", detail: "", reps: 30 }
      ]}
    ]
  },
  {
    id: "harper", name: "Harper", category: "hero", type: "amrap", timeCap: 23 * 60,
    description: "AMRAP 23 min: 9 chest-to-bar, 15 power cleans, 21 air squats (135 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Chest-to-bar", detail: "", reps: 9 },
        { name: "Power clean", detail: "135 lb", reps: 15 },
        { name: "Air squats", detail: "", reps: 21 }
      ]}
    ]
  },
  {
    id: "havana", name: "Havana", category: "hero", type: "amrap", timeCap: 25 * 60,
    description: "AMRAP 25 min: 150 dobles saltos, 50 flexiones, 15 power cleans.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Dobles saltos", detail: "", reps: 150 },
        { name: "Flexiones", detail: "", reps: 50 },
        { name: "Power clean", detail: "135 lb", reps: 15 }
      ]}
    ]
  },
  {
    id: "helton", name: "Helton", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 800 m de carrera, 30 DB squat cleans, 30 burpees (35/50 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "DB squat clean", detail: "35 lb", reps: 30 },
        { name: "Burpees", detail: "", reps: 30 }
      ]}
    ]
  },
  {
    id: "hidalgo", name: "Hidalgo", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 2 millas de carrera, descanso 2 min, 20 squat cleans, 20 saltos al cajón, 20 zancadas overhead, 20 saltos al cajón, descanso 2 min.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 2 millas", detail: "", reps: 1 },
        { name: "Squat clean", detail: "95 lb", reps: 20 },
        { name: "Salto al cajón", detail: "20 in", reps: 20 },
        { name: "Zancadas overhead", detail: "95 lb", reps: 20 },
        { name: "Salto al cajón", detail: "20 in", reps: 20 }
      ]}
    ]
  },
  {
    id: "hildy", name: "Hildy", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 100 cal remo, 75 thrusters, 50 dominadas, 75 wall balls, 100 cal remo (35/45 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Remo 100 cal", detail: "", reps: 1 },
        { name: "Thruster", detail: "35 lb", reps: 75 },
        { name: "Dominadas", detail: "", reps: 50 },
        { name: "Wall ball", detail: "14 lb", reps: 75 },
        { name: "Remo 100 cal", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "holbrook", name: "Holbrook", category: "hero", type: "for-time", timeCap: null,
    description: "10 rondas, cada una por tiempo: 5 thrusters, 10 dominadas, sprint 100 m; descanso 1 min entre rondas (75/115 lb).",
    blocks: [
      { kind: "rounds", rounds: 10, items: [
        { name: "Thruster", detail: "75 lb", reps: 5 },
        { name: "Dominadas", detail: "", reps: 10 },
        { name: "Sprint 100 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "holleyman", name: "Holleyman", category: "hero", type: "for-time", timeCap: null,
    description: "30 rondas por tiempo: 5 wall balls, 3 HSPU, 1 power clean (155/225 lb).",
    blocks: [
      { kind: "rounds", rounds: 30, items: [
        { name: "Wall ball", detail: "14 lb", reps: 5 },
        { name: "Flexiones pino (HSPU)", detail: "", reps: 3 },
        { name: "Power clean", detail: "155 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "hollywood", name: "Hollywood", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 2000 m de carrera, 22 wall balls, 22 muscle-ups, 22 wall balls, 22 power cleans, 22 wall balls (125 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 2000 m", detail: "", reps: 1 },
        { name: "Wall ball", detail: "20 lb", reps: 22 },
        { name: "Muscle-up", detail: "", reps: 22 },
        { name: "Wall ball", detail: "20 lb", reps: 22 },
        { name: "Power clean", detail: "125 lb", reps: 22 },
        { name: "Wall ball", detail: "20 lb", reps: 22 }
      ]}
    ]
  },
  {
    id: "hoover", name: "Hoover", category: "hero", type: "for-time", timeCap: null,
    description: "8 rondas por tiempo: 400 m de carrera, 15 burpee box jump-overs, 10 cal bici, 6 DB snatches alternos (50/75 lb).",
    blocks: [
      { kind: "rounds", rounds: 8, items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Burpee box jump-over", detail: "20 in", reps: 15 },
        { name: "Bici 10 cal", detail: "", reps: 1 },
        { name: "DB snatch alterno", detail: "50 lb", reps: 6 }
      ]}
    ]
  },
  {
    id: "hortman", name: "Hortman", category: "hero", type: "amrap", timeCap: 45 * 60,
    description: "AMRAP 45 min: 800 m de carrera, 80 air squats, 8 muscle-ups.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Air squats", detail: "", reps: 80 },
        { name: "Muscle-up", detail: "", reps: 8 }
      ]}
    ]
  },
  {
    id: "horton", name: "Horton", category: "hero", type: "for-time", timeCap: null,
    description: "En pareja, 9 rondas por tiempo: 9 bar muscle-ups, 11 clean & jerks (105/155 lb), 50 yd buddy carry.",
    blocks: [
      { kind: "rounds", rounds: 9, items: [
        { name: "Bar muscle-up", detail: "", reps: 9 },
        { name: "Clean & Jerk", detail: "105 lb", reps: 11 },
        { name: "Buddy carry 50 yd", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "hotshots-19", name: "Hotshots 19", category: "hero", type: "for-time", timeCap: null,
    description: "6 rondas por tiempo: 30 air squats, 19 power cleans, 7 dominadas estrictas, 400 m de carrera (135 lb).",
    blocks: [
      { kind: "rounds", rounds: 6, items: [
        { name: "Air squats", detail: "", reps: 30 },
        { name: "Power clean", detail: "135 lb", reps: 19 },
        { name: "Dominadas estrictas", detail: "", reps: 7 },
        { name: "Carrera 400 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "j-j", name: "J.J.", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1 squat clean, 10 parallette HSPU, 2 squat cleans, 9 HSPU, ... 10 squat cleans, 1 HSPU (125/185 lb).",
    blocks: [
      { kind: "rounds", rounds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], items: [
        { name: "Squat clean", detail: "125 lb", reps: null },
        { name: "Parallette HSPU", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "jack", name: "Jack", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 10 push presses, 10 KB swings, 10 saltos al cajón (75/115 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Push press", detail: "75 lb", reps: 10 },
        { name: "KB swing", detail: "35 lb", reps: 10 },
        { name: "Salto al cajón", detail: "20 in", reps: 10 }
      ]}
    ]
  },
  {
    id: "jack-s-triangle", name: "Jack's Triangle", category: "hero", type: "for-time", timeCap: null,
    description: "En 23 min por reps totales: 0-2 min max pesos muertos, 2-21 min AMRAP de 4 dominadas estrictas + 11 saltos al cajón + 13 flexiones + 23 cal bici, 21-23 min max pesos muertos.",
    blocks: [
      { kind: "single", items: [
        { name: "Peso muerto (0-2 min)", detail: "155 lb", reps: 20 },
        { name: "Dominadas estrictas", detail: "", reps: 4 },
        { name: "Salto al cajón", detail: "24 in", reps: 11 },
        { name: "Flexiones", detail: "", reps: 13 },
        { name: "Bici 23 cal", detail: "", reps: 1 },
        { name: "Peso muerto (21-23 min)", detail: "155 lb", reps: 20 }
      ]}
    ]
  },
  {
    id: "jag-28", name: "Jag 28", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 800 m de carrera, 28 KB swings, 28 dominadas estrictas, 28 KB clean & jerks, 28 dominadas estrictas (53/70 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "KB swing", detail: "53 lb", reps: 28 },
        { name: "Dominadas estrictas", detail: "", reps: 28 },
        { name: "KB clean & jerk", detail: "53 lb", reps: 28 },
        { name: "Dominadas estrictas", detail: "", reps: 28 }
      ]}
    ]
  },
  {
    id: "jared", name: "Jared", category: "hero", type: "for-time", timeCap: null,
    description: "4 rondas por tiempo: 800 m de carrera, 40 dominadas, 70 flexiones.",
    blocks: [
      { kind: "rounds", rounds: 4, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Dominadas", detail: "", reps: 40 },
        { name: "Flexiones", detail: "", reps: 70 }
      ]}
    ]
  },
  {
    id: "jason", name: "Jason", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 100 air squats, 5 muscle-ups, 75 air squats, 10 muscle-ups, 50 air squats, 15 muscle-ups, 25 air squats, 20 muscle-ups.",
    blocks: [
      { kind: "single", items: [
        { name: "Air squats", detail: "", reps: 100 },
        { name: "Muscle-up", detail: "", reps: 5 },
        { name: "Air squats", detail: "", reps: 75 },
        { name: "Muscle-up", detail: "", reps: 10 },
        { name: "Air squats", detail: "", reps: 50 },
        { name: "Muscle-up", detail: "", reps: 15 },
        { name: "Air squats", detail: "", reps: 25 },
        { name: "Muscle-up", detail: "", reps: 20 }
      ]}
    ]
  },
  {
    id: "jbo", name: "JBo", category: "hero", type: "amrap", timeCap: 28 * 60,
    description: "AMRAP 28 min: 1 escalada de cuerda sin piernas (desde sentado), 12 press banca (75/115 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Escalada de cuerda (sin piernas)", detail: "15 ft", reps: 1 },
        { name: "Press banca", detail: "75 lb", reps: 12 }
      ]}
    ]
  },
  {
    id: "jenny", name: "Jenny", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 20 sentadillas overhead, 20 sentadillas traseras, 400 m de carrera (35/45 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Sentadilla overhead", detail: "35 lb", reps: 20 },
        { name: "Sentadilla trasera", detail: "35 lb", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "jennifer", name: "Jennifer", category: "hero", type: "amrap", timeCap: 26 * 60,
    description: "AMRAP 26 min: 10 dominadas, 15 KB swings, 20 saltos al cajón (35 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Dominadas", detail: "", reps: 10 },
        { name: "KB swing", detail: "35 lb", reps: 15 },
        { name: "Salto al cajón", detail: "20 in", reps: 20 }
      ]}
    ]
  },
  {
    id: "jerry", name: "Jerry", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1 milla de carrera, remo 2K, 1 milla de carrera.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1 milla", detail: "", reps: 1 },
        { name: "Remo 2K", detail: "", reps: 1 },
        { name: "Carrera 1 milla", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "johnson", name: "Johnson", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 9 pesos muertos, 8 muscle-ups, 9 squat cleans (165/245 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Peso muerto", detail: "165 lb", reps: 9 },
        { name: "Muscle-up", detail: "", reps: 8 },
        { name: "Squat clean", detail: "105 lb", reps: 9 }
      ]}
    ]
  },
  {
    id: "jonathon-farmer", name: "Jonathon Farmer", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: remo 1500 m, 2 rondas de 53 flexiones + 11 dominadas + 5 press militar, 100 m farmers carry, 50 m sled push, sprint 300 m, remo 1500 m.",
    blocks: [
      { kind: "single", items: [
        { name: "Remo 1500 m", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 106 },
        { name: "Dominadas", detail: "", reps: 22 },
        { name: "Press militar", detail: "95 lb", reps: 10 },
        { name: "Farmers carry 100 m", detail: "35 lb", reps: 1 },
        { name: "Sled push 50 m", detail: "45 lb", reps: 1 },
        { name: "Sprint 300 m", detail: "", reps: 1 },
        { name: "Remo 1500 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "jorge", name: "Jorge", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 30 GHD sit-ups, 24 GHD sit-ups, 12 squat cleans, 9 squat cleans, 12 GHD sit-ups, 6 squat cleans, 6 GHD sit-ups, 3 squat cleans (155 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "GHD sit-ups", detail: "", reps: 30 },
        { name: "GHD sit-ups", detail: "", reps: 24 },
        { name: "Squat clean", detail: "155 lb", reps: 12 },
        { name: "Squat clean", detail: "155 lb", reps: 9 },
        { name: "GHD sit-ups", detail: "", reps: 12 },
        { name: "Squat clean", detail: "155 lb", reps: 6 },
        { name: "GHD sit-ups", detail: "", reps: 6 },
        { name: "Squat clean", detail: "155 lb", reps: 3 }
      ]}
    ]
  },
  {
    id: "josh", name: "Josh", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 21 sentadillas overhead, 42 dominadas, 15 sentadillas overhead, 30 dominadas, 9 sentadillas overhead, 18 dominadas (95 lb).",
    blocks: [
      { kind: "rounds", rounds: [21, 15, 9], items: [
        { name: "Sentadilla overhead", detail: "95 lb", reps: null },
        { name: "Dominadas", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "joshie", name: "Joshie", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 21 DB snatches (brazo der.), 21 DB snatches (brazo izq.), 21 L pull-ups (25/40 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "DB snatch (der.)", detail: "25 lb", reps: 21 },
        { name: "DB snatch (izq.)", detail: "25 lb", reps: 21 },
        { name: "L pull-ups", detail: "", reps: 21 }
      ]}
    ]
  },
  {
    id: "josh-o", name: "Josh-O", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 100 thrusters, 100 chest-to-bar, carrera de 6 millas (particionable) (95/135 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Thruster", detail: "95 lb", reps: 100 },
        { name: "Chest-to-bar", detail: "", reps: 100 },
        { name: "Carrera 6 millas", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "jt", name: "JT", category: "hero", type: "for-time", timeCap: null,
    description: "21-15-9 de flexiones pino, fondos en anillas y flexiones, por tiempo.",
    blocks: [
      { kind: "rounds", rounds: [21, 15, 9], items: [
        { name: "Flexiones pino (HSPU)", detail: "", reps: null },
        { name: "Fondos en anillas", detail: "", reps: null },
        { name: "Flexiones", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "justin", name: "Justin", category: "hero", type: "for-time", timeCap: null,
    description: "30-20-10 de sentadillas traseras y press banca con peso corporal.",
    blocks: [
      { kind: "rounds", rounds: [30, 20, 10], items: [
        { name: "Sentadilla trasera (peso corporal)", detail: "", reps: null },
        { name: "Press banca (peso corporal)", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "k27", name: "K27", category: "hero", type: "for-time", timeCap: null,
    description: "27 rondas por tiempo: 5 hang power cleans, 5 burpees, 15 dobles saltos (105/185 lb).",
    blocks: [
      { kind: "rounds", rounds: 27, items: [
        { name: "Hang power clean", detail: "105 lb", reps: 5 },
        { name: "Burpees", detail: "", reps: 5 },
        { name: "Dobles saltos", detail: "", reps: 15 }
      ]}
    ]
  },
  {
    id: "kelly-brown", name: "Kelly Brown", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: remo 440 m, 10 saltos al cajón, 10 pesos muertos, 10 wall balls.",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Remo 440 m", detail: "", reps: 1 },
        { name: "Salto al cajón", detail: "24 in", reps: 10 },
        { name: "Peso muerto", detail: "185 lb", reps: 10 },
        { name: "Wall ball", detail: "20 lb", reps: 10 }
      ]}
    ]
  },
  {
    id: "kev", name: "Kev", category: "hero", type: "amrap", timeCap: 26 * 60,
    description: "En pareja, AMRAP 26 min: 6 pesos muertos, 9 burpees sincronizados, 9 bar muscle-ups, 55 ft partner barbell carry.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Peso muerto", detail: "205 lb", reps: 6 },
        { name: "Burpees sincronizados", detail: "", reps: 9 },
        { name: "Bar muscle-up", detail: "", reps: 9 },
        { name: "Partner barbell carry 55 ft", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "kevin", name: "Kevin", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 32 pesos muertos, 32 hanging hip touches (alternando brazos), 800 m farmers carry (185 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Peso muerto", detail: "185 lb", reps: 32 },
        { name: "Hanging hip touches", detail: "", reps: 32 },
        { name: "Farmers carry 800 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "klepto", name: "Klepto", category: "hero", type: "for-time", timeCap: null,
    description: "4 rondas por tiempo: 27 saltos al cajón, 20 burpees, 11 squat cleans (95 lb).",
    blocks: [
      { kind: "rounds", rounds: 4, items: [
        { name: "Salto al cajón", detail: "20 in", reps: 27 },
        { name: "Burpees", detail: "", reps: 20 },
        { name: "Squat clean", detail: "95 lb", reps: 11 }
      ]}
    ]
  },
  {
    id: "kutschbach", name: "Kutschbach", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 11 sentadillas traseras, 10 jerks (125/185 lb).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Sentadilla trasera", detail: "125 lb", reps: 11 },
        { name: "Jerk", detail: "95 lb", reps: 10 }
      ]}
    ]
  },
  {
    id: "larry", name: "Larry", category: "hero", type: "for-time", timeCap: null,
    description: "21-18-15-12-9-6-3 de sentadillas frontales con saco de arena (75/115 lb).",
    blocks: [
      { kind: "rounds", rounds: [21, 18, 15, 12, 9, 6, 3], items: [
        { name: "Sentadilla frontal (saco arena)", detail: "75 lb", reps: null }
      ]}
    ]
  },
  {
    id: "laura", name: "Laura", category: "hero", type: "amrap", timeCap: 21 * 60,
    description: "En pareja, AMRAP 21 min: 30 cal remo, 20 burpees sobre el remo, 10 power cleans (105 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Remo 30 cal", detail: "", reps: 1 },
        { name: "Burpees sobre el remo", detail: "", reps: 20 },
        { name: "Power clean", detail: "105 lb", reps: 10 }
      ]}
    ]
  },
  {
    id: "ledesma", name: "Ledesma", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 5 parallette HSPU, 10 toes-to-rings, 15 medicine ball cleans.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Parallette HSPU", detail: "", reps: 5 },
        { name: "Toes-to-rings", detail: "", reps: 10 },
        { name: "Medicine ball clean", detail: "14 lb", reps: 15 }
      ]}
    ]
  },
  {
    id: "lee", name: "Lee", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 400 m de carrera, 1 peso muerto, 3 squat cleans, 3 muscle-ups, 1 escalada de cuerda (225/345 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Peso muerto", detail: "225 lb", reps: 1 },
        { name: "Squat clean", detail: "125 lb", reps: 3 },
        { name: "Muscle-up", detail: "", reps: 3 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 1 }
      ]}
    ]
  },
  {
    id: "leehan", name: "Leehan", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 6 pesos muertos, 6 air squats, 6 saltos al cajón, sumando 6 reps a cada movimiento cada ronda; luego remo 1742 m.",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Peso muerto", detail: "125 lb", reps: 6 },
        { name: "Air squats", detail: "", reps: 6 },
        { name: "Salto al cajón", detail: "20 in", reps: 6 },
        { name: "Remo 1742 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "liam", name: "Liam", category: "hero", type: "for-time", timeCap: null,
    description: "800 m de carrera con placa, 100 toes-to-bar, 10 escaladas de cuerda, 800 m con placa (particionable) (25/45 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 800 m (placa)", detail: "25 lb", reps: 1 },
        { name: "Toes-to-bar", detail: "", reps: 100 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 10 },
        { name: "Carrera 800 m (placa)", detail: "25 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "locke", name: "Locke", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: remo/carrera 565 m, 60 burpee box jump-overs, 7 rondas de 9 pesos muertos + 25 flexiones + 21 box step-ups, remo/carrera 565 m (125/185 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Remo/carrera 565 m", detail: "", reps: 1 },
        { name: "Burpee box jump-over", detail: "20 in", reps: 60 },
        { name: "Peso muerto", detail: "125 lb", reps: 63 },
        { name: "Flexiones", detail: "", reps: 175 },
        { name: "Box step-up", detail: "20 in", reps: 147 },
        { name: "Remo/carrera 565 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "loredo", name: "Loredo", category: "hero", type: "for-time", timeCap: null,
    description: "6 rondas por tiempo: 24 air squats, 24 flexiones, 24 zancadas, 400 m de carrera.",
    blocks: [
      { kind: "rounds", rounds: 6, items: [
        { name: "Air squats", detail: "", reps: 24 },
        { name: "Flexiones", detail: "", reps: 24 },
        { name: "Zancadas", detail: "", reps: 24 },
        { name: "Carrera 400 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "lorenzo", name: "Lorenzo", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1000 m de carrera, 5 rondas de 15 flexiones + 20 medicine ball cleans + 21 burpees, 1000 m de carrera.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1000 m", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 75 },
        { name: "Medicine ball clean", detail: "14 lb", reps: 100 },
        { name: "Burpees", detail: "", reps: 105 },
        { name: "Carrera 1000 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "luce", name: "Luce", category: "hero", type: "for-time", timeCap: null,
    description: "Con chaleco: 1K de carrera, 10 muscle-ups, 100 air squats, 1K de carrera (14 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1K", detail: "chaleco 14 lb", reps: 1 },
        { name: "Muscle-up", detail: "", reps: 10 },
        { name: "Air squats", detail: "", reps: 100 },
        { name: "Carrera 1K", detail: "chaleco 14 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "luke", name: "Luke", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 400 m de carrera, 15 clean & jerks, 30 toes-to-bar, 400 m de carrera, 45 wall balls, 45 KB swings, 400 m de carrera, 30 ring dips, 400 m de carrera.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Clean & Jerk", detail: "105 lb", reps: 15 },
        { name: "Toes-to-bar", detail: "", reps: 30 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Wall ball", detail: "14 lb", reps: 45 },
        { name: "KB swing", detail: "35 lb", reps: 45 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Ring dips", detail: "", reps: 30 },
        { name: "Carrera 400 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "lumberjack-20", name: "Lumberjack 20", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 20 pesos muertos, 400 m de carrera, 20 KB swings, 400 m, 20 sentadillas overhead, 400 m, 20 burpees, 400 m, 20 chest-to-bar, 400 m, 20 saltos al cajón, 400 m, 20 DB squat cleans, 400 m.",
    blocks: [
      { kind: "single", items: [
        { name: "Peso muerto", detail: "185 lb", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "KB swing", detail: "53 lb", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Sentadilla overhead", detail: "75 lb", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Burpees", detail: "", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Chest-to-bar", detail: "", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Salto al cajón", detail: "24 in", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "DB squat clean", detail: "40 lb", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "maloney", name: "Maloney", category: "hero", type: "for-time", timeCap: null,
    description: "6 rondas por tiempo: shuttle run 300 m, 16 pesos muertos, 6 hang power cleans; descanso 2 min entre rondas (125/185 lb).",
    blocks: [
      { kind: "rounds", rounds: 6, items: [
        { name: "Shuttle run 300 m", detail: "", reps: 1 },
        { name: "Peso muerto", detail: "125 lb", reps: 16 },
        { name: "Hang power clean", detail: "125 lb", reps: 6 }
      ]}
    ]
  },
  {
    id: "manion", name: "Manion", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 400 m de carrera, 29 sentadillas traseras (95/135 lb).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Sentadilla trasera", detail: "95 lb", reps: 29 }
      ]}
    ]
  },
  {
    id: "manuel", name: "Manuel", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas de: 2 min de air squats, 2 min de flexiones, 3 min para correr 400 m (con chaleco).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Air squats (2 min)", detail: "", reps: 50 },
        { name: "Flexiones (2 min)", detail: "", reps: 50 },
        { name: "Carrera 400 m", detail: "chaleco", reps: 1 }
      ]}
    ]
  },
  {
    id: "marco", name: "Marco", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 21 dominadas, 15 HSPU, 9 thrusters (95/135 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Dominadas", detail: "", reps: 21 },
        { name: "Flexiones pino (HSPU)", detail: "", reps: 15 },
        { name: "Thruster", detail: "95 lb", reps: 9 }
      ]}
    ]
  },
  {
    id: "marston", name: "Marston", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 1 peso muerto, 10 toes-to-bar, 15 bar-facing burpees (275/405 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Peso muerto", detail: "275 lb", reps: 1 },
        { name: "Toes-to-bar", detail: "", reps: 10 },
        { name: "Bar-facing burpees", detail: "", reps: 15 }
      ]}
    ]
  },
  {
    id: "matt-16", name: "Matt 16", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 16 pesos muertos, 16 hang power cleans, 16 push presses, 800 m de carrera (×3) (275 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Peso muerto", detail: "275 lb", reps: 16 },
        { name: "Hang power clean", detail: "185 lb", reps: 16 },
        { name: "Push press", detail: "185 lb", reps: 16 },
        { name: "Carrera 800 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "maupin", name: "Maupin", category: "hero", type: "for-time", timeCap: null,
    description: "4 rondas por tiempo: 800 m de carrera, 49 flexiones, 49 abdominales, 49 air squats.",
    blocks: [
      { kind: "rounds", rounds: 4, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 49 },
        { name: "Abdominales", detail: "", reps: 49 },
        { name: "Air squats", detail: "", reps: 49 }
      ]}
    ]
  },
  {
    id: "maxton", name: "Maxton", category: "hero", type: "for-time", timeCap: null,
    description: "Con chaleco, 13 rondas por tiempo: 8 dominadas estrictas, 26 box step-ups, 21 burpees (14/20 lb).",
    blocks: [
      { kind: "rounds", rounds: 13, items: [
        { name: "Dominadas estrictas", detail: "", reps: 8 },
        { name: "Box step-up", detail: "20 in", reps: 26 },
        { name: "Burpees", detail: "", reps: 21 }
      ]}
    ]
  },
  {
    id: "maxim-56", name: "Maxim 56", category: "hero", type: "for-time", timeCap: null,
    description: "En pareja: buy-in de 56 s handstand hold o wall sit, luego cada uno 56 burpees, 56 flutter kicks, 56 zancadas, 56 flexiones, 56 air squats; cash-out carrera 5600 m.",
    blocks: [
      { kind: "single", items: [
        { name: "Handstand hold / wall sit", detail: "", reps: 56 },
        { name: "Burpees", detail: "", reps: 56 },
        { name: "Flutter kicks", detail: "", reps: 56 },
        { name: "Zancadas", detail: "", reps: 56 },
        { name: "Flexiones", detail: "", reps: 56 },
        { name: "Air squats", detail: "", reps: 56 },
        { name: "Carrera 5600 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "mccartney", name: "McCartney", category: "hero", type: "for-time", timeCap: null,
    description: "En equipos de 3: remo 2000 m, 14 DB thrusters, 34 KB swings, 484 dobles saltos, 108 burpees, remo 2000 m, 18 pesos muertos.",
    blocks: [
      { kind: "single", items: [
        { name: "Remo 2000 m", detail: "", reps: 1 },
        { name: "DB thruster", detail: "35 lb", reps: 14 },
        { name: "KB swing", detail: "53 lb", reps: 34 },
        { name: "Dobles saltos", detail: "", reps: 484 },
        { name: "Burpees", detail: "", reps: 108 },
        { name: "Remo 2000 m", detail: "", reps: 1 },
        { name: "Peso muerto", detail: "155 lb", reps: 18 }
      ]}
    ]
  },
  {
    id: "mccluskey", name: "McCluskey", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas de: 9 muscle-ups, 15 burpee pull-ups, 21 dominadas, 800 m de carrera (con chaleco opcional).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Muscle-up", detail: "", reps: 9 },
        { name: "Burpee pull-ups", detail: "", reps: 15 },
        { name: "Dominadas", detail: "", reps: 21 },
        { name: "Carrera 800 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "mcgee", name: "McGhee", category: "hero", type: "amrap", timeCap: 30 * 60,
    description: "AMRAP 30 min: 5 pesos muertos, 9 saltos al cajón (275 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Peso muerto", detail: "275 lb", reps: 5 },
        { name: "Salto al cajón", detail: "24 in", reps: 9 }
      ]}
    ]
  },
  {
    id: "meadows", name: "Meadows", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 20 muscle-ups, 25 bajadas lentas desde inverted hang en anillas, 30 ring HSPU.",
    blocks: [
      { kind: "single", items: [
        { name: "Muscle-up", detail: "", reps: 20 },
        { name: "Bajada lenta en anillas", detail: "", reps: 25 },
        { name: "Ring HSPU", detail: "", reps: 30 }
      ]}
    ]
  },
  {
    id: "michael", name: "Michael", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 800 m de carrera, 50 back extensions, 50 abdominales.",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Back extensions", detail: "", reps: 50 },
        { name: "Abdominales", detail: "", reps: 50 }
      ]}
    ]
  },
  {
    id: "miron", name: "Miron", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 800 m de carrera, 23 sentadillas traseras (¾ PC), 13 pesos muertos (1½ PC).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Sentadilla trasera (¾ PC)", detail: "", reps: 23 },
        { name: "Peso muerto (1½ PC)", detail: "", reps: 13 }
      ]}
    ]
  },
  {
    id: "monti", name: "Monti", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 50 barbell step-ups, 15 cleans, 50 step-ups, 10 snatches (95 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Barbell step-up", detail: "45 lb", reps: 50 },
        { name: "Clean", detail: "95 lb", reps: 15 },
        { name: "Barbell step-up", detail: "45 lb", reps: 50 },
        { name: "Snatch", detail: "95 lb", reps: 10 }
      ]}
    ]
  },
  {
    id: "moon", name: "Moon", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 10 DB hang split snatches (der.), 1 escalada de cuerda, 10 DB hang split snatches (izq.), 1 escalada de cuerda (40 lb).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "DB hang split snatch (der.)", detail: "40 lb", reps: 10 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 1 },
        { name: "DB hang split snatch (izq.)", detail: "40 lb", reps: 10 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 1 }
      ]}
    ]
  },
  {
    id: "moore", name: "Moore", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 1 escalada de cuerda, 400 m de carrera, max-rep HSPU.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Escalada de cuerda", detail: "15 ft", reps: 1 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Flexiones pino (HSPU)", detail: "max reps", reps: 5 }
      ]}
    ]
  },
  {
    id: "morrison", name: "Morrison", category: "hero", type: "for-time", timeCap: null,
    description: "50-40-30-20-10 de wall balls, saltos al cajón y KB swings (35 lb).",
    blocks: [
      { kind: "rounds", rounds: [50, 40, 30, 20, 10], items: [
        { name: "Wall ball", detail: "14 lb", reps: null },
        { name: "Salto al cajón", detail: "20 in", reps: null },
        { name: "KB swing", detail: "35 lb", reps: null }
      ]}
    ]
  },
  {
    id: "mr-joshua", name: "Mr. Joshua", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 400 m de carrera, 30 GHD sit-ups, 15 pesos muertos (175 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "GHD sit-ups", detail: "", reps: 30 },
        { name: "Peso muerto", detail: "175 lb", reps: 15 }
      ]}
    ]
  },
  {
    id: "muller", name: "Muller", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1000 m de carrera, 710 m plate carry, 5 rondas de 13 burpee pull-ups + 13 pesos muertos, 710 m plate carry, 1000 m de carrera.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1000 m", detail: "", reps: 1 },
        { name: "Plate carry 710 m", detail: "25 lb", reps: 1 },
        { name: "Burpee pull-ups", detail: "", reps: 65 },
        { name: "Peso muerto", detail: "155 lb", reps: 65 },
        { name: "Plate carry 710 m", detail: "25 lb", reps: 1 },
        { name: "Carrera 1000 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "murph", name: "Murph", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1 milla de carrera, 100 dominadas, 200 flexiones, 300 air squats, 1 milla de carrera (con chaleco de 20 lb si es posible).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1 milla", detail: "", reps: 1 },
        { name: "Dominadas", detail: "", reps: 100 },
        { name: "Flexiones", detail: "", reps: 200 },
        { name: "Air squats", detail: "", reps: 300 },
        { name: "Carrera 1 milla", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "nate", name: "Nate", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 2 muscle-ups, 4 HSPU, 8 KB swings (32/24 kg).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Muscle-up", detail: "", reps: 2 },
        { name: "Flexiones pino (HSPU)", detail: "", reps: 4 },
        { name: "KB swing", detail: "32/24 kg", reps: 8 }
      ]}
    ]
  },
  {
    id: "ned", name: "Ned", category: "hero", type: "for-time", timeCap: null,
    description: "11 sentadillas traseras con peso corporal, remo 1000 m.",
    blocks: [
      { kind: "single", items: [
        { name: "Sentadilla trasera (PC)", detail: "", reps: 11 },
        { name: "Remo 1000 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "nick", name: "Nick", category: "hero", type: "for-time", timeCap: null,
    description: "12 rondas por tiempo: 10 DB hang squat cleans, 6 HSPU sobre mancuernas (45 lb).",
    blocks: [
      { kind: "rounds", rounds: 12, items: [
        { name: "DB hang squat clean", detail: "45 lb", reps: 10 },
        { name: "HSPU sobre mancuernas", detail: "", reps: 6 }
      ]}
    ]
  },
  {
    id: "nickman", name: "Nickman", category: "hero", type: "for-time", timeCap: null,
    description: "10 rondas por tiempo: 200 m farmers carry, 10 dominadas lastradas, 20 DB power snatches alternos.",
    blocks: [
      { kind: "rounds", rounds: 10, items: [
        { name: "Farmers carry 200 m", detail: "40 lb", reps: 1 },
        { name: "Dominadas lastradas", detail: "20 lb", reps: 10 },
        { name: "DB power snatch alterno", detail: "40 lb", reps: 20 }
      ]}
    ]
  },
  {
    id: "northrup", name: "Northrup", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 26 barbell back-rack step-ups, 3 rondas de 17 power cleans + 19 abdominales + 21 pesos muertos, 31 cal remo.",
    blocks: [
      { kind: "single", items: [
        { name: "Back-rack step-up", detail: "65 lb", reps: 26 },
        { name: "Power clean", detail: "65 lb", reps: 51 },
        { name: "Abdominales", detail: "", reps: 57 },
        { name: "Peso muerto", detail: "65 lb", reps: 63 },
        { name: "Remo 31 cal", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "nukes", name: "Nukes", category: "hero", type: "for-time", timeCap: null,
    description: "8 min: 1 milla de carrera + max reps pesos muertos; 10 min: 1 milla + max reps power cleans; 12 min: 1 milla + max reps overhead squats (sin descanso).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1 milla", detail: "", reps: 1 },
        { name: "Peso muerto (max reps)", detail: "315 lb", reps: 30 },
        { name: "Power clean (max reps)", detail: "225 lb", reps: 30 },
        { name: "Sentadilla overhead (max reps)", detail: "135 lb", reps: 30 }
      ]}
    ]
  },
  {
    id: "nunez", name: "Nunez", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 800 m de carrera, 50 dominadas, 40 air squats (peso 1), 600 m de carrera, 30 burpee box jump-overs, 20 air squats (peso 2), 400 m de carrera, 15 burpee box jump-overs, 12 bar muscle-ups, 10 squat cleans (peso 3).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Dominadas", detail: "", reps: 50 },
        { name: "Air squats (peso 1)", detail: "65 lb", reps: 40 },
        { name: "Carrera 600 m", detail: "", reps: 1 },
        { name: "Burpee box jump-over", detail: "20 in", reps: 30 },
        { name: "Air squats (peso 2)", detail: "125 lb", reps: 20 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Burpee box jump-over", detail: "20 in", reps: 15 },
        { name: "Bar muscle-up", detail: "", reps: 12 },
        { name: "Squat clean (peso 3)", detail: "155 lb", reps: 10 }
      ]}
    ]
  },
  {
    id: "nutts", name: "Nutts", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 10 HSPU, 15 pesos muertos, 25 saltos al cajón, 50 dominadas, 100 wall balls, 200 dobles saltos, 400 m de carrera con placa (175/250 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Flexiones pino (HSPU)", detail: "", reps: 10 },
        { name: "Peso muerto", detail: "175 lb", reps: 15 },
        { name: "Salto al cajón", detail: "24 in", reps: 25 },
        { name: "Dominadas", detail: "", reps: 50 },
        { name: "Wall ball", detail: "14 lb", reps: 100 },
        { name: "Dobles saltos", detail: "", reps: 200 },
        { name: "Carrera 400 m (placa)", detail: "25 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "oda-7313", name: "ODA 7313", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 300 m jog, 10 DB thrusters (izq.), 10 DB thrusters (der.), 7 dominadas estrictas (con chaleco).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Jog 300 m", detail: "", reps: 1 },
        { name: "DB thruster (izq.)", detail: "20 lb", reps: 10 },
        { name: "DB thruster (der.)", detail: "20 lb", reps: 10 },
        { name: "Dominadas estrictas", detail: "", reps: 7 }
      ]}
    ]
  },
  {
    id: "omar", name: "Omar", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 10 thrusters, 20 thrusters, 25 bar-facing burpees, 30 thrusters, 35 bar-facing burpees (65/95 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Thruster", detail: "65 lb", reps: 10 },
        { name: "Thruster", detail: "65 lb", reps: 20 },
        { name: "Bar-facing burpees", detail: "", reps: 25 },
        { name: "Thruster", detail: "65 lb", reps: 30 },
        { name: "Bar-facing burpees", detail: "", reps: 35 }
      ]}
    ]
  },
  {
    id: "otis", name: "Otis", category: "hero", type: "for-time", timeCap: null,
    description: "AMRAP 15 min: 1 sentadilla trasera + 1 press militar, 2 sentadillas + 2 press + 2 pesos muertos, 3+3+3, etc. (1½ PC / ¾ PC).",
    blocks: [
      { kind: "single", items: [
        { name: "Sentadilla trasera (1½ PC)", detail: "", reps: 10 },
        { name: "Press militar (¾ PC)", detail: "", reps: 10 },
        { name: "Peso muerto (1½ PC)", detail: "", reps: 10 }
      ]}
    ]
  },
  {
    id: "ozzy", name: "Ozzy", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 11 deficit HSPU, 22 yd farmers carry (35/50 lb).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Deficit HSPU", detail: "", reps: 11 },
        { name: "Farmers carry 22 yd", detail: "35 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "pat", name: "Pat", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 800 m de carrera con placa, 14 rondas de 5 dominadas estrictas + 4 burpee box jumps + 3 cleans, 800 m con placa.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 800 m (placa)", detail: "25 lb", reps: 1 },
        { name: "Dominadas estrictas", detail: "", reps: 70 },
        { name: "Burpee box jumps", detail: "20 in", reps: 56 },
        { name: "Clean", detail: "125 lb", reps: 42 },
        { name: "Carrera 800 m (placa)", detail: "25 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "paul", name: "Paul", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 50 dobles saltos, 35 rodillas al pecho, 20 yd overhead walk (125/185 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Dobles saltos", detail: "", reps: 50 },
        { name: "Rodillas al pecho", detail: "", reps: 35 },
        { name: "Overhead walk 20 yd", detail: "125 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "paul-pena", name: "Paul Pena", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas, cada una por tiempo: 100 m sprint, 19 KB swings, 10 burpee box jumps; descanso 3 min entre rondas (53/70 lb).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Sprint 100 m", detail: "", reps: 1 },
        { name: "KB swing", detail: "53 lb", reps: 19 },
        { name: "Burpee box jump", detail: "20 in", reps: 10 }
      ]}
    ]
  },
  {
    id: "peyton", name: "Peyton", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 10 DB thrusters (35/50 lb); cada 2 min 40 dobles saltos; al llegar a 20 min, carrera de 2 millas.",
    blocks: [
      { kind: "amrap", items: [
        { name: "DB thruster", detail: "35 lb", reps: 10 },
        { name: "Dobles saltos (cada 2 min)", detail: "", reps: 40 },
        { name: "Carrera 2 millas (al final)", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "pike", name: "Pike", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 10 ring dips estrictos, 20 flexiones, 10 HSPU estrictos, 50 m bear crawl (55/75 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Ring dips estrictos", detail: "", reps: 10 },
        { name: "Flexiones", detail: "", reps: 20 },
        { name: "HSPU estrictos", detail: "", reps: 10 },
        { name: "Bear crawl 50 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "pikey", name: "Pikey", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 400 m de carrera, 12 burpee bar muscle-ups, 15 squat snatches, 800 m de carrera, 12 burpee bar muscle-ups, 20 clean & jerks, 800 m de carrera, 12 burpee bar muscle-ups, 18 thrusters, 400 m de carrera (105/155 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Burpee bar muscle-up", detail: "", reps: 12 },
        { name: "Squat snatch", detail: "105 lb", reps: 15 },
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Burpee bar muscle-up", detail: "", reps: 12 },
        { name: "Clean & Jerk", detail: "105 lb", reps: 20 },
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Burpee bar muscle-up", detail: "", reps: 12 },
        { name: "Thruster", detail: "105 lb", reps: 18 },
        { name: "Carrera 400 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "pk", name: "PK", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 400 m sprint, 12 power cleans; descanso 2 min entre rondas (155/225 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Sprint 400 m", detail: "", reps: 1 },
        { name: "Power clean", detail: "155 lb", reps: 12 }
      ]}
    ]
  },
  {
    id: "ralph", name: "Ralph", category: "hero", type: "for-time", timeCap: null,
    description: "4 rondas por tiempo: 8 pesos muertos, 16 burpees, 3 escaladas de cuerda, 600 m de carrera (250 lb).",
    blocks: [
      { kind: "rounds", rounds: 4, items: [
        { name: "Peso muerto", detail: "250 lb", reps: 8 },
        { name: "Burpees", detail: "", reps: 16 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 3 },
        { name: "Carrera 600 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "randy", name: "Randy", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 75 power snatches (75 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Power snatch", detail: "75 lb", reps: 75 }
      ]}
    ]
  },
  {
    id: "rankel", name: "Rankel", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 6 pesos muertos, 7 burpee pull-ups, 10 KB swings, 200 m de carrera (155 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Peso muerto", detail: "155 lb", reps: 6 },
        { name: "Burpee pull-ups", detail: "", reps: 7 },
        { name: "KB swing", detail: "53 lb", reps: 10 },
        { name: "Carrera 200 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "rene", name: "René", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 400 m de carrera, 21 zancadas, 15 dominadas, 9 burpees (con chaleco).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Zancadas", detail: "", reps: 21 },
        { name: "Dominadas", detail: "", reps: 15 },
        { name: "Burpees", detail: "", reps: 9 }
      ]}
    ]
  },
  {
    id: "rich", name: "Rich", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 13 squat snatches, 10 rondas de 10 dominadas + 100 m sprint (105 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Squat snatch", detail: "105 lb", reps: 13 },
        { name: "Dominadas", detail: "", reps: 100 },
        { name: "Sprint 100 m", detail: "", reps: 10 }
      ]}
    ]
  },
  {
    id: "ricky", name: "Ricky", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 5 DB pesos muertos, 8 push presses, 12 saltos al cajón, 6 thrusters, 6 bar-facing burpees.",
    blocks: [
      { kind: "amrap", items: [
        { name: "DB peso muerto", detail: "50 lb", reps: 5 },
        { name: "Push press", detail: "95 lb", reps: 8 },
        { name: "Salto al cajón", detail: "20 in", reps: 12 },
        { name: "Thruster", detail: "65 lb", reps: 6 },
        { name: "Bar-facing burpees", detail: "", reps: 6 }
      ]}
    ]
  },
  {
    id: "riley", name: "Riley", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1.5 millas de carrera, 150 burpees, 1.5 millas de carrera (con chaleco).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1.5 millas", detail: "", reps: 1 },
        { name: "Burpees", detail: "", reps: 150 },
        { name: "Carrera 1.5 millas", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "rj", name: "RJ", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 800 m de carrera, 50 flexiones.",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 50 }
      ]}
    ]
  },
  {
    id: "robbie", name: "Robbie", category: "hero", type: "amrap", timeCap: 25 * 60,
    description: "AMRAP 25 min: 8 HSPU, 1 L-sit escalada de cuerda.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Flexiones pino (HSPU)", detail: "", reps: 8 },
        { name: "L-sit escalada de cuerda", detail: "15 ft", reps: 1 }
      ]}
    ]
  },
  {
    id: "rocket", name: "Rocket", category: "hero", type: "amrap", timeCap: 30 * 60,
    description: "AMRAP 30 min: 10 flexiones, 15 air squats.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Flexiones", detail: "", reps: 10 },
        { name: "Air squats", detail: "", reps: 15 }
      ]}
    ]
  },
  {
    id: "roney", name: "Roney", category: "hero", type: "for-time", timeCap: null,
    description: "4 rondas por tiempo: 200 m de carrera, 11 thrusters, 200 m de carrera, 11 push presses, 200 m de carrera, 11 press banca.",
    blocks: [
      { kind: "rounds", rounds: 4, items: [
        { name: "Carrera 200 m", detail: "", reps: 1 },
        { name: "Thruster", detail: "95 lb", reps: 11 },
        { name: "Carrera 200 m", detail: "", reps: 1 },
        { name: "Push press", detail: "95 lb", reps: 11 },
        { name: "Carrera 200 m", detail: "", reps: 1 },
        { name: "Press banca", detail: "95 lb", reps: 11 }
      ]}
    ]
  },
  {
    id: "roy", name: "Roy", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 15 pesos muertos, 20 saltos al cajón, 25 dominadas (225 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Peso muerto", detail: "225 lb", reps: 15 },
        { name: "Salto al cajón", detail: "24 in", reps: 20 },
        { name: "Dominadas", detail: "", reps: 25 }
      ]}
    ]
  },
  {
    id: "ryan", name: "Ryan", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 7 muscle-ups, 21 burpees (con chaleco).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Muscle-up", detail: "", reps: 7 },
        { name: "Burpees", detail: "", reps: 21 }
      ]}
    ]
  },
  {
    id: "ryan-comas", name: "Ryan Comas", category: "hero", type: "for-time", timeCap: null,
    description: "En equipo de 3: 1065 ft versa climb / remo / ski, 10 rondas de 13 pesos muertos + 13 dominadas + 13 cal remo + 13 sentadillas traseras + 13 burpees, 1065 m remo o ski.",
    blocks: [
      { kind: "single", items: [
        { name: "Versa climb / remo / ski 1065", detail: "", reps: 1 },
        { name: "Peso muerto", detail: "165 lb", reps: 130 },
        { name: "Dominadas", detail: "", reps: 130 },
        { name: "Remo 13 cal", detail: "", reps: 130 },
        { name: "Sentadilla trasera", detail: "165 lb", reps: 130 },
        { name: "Burpees", detail: "", reps: 130 }
      ]}
    ]
  },
  {
    id: "ryan-so", name: "Ryan SO", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1600 m de carrera, 4 rondas de 9 power cleans + 2 dominadas estrictas + 14 burpees, 3 rondas de 13 saltos al cajón + 13 flexiones + 50 dobles saltos, 1600 m de carrera.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1600 m", detail: "", reps: 1 },
        { name: "Power clean", detail: "95 lb", reps: 36 },
        { name: "Dominadas estrictas", detail: "", reps: 8 },
        { name: "Burpees", detail: "", reps: 56 },
        { name: "Salto al cajón", detail: "20 in", reps: 39 },
        { name: "Flexiones", detail: "", reps: 39 },
        { name: "Dobles saltos", detail: "", reps: 150 },
        { name: "Carrera 1600 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "santiago", name: "Santiago", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 18 DB hang squat cleans, 18 dominadas, 10 power cleans, 10 HSPU (95 lb).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "DB hang squat clean", detail: "35 lb", reps: 18 },
        { name: "Dominadas", detail: "", reps: 18 },
        { name: "Power clean", detail: "95 lb", reps: 10 },
        { name: "Flexiones pino (HSPU)", detail: "", reps: 10 }
      ]}
    ]
  },
  {
    id: "santora", name: "Santora", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por reps: 1 min de squat cleans, 1 min de shuttle sprints, 1 min de pesos muertos, 1 min de burpees, 1 min de jerks (descanso 1 min).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Squat cleans (1 min)", detail: "105 lb", reps: 20 },
        { name: "Shuttle sprint (1 min)", detail: "", reps: 10 },
        { name: "Peso muerto (1 min)", detail: "165 lb", reps: 20 },
        { name: "Burpees (1 min)", detail: "", reps: 20 },
        { name: "Jerk (1 min)", detail: "105 lb", reps: 20 }
      ]}
    ]
  },
  {
    id: "schmalls", name: "Schmalls", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 800 m de carrera, 2 rondas de 50 burpees + 40 dominadas + 30 sentadillas a una pierna + 20 KB swings, 800 m de carrera.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Burpees", detail: "", reps: 100 },
        { name: "Dominadas", detail: "", reps: 80 },
        { name: "Sentadilla a una pierna", detail: "", reps: 60 },
        { name: "KB swing", detail: "53 lb", reps: 40 },
        { name: "Carrera 800 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "scooter", name: "Scooter", category: "hero", type: "amrap", timeCap: 30 * 60,
    description: "En pareja, AMRAP 30 min: 30 dobles saltos, 15 flexiones (alternando por ronda); luego 5 min para 1RM de peso muerto en pareja.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Dobles saltos", detail: "", reps: 30 },
        { name: "Flexiones", detail: "", reps: 15 },
        { name: "Peso muerto 1RM (pareja)", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "scotty", name: "Scotty", category: "hero", type: "amrap", timeCap: 11 * 60,
    description: "AMRAP 11 min: 5 pesos muertos, 18 wall balls, 17 burpees sobre la barra (205/315 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Peso muerto", detail: "205 lb", reps: 5 },
        { name: "Wall ball", detail: "14 lb", reps: 18 },
        { name: "Burpees sobre la barra", detail: "", reps: 17 }
      ]}
    ]
  },
  {
    id: "sean", name: "Sean", category: "hero", type: "for-time", timeCap: null,
    description: "10 rondas por tiempo: 11 chest-to-bar, 22 sentadillas frontales (55 lb).",
    blocks: [
      { kind: "rounds", rounds: 10, items: [
        { name: "Chest-to-bar", detail: "", reps: 11 },
        { name: "Sentadilla frontal", detail: "55 lb", reps: 22 }
      ]}
    ]
  },
  {
    id: "servais", name: "Servais", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1.5 millas de carrera, 8 rondas de 19 dominadas + 19 flexiones + 19 burpees + 400 m sandbag carry, 1 milla farmers carry.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1.5 millas", detail: "", reps: 1 },
        { name: "Dominadas", detail: "", reps: 152 },
        { name: "Flexiones", detail: "", reps: 152 },
        { name: "Burpees", detail: "", reps: 152 },
        { name: "Sandbag carry 400 m", detail: "", reps: 8 },
        { name: "Farmers carry 1 milla", detail: "30 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "severin", name: "Severin", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 50 dominadas estrictas, 100 flexiones, 5K de carrera.",
    blocks: [
      { kind: "single", items: [
        { name: "Dominadas estrictas", detail: "", reps: 50 },
        { name: "Flexiones", detail: "", reps: 100 },
        { name: "Carrera 5K", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "sham", name: "Sham", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 11 pesos muertos con peso corporal, 100 m sprint.",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Peso muerto (PC)", detail: "", reps: 11 },
        { name: "Sprint 100 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "shawn", name: "Shawn", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 5 millas de carrera en intervalos de 5 min, con 50 air squats y 50 flexiones por cada intervalo.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 5 millas", detail: "", reps: 1 },
        { name: "Air squats", detail: "", reps: 250 },
        { name: "Flexiones", detail: "", reps: 250 }
      ]}
    ]
  },
  {
    id: "ship", name: "Ship", category: "hero", type: "for-time", timeCap: null,
    description: "9 rondas por tiempo: 7 squat cleans, 8 burpee box jumps (125/185 lb, cajón 30/36 in).",
    blocks: [
      { kind: "rounds", rounds: 9, items: [
        { name: "Squat clean", detail: "125 lb", reps: 7 },
        { name: "Burpee box jump", detail: "30 in", reps: 8 }
      ]}
    ]
  },
  {
    id: "sisson", name: "Sisson", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 1 escalada de cuerda, 5 burpees, 200 m de carrera (con chaleco).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Escalada de cuerda", detail: "15 ft", reps: 1 },
        { name: "Burpees", detail: "", reps: 5 },
        { name: "Carrera 200 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "small", name: "Small", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: remo 1000 m, 50 burpees, 50 saltos al cajón, 800 m de carrera (20/24 in).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Remo 1000 m", detail: "", reps: 1 },
        { name: "Burpees", detail: "", reps: 50 },
        { name: "Salto al cajón", detail: "20 in", reps: 50 },
        { name: "Carrera 800 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "smykowski", name: "Smykowski", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: carrera 6K, 60 burpee pull-ups.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 6K", detail: "", reps: 1 },
        { name: "Burpee pull-ups", detail: "", reps: 60 }
      ]}
    ]
  },
  {
    id: "spehar", name: "Spehar", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 100 thrusters, 100 chest-to-bar, carrera de 6 millas (particionable) (95/135 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Thruster", detail: "95 lb", reps: 100 },
        { name: "Chest-to-bar", detail: "", reps: 100 },
        { name: "Carrera 6 millas", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "stephen", name: "Stephen", category: "hero", type: "for-time", timeCap: null,
    description: "30-25-20-15-10-5 de GHD sit-ups, back extensions, rodillas al pecho y stiff-legged deadlifts (65 lb).",
    blocks: [
      { kind: "rounds", rounds: [30, 25, 20, 15, 10, 5], items: [
        { name: "GHD sit-ups", detail: "", reps: null },
        { name: "Back extensions", detail: "", reps: null },
        { name: "Rodillas al pecho", detail: "", reps: null },
        { name: "Stiff-legged deadlift", detail: "65 lb", reps: null }
      ]}
    ]
  },
  {
    id: "strange", name: "Strange", category: "hero", type: "for-time", timeCap: null,
    description: "8 rondas por tiempo: 600 m de carrera, 11 dominadas lastradas, 11 KB thrusters (35/53 lb).",
    blocks: [
      { kind: "rounds", rounds: 8, items: [
        { name: "Carrera 600 m", detail: "", reps: 1 },
        { name: "Dominadas lastradas", detail: "", reps: 11 },
        { name: "KB thruster", detail: "35 lb", reps: 11 }
      ]}
    ]
  },
  {
    id: "t", name: "T", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 100 m sprint, 10 squat clean thrusters, 15 KB swings, 100 m sprint; descanso 2 min (75 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Sprint 100 m", detail: "", reps: 1 },
        { name: "Squat clean thruster", detail: "75 lb", reps: 10 },
        { name: "KB swing", detail: "35 lb", reps: 15 },
        { name: "Sprint 100 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "t-j", name: "T.J.", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 10 press banca, 10 dominadas estrictas; repetir el triplete hasta 100 thrusters (125/185 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Press banca", detail: "125 lb", reps: 10 },
        { name: "Dominadas estrictas", detail: "", reps: 10 },
        { name: "Thruster", detail: "95 lb", reps: 100 }
      ]}
    ]
  },
  {
    id: "t-u-p", name: "T.U.P.", category: "hero", type: "for-time", timeCap: null,
    description: "15-12-9-6-3 de power cleans, dominadas, sentadillas frontales y dominadas (135 lb).",
    blocks: [
      { kind: "rounds", rounds: [15, 12, 9, 6, 3], items: [
        { name: "Power clean", detail: "135 lb", reps: null },
        { name: "Dominadas", detail: "", reps: null },
        { name: "Sentadilla frontal", detail: "135 lb", reps: null },
        { name: "Dominadas", detail: "", reps: null }
      ]}
    ]
  },
  {
    id: "tama", name: "Tama", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 800 m single-arm barbell farmers carry, 31 toes-to-bar, 31 flexiones, 31 sentadillas frontales, 400 m carry, 31 hang power cleans, 200 m carry.",
    blocks: [
      { kind: "single", items: [
        { name: "Farmers carry 800 m (barra a un brazo)", detail: "35 lb", reps: 1 },
        { name: "Toes-to-bar", detail: "", reps: 31 },
        { name: "Flexiones", detail: "", reps: 31 },
        { name: "Sentadilla frontal", detail: "65 lb", reps: 31 },
        { name: "Farmers carry 400 m", detail: "65 lb", reps: 1 },
        { name: "Hang power clean", detail: "95 lb", reps: 31 },
        { name: "Farmers carry 200 m", detail: "95 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "taylor", name: "Taylor", category: "hero", type: "for-time", timeCap: null,
    description: "400 m de carrera, 5 burpee muscle-ups, 400 m de carrera, 5 burpee muscle-ups (con chaleco opcional).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Burpee muscle-up", detail: "", reps: 5 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Burpee muscle-up", detail: "", reps: 5 }
      ]}
    ]
  },
  {
    id: "terry", name: "Terry", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 1 milla de carrera, 100 flexiones, 100 m bear crawl, 1 milla de carrera, 100 flexiones, 1 milla de carrera.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1 milla", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 100 },
        { name: "Bear crawl 100 m", detail: "", reps: 1 },
        { name: "Carrera 1 milla", detail: "", reps: 1 },
        { name: "Flexiones", detail: "", reps: 100 },
        { name: "Carrera 1 milla", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "the-don", name: "The Don", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 66 pesos muertos, 66 saltos al cajón, 66 KB swings, 66 dominadas, 66 thrusters, 66 wall balls, 66 burpees, 66 dobles saltos (70 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Peso muerto", detail: "70 lb", reps: 66 },
        { name: "Salto al cajón", detail: "20 in", reps: 66 },
        { name: "KB swing", detail: "35 lb", reps: 66 },
        { name: "Dominadas", detail: "", reps: 66 },
        { name: "Thruster", detail: "35 lb", reps: 66 },
        { name: "Wall ball", detail: "14 lb", reps: 66 },
        { name: "Burpees", detail: "", reps: 66 },
        { name: "Dobles saltos", detail: "", reps: 66 }
      ]}
    ]
  },
  {
    id: "the-lyon", name: "The Lyon", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas, cada una por tiempo: 7 squat cleans, 7 shoulder-to-overheads, 7 burpee chest-to-bar; descanso 2 min (115/165 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Squat clean", detail: "115 lb", reps: 7 },
        { name: "Shoulder-to-overhead", detail: "115 lb", reps: 7 },
        { name: "Burpee chest-to-bar", detail: "", reps: 7 }
      ]}
    ]
  },
  {
    id: "the-seven", name: "The Seven", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas: 7 HSPU, 7 thrusters, 7 rodillas al pecho, 7 pesos muertos, 7 burpees, 7 KB swings, 7 dominadas.",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Flexiones pino (HSPU)", detail: "", reps: 7 },
        { name: "Thruster", detail: "60/40 kg", reps: 7 },
        { name: "Rodillas al pecho", detail: "", reps: 7 },
        { name: "Peso muerto", detail: "110/75 kg", reps: 7 },
        { name: "Burpees", detail: "", reps: 7 },
        { name: "KB swing", detail: "32/24 kg", reps: 7 },
        { name: "Dominadas", detail: "", reps: 7 }
      ]}
    ]
  },
  {
    id: "thompson", name: "Thompson", category: "hero", type: "for-time", timeCap: null,
    description: "10 rondas por tiempo: 1 escalada de cuerda, 29 sentadillas traseras (65/95 lb).",
    blocks: [
      { kind: "rounds", rounds: 10, items: [
        { name: "Escalada de cuerda", detail: "15 ft", reps: 1 },
        { name: "Sentadilla trasera", detail: "65 lb", reps: 29 }
      ]}
    ]
  },
  {
    id: "tiff", name: "Tiff", category: "hero", type: "for-time", timeCap: null,
    description: "En 25 min: 1.5 millas de carrera, luego AMRAP de 11 chest-to-bar + 7 hang squat cleans (105/155 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1.5 millas", detail: "", reps: 1 },
        { name: "Chest-to-bar", detail: "", reps: 11 },
        { name: "Hang squat clean", detail: "105 lb", reps: 7 }
      ]}
    ]
  },
  {
    id: "timothy-helton", name: "Timothy Helton", category: "hero", type: "for-time", timeCap: null,
    description: "En equipo de 3: remo 2364 m, 10 rondas de 49 wall balls + 26 dominadas + 200 m de carrera + 8 ring muscle-ups + 40 pesos muertos, y en 10 min un 1RM de sentadilla trasera por miembro.",
    blocks: [
      { kind: "single", items: [
        { name: "Remo 2364 m", detail: "", reps: 1 },
        { name: "Wall ball", detail: "14 lb", reps: 490 },
        { name: "Dominadas", detail: "", reps: 260 },
        { name: "Carrera 200 m", detail: "", reps: 10 },
        { name: "Ring muscle-up", detail: "", reps: 80 },
        { name: "Peso muerto", detail: "105 lb", reps: 400 },
        { name: "Sentadilla trasera 1RM", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "tk", name: "TK", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 8 dominadas estrictas, 8 saltos al cajón, 12 KB swings (30/36 in, 53/70 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Dominadas estrictas", detail: "", reps: 8 },
        { name: "Salto al cajón", detail: "30 in", reps: 8 },
        { name: "KB swing", detail: "53 lb", reps: 12 }
      ]}
    ]
  },
  {
    id: "tom", name: "Tom", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 7 muscle-ups, 11 thrusters, 7 muscle-ups, 11 thrusters (105/155 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Muscle-up", detail: "", reps: 7 },
        { name: "Thruster", detail: "105 lb", reps: 11 },
        { name: "Muscle-up", detail: "", reps: 7 },
        { name: "Thruster", detail: "105 lb", reps: 11 }
      ]}
    ]
  },
  {
    id: "tommy-v", name: "Tommy V", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 21 thrusters, 12 escaladas de cuerda, 15 thrusters, 9 escaladas de cuerda, 9 thrusters, 6 escaladas de cuerda (75/115 lb, cuerda 15 ft).",
    blocks: [
      { kind: "single", items: [
        { name: "Thruster", detail: "75 lb", reps: 21 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 12 },
        { name: "Thruster", detail: "75 lb", reps: 15 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 9 },
        { name: "Thruster", detail: "75 lb", reps: 9 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 6 }
      ]}
    ]
  },
  {
    id: "topsy", name: "Topsy", category: "hero", type: "amrap", timeCap: 25 * 60,
    description: "AMRAP 25 min: 3 ring muscle-ups, 8 thrusters, 17 cal remo (75/115 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Ring muscle-up", detail: "", reps: 3 },
        { name: "Thruster", detail: "75 lb", reps: 8 },
        { name: "Remo 17 cal", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "tpt9000", name: "TPT9000", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 100 m de carrera, 9 rondas de 8 burpees + 26 KB swings + 21 wall balls, 100 m de carrera (35/44 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 100 m", detail: "", reps: 1 },
        { name: "Burpees", detail: "", reps: 72 },
        { name: "KB swing", detail: "35 lb", reps: 234 },
        { name: "Wall ball", detail: "14 lb", reps: 189 },
        { name: "Carrera 100 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "triple-deuce", name: "triple deuce", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 22 burpees, 22 air squats, 22 dominadas, 22 sandbag ground-to-over-shoulder, sprint 722 m (40/60 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Burpees", detail: "", reps: 22 },
        { name: "Air squats", detail: "", reps: 22 },
        { name: "Dominadas", detail: "", reps: 22 },
        { name: "Sandbag ground-to-shoulder", detail: "40 lb", reps: 22 },
        { name: "Sprint 722 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "tully", name: "Tully", category: "hero", type: "for-time", timeCap: null,
    description: "Natación 200 m, 23 DB squat cleans, natación 200 m, 23 DB squat cleans (30/40 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Natación 200 m", detail: "", reps: 1 },
        { name: "DB squat clean", detail: "30 lb", reps: 23 },
        { name: "Natación 200 m", detail: "", reps: 1 },
        { name: "DB squat clean", detail: "30 lb", reps: 23 }
      ]}
    ]
  },
  {
    id: "tumilson", name: "Tumilson", category: "hero", type: "for-time", timeCap: null,
    description: "8 rondas por tiempo: 200 m de carrera, 11 DB burpee deadlifts (60 lb).",
    blocks: [
      { kind: "rounds", rounds: 8, items: [
        { name: "Carrera 200 m", detail: "", reps: 1 },
        { name: "DB burpee deadlift", detail: "60 lb", reps: 11 }
      ]}
    ]
  },
  {
    id: "tyler", name: "Tyler", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 7 muscle-ups, 21 sumo deadlift high pulls (65/95 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Muscle-up", detail: "", reps: 7 },
        { name: "Sumo deadlift high pull", detail: "65 lb", reps: 21 }
      ]}
    ]
  },
  {
    id: "viola", name: "Viola", category: "hero", type: "amrap", timeCap: 20 * 60,
    description: "AMRAP 20 min: 400 m de carrera, 11 power snatches, 17 dominadas, 13 power cleans (65/95 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Power snatch", detail: "65 lb", reps: 11 },
        { name: "Dominadas", detail: "", reps: 17 },
        { name: "Power clean", detail: "65 lb", reps: 13 }
      ]}
    ]
  },
  {
    id: "wade", name: "Wade", category: "hero", type: "for-time", timeCap: null,
    description: "Con chaleco: 1200 m de carrera, 4 rondas de 12 dominadas estrictas + 9 dips estrictos + 6 HSPU estrictos, 1200 m de carrera.",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 1200 m", detail: "chaleco", reps: 1 },
        { name: "Dominadas estrictas", detail: "", reps: 48 },
        { name: "Dips estrictos", detail: "", reps: 36 },
        { name: "HSPU estrictos", detail: "", reps: 24 },
        { name: "Carrera 1200 m", detail: "chaleco", reps: 1 }
      ]}
    ]
  },
  {
    id: "walsh", name: "Walsh", category: "hero", type: "for-time", timeCap: null,
    description: "4 rondas por tiempo: 22 burpee pull-ups, 22 sentadillas traseras, 200 m de carrera con placa overhead (125 lb).",
    blocks: [
      { kind: "rounds", rounds: 4, items: [
        { name: "Burpee pull-ups", detail: "", reps: 22 },
        { name: "Sentadilla trasera", detail: "125 lb", reps: 22 },
        { name: "Carrera 200 m (placa overhead)", detail: "25 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "war-frank", name: "War Frank", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 25 muscle-ups, 100 air squats, 35 GHD sit-ups, 400 m de carrera con placa (175 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Muscle-up", detail: "", reps: 25 },
        { name: "Air squats", detail: "", reps: 100 },
        { name: "GHD sit-ups", detail: "", reps: 35 },
        { name: "Carrera 400 m (placa)", detail: "25 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "weaver", name: "Weaver", category: "hero", type: "for-time", timeCap: null,
    description: "4 rondas por tiempo: 10 L pull-ups, 15 flexiones, 15 chest-to-bar, 15 flexiones, 20 dominadas.",
    blocks: [
      { kind: "rounds", rounds: 4, items: [
        { name: "L pull-ups", detail: "", reps: 10 },
        { name: "Flexiones", detail: "", reps: 15 },
        { name: "Chest-to-bar", detail: "", reps: 15 },
        { name: "Flexiones", detail: "", reps: 15 },
        { name: "Dominadas", detail: "", reps: 20 }
      ]}
    ]
  },
  {
    id: "wes", name: "Wes", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 800 m de carrera con placa, 14 rondas de 5 dominadas estrictas + 4 burpee box jumps + 3 cleans, 800 m con placa (185 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 800 m (placa)", detail: "25 lb", reps: 1 },
        { name: "Dominadas estrictas", detail: "", reps: 70 },
        { name: "Burpee box jumps", detail: "24 in", reps: 56 },
        { name: "Clean", detail: "185 lb", reps: 42 },
        { name: "Carrera 800 m (placa)", detail: "25 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "wesley", name: "Wesley", category: "hero", type: "for-time", timeCap: null,
    description: "En 35 min: 800 m de carrera, luego AMRAP de 8 saltos al cajón + 6 dominadas estrictas + 21 yd walking lunge con placa overhead (45 lb).",
    blocks: [
      { kind: "single", items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Salto al cajón", detail: "", reps: 8 },
        { name: "Dominadas estrictas", detail: "", reps: 6 },
        { name: "Walking lunge 21 yd (placa overhead)", detail: "45 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "weston", name: "Weston", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: remo 1000 m, 200 m farmers carry (der.), 200 m farmers carry (izq.) (30/45 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Remo 1000 m", detail: "", reps: 1 },
        { name: "Farmers carry 200 m (der.)", detail: "30 lb", reps: 1 },
        { name: "Farmers carry 200 m (izq.)", detail: "30 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "white", name: "White", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 3 escaladas de cuerda, 10 toes-to-bar, 21 zancadas overhead, 400 m de carrera (25/45 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Escalada de cuerda", detail: "15 ft", reps: 3 },
        { name: "Toes-to-bar", detail: "", reps: 10 },
        { name: "Zancadas overhead", detail: "25 lb", reps: 21 },
        { name: "Carrera 400 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "whitt", name: "Whitt", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 800 m de carrera con balón medicinal, 30 wall balls, 30 ball slams (20/30 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Carrera 800 m (balón)", detail: "20 lb", reps: 1 },
        { name: "Wall ball", detail: "20 lb", reps: 30 },
        { name: "Ball slams", detail: "20 lb", reps: 30 }
      ]}
    ]
  },
  {
    id: "whitten", name: "Whitten", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 22 KB swings, 22 saltos al cajón, 400 m de carrera, 22 burpees, 22 wall balls (53/72 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "KB swing", detail: "53 lb", reps: 22 },
        { name: "Salto al cajón", detail: "20 in", reps: 22 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Burpees", detail: "", reps: 22 },
        { name: "Wall ball", detail: "14 lb", reps: 22 }
      ]}
    ]
  },
  {
    id: "willy", name: "Willy", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 800 m de carrera, 5 sentadillas frontales, 200 m de carrera, 11 chest-to-bar, 400 m de carrera, 12 KB swings (155 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Carrera 800 m", detail: "", reps: 1 },
        { name: "Sentadilla frontal", detail: "155 lb", reps: 5 },
        { name: "Carrera 200 m", detail: "", reps: 1 },
        { name: "Chest-to-bar", detail: "", reps: 11 },
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "KB swing", detail: "53 lb", reps: 12 }
      ]}
    ]
  },
  {
    id: "wilmot", name: "Wilmot", category: "hero", type: "for-time", timeCap: null,
    description: "6 rondas por tiempo: 50 air squats, 25 ring dips.",
    blocks: [
      { kind: "rounds", rounds: 6, items: [
        { name: "Air squats", detail: "", reps: 50 },
        { name: "Ring dips", detail: "", reps: 25 }
      ]}
    ]
  },
  {
    id: "wittman", name: "Wittman", category: "hero", type: "for-time", timeCap: null,
    description: "7 rondas por tiempo: 15 power cleans, 15 saltos al cajón (65/95 lb).",
    blocks: [
      { kind: "rounds", rounds: 7, items: [
        { name: "Power clean", detail: "65 lb", reps: 15 },
        { name: "Salto al cajón", detail: "20 in", reps: 15 }
      ]}
    ]
  },
  {
    id: "woehlke", name: "Woehlke", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas, cada una por tiempo: 4 jerks, 5 sentadillas frontales, 40 dominadas, 50 flexiones, 60 abdominales; descanso 3 min (125/185 lb).",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Jerk", detail: "125 lb", reps: 4 },
        { name: "Sentadilla frontal", detail: "125 lb", reps: 5 },
        { name: "Dominadas", detail: "", reps: 40 },
        { name: "Flexiones", detail: "", reps: 50 },
        { name: "Abdominales", detail: "", reps: 60 }
      ]}
    ]
  },
  {
    id: "wood", name: "Wood", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 400 m de carrera, 10 sumo deadlift high pulls, 10 thrusters; descanso 1 min (65/95 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Carrera 400 m", detail: "", reps: 1 },
        { name: "Sumo deadlift high pull", detail: "65 lb", reps: 10 },
        { name: "Thruster", detail: "65 lb", reps: 10 }
      ]}
    ]
  },
  {
    id: "wyk", name: "Wyk", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 5 sentadillas frontales, 5 escaladas de cuerda, 400 m de carrera con placa (155/225 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Sentadilla frontal", detail: "155 lb", reps: 5 },
        { name: "Escalada de cuerda", detail: "15 ft", reps: 5 },
        { name: "Carrera 400 m (placa)", detail: "25 lb", reps: 1 }
      ]}
    ]
  },
  {
    id: "yeti", name: "Yeti", category: "hero", type: "for-time", timeCap: null,
    description: "Por tiempo: 25 dominadas, 10 muscle-ups, 1.5 millas de carrera, 10 muscle-ups, 25 dominadas.",
    blocks: [
      { kind: "single", items: [
        { name: "Dominadas", detail: "", reps: 25 },
        { name: "Muscle-up", detail: "", reps: 10 },
        { name: "Carrera 1.5 millas", detail: "", reps: 1 },
        { name: "Muscle-up", detail: "", reps: 10 },
        { name: "Dominadas", detail: "", reps: 25 }
      ]}
    ]
  },
  {
    id: "zembiec", name: "Zembiec", category: "hero", type: "for-time", timeCap: null,
    description: "5 rondas por tiempo: 7 strict burpee pull-ups, 400 m de carrera (125/185 lb).",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Strict burpee pull-ups", detail: "", reps: 7 },
        { name: "Carrera 400 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "zeus", name: "Zeus", category: "hero", type: "for-time", timeCap: null,
    description: "3 rondas por tiempo: 30 wall balls, 30 sumo deadlift high pulls, 30 saltos al cajón, 30 push presses, 30 flexiones.",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "Wall ball", detail: "14 lb", reps: 30 },
        { name: "Sumo deadlift high pull", detail: "55 lb", reps: 30 },
        { name: "Salto al cajón", detail: "20 in", reps: 30 },
        { name: "Push press", detail: "55 lb", reps: 30 },
        { name: "Flexiones", detail: "", reps: 30 }
      ]}
    ]
  },
  {
    id: "zimmerman", name: "Zimmerman", category: "hero", type: "amrap", timeCap: 25 * 60,
    description: "AMRAP 25 min: 11 chest-to-bar, 2 pesos muertos, 10 HSPU (205/315 lb).",
    blocks: [
      { kind: "amrap", items: [
        { name: "Chest-to-bar", detail: "", reps: 11 },
        { name: "Peso muerto", detail: "205 lb", reps: 2 },
        { name: "Flexiones pino (HSPU)", detail: "", reps: 10 }
      ]}
    ]
  },

  /* ==========================================================================
     ATHLEAN Inferno / Max Size — retos de acondicionamiento (sábados + desafíos)
     Transcritos del programa de 12 semanas. El plan de pesas va en un módulo
     aparte (ver prompt de handoff).
     ========================================================================== */
  {
    id: "ax-burn-ladder", name: "Burn Ladder", category: "inferno", type: "for-time", timeCap: 10 * 60,
    description:
      "SEMANA 1 · 10 minutos de tortura.\n\n" +
      "Hacé 5 reps del movimiento y aguantá un hold isométrico por el tiempo indicado. Los tiempos de hold suben de a 5 segundos. " +
      "Ejemplo: 5 flexiones y hold de 5 s; otras 5 flexiones y hold de 10 s; y así hasta llegar arriba (25 s) o hasta no poder " +
      "hacer el ejercicio con buena técnica. El objetivo es acumular 10 minutos de \"tiempo de hold\" en total.\n\n" +
      "IMPORTANTE: cada ejercicio se hace POR SEPARADO, no es un circuito. Completás toda la escalera de un ejercicio " +
      "(5+5s, 5+10s, 5+15s, 5+20s, 5+25s — o cuando fallás el hold o la técnica) y recién ahí pasás al siguiente.\n\n" +
      "Descanso al mínimo.",
    blocks: [
      { kind: "single", items: [
        { name: "Flexiones", detail: "5 reps → hold: 5s · 10s · 15s · 20s · 25s (parás al fallar)", reps: 5 },
        { name: "Sentadillas prisionero", detail: "5 reps → hold en isométrico: 5→25 s", reps: 5 },
        { name: "Pendulum planks", detail: "5 reps → plancha: 5→25 s", reps: 5 },
        { name: "Inverted rows", detail: "5 reps → squeeze arriba: 5→25 s", reps: 5 },
        { name: "Press mancuernas sentado", detail: "5 reps → hold a 90°: 5→25 s", reps: 5 },
        { name: "Elevación de gemelos con mancuernas", detail: "5 reps → hold en puntas: 5→25 s", reps: 5 },
        { name: "Curl de bíceps con mancuernas", detail: "5 reps → hold a 90°: 5→25 s", reps: 5 },
        { name: "Encogimientos con mancuernas", detail: "5 reps → hold arriba: 5→25 s", reps: 5 }
      ]}
    ]
  },
  {
    id: "ax-diabol-x", name: "Diabol-X (El Diablo)", category: "inferno", type: "for-time", timeCap: 10 * 60,
    description:
      "SEMANA 2 · 10 ejercicios, 1 minuto cada uno. Todo el entrenamiento se completa en 10 minutos.\n\n" +
      "Cada rep de cada ejercicio suma a tu puntaje total. Al final de los 10 minutos sumás todas tus reps: ese es tu score. " +
      "No importa qué estrategia uses para pasarla, esperá que sea durísima. Por algo lo llaman El Diablo.\n\n" +
      "El descanso entre ejercicios NO puede superar los 30 segundos.\n\n" +
      "Izquierda + derecha = 1 rep (recién cuando completás ambos lados) en: Minuto 3 (Diagonal Jumping Planks) y Minuto 5 (Sprinter Lunges).",
    blocks: [
      { kind: "single", items: [
        { name: "Min 1 · Flexiones", detail: "Máx reps en 60 s", reps: 0 },
        { name: "Min 2 · Saltos al cajón", detail: "Máx reps en 60 s", reps: 0 },
        { name: "Min 3 · Diagonal jumping planks", detail: "Izq + der = 1 rep · máx en 60 s", reps: 0 },
        { name: "Min 4 · Diamond cutter pushups", detail: "Máx reps en 60 s", reps: 0 },
        { name: "Min 5 · Sprinter lunges", detail: "Izq + der = 1 rep · máx en 60 s", reps: 0 },
        { name: "Min 6 · Squat burpees", detail: "Máx reps en 60 s", reps: 0 },
        { name: "Min 7 · Reverse corkscrews", detail: "Máx reps en 60 s", reps: 0 },
        { name: "Min 8 · DB renegade rows", detail: "Máx reps en 60 s", reps: 0 },
        { name: "Min 9 · DB thrusters", detail: "Máx reps en 60 s", reps: 0 },
        { name: "Min 10 · DB straight bar curls", detail: "Máx reps en 60 s", reps: 0 }
      ]}
    ]
  },
  {
    id: "ax-fire-ice", name: "Fire and Ice", category: "inferno", type: "rounds", timeCap: 10 * 60,
    description:
      "SEMANA 3 · 10 minutos de tortura.\n\n" +
      "Alterná \"FIRE\" (un circuito que hay que completar en 1 minuto) con \"ICE\" (un circuito más fácil, también dentro de 1 minuto). " +
      "Objetivo: completar todas las rondas sin fallar los targets de reps de cada ronda. Total: 10 minutos, con dos formas de llegar.\n\n" +
      "OPCIÓN 1 (más difícil): 5 rondas de FIRE (alias \"Hang Ten\") alternadas con 5 de ICE →\n" +
      "FIRE / ICE / FIRE / ICE / FIRE / ICE / FIRE / ICE / FIRE / ICE.\n\n" +
      "OPCIÓN 2 (un poco más fácil): sacás 2 rondas de FIRE y las cambiás por una variante algo más dura de ICE →\n" +
      "ICE / FIRE / ICE / ICE / FIRE / ICE / ICE / ICE / FIRE / ICE.\n" +
      "En la OPCIÓN 2, cada ICE agrega Saltos simples a la comba con el tiempo que sobre del minuto.\n\n" +
      "FIRE: Sprawling Burpees ×10 · Twisting Pistons ×5 por lado · Divebomber Pushups ×10.\n" +
      "ICE: Dominadas ×5 · Rodillas al pecho colgado ×5.\n\n" +
      "(Abajo está cargada la OPCIÓN 1.)",
    blocks: [
      { kind: "rounds", rounds: 5, items: [
        { name: "Sprawling burpees", detail: "FIRE · x10", reps: 10 },
        { name: "Twisting pistons", detail: "FIRE · 5 por lado (=10)", reps: 10 },
        { name: "Divebomber pushups", detail: "FIRE · x10", reps: 10 },
        { name: "Dominadas", detail: "ICE · x5", reps: 5 },
        { name: "Rodillas al pecho colgado", detail: "ICE · x5", reps: 5 }
      ]}
    ]
  },
  {
    id: "ax-bump-run", name: "Bump and Run", category: "inferno", type: "amrap", timeCap: 15 * 60,
    description: "Semana 5 · Metabolic Arson. AMRAP 15 min. Podés descansar lo que necesites (afecta las rondas). Metas 200 m: <40 s avanzado / <60 s intermedio / <80 s principiante. 100 m: <20 / <30 / <40 s.",
    blocks: [
      { kind: "amrap", items: [
        { name: "Burpees", detail: "", reps: 5 },
        { name: "Carrera 100 m", detail: "1/4 vuelta", reps: 1 },
        { name: "Burpees", detail: "", reps: 10 },
        { name: "Carrera 200 m", detail: "1/2 vuelta", reps: 1 }
      ]}
    ]
  },
  {
    id: "ax-sprint-ladder", name: "Sprint Ladder", category: "inferno", type: "for-time", timeCap: null,
    description: "Semana 6 · Metabolic Arson. Hacé la secuencia lo más rápido posible con buena forma. Principiantes: cortan en los 400 m y pasan directo al enfriamiento.",
    blocks: [
      { kind: "single", items: [
        { name: "Trote de calentamiento 800 m", detail: "1/2 milla", reps: 1 },
        { name: "Sprint 100 m / trote 100 m", detail: "", reps: 1 },
        { name: "Sprint 200 m / trote 200 m", detail: "", reps: 1 },
        { name: "Sprint 300 m / trote 300 m", detail: "", reps: 1 },
        { name: "Sprint 400 m / trote 400 m", detail: "principiantes enfrían acá", reps: 1 },
        { name: "Sprint 300 m / trote 300 m", detail: "", reps: 1 },
        { name: "Sprint 200 m / trote 200 m", detail: "", reps: 1 },
        { name: "Sprint 100 m / trote 100 m", detail: "", reps: 1 },
        { name: "Caminata de enfriamiento 400-800 m", detail: "", reps: 1 }
      ]}
    ]
  },
  {
    id: "ax-tracknophobia", name: "A-Track-Nophobia", category: "inferno", type: "for-time", timeCap: null,
    description: "Semana 7 · Metabolic Arson. Workout de pista, 4 vueltas. En cada vuelta cambiás lo que hacés al recorrer la curva.",
    blocks: [
      { kind: "single", items: [
        { name: "Vuelta 1", detail: "flexiones al fallo, sprint 100 m, caminar curva 100 m (×2)", reps: 1 },
        { name: "Vuelta 2", detail: "igual, pero la curva = zancadas caminando", reps: 1 },
        { name: "Vuelta 3", detail: "igual, pero la curva = sentadillas deslizando", reps: 1 },
        { name: "Vuelta 4", detail: "sprint la pista entera", reps: 1 }
      ]}
    ]
  },
  {
    id: "ax-hot-plate", name: "The Hot Plate Challenge", category: "inferno", type: "for-time", timeCap: null,
    description: "Semana 8 · Puntaje = tiempo total (incluye flexiones y sprints). Secuencia de 200 yd, 2 veces. Disco: ≤135 lb → 25 lb / 136-199 → 35 lb / 200+ → 45 lb. 15 flexiones cada vez que se cae el disco. Lanzamientos totales ÷ 2 = sprints de 20 yd para terminar. Tiers: BASIX >13 min · SOLID 11-13 · PRO 9:31-11 · ELITE 8:31-9:30 · XTREME <8:30.",
    blocks: [
      { kind: "single", items: [
        { name: "100 yd ida", detail: "push press throw + discus izq + discus der (sprint al disco cada vez)", reps: 1 },
        { name: "100 yd vuelta", detail: "acarreo del disco a una mano (15 flexiones si se cae)", reps: 1 },
        { name: "Repetir la secuencia de 200 yd", detail: "2 veces en total", reps: 1 },
        { name: "Sprints finales de 20 yd", detail: "lanzamientos totales ÷ 2", reps: 0 }
      ]}
    ]
  },
  {
    id: "ax-you-in-30-push", name: "You in 30 · Push", category: "inferno", type: "for-time", timeCap: 10 * 60,
    description: "Desafío 'You in 30 Minutes' — segmento PUSH. 1 minuto por ejercicio (10 min). 10 reps de cada variación salvo indicado; descansá el resto del minuto. Contá los minutos completados con éxito. Tiers sobre los 30 min: BASIX ≤14 · SOLID 15-19 · PRO 20-25 · ELITE 26-29 · XTREME 30/30.",
    blocks: [
      { kind: "single", items: [
        { name: "Min 1 · Flexiones estándar", detail: "x10", reps: 10 },
        { name: "Min 2 · Prowler pushups", detail: "x10", reps: 10 },
        { name: "Min 3 · Archers", detail: "x5 por lado", reps: 10 },
        { name: "Min 4 · Posted pushups", detail: "x5 por brazo", reps: 10 },
        { name: "Min 5 · Rolling plyo pushups", detail: "x10", reps: 10 },
        { name: "Min 6 · Hannibal pushups", detail: "x10", reps: 10 },
        { name: "Min 7 · Foot plant pushups", detail: "x10", reps: 10 },
        { name: "Min 8 · Cliffhanger pushups", detail: "x10", reps: 10 },
        { name: "Min 9 · Hand plant pushups", detail: "x10", reps: 10 },
        { name: "Min 10 · Flexiones", detail: "x5 (hold 20 s / 40 s)", reps: 5 }
      ]}
    ]
  },
  {
    id: "ax-you-in-30-pull", name: "You in 30 · Pull", category: "inferno", type: "for-time", timeCap: 10 * 60,
    description: "Desafío 'You in 30 Minutes' — segmento PULL. 1 minuto por ejercicio (10 min). 6 reps de cada variación salvo indicado; descansá el resto del minuto.",
    blocks: [
      { kind: "single", items: [
        { name: "Min 1 · Dominadas estándar", detail: "x6", reps: 6 },
        { name: "Min 2 · Commando pullups", detail: "x3 por lado", reps: 6 },
        { name: "Min 3 · 1½ pullups", detail: "x6", reps: 6 },
        { name: "Min 4 · Around the world pullups", detail: "x3 por dirección", reps: 6 },
        { name: "Min 5 · Plyo pullups", detail: "x6", reps: 6 },
        { name: "Min 6 · Cyclone pullups", detail: "x6", reps: 6 },
        { name: "Min 7 · Front lever pullups", detail: "x6", reps: 6 },
        { name: "Min 8 · 1 arm assisted pullups", detail: "x3 por brazo", reps: 6 },
        { name: "Min 9 · Headbanger pullups", detail: "x6", reps: 6 },
        { name: "Min 10 · Dominadas", detail: "x6 (5 s subida / 5 s bajada)", reps: 6 }
      ]}
    ]
  },
  {
    id: "ax-you-in-30-legs", name: "You in 30 · Legs", category: "inferno", type: "for-time", timeCap: 10 * 60,
    description: "Desafío 'You in 30 Minutes' — segmento LEGS. 1 minuto por ejercicio (10 min). 10 reps de cada variación salvo indicado; descansá el resto del minuto.",
    blocks: [
      { kind: "single", items: [
        { name: "Min 1 · Jump squats", detail: "x10", reps: 10 },
        { name: "Min 2 · Prisoner drop step lunges", detail: "x10 por pierna", reps: 10 },
        { name: "Min 3 · Tuck jumps", detail: "x10", reps: 10 },
        { name: "Min 4 · 1½ squats", detail: "x10", reps: 10 },
        { name: "Min 5 · Sprinter lunge leaps", detail: "x10 por pierna", reps: 10 },
        { name: "Min 6 · Split squat lateral jumps", detail: "x10 (3 pasos y salto)", reps: 10 },
        { name: "Min 7 · Ninja tuck jumps", detail: "x10", reps: 10 },
        { name: "Min 8 · Levitation squats", detail: "x10 por pierna", reps: 10 },
        { name: "Min 9 · 180 jump squats", detail: "x10", reps: 10 },
        { name: "Min 10 · Jump squats", detail: "x5 (hold 20 s / 40 s)", reps: 5 }
      ]}
    ]
  },
  {
    id: "ax-towering-inferno", name: "The Towering Inferno", category: "inferno", type: "rounds", timeCap: null,
    description: "Desafío final. 3 rondas: pesado (10RM), moderado (15RM), peso corporal. En cada 'piso': las reps indicadas + un hold isométrico que crece 5 s. Puntaje = pisos completados. Tiers: BASIX <8 · SOLID 8-9 · PRO 10-11 · ELITE 12-14 · XTREME 15/15.",
    blocks: [
      { kind: "rounds", rounds: 3, items: [
        { name: "DB bench press", detail: "R1/R2: 3 reps + hold · R3: flexiones x5 + hold", reps: 3 },
        { name: "Sentadillas con barra", detail: "R1/R2: 3 reps + hold · R3: prisoner jump squats x5 + hold", reps: 3 },
        { name: "Press militar de pie", detail: "R1/R2: 3 reps + hold · R3: pike pushups x5 + hold", reps: 3 },
        { name: "Curl con barra", detail: "R1/R2: 3 reps + hold · R3: inverted chins x5 + hold", reps: 3 },
        { name: "Rope pushdowns", detail: "R1/R2: 3 reps + hold · R3: diamond cutter pushups x5 + hold", reps: 3 }
      ]}
    ]
  },
  {
    id: "ax-firemans-carry", name: "Fireman's Carry Challenge", category: "inferno", type: "for-time", timeCap: null,
    description: "Semana 12 · Tramo de 30 yd con 4 discos de barra. Objetivo: terminar en menos de 4 min 30 s.",
    blocks: [
      { kind: "single", items: [
        { name: "Chest plate carry 30 yd + sprint de vuelta", detail: "4 viajes", reps: 4 },
        { name: "Farmer's carry 30 yd + sprint de vuelta", detail: "2 viajes", reps: 2 },
        { name: "Overhead carry 30 yd + sprint de vuelta", detail: "4 viajes", reps: 4 }
      ]}
    ]
  }
];
