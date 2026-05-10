import { CHAPTER_1_SCENARIOS } from "./chapter1";
import { CHAPTERS_2_TO_5_LINEAR } from "./chapters2to5Linear";

/**
 * All authored static beats keyed by id. Expand with chapter2.js … as videos arrive.
 * Each scenario may set `videoSrc` and per-choice `outcomeVideoSrc` (paths under `public/`, e.g. `/media/...`).
 */
export const SCENARIOS_BY_ID = {
  ...CHAPTERS_2_TO_5_LINEAR,
  ...CHAPTER_1_SCENARIOS,
};

/** First beat when opening `/game?day=N` (1–5). */
export const CHAPTER_START_IDS = {
  1: "c1-q1",
  2: "c2-lin-1",
  3: "c3-lin-1",
  4: "c4-lin-1",
  5: "c5-lin-1",
};

export function getStartScenarioId(dayParam) {
  const n = parseInt(String(dayParam ?? "1"), 10);
  const d = Number.isFinite(n) ? Math.max(1, Math.min(5, n)) : 1;
  return CHAPTER_START_IDS[d] || CHAPTER_START_IDS[1];
}

export function getScenario(id) {
  return SCENARIOS_BY_ID[id] ?? null;
}
