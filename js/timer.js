/* ==========================================================================
   AppGym — Motor de cronómetro
   Modos: stopwatch, countdown, amrap, emom, tabata
   ========================================================================== */

(function () {
  "use strict";

  class TimerEngine {
    /**
     * @param {object} hooks  { onTick(state), onBeep(kind), onFinish() }
     */
    constructor(hooks) {
      this.hooks = hooks || {};
      this.mode = "stopwatch";
      this.running = false;

      // Configuración
      this.durationSec = 60;   // cuenta atrás / amrap
      this.intervalSec = 60;   // emom
      this.workSec = 20;       // tabata
      this.restSec = 10;       // tabata
      this.tabataRounds = 8;   // tabata

      // Estado
      this.accumulatedMs = 0;
      this.startTs = 0;
      this.lastSignature = "";
      this.lastTickSig = "";
      this.lastDisplay = "";
      this.finished = false;

      this._interval = null;
    }

    configure(opts) {
      if (opts.mode != null) this.mode = opts.mode;
      if (opts.durationSec != null) this.durationSec = opts.durationSec;
      if (opts.intervalSec != null) this.intervalSec = opts.intervalSec;
      if (opts.workSec != null) this.workSec = opts.workSec;
      if (opts.restSec != null) this.restSec = opts.restSec;
      if (opts.tabataRounds != null) this.tabataRounds = opts.tabataRounds;
      this.reset();
    }

    get elapsedMs() {
      return this.accumulatedMs + (this.running ? Date.now() - this.startTs : 0);
    }

    get totalDurationMs() {
      switch (this.mode) {
        case "countdown":
        case "amrap": return this.durationSec * 1000;
        case "tabata": return this.tabataRounds * (this.workSec + this.restSec) * 1000;
        default: return 0;
      }
    }

    start() {
      if (this.running || this.finished) return;
      this.running = true;
      this.startTs = Date.now();
      this.lastSignature = "";
      this.lastTickSig = "";
      this.lastDisplay = "";
      this._ensureLoop();
      this._tick(true);
    }

    pause() {
      if (!this.running) return;
      this.accumulatedMs = this.elapsedMs;
      this.running = false;
      this._emitState();
    }

    toggle() {
      if (this.running) this.pause();
      else this.start();
    }

    reset() {
      this.running = false;
      this.accumulatedMs = 0;
      this.startTs = 0;
      this.finished = false;
      this.lastSignature = "";
      this.lastTickSig = "";
      this.lastDisplay = "";
      this._clearLoop();
      this._emitState();
    }

    _ensureLoop() {
      if (this._interval) return;
      this._interval = setInterval(() => this._tick(false), 80);
    }

    _clearLoop() {
      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }
    }

    _tick(force) {
      const state = this._computeState();
      if (state.signature !== this.lastSignature) {
        this.lastSignature = state.signature;
      }
      // Refresca la pantalla cada vez que cambia el segundo mostrado
      if (force || state.display !== this.lastDisplay) {
        this.lastDisplay = state.display;
        this._emitState(state);
      }
      if (state.finished && !this.finished) {
        this.finished = true;
        this.running = false;
        this.accumulatedMs = this.totalDurationMs || this.accumulatedMs;
        this._clearLoop();
        if (this.hooks.onFinish) this.hooks.onFinish(state);
      }
    }

    _computeState() {
      const elapsed = this.elapsedMs;
      let display = "00:00";
      let phase = null;
      let round = null;
      let finished = false;
      let signature = "";
      let beepKind = null;

      switch (this.mode) {
        case "stopwatch": {
          display = fmt(elapsed);
          signature = "sw:" + Math.floor(elapsed / 1000);
          break;
        }

        case "countdown":
        case "amrap": {
          const remaining = Math.max(0, this.totalDurationMs - elapsed);
          const secs = Math.ceil(remaining / 1000);
          display = fmt(remaining);
          signature = "cd:" + secs;
          finished = remaining <= 0;
          if (secs <= 3 && secs > 0 && this.lastSignature !== "cd:" + secs) {
            beepKind = "tick";
          }
          if (finished && this.lastSignature !== "cd:0") beepKind = "end";
          break;
        }

        case "emom": {
          const intervalMs = this.intervalSec * 1000;
          const capMs = this.durationSec > 0 ? this.durationSec * 1000 : 0;
          const minute = Math.floor(elapsed / intervalMs) + 1;
          if (capMs && elapsed >= capMs) {
            display = fmt(0);
            finished = true;
            round = Math.floor(capMs / intervalMs);
            signature = "emom:fin";
            if (this.lastSignature && this.lastSignature !== signature) beepKind = "end";
            break;
          }
          const inMinute = intervalMs - (elapsed % intervalMs);
          const secsLeft = Math.ceil(inMinute / 1000);
          display = fmt(inMinute);
          round = minute;
          phase = "Minuto " + minute;
          signature = "emom:" + minute;
          if (secsLeft <= 3 && secsLeft > 0) {
            const tickSig = "emom:" + minute + ":" + secsLeft;
            if (this.lastTickSig !== tickSig) { beepKind = "tick"; this.lastTickSig = tickSig; }
          }
          if (this.lastSignature && this.lastSignature !== signature) beepKind = "end";
          break;
        }

        case "tabata": {
          const cycle = (this.workSec + this.restSec) * 1000;
          const total = this.tabataRounds * cycle;
          if (elapsed >= total) {
            display = fmt(0);
            finished = true;
            signature = "tabata:fin";
            round = this.tabataRounds;
          } else {
            const pos = elapsed % cycle;
            const isWork = pos < this.workSec * 1000;
            const remaining = isWork ? this.workSec * 1000 - pos : cycle - pos;
            display = fmt(remaining);
            round = Math.floor(elapsed / cycle) + 1;
            phase = isWork ? "Trabajo" : "Descanso";
            signature = "tabata:" + round + ":" + (isWork ? "w" : "r");
            if (this.lastSignature && this.lastSignature !== signature) beepKind = "end";
          }
          break;
        }
      }

      if (beepKind && this.running) {
        if (this.hooks.onBeep) this.hooks.onBeep(beepKind);
      }

      return { display, phase, round, finished, signature, mode: this.mode };
    }

    _emitState(state) {
      const s = state || this._computeState();
      const st = {
        mode: this.mode,
        running: this.running,
        display: s.display,
        phase: s.phase,
        round: s.round,
        finished: s.finished,
        elapsedMs: this.elapsedMs
      };
      if (this.hooks.onTick) this.hooks.onTick(st);
      return st;
    }
  }

  function fmt(ms) {
    const totalSec = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  window.TimerEngine = TimerEngine;
  window.fmtTime = fmt;
})();
