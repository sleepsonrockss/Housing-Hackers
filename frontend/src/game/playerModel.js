/** Starting stats for the narrative run (design: $1850 cash, 50 / 50 on other meters). */
export const INITIAL_PLAYER_STATS = {
  money: 1850,
  mentalBattery: 50,
  stress: 50,
};

export function applyChoiceDeltas(stats, choice) {
  const next = { ...stats };
  if (typeof choice.moneyDelta === "number") next.money += choice.moneyDelta;
  if (typeof choice.mentalBatteryDelta === "number") next.mentalBattery += choice.mentalBatteryDelta;
  if (typeof choice.stressDelta === "number") next.stress += choice.stressDelta;
  next.money = Math.max(0, next.money);
  next.mentalBattery = clamp(next.mentalBattery, 0, 100);
  next.stress = clamp(next.stress, 0, 100);
  return next;
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

export function mergeFlags(flags, choice) {
  const out = { ...flags };
  if (Array.isArray(choice.flagsSet)) {
    for (const f of choice.flagsSet) out[f] = true;
  }
  return out;
}
