/**
 * sounds.js — Web Audio API synthesized sound effects for TinyGames
 * No audio files needed. Works on all modern browsers.
 * Usage: Sounds.play('click') / Sounds.play('win') etc.
 */
const Sounds = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Resume if suspended (autoplay policy)
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone({ type = 'sine', freq = 440, freq2, duration = 0.15, gain = 0.3, delay = 0 }) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const vol = c.createGain();

      osc.connect(vol);
      vol.connect(c.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      if (freq2) osc.frequency.exponentialRampToValueAtTime(freq2, c.currentTime + delay + duration);

      vol.gain.setValueAtTime(gain, c.currentTime + delay);
      vol.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);

      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration);
    } catch (e) { /* Silently ignore if audio not supported */ }
  }

  const effects = {
    // ── Shared ──────────────────────────────────────────────
    click() {
      tone({ type: 'sine', freq: 600, freq2: 400, duration: 0.08, gain: 0.2 });
    },
    win() {
      tone({ type: 'sine', freq: 523, duration: 0.15, gain: 0.3 });
      tone({ type: 'sine', freq: 659, duration: 0.15, gain: 0.3, delay: 0.15 });
      tone({ type: 'sine', freq: 784, duration: 0.3,  gain: 0.35, delay: 0.3 });
    },
    lose() {
      tone({ type: 'sawtooth', freq: 300, freq2: 150, duration: 0.4, gain: 0.3 });
    },
    // ── Tic-Tac-Toe ─────────────────────────────────────────
    place() {
      tone({ type: 'sine', freq: 500, freq2: 350, duration: 0.1, gain: 0.25 });
    },
    // ── Dots & Boxes ────────────────────────────────────────
    drawLine() {
      tone({ type: 'triangle', freq: 400, duration: 0.08, gain: 0.2 });
    },
    claimBox() {
      tone({ type: 'sine', freq: 700, duration: 0.1, gain: 0.3 });
      tone({ type: 'sine', freq: 900, duration: 0.1, gain: 0.3, delay: 0.1 });
    },
    // ── Block Drop ──────────────────────────────────────────
    move() {
      tone({ type: 'square', freq: 220, duration: 0.05, gain: 0.1 });
    },
    rotate() {
      tone({ type: 'sine', freq: 350, freq2: 500, duration: 0.1, gain: 0.2 });
    },
    lineClear() {
      tone({ type: 'sine', freq: 523, duration: 0.1, gain: 0.3 });
      tone({ type: 'sine', freq: 659, duration: 0.1, gain: 0.3, delay: 0.1 });
      tone({ type: 'sine', freq: 880, duration: 0.2, gain: 0.35, delay: 0.2 });
    },
    drop() {
      tone({ type: 'triangle', freq: 180, freq2: 100, duration: 0.12, gain: 0.25 });
    },
    gameOver() {
      tone({ type: 'sawtooth', freq: 440, freq2: 220, duration: 0.3, gain: 0.3 });
      tone({ type: 'sawtooth', freq: 220, freq2: 110, duration: 0.4, gain: 0.3, delay: 0.3 });
    }
  };

  return { play: (name) => { if (effects[name]) effects[name](); } };
})();
