# AppGym — Handoff: módulo "Programa" (plan de pesas AthleanX Max/Size)

Estado al 2026-09-08. Este doc existe para que otra sesión de Claude Code
continúe **sin necesidad del PDF original** ni de releer todo el chat.

**Estado del módulo "Programa": las 12 semanas están cargadas y verificadas
contra la fuente del usuario** (Fase 1 sem 1-4, Fase 2 sem 5-8, Fase 3 sem 9-12).
Sesiones de pesas, retos de sábado y de cierre, y "Five Alarm" / "Athletic Pillar"
finishers — estos últimos con `steps` y botón "Empezar finisher" que los corre en
el runner. Ver secciones FASE 1/2/3 más abajo para las correcciones concretas.

---

## 1. Qué es la app hoy

Web estática (sin build, sin dependencias) desplegada en GitHub Pages:
**https://andriwayssolutions.github.io/appgym/** — repo `andriwayssolutions/appgym`.

Archivos:
- `index.html` — 3 vistas: Contador, Rutinas, Cronómetro + overlay `#runner` + modales.
- `css/styles.css` — tema oscuro, tokens CSS, responsive. Los assets llevan `?v=N`
  (subir N en cada deploy para romper caché de GitHub Pages).
- `js/data.js` — `window.EXERCISES` (datalist) y `window.WODS` (rutinas benchmark,
  hero y ahora **inferno/Retos**).
- `js/videos.js` — catálogo de vídeos por movimiento + `resolveMovementVideo()`
  (normaliza acentos/plural/variantes; devuelve null si no hay id → no muestra nada).
- `js/timer.js` — `window.TimerEngine` (stopwatch / countdown / emom / tabata),
  usa `Date.now()` de referencia. `pause()` NO limpia el intervalo → usar
  `reset()` o `_clearLoop()` al descartar una instancia.
- `js/app.js` — toda la lógica. IIFE. Estado en `localStorage` clave `appgym:v1`
  con `deepMerge` sobre `DEFAULTS`.
- `_devserver.js` — server local sin dependencias (`node _devserver.js` → :8765),
  con cabeceras `no-store`. Está en `.gitignore`, no se despliega.

### Modelo de datos de una rutina (`window.WODS`)
```js
{
  id, name, category: "benchmark" | "hero" | "inferno",
  type: "for-time" | "rounds" | "amrap" | "emom",
  timeCap: segundos | null,
  description,
  blocks: [
    { kind: "rounds", rounds: N | [21,15,9], items: [{ name, detail, reps: N|null }] },
    { kind: "single", items: [{ name, detail, reps }] },
    { kind: "amrap",  items: [{ name, detail, reps }] },
    { kind: "emom",   items: [{ name, detail, reps }] }
  ]
}
```
`resolvePreset()` / `resolveCustom()` → `{ type: "linear" | "amrap" | "emom", steps|circuit, timeCap }`.

### El runner (overlay `#runner`)
- **linear** (for-time / rounds): arranca en **vista general** (`renderOverview()`),
  grilla responsive de tarjetas por ejercicio con barra de progreso + `+/-` inline
  (`ovStepAdjust`). Tocás una tarjeta → `openRunnerStepDetail(idx)` → vista individual
  (contador grande, vídeo, `+/-`, "paso anterior" con ícono de retorno, "siguiente paso").
  Botón de grilla `#runnerOverview` en la barra superior vuelve al resumen.
  Las reps se guardan por índice en `runner.repsByIndex[]` (no se pierden al saltar).
  "Finalizar rutina" desde el resumen → `finishRunner()`.
- **amrap / emom**: van directo a la vista individual/circuito, sin resumen.
- `runner` es un objeto global; `startRunner()` lo recrea entero. `exitRunner()`
  restaura `#runnerBody` a `runnerBodyTemplate` (importante: si no, la siguiente
  rutina lo encuentra a medio armar — ese fue un bug real ya arreglado).

---

## 2. Qué se hizo esta sesión (ya deployado)

Categoría **"Retos"** (`category: "inferno"`) con 12 desafíos de acondicionamiento
del programa, en `js/data.js` (al final del array): `ax-burn-ladder`, `ax-diabol-x`,
`ax-fire-ice`, `ax-bump-run`, `ax-sprint-ladder`, `ax-tracknophobia`, `ax-hot-plate`,
`ax-you-in-30` (antes 3 WODs push/pull/legs; ahora uno solo, EMOM `perMinute`
de 30′), `ax-towering-inferno`, `ax-firemans-carry`.
Filtro nuevo "Retos" en `index.html`, badge `.badge-inferno` (ámbar), y el gate de
`renderRoutines()` pasó a `if (routineFilter !== "custom")`.

