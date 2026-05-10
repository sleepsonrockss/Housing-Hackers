const STORAGE_KEY = "housing-hackers-player-run-v1";

function isValidStats(s) {
  return (
    s &&
    typeof s.money === "number" &&
    typeof s.mentalBattery === "number" &&
    typeof s.stress === "number"
  );
}

/** @returns {{ stats: object, flags: object } | null} */
export function loadPersistedRun() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!isValidStats(data.stats)) return null;
    return {
      stats: data.stats,
      flags: data.flags && typeof data.flags === "object" ? data.flags : {},
    };
  } catch {
    return null;
  }
}

/** @param {object} stats @param {object} flags */
export function savePersistedRun(stats, flags) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ stats, flags }));
  } catch {
    // quota / private mode
  }
}

export function clearPersistedRun() {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
