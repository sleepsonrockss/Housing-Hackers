/**
 * Replace `{{balance}}` with the player's current cash (formatted).
 * Optional: `{{amt:65}}` shows a dollar amount (fixed copy); use for item prices.
 */
export function interpolateScenarioText(text, stats) {
  if (typeof text !== "string") return "";
  const balance = typeof stats?.money === "number" ? stats.money : 0;
  let out = text.replace(/\{\{balance\}\}/g, formatMoney(balance));
  out = out.replace(/\{\{money\}\}/g, formatMoney(balance));
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
