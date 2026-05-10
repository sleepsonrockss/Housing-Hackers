import { CHAPTER_1_SCENARIOS } from "./chapter1";
import { CHAPTER_2_SCENARIOS } from "./chapter2";
import { CHAPTER_3_SCENARIOS } from "./chapter3";
import { CHAPTER_4_SCENARIOS } from "./chapter4";
import { CHAPTER_5_SCENARIOS } from "./chapter5";

/**
 * All authored static beats keyed by id. Later spreads override earlier on id collision — chapter 1 wins.
 * Each scenario may set `videoSrc` and per-choice `outcomeVideoSrc` (paths under `public/`, e.g. `/media/...`).
 */
export const SCENARIOS_BY_ID = {
  ...CHAPTER_5_SCENARIOS,
  ...CHAPTER_4_SCENARIOS,
  ...CHAPTER_3_SCENARIOS,
  ...CHAPTER_2_SCENARIOS,
  ...CHAPTER_1_SCENARIOS,
};

/** First beat when opening `/game?day=N` (1–5). */
export const CHAPTER_START_IDS = {
  1: "c1-q1",
  2: "c2-q1",
  3: "c3-q1",
  4: "c4-q1",
  5: "c5-q1",
};

export function getStartScenarioId(dayParam) {
  const n = parseInt(String(dayParam ?? "1"), 10);
  const d = Number.isFinite(n) ? Math.max(1, Math.min(5, n)) : 1;
  return CHAPTER_START_IDS[d] || CHAPTER_START_IDS[1];
}

export function getScenario(id) {
  return SCENARIOS_BY_ID[id] ?? null;
}
