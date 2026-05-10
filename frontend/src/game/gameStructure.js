/**
 * NextTenant narrative structure (player-facing): five days of scenarios.
 *
 * System rules (design targets — wire in gameplay / persistence as you build):
 * - Reentry: failing the course for non-monetary reasons routes through a reentry track (separate from money failure).
 * - Money failure: show where money was lost and which choices led there; player can jump to an exact earlier beat
 *   or finish the course with replenished (“elevated”) money.
 * - Stress: baseline 50; adjustable via “Muse’s connections” (support / companion layer).
 */

export const DEFAULT_STRESS = 50;

export const GAME_SYSTEM_RULES = {
  defaultStress: DEFAULT_STRESS,
  stressNote:
    "Stress defaults to 50 and can be edited through Muse’s connections (social support / companion hooks).",
  reentryProgram: {
    summary:
      "Failed course for non-monetary reasons → reentry program (parallel path; not the same as running out of money).",
  },
  moneyFailure: {
    summary:
      "Money-depleted failure surfaces the decision trail and exact balance impact; player can jump back to a chosen beat or complete the course with new elevated money.",
    checkpointReplay: true,
  },
};

/** Canonical five days (internal `chapter` index 1–5 matches URL `?day=`). */
export const GAME_CHAPTERS = [
  {
    chapter: 1,
    label: "CHAPTER 1 — SURVIVAL MONEY",
    shortTitle: "Survival Money",
    workbookDaySpan: [1, 3],
    coreTheme: "Can you financially survive long enough to stay housed?",
    pillTag: "Money",
    estimatedScenarios: 8,
  },
  {
    chapter: 2,
    label: "CHAPTER 2 — RENTAL SURVIVAL",
    shortTitle: "Rental Survival",
    workbookDaySpan: [4, 6],
    coreTheme: "Can you safely maintain housing?",
    pillTag: "Rental",
    estimatedScenarios: 8,
  },
  {
    chapter: 3,
    label: "CHAPTER 3 — PEOPLE & SAFETY",
    shortTitle: "People & Safety",
    workbookDaySpan: [7, 8],
    coreTheme: "The people around you can protect or restabilize your housing.",
    pillTag: "People",
    estimatedScenarios: 6,
  },
  {
    chapter: 4,
    label: "CHAPTER 4 — BURNOUT & RECOVERY",
    shortTitle: "Burnout & Recovery",
    workbookDaySpan: [9, 11],
    coreTheme: "You cannot maintain stability while emotionally overwhelmed.",
    pillTag: "Burnout",
    estimatedScenarios: 8,
  },
  {
    chapter: 5,
    label: "CHAPTER 5 — THE FUTURE",
    shortTitle: "The Future",
    workbookDaySpan: [12, 13],
    coreTheme: "Can you build long-term independence?",
    pillTag: "Future",
    estimatedScenarios: 6,
  },
];

export const CHAPTER_COUNT = GAME_CHAPTERS.length;

/** Sum of `estimatedScenarios` (planning figure until content is authored per chapter). */
export const ESTIMATED_SCENARIO_TOTAL = GAME_CHAPTERS.reduce((sum, c) => sum + c.estimatedScenarios, 0);

/** Shown on landing / How it works (player-facing total; may differ from planning sum). */
export const DISPLAY_SCENARIO_TOTAL = 48;

const TAG_FILTERS = ["All", "Money", "Rental", "People", "Burnout", "Future"];

/** Days list (player-facing day index 1–5). Review: `/game/day/N`; play: `/game?day=N`. */
export function getChaptersPageItems() {
  return GAME_CHAPTERS.map((c, i) => ({
    day: c.chapter,
    title: c.shortTitle,
    tag: c.pillTag,
    status: i === 0 ? "active" : "locked",
  }));
}

/** Landing hero strip — demo progress: first chapter in progress. */
export function getLandingChapterStrip() {
  return GAME_CHAPTERS.map((c, i) => ({
    day: c.chapter,
    title: c.shortTitle,
    desc: c.coreTheme,
    tag: c.pillTag,
    n: c.estimatedScenarios,
    s: i === 0 ? "active" : "locked",
  }));
}

/** Index / canvas-style page — demo: two complete, third active (matches old “2 / N” feel at smaller N). */
export function getIndexChaptersDemo() {
  return GAME_CHAPTERS.map((c, i) => ({
    day: c.chapter,
    title: c.shortTitle,
    description: c.coreTheme,
    tag: c.pillTag,
    scenarios: c.estimatedScenarios,
    status: i < 2 ? "complete" : i === 2 ? "active" : "locked",
  }));
}

export { TAG_FILTERS as CHAPTER_TAG_FILTERS };
