import { applyScaledMoneyDelta } from "./playerModel";

/**
 * Replace `{{balance}}` with the player's current cash (formatted).
 * `{{amt:N}}` — literal dollar copy (e.g. wage rates, neutral references).
 * `{{loss:N}}` — N is baseline dollars lost; display matches what `applyScaledMoneyDelta(-N)` deducts from balance.
 */
export function interpolateScenarioText(text, stats) {
  if (typeof text !== "string") return "";
  const balance = typeof stats?.money === "number" ? stats.money : 0;
  let out = text.replace(/\{\{balance\}\}/g, formatMoney(balance));
  out = out.replace(/\{\{money\}\}/g, formatMoney(balance));
  out = out.replace(/\{\{loss:([\d.-]+)\}\}/g, (_, raw) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return raw;
    const scaled = applyScaledMoneyDelta(-Math.abs(n));
    return formatMoney(Math.abs(scaled));
  });
  out = out.replace(/\{\{amt:([\d.-]+)\}\}/g, (_, raw) => {
    const n = Number(raw);
    return Number.isFinite(n) ? formatMoney(n) : raw;
  });
  return out;
}

export function formatMoney(n) {
  const v = Math.round(Number(n) || 0);
  return `$${v.toLocaleString("en-US")}`;
}
