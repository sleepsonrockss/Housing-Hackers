/**
 * Stat-change SFX (Web Audio). Bright mobile-style “cha‑ching” for money in,
 * heavier scrape + thump for money out — original synthesis. Loudness is
 * boosted on a dedicated bus so it reads on laptop speakers.
 *
 * Call from a user gesture (choice tap). We do NOT skip on prefers-reduced-motion
 * (that was muting SFX for many users); add a settings mute later if needed.
 */

let sharedCtx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedCtx) sharedCtx = new Ctor();
  return sharedCtx;
}

/** Preamp + light compression so stacked layers stay audible without nasty clipping. */
function getSfxBus(c) {
  if (c._sfxBus) return c._sfxBus;
  const pre = c.createGain();
  pre.gain.value = 2.55;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -22;
  comp.knee.value = 18;
  comp.ratio.value = 2.8;
  comp.attack.value = 0.002;
  comp.release.value = 0.12;
  pre.connect(comp);
  comp.connect(c.destination);
  c._sfxBus = pre;
  return c._sfxBus;
}

function tone(c, { t, freq, dur, vol = 0.06, type = "sine", freqTo = null }) {
  const bus = getSfxBus(c);
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
  g.gain.linearRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(bus);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

function noiseBurst(c, t, duration, vol, centerHz, q = 1.45) {
  const bus = getSfxBus(c);
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
  bp.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(bp);
  bp.connect(g);
  g.connect(bus);
  src.start(t);
  src.stop(t + duration + 0.04);
}

function noiseSweep(c, t, duration, vol, fromHz, toHz) {
  const bus = getSfxBus(c);
  const sr = c.sampleRate;
  const frames = Math.max(1, Math.floor(sr * duration));
  const buf = c.createBuffer(1, frames, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(fromHz, t);
  try {
    bp.frequency.exponentialRampToValueAtTime(Math.max(400, toHz), t + duration);
  } catch {
    bp.frequency.setValueAtTime(toHz, t + duration);
  }
  bp.Q.value = 1.85;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(bp);
  bp.connect(g);
  g.connect(bus);
  src.start(t);
  src.stop(t + duration + 0.05);
}

function metallicCoinHit(c, t, baseFreq, dur, vol) {
  const det = [-1.2, 0, 1.6];
  for (let k = 0; k < det.length; k++) {
    tone(c, {
      t,
      freq: baseFreq + det[k],
      dur,
      vol: vol * 0.42,
      type: "sine",
      freqTo: Math.max(80, baseFreq * 0.86 + det[k]),
    });
  }
  tone(c, {
    t,
    freq: baseFreq * 2.003,
    dur: dur * 0.92,
    vol: vol * 0.22,
    type: "triangle",
    freqTo: baseFreq * 1.72,
  });
  tone(c, {
    t: t + 0.0015,
    freq: baseFreq * 3.98,
    dur: dur * 0.55,
    vol: vol * 0.08,
    type: "sine",
  });
}

function playCashIn(c, t0) {
  const freqs = [
    987.77, 1174.66, 1318.51, 1396.91, 1567.98, 1760.0, 1864.66, 1975.53, 2093.0, 2217.46,
  ];
  const step = [0.019, 0.018, 0.017, 0.019, 0.018, 0.017, 0.019, 0.018, 0.02];
  let tHit = t0;
  for (let i = 0; i < freqs.length; i++) {
    const v = Math.max(0.03, 0.09 - i * 0.005);
    const d = 0.08 + i * 0.002;
    metallicCoinHit(c, tHit, freqs[i], d, v);
    noiseBurst(c, tHit, 0.016, 0.038 + i * 0.002, 2600 + i * 200, 1.65);
    if (i < step.length) tHit += step[i];
  }

  noiseSweep(c, t0 + 0.008, 0.1, 0.075, 1100, 7200);
  noiseBurst(c, t0 + 0.11, 0.04, 0.065, 5400, 2.0);

  const tail = t0 + 0.15;
  metallicCoinHit(c, tail, 2637.02, 0.14, 0.05);
  metallicCoinHit(c, tail + 0.028, 2349.32, 0.12, 0.032);
  metallicCoinHit(c, tail + 0.052, 2093.0, 0.1, 0.022);
  noiseBurst(c, tail + 0.02, 0.028, 0.045, 6600, 2.2);
}

function playCashOut(c, t0) {
  noiseSweep(c, t0, 0.075, 0.075, 950, 200);
  noiseBurst(c, t0 + 0.012, 0.048, 0.065, 360, 0.95);
  tone(c, { t: t0 + 0.015, freq: 165, dur: 0.06, vol: 0.095, type: "triangle", freqTo: 92 });
  tone(c, { t: t0 + 0.048, freq: 98, dur: 0.12, vol: 0.11, type: "sine", freqTo: 55 });
  tone(c, { t: t0 + 0.095, freq: 72, dur: 0.11, vol: 0.075, type: "triangle", freqTo: 45 });
  noiseBurst(c, t0 + 0.1, 0.034, 0.038, 580, 1.05);
}

function playStressUp(c, t) {
  tone(c, { t, freq: 300, dur: 0.045, vol: 0.065, type: "triangle" });
  tone(c, { t: t + 0.04, freq: 245, dur: 0.065, vol: 0.05, type: "triangle", freqTo: 180 });
}

function playStressDown(c, t) {
  tone(c, { t, freq: 392, dur: 0.1, vol: 0.065, type: "sine", freqTo: 294 });
}

function scheduleAll(c, moneyScaled, stressRaw) {
  const t0 = c.currentTime + 0.008;
  let stressAt = t0;

  const hasMoney = moneyScaled != null && moneyScaled !== 0;
  const hasStress = stressRaw != null && stressRaw !== 0;
  if (!hasMoney && !hasStress) return;

  if (hasMoney) {
    if (moneyScaled > 0) {
      playCashIn(c, t0);
      stressAt = t0 + 0.3;
    } else {
      playCashOut(c, t0);
      stressAt = t0 + 0.18;
    }
  }

  if (hasStress) {
    if (stressRaw > 0) playStressUp(c, stressAt);
    else playStressDown(c, stressAt);
  }
}

/**
 * @param {number | null | undefined} moneyScaled — value after `applyScaledMoneyDelta`
 * @param {number | null | undefined} stressRaw — raw stress delta from the choice
 */
export function playChoiceStatSfx(moneyScaled, stressRaw) {
  if (typeof window === "undefined") return;
  const c = getCtx();
  if (!c) return;

  const fire = () => scheduleAll(c, moneyScaled, stressRaw);

  if (c.state === "suspended") {
    void c.resume().then(fire, fire);
  } else {
    fire();
  }
}
