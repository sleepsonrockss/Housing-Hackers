import { CHAPTER_COUNT } from "./gameStructure";

const STORAGE_KEY = "housing-hackers-player-run-v1";

/** One-shot initial stress (0–100) after Muse calibration; consumed when a `reset=1` game starts. */
const INITIAL_STRESS_OVERRIDE_KEY = "housing-hackers-initial-stress-override-v1";

/** Full `/api/eeg/calibrate` JSON for PDF report; consumed when `reset=1` game starts (with customized play). */
const MUSE_REPORT_PENDING_KEY = "housing-hackers-muse-report-pending-v1";

/**
 * Store calibrated starting stress before navigating to `/game?day=1&reset=1`.
 * @param {number} stress
 */
export function setPendingInitialStress(stress) {
  if (typeof sessionStorage === "undefined") return;
  const n = typeof stress === "number" && Number.isFinite(stress) ? Math.round(stress) : NaN;
  if (!Number.isFinite(n)) return;
  const clamped = Math.min(100, Math.max(0, n));
  try {
    sessionStorage.setItem(INITIAL_STRESS_OVERRIDE_KEY, JSON.stringify({ stress: clamped }));
  } catch {
    // ignore
  }
}

/** Read calibrated stress without removing (e.g. initial render before effect consumes). */
export function peekPendingInitialStress() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(INITIAL_STRESS_OVERRIDE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const n = typeof data?.stress === "number" && Number.isFinite(data.stress) ? Math.round(data.stress) : NaN;
    if (!Number.isFinite(n)) return null;
    return Math.min(100, Math.max(0, n));
  } catch {
    return null;
  }
}

/** @returns {number | null} */
/** @param {Record<string, unknown>} payload */
export function setPendingMuseReportPayload(payload) {
  if (typeof sessionStorage === "undefined") return;
  if (!payload || typeof payload !== "object") return;
  try {
    sessionStorage.setItem(MUSE_REPORT_PENDING_KEY, JSON.stringify({ ...payload, capturedAt: new Date().toISOString() }));
  } catch {
    // ignore
  }
}

/** @returns {Record<string, unknown> | null} */
export function consumePendingMuseReportPayload() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(MUSE_REPORT_PENDING_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(MUSE_REPORT_PENDING_KEY);
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : null;
  } catch {
    try {
      sessionStorage.removeItem(MUSE_REPORT_PENDING_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

export function consumePendingInitialStress() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(INITIAL_STRESS_OVERRIDE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(INITIAL_STRESS_OVERRIDE_KEY);
    const data = JSON.parse(raw);
    const n = typeof data?.stress === "number" && Number.isFinite(data.stress) ? Math.round(data.stress) : NaN;
    if (!Number.isFinite(n)) return null;
    return Math.min(100, Math.max(0, n));
  } catch {
    try {
      sessionStorage.removeItem(INITIAL_STRESS_OVERRIDE_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

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

function normalizeStressTimeline(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e) => e && typeof e.stress === "number" && Number.isFinite(e.stress))
    .map((e, i) => ({
      step: typeof e.step === "number" && Number.isFinite(e.step) ? e.step : i,
      stress: Math.min(100, Math.max(0, Math.round(e.stress))),
      beat: typeof e.beat === "string" ? e.beat : "",
      label: typeof e.label === "string" ? e.label : "",
      chapter: typeof e.chapter === "number" && Number.isFinite(e.chapter) ? e.chapter : null,
    }));
}

function normalizeMuseCalibration(raw) {
  if (!raw || typeof raw !== "object") return null;
  const stress = typeof raw.stress === "number" && Number.isFinite(raw.stress) ? Math.round(raw.stress) : null;
  const concentration =
    typeof raw.concentration === "number" && Number.isFinite(raw.concentration) ? Math.round(raw.concentration) : null;
  return {
    ...raw,
    stress,
    concentration,
    capturedAt: typeof raw.capturedAt === "string" ? raw.capturedAt : undefined,
  };
}

/** @returns {{ stats: object, flags: object, unlockedDay: number, answersByChapter: object, gameOverReason?: string | null, museCalibration?: object | null, stressTimeline?: object[] } | null} */
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
      museCalibration: data.museCalibration ? normalizeMuseCalibration(data.museCalibration) : null,
      stressTimeline: normalizeStressTimeline(data.stressTimeline),
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
 * @param {object | null | undefined} p.museCalibration — Muse / API snapshot for landlord PDF
 * @param {object[] | undefined} p.stressTimeline — in-game stress after each logged choice
 */
export function savePersistedRun({
  stats,
  flags,
  unlockedDay,
  answersByChapter,
  gameOverReason,
  museCalibration,
  stressTimeline,
}) {
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
        museCalibration: museCalibration && typeof museCalibration === "object" ? museCalibration : null,
        stressTimeline: normalizeStressTimeline(stressTimeline),
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

/**
 * True when the saved run has real progress (not merely auto-saved initial stats before any choice).
 * Used so landing CTAs say "Play" until the player has actually moved forward.
 * @param {ReturnType<typeof loadPersistedRun>} run
 */
export function hasRunProgress(run) {
  if (!run) return false;
  if (run.gameOverReason === "money" || run.gameOverReason === "stress") return true;
  if (typeof run.unlockedDay === "number" && Number.isFinite(run.unlockedDay) && run.unlockedDay > 1) return true;
  const abc = run.answersByChapter;
  if (abc && typeof abc === "object") {
    for (const arr of Object.values(abc)) {
      if (Array.isArray(arr) && arr.length > 0) return true;
    }
  }
  return false;
}

/** `/game?day=N` — fresh run uses `reset=1` so money/stress always match defaults. */
export function getResumeGameHref() {
  const run = loadPersistedRun();
  if (!run) return "/game?day=1&reset=1";
  const d = Math.max(1, Math.min(CHAPTER_COUNT, Math.floor(run.unlockedDay) || 1));
  return `/game?day=${d}`;
}