**Lo que NO se hizo:** el plan de pesas de 12 semanas. Eso es este handoff.

---

## 3. El programa de pesas — estructura completa (transcrita del PDF)

Título: **ATHLEAN INFERNO — MAX/SIZE**. 12 semanas, 3 fases. Lun/Mar/Jue/Vie
pesas, Mié/Dom OFF, Sáb reto (ya cargados como "Retos").

### FASE 1 — "IGNITION" / método XV-10 ("10-by") — Semanas 1-4
Cada día de pesas = 2 ejercicios:
- Ejercicio A: **10 × 10** al **60% del 1RM**
- Ejercicio B: **10 × 5** al **8RM / 75% del 1RM**
- Descanso: **1 min dentro** de un "10-by"; **3-5 min entre** los dos 10-by.
- Sem 1-2: terminar TODAS las series de A antes de pasar a B.
- Sem 3-4: **series alternadas** A/B hasta completar las 20.

Pares de músculos y ejercicios (rotan el orden A/B cada semana):
| Día | Sem 1 (A / B) | Ejercicios |
|---|---|---|
| Lun | Pecho / Espalda | Incline Bench Press (DB o BB) / Underhand Barbell Rows |
| Mar | Cuádriceps / Isquios | Barbell Squats / Deadlifts |
| Jue | Bíceps / Tríceps | Barbell Curls / Lying Triceps X-Tensions (EZ o DB) |
| Vie | Hombros / Trapecios | DB Shoulder Press / DB High Pulls |

Sem 2: se invierte (Espalda/Pecho, Isquios/Cuádriceps, Tríceps/Bíceps, Trapecios/Hombros)
— el que era 10×10 pasa a 10×5 y viceversa. Sem 3-4 igual pero alternando series.

**Finishers por músculo:**
- Sem 1-2 "PRO-PAIN": máx reps al fallo → completar **2× ese número en 4:30**.
  El reloj arranca al terminar la última rep de la primera serie.
  (Pecho: pushups. Espalda: inverted rows. Cuádriceps: prisoner jump squats.
   Isquios: physioball ham curls. Bíceps: inverted chin rows. Tríceps: bench dips.
   Hombros: DB neutral OHP @50% 12RM. Trapecios: seated DB shrugs @50% 12RM.)
- Sem 3-4 "ISO-PRO-PAIN": hold isométrico 60 s → completar el nº de reps del fallo
  original **en 9 min**. Cada vez que descansás, retomás con un hold de 30 s.

**Sáb Sem 1:** Burn Ladder · **Sáb Sem 2:** Diabol-X · **Sáb Sem 3:** Fire and Ice ·
**Sáb Sem 4:** The 'You in 30 Minutes' Challenge (`ax-you-in-30`).

### "You in 30 Minutes" (Sáb Sem 4) — estructura real
**3 bloques de 10′** (empuje / tirón / pierna). Cada bloque es un EMOM: al arrancar
el minuto hacés las reps del ejercicio de ese minuto y descansás lo que sobra; al
minuto siguiente cambia el ejercicio. **Si no completás las reps de un minuto a
tiempo, el bloque termina ahí.** Descanso de 1-2′ (config `restBetweenSec: 90`) y
arranca el bloque siguiente. Empuje 10 reps/min salvo aclaración; tirón 6; pierna
10. Minuto 10 de cada bloque: 5 reps + hold abajo 20-40 s según nivel.
Puntaje = total de minutos completados con éxito entre los 3 bloques (máx 30).
Tiers: BASIX ≤14 · SOLID 15-19 · PRO 20-25 · ELITE 26-29 · XTREME 30/30.

En el código: un solo WOD `ax-you-in-30`, `type:"emom"` + `perMinute:true`, con 3
`blocks` de `kind:"emom"` (cada uno con `label` y 10 `items`). `resolvePreset`
devuelve `segments:[{label,circuit}]`. El runner de `app.js` (`startBlock` /
`evalMinute` / `endBlock` / `showInterBlock`): reconfigura el `TimerEngine` EMOM
por bloque (10′), evalúa cada minuto al cambiar de minuto (`onTick` con `st.round`),
corta el bloque si el minuto no se marcó/no llegó a las reps, muestra la pantalla
de descanso (countdown) entre bloques y suma `successMinutes` para el puntaje
final. Botones nuevos en el runner: "Completé el minuto" (`runnerNext` en
perMinute), "No llegué — cortar bloque" (`#runnerEndBlock`), "Empezar … ahora"
(`#runnerNextBlock`).

