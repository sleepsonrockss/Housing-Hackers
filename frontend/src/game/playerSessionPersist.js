import { CHAPTER_COUNT } from "./gameStructure";

const STORAGE_KEY = "housing-hackers-player-run-v1";

function isValidStats(s) {
  return s && typeof s.money === "number" && typeof s.stress === "number";
}

function normalizeAnswers(raw) {
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  for (const [k, arr] of Object.entries(raw)) {
    if (!Array.isArray(arr)) continue;
    out[k] = arr
      .filter((e) => e && typeof e.scenarioTitle === "string" && typeof e.choiceText === "string")
      .map((e) => ({
        scenarioId: typeof e.scenarioId === "string" ? e.scenarioId : "",
        scenarioTitle: e.scenarioTitle,
        choiceText: e.choiceText,
      }));
  }
  return out;
}

function maxChapterFromAnswers(answersByChapter) {
  let m = 1;
  for (const k of Object.keys(answersByChapter)) {
    const n = parseInt(k, 10);
    if (Number.isFinite(n) && answersByChapter[k]?.length) m = Math.max(m, n);
  }
  return m;
}

/** @returns {{ stats: object, flags: object, unlockedDay: number, answersByChapter: object, gameOverReason?: string | null } | null} */
export function loadPersistedRun() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!isValidStats(data.stats)) return null;
    const answersByChapter = normalizeAnswers(data.answersByChapter);
    let unlockedDay =
      typeof data.unlockedDay === "number" && Number.isFinite(data.unlockedDay)
        ? Math.min(5, Math.max(1, Math.floor(data.unlockedDay)))
        : 1;
    unlockedDay = Math.max(unlockedDay, maxChapterFromAnswers(answersByChapter));
    const gor = data.gameOverReason;
    const gameOverReason =
      gor === "money" || gor === "stress" ? gor : null;
    return {
      stats: data.stats,
      flags: data.flags && typeof data.flags === "object" ? data.flags : {},
      unlockedDay,
      answersByChapter,
      gameOverReason,
    };
  } catch {
    return null;
  }
}

/**
 * @param {object} p
 * @param {object} p.stats
 * @param {object} p.flags
 * @param {number} p.unlockedDay
 * @param {object} p.answersByChapter
 * @param {string | null | undefined} p.gameOverReason — `"money"` | `"stress"` when the run has ended
 */
export function savePersistedRun({ stats, flags, unlockedDay, answersByChapter, gameOverReason }) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        stats,
        flags,
        unlockedDay: Math.min(5, Math.max(1, unlockedDay)),
        answersByChapter: answersByChapter && typeof answersByChapter === "object" ? answersByChapter : {},
        gameOverReason: gameOverReason === "money" || gameOverReason === "stress" ? gameOverReason : null,
      })
    );
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

/** New run: resets money ($1850), stress, flags, answers, and chapter progress in this browser. */
export const RESTART_GAME_HREF = "/game?day=1&reset=1";

/** `/game?day=N` — fresh run uses `reset=1` so money/stress always match defaults. */
export function getResumeGameHref() {
  const run = loadPersistedRun();
  if (!run) return "/game?day=1&reset=1";
  const d = Math.max(1, Math.min(CHAPTER_COUNT, Math.floor(run.unlockedDay) || 1));
  return `/game?day=${d}`;
}
