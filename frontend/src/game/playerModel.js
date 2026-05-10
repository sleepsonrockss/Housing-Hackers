/** Starting stats: $1850 cash (NextTenant v2); stress 0–100. */
export const INITIAL_PLAYER_STATS = {
  money: 1850,
  stress: 50,
};

/**
 * Scenario `moneyDelta` negatives are baseline amounts; this multiplier inflates real losses
 * so money game-over is reachable on very bad paths, while typical / mixed play targets
 * ~70% money survival vs ~30% hitting $0 (tune with study data).
 */
export const MONEY_LOSS_SCALE = 5;

/** Apply loss inflation; non-negative deltas pass through rounded. */
export function applyScaledMoneyDelta(rawDelta) {
  if (typeof rawDelta !== "number" || !Number.isFinite(rawDelta)) return 0;
  if (rawDelta >= 0) return Math.round(rawDelta);
  return Math.round(rawDelta * MONEY_LOSS_SCALE);
}

/** Keep only money + stress and enforce bounds (drops legacy `mentalBattery` from saves). */
export function normalizeStats(raw) {
  const money =
    typeof raw?.money === "number" && Number.isFinite(raw.money)
      ? Math.max(0, Math.round(raw.money))
      : INITIAL_PLAYER_STATS.money;
  const stress = clamp(
    typeof raw?.stress === "number" && Number.isFinite(raw.stress) ? raw.stress : INITIAL_PLAYER_STATS.stress,
    0,
    100
  );
  return { money, stress };
}

export function applyChoiceDeltas(stats, choice) {
  const next = normalizeStats(stats);
  if (typeof choice.moneyDelta === "number") next.money += applyScaledMoneyDelta(choice.moneyDelta);
  if (typeof choice.stressDelta === "number") next.stress += choice.stressDelta;
  next.money = Math.max(0, next.money);
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

/**
 * Run loss condition after applying a choice (or for loaded stats).
 * Stress is 0–100 where a higher number means more stress; 100 ends the run.
 * Money at $0 or below ends the run (money is checked first if both apply).
 * @returns {"money" | "stress" | null}
 */
export function getGameOverReason(stats) {
  const n = normalizeStats(stats);
  if (n.money <= 0) return "money";
  if (n.stress >= 100) return "stress";
  return null;
}