### FASE 2 — "AX-RSON TRAINING" — Semanas 6-8
Hipertrofia más clásica. Cada músculo:
- **2 series** de superserie A1+A2 (6-9RM cada uno), 2 min descanso.
- **3 series** de "drop a isométrico": A1 (10RM) × 8 reps → hold isométrico. 90 s descanso.
- **5 series** rectas de un básico (6-9RM), 60 s descanso.
- **"FIVE ALARM FINISHER"** (circuito con nombre, 1-3 rondas).

Días: Lun Pecho/Tríceps · Mar Cuádriceps/Isquios · Jue Hombros/Trapecios+Upper Back
· Vie Espalda/Bíceps.

**CORRECCIONES (fuente del usuario, sem 5 y 6 verificadas):**
- Días de Fase 2: Lun Pecho/Tríceps · Mar Cuádriceps/Isquios · **Jue
  Hombros/Trapecios+Upper Back** · Vie Espalda/Bíceps (el `F2_DAYS` ya estaba así).
- **El ejercicio del drop→iso ROTA por semana** dentro de la superserie [A1, A2]:
  - **sem 5 y 7 (impares)** → **A2** (2º movimiento): Chest=DB Incline Press,
    Quads=Barbell Squats, Hams=Hip Thrust, Delts=DB OHP, Traps=Face Pulls,
    Back=Lat Pulldowns, Bis=DB Straight Bar Curls, Tris=DB Incline Tri Ext.
  - **sem 6 y 8 (pares)** → **A1** (1er movimiento): Chest=Floor Flys,
    Quads=Bulgarian Split Squats, Hams=PB Glute Ham Raise, Delts=DB Scaptions,
    Traps=Barbell Shrugs, Back=Straight-Arm Pushdowns, Bis=DB Spider Curls,
    Tris=DB Inverted Kickbacks.
  - En el código: `F2_MUSCLES` ya no tiene `dropIso`; `buildF2Session` calcula
    `dropIdx = week % 2 === 0 ? 0 : 1` sobre `x.superset`. (7-8 = asunción por
    paridad; confirmar cuando lleguen esas semanas.)
- Superset A1 de **Cuádriceps** = Bulgarian Split Squat **hold isométrico al
  fallo por pierna** (no reps); va en `F2_MUSCLES.Cuádriceps.ssNote`.
- Finishers **sem 5 y 6** = mismos (`F2_MUSCLES[m].finisher`). **Sem 7 y 8** =
  mismos entre sí, en `F2_FINISHERS_W78` (Fire on the Floor, Tri-al by Fire,
  Blast Off, 3rd Degree Lunges, Smoldering Shoulders, Entrapment, Ladder 8, Fire
  Pit) — verificados contra la fuente en ambas semanas.
- `buildF2Session`: `week <= 6 ? x.finisher : F2_FINISHERS_W78[m]`.
- Rotación del drop→iso confirmada por las 4 semanas: **5 y 7 → A2 · 6 y 8 → A1**.
- Sáb: sem 5 Bump and Run (`ax-bump-run`) · sem 6 Sprint Ladder
  (`ax-sprint-ladder`) · sem 7 A-Track-Nophobia (`ax-tracknophobia`, reescrito:
  1 milla/4 vueltas) · sem 8 Hot Plate (`ax-hot-plate`, reescrito: `rounds:2` de
  la secuencia 200 yd + `single` de sprints; tiers por tiempo). Todos OK.
- **Five Alarm Finishers → enganchados al runner.** Cada finisher de Fase 2
  (`F2_MUSCLES[m].finisher` y `F2_FINISHERS_W78[m]`) ahora tiene
  `{ name, rounds, protocol, steps:[{name,detail,reps}] }` (`reps:0` = al fallo /
  hold / libre). `buildF2Session` los pasa con `steps`+`rounds`. La tarjeta del
  finisher lista los pasos numerados + botón **"Empezar finisher"** →
  `startFinisher()` arma un WOD con `finisherWod()` (`type:"rounds"` si rounds>1,
  si no `"for-time"`) y lo abre con **`window.AppGym.startWod(wod)`** (API nueva
  en app.js, hermana de `startWodById`). Ladder 8 se expande con `ladder8Steps()`
  (16 pasos). Los finishers de Fase 1 (`kind:"propain"`) y Fase 3 (`note` sin
  `steps`) no cambian.

