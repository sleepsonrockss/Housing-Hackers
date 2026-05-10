/**
 * Stat-change SFX via Web Audio (no asset files). Money cues aim for a bright
 * mobile‑game “cash stack / ka‑ching” feel (Monopoly‑style), not literal IP.
 * Call from a user gesture (choice tap) so browsers allow sound.
 */

let sharedCtx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedCtx) sharedCtx = new Ctor();
  return sharedCtx;
}

function tone(c, { t, freq, dur, vol = 0.06, type = "sine", freqTo = null }) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (freqTo != null && freqTo > 0) {
    try {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqTo), t + dur);
    } catch {
      osc.frequency.setValueAtTime(freqTo, t + dur);
    }
  }
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

/** Short filtered noise = “paper / coin sparkle” layer on top of tones. */
function noiseBurst(c, t, duration, vol, centerHz) {
  const sr = c.sampleRate;
  const frames = Math.max(1, Math.floor(sr * duration));
  const buf = c.createBuffer(1, frames, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = centerHz;
  bp.Q.value = 1.35;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(bp);
  bp.connect(g);
  g.connect(c.destination);
  src.start(t);
  src.stop(t + duration + 0.04);
}

/** Bright stacked “coins counting up” + shimmer (mobile monopoly‑ish). */
function playCashIn(c, t0) {
  const stack = [
    { f: 1046.5, at: 0, dur: 0.085, v: 0.065 },
    { f: 1318.5, at: 0.024, dur: 0.09, v: 0.058 },
    { f: 1568, at: 0.048, dur: 0.095, v: 0.052 },
    { f: 1760, at: 0.074, dur: 0.1, v: 0.047 },
    { f: 2093, at: 0.1, dur: 0.11, v: 0.042 },
    { f: 2349.3, at: 0.128, dur: 0.12, v: 0.036 },
  ];
  for (const s of stack) {
    tone(c, {
      t: t0 + s.at,
      freq: s.f,
      dur: s.dur,
      vol: s.v,
      type: "sine",
      freqTo: s.f * 0.94,
    });
  }
  noiseBurst(c, t0, 0.038, 0.055, 2600);
  noiseBurst(c, t0 + 0.055, 0.032, 0.045, 4200);
  tone(c, {
    t: t0 + 0.14,
    freq: 3136,
    dur: 0.16,
    vol: 0.028,
    type: "triangle",
    freqTo: 2200,
  });
}

/** Heavier “vault / bills leaving” — still gamey, not the gain sparkle. */
function playCashOut(c, t0) {
  noiseBurst(c, t0, 0.055, 0.065, 520);
  noiseBurst(c, t0 + 0.018, 0.04, 0.04, 900);
  tone(c, { t: t0 + 0.02, freq: 118, dur: 0.1, vol: 0.095, type: "triangle", freqTo: 72 });
  tone(c, { t: t0 + 0.07, freq: 88, dur: 0.12, vol: 0.07, type: "sine", freqTo: 55 });
}

function playStressUp(c, t) {
  tone(c, { t, freq: 300, dur: 0.045, vol: 0.04, type: "triangle" });
  tone(c, { t: t + 0.04, freq: 245, dur: 0.065, vol: 0.032, type: "triangle", freqTo: 180 });
}

function playStressDown(c, t) {
  tone(c, { t, freq: 392, dur: 0.1, vol: 0.042, type: "sine", freqTo: 294 });
}

/**
 * @param {number | null | undefined} moneyScaled — value after `applyScaledMoneyDelta`
 * @param {number | null | undefined} stressRaw — raw stress delta from the choice
 */
export function playChoiceStatSfx(moneyScaled, stressRaw) {
  if (typeof window === "undefined") return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  } catch {
    /* ignore */
  }

  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume().catch(() => {});

  const hasMoney = moneyScaled != null && moneyScaled !== 0;
  const hasStress = stressRaw != null && stressRaw !== 0;
  if (!hasMoney && !hasStress) return;

  const t0 = c.currentTime;
  let stressAt = t0;

  if (hasMoney) {
    if (moneyScaled > 0) {
      playCashIn(c, t0);
      stressAt = t0 + 0.22;
    } else {
      playCashOut(c, t0);
      stressAt = t0 + 0.16;
    }
  }

  if (hasStress) {
    if (stressRaw > 0) playStressUp(c, stressAt);
    else playStressDown(c, stressAt);
  }
}