Ejercicios (Sem 6, se repiten en 7-8 cambiando finishers):
- **Pecho**: Floor Flys ⇒ Incline Bench Press // **Incline Bench Press** (10RM) ⇒ iso // Bench Press.
  Finisher "Pec Purgatory" (3 rondas): DB Incline Bench midrange ×F ⇒ Lower Dip Stretch Hold 30s ⇒ Cable Cross Contraction burnout.
- **Tríceps**: DB Inverted Kickbacks ⇒ DB Incline Tricep Ext // (10RM)⇒iso // Close Grip Bench.
  Finisher "Steel Moving": Triceps Pushdowns (12RM) ×F ⇒ 1½× ese nº sin soltar.
- **Cuádriceps**: Bulgarian Split Squat Hold al fallo/pierna ⇒ Barbell Squats // (10RM)⇒iso // DB Alt Reverse Lunges.
  Finisher "Liquid Legs": DB Goblet Squat ×100 total; Wall Sit 1 min en cada minuto par.
- **Isquios**: PB Glute Ham Raise ⇒ Barbell Hip Thrust // (10RM)⇒iso // Stiff Legged DL.
  Finisher "Asses to Ashes": KB Swings ×100; Long Legged Bridge Hold 1 min en minuto par.
- **Hombros**: DB Scaptions ⇒ DB OHP // (10RM)⇒iso // Barbell Clean and Press.
  Finisher "Cannonball Run": DB Side Laterals (8RM) ×F bajando rack a 10 lb ⇒ DB Shoulder Press ×F subiendo.
- **Trapecios/Upper Back**: Barbell Shrugs ⇒ Face Pulls // (10RM)⇒iso // DB High Pulls.
  Finisher "Inferno Crossfire" (3 rondas): Overhead Trap Raises ×30 ⇒ Band Pull Aparts ×30 ⇒ DB Shrug Holds 30s.
- **Espalda**: Straight Arm Pushdowns ⇒ Lat Pulldowns // (10RM)⇒iso // Barbell Rows.
  Finisher "Alphabet Arson" (3 rondas): Prone Incline DB Y's (15RM) ×F ⇒ T's ×F ⇒ I's ×F ⇒ Hyperextensions ×F.
- **Bíceps**: DB Spider Curls ⇒ DB Straight Bar Curls // (10RM)⇒iso // DB Hammer Curls.
  Finisher "Hang Em, Bang Em or Burn": Standing DB Curls (12RM) ×F ⇒ 1½× ese nº sin soltar.

Sem 7-8 cambian sólo los finishers (Smoldering Shoulders, Entrapment, Ladder 8,
Fire Pit, Fire on the Floor, Tri-al by Fire, Blast Off, 3rd Degree Lunges...).
**Sáb Sem 5:** Bump and Run · **Sáb Sem 6:** Sprint Ladder · **Sáb Sem 7:** A-Track-Nophobia · **Sáb Sem 8:** Hot Plate.

### FASE 3 — "MAX DEVELOPMENT" / BACKFIRE TRAINING — Semanas 9-12 (verificada)
- **Días concéntricos**: 12RM, tempo **1/1/5**, **50 reps por ejercicio**.
- **Días excéntricos**: 6RM, tempo **5/1/1**, **25 reps por ejercicio**.
- Completá TODAS las reps de un ejercicio antes de pasar al siguiente.
- "Cada vez que descansás": 60 s del **estiramiento** (conc) o la **flex /
  contracción isométrica** (ecc) del músculo trabajado, y seguís repitiendo.
- **4 bloques** de 4 movimientos (`F3_BLOCKS`): pushA, pushB, pullA, pullB. Cada
  ítem tiene su `stretch` y su `flex` pareados.
- **Calendario real por semana** en `F3_SCHEDULE` (cada semana distinta; días que
  no figuran = descanso; sem 11 lun = OFF):
  - **W9:** Lun pushA conc · Mar pushA ecc · Jue pullA conc · Vie pullA ecc · Dom pushB conc
  - **W10:** Lun pushB ecc · Mié pullB conc · Jue pullB ecc · Sáb pushA conc · Dom pushA ecc
  - **W11:** Mar pullA conc · Mié pullA ecc · Vie pushB conc · Sáb pushB ecc
  - **W12:** Lun pullB conc · Mar pullB ecc · **Jue Fireman's Carry · Vie Towering Inferno**
- **Athletic Pillar finishers** (`F3_PILLARS`, 8): linear-loco (1 milla),
  nonlinear-loco (Agility Wheel), crawl, jump (soga 200/100/100/100/200),
  static-flex, static-balance, dynamic-balance, dynamic-flex (2 rondas, 1 por
  pierna). Todos con `steps` → "Empezar finisher" corre en el runner.
- `phaseOf` ahora: `<=4 → 1, <=8 → 2, resto → 3`. `weekPlan` maneja la sem 12
  jue/vie como retos y el resto de la Fase 3 por `F3_SCHEDULE`.

### Retos de cierre (Sem 12) — reescritos
- **`ax-firemans-carry`**: `single` con chest carry ×4, farmer's ×2, overhead ×4
  (sprint de vuelta cada viaje). Objetivo < 4:30.
- **`ax-towering-inferno`**: `single` de **15 "pisos"** (R1 10RM / R2 15RM / R3
  peso corporal, 5 pisos c/u; reps + holds crecientes 5→15/20/25 s). Puntaje =
  pisos completados. Tiers BASIX <8 · SOLID 8-9 · PRO 10-11 · ELITE 12-14 · XTREME 15.

### Tiers de puntuación (para desafíos con score)
BASIX / SOLID / PRO / ELITE / XTREME. Los umbrales están en la `description` de
cada reto en `data.js` (Hot Plate, You in 30, Towering Inferno).

---

## 4. Módulo "Programa" propuesto — arquitectura

### 4ª pestaña
Agregar `<button class="tab" data-view="program">` en `#tabbar` y
`<section id="view-program">`. `switchView()` ya es genérico.

### Datos: `js/program.js` → `window.PROGRAMS`
```js
window.PROGRAMS = [{
  id: "ax-max-size",
  name: "AthleanX Max/Size",
  weeks: 12,
  lifts: [   // ejercicios base para pedir el RM en el onboarding
    { id: "incline-bench", name: "Incline Bench Press", rmType: "1RM" },
    { id: "underhand-row",  name: "Underhand Barbell Row", rmType: "1RM" },
    { id: "squat", name: "Barbell Squat", rmType: "1RM" },
    { id: "deadlift", name: "Deadlift", rmType: "1RM" },
    { id: "db-shoulder-press", name: "DB Shoulder Press", rmType: "1RM" },
    { id: "db-high-pull", name: "DB High Pull", rmType: "1RM" },
    { id: "bb-curl", name: "Barbell Curl", rmType: "1RM" },
    { id: "lying-tri-ext", name: "Lying Triceps X-Tension", rmType: "1RM" }
    // fase 2/3 usan 6-9RM/10RM/12RM: pedirlos también o derivar de 1RM con tabla estándar
  ],
  schedule: [   // 12 * 7 entradas, o generado por función
    { week: 1, day: "mon", kind: "lift", title: "Pecho / Espalda", session: "w1-mon" },
    { week: 1, day: "wed", kind: "off" },
    { week: 1, day: "sat", kind: "challenge", wodId: "ax-burn-ladder" },
    ...
  ],
  sessions: {
    "w1-mon": {
      title: "XV-10 · Pecho / Espalda",
      note: "Terminá las 10 series de A antes de pasar a B. Descanso 1 min dentro, 3-5 min entre.",
      exercises: [
        { name: "Incline Bench Press", scheme: { type: "sets", sets: 10, reps: 10, loadPct: 0.60, restSec: 60 }, liftId: "incline-bench" },
        { name: "Underhand Barbell Rows", scheme: { type: "sets", sets: 10, reps: 5, loadPct: 0.75, restSec: 60 }, liftId: "underhand-row" }
      ],
      finishers: [
        { name: "Chest Pro-Pain", protocol: "Máx pushups al fallo → 2× ese nº en 4:30" },
        { name: "Back Pro-Pain",  protocol: "Máx inverted rows al fallo → 2× ese nº en 4:30" }
      ]
    }
    // tipos de scheme: "sets" (fase 1-2), "tempoReps" (fase 3: {reps, tempo, loadPct}), "superset", "dropToИso"
  }
}];
```

### Estado (localStorage, clave nueva `appgym:program:v1`)
```js
{
  activeProgramId: "ax-max-size",
  rms: { "incline-bench": 80, "squat": 140, ... },   // kg (o lb, con toggle de unidad)
  cursor: { week: 3, day: "tue" },                    // dónde va
  log: {
    // por sesión-fecha: series reales
    "w3-tue|2026-09-05": {
      "squat":    [{ w: 84, r: 10 }, { w: 84, r: 10 }, ...],   // 10 entradas
      "deadlift": [{ w: 105, r: 5 }, ...]
    }
  },
  done: { "w1-mon": true, "w1-tue": true, ... }
}
```

### Pantallas
1. **Onboarding** (primera vez o botón "editar RMs"): inputs de RM por lift,
   toggle kg/lb. Calcula y muestra los pesos de trabajo (60%, 75%). Redondeo a 2.5.
2. **Calendario**: grilla 12 semanas × 7 días. Día actual resaltado. Cada celda:
   título corto + estado (hecho ✓ / pendiente / off). Tap → abre la sesión.
   Barra de progreso global "Semana 3 de 12".
3. **Sesión** (el "runner" de pesas — reusar patrón de `renderOverview`):
   lista de ejercicios; cada uno muestra el esquema resuelto ("10 × 10 @ 48 kg,
   descanso 1:00"). Tap en una serie → registrar **peso real + reps reales**
   (default = prescrito) → al confirmar arranca **countdown de descanso** con
   `TimerEngine` (mode countdown, `restSec`) → siguiente serie.
   Serie marcada ✓ al registrarla. Ejercicio ✓ al completar todas las series.
   Botón "Finalizar sesión" → marca el día como hecho, avanza `cursor`.
4. **Finishers**: si el finisher tiene forma de WOD (circuito/EMOM/for-time),
   generar un WOD al vuelo y llamar `startRunner()`. Si no (pro-pain "2× en 4:30"),
   pantallita simple: input del nº de fallo → countdown 4:30 + contador.
5. **Historial por ejercicio**: "Última vez: 10×10 @ 45 kg (hace 6 días)".
   Idealmente sugerir subir el peso si completaste todas las reps.

### Timer de descanso
`TimerEngine` ya soporta `countdown`. Ojo: al descartar la instancia, llamá
`reset()` (no sólo `pause()`) para que no quede el `setInterval` vivo.

### Tempos (fase 3)
Metrónomo: para `1/1/5` → beep/flash en 1s (concéntrico), 1s (pausa), 5s (excéntrico).
Reusar `sound()` de `app.js`. Opcional en MVP.

---

## 5. Plan por fases (para la próxima sesión)

- **MVP (fase A)**: `program.js` con `ax-max-size` (al menos Fase 1 completa, 4 semanas)
  + 4ª pestaña + onboarding RMs + calendario + pantalla de sesión con log de series
  + countdown de descanso + marcar día hecho. Usable de punta a punta.
- **Fase B**: historial/progresión por ejercicio, sugerencia de subir peso,
  Fases 2 y 3 del programa (schemes superset / tempoReps), enganche de finishers al runner.
- **Fase C**: metrónomo de tempo, tiers de puntuación en pantalla de fin,
  exportar/compartir progreso, unidades lb.

### Decisiones abiertas para preguntarle al usuario
1. ¿Unidad por defecto kg o lb? (el PDF está en lb).
2. ¿Pedimos sólo el 1RM y derivamos 6-9/10/12RM con tabla, o pedimos cada uno?
3. ¿El calendario es fecha-real (empezás un lunes concreto) o sólo "semana/día"
   relativo que vas avanzando manualmente?
4. ¿Transcribir las 12 semanas completas ahora, o Fase 1 (4 sem) para el MVP y
   el resto después?
5. ¿El log de series se guarda sólo local, o se piensa en sync algún día
   (cambiaría a Supabase/Firebase)?

---

## 6. Recordatorios de infra
- Deploy = `git push` a `main` → GitHub Pages rebuild ~1 min. Subir `?v=N` en `index.html`.
- Verificar en vivo, no sólo local: GitHub Pages cachea 10 min (por eso el `?v=`).
- El sandbox de Claude Code no comparte `localhost` con el Chrome del usuario:
  probar con el navegador integrado o Claude-in-Chrome, o pedirle capturas.
- No hay `package.json` — todo vanilla, sin `npm install`. Mantenerlo así.
