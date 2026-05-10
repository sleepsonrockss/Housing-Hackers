/**
 * Linear placeholder beats for chapters 2–5 so each `/game?day=N` plays several questions
 * before handing off to the next chapter (chapter 5 ends the run).
 * Swap in authored scenarios when workbook content is ported.
 */

function stubBeat(chapter, index, title, situation, nextId) {
  const id = `c${chapter}-lin-${index}`;
  return [
    id,
    {
      id,
      chapter,
      title,
      mood: "neutral",
      situation,
      choices: [
        {
          id: 1,
          text: "Continue",
          moneyDelta: 0,
          stressDelta: 0,
          mentalBatteryDelta: 0,
          consequence: "positive",
          outcome: "",
          lesson: "",
          nextId,
        },
      ],
    },
  ];
}

const pairs234 = [2, 3, 4].flatMap((ch) => {
  const nextStart = `c${ch + 1}-lin-1`;
  return [
    stubBeat(
      ch,
      1,
      `Chapter ${ch} — question 1 of 3`,
      `You are in Chapter ${ch}. This is placeholder copy until the full workbook beats are wired. Cash on hand: {{balance}}.`,
      `c${ch}-lin-2`
    ),
    stubBeat(
      ch,
      2,
      `Chapter ${ch} — question 2 of 3`,
      `Another moment in Chapter ${ch}: paperwork, people, or pressure—real scenes will replace this text. Balance: {{balance}}.`,
      `c${ch}-lin-3`
    ),
    stubBeat(
      ch,
      3,
      `Chapter ${ch} — question 3 of 3`,
      `Last question of Chapter ${ch} before the next chapter loads.`,
      nextStart
    ),
  ];
});

export const CHAPTERS_2_TO_5_LINEAR = Object.fromEntries([
  ...pairs234,
  stubBeat(
    5,
    1,
    "Chapter 5 — question 1 of 3",
    "Chapter 5 opens: you are building toward longer-term stability. Placeholder for now. {{balance}} on hand.",
    "c5-lin-2"
  ),
  stubBeat(
    5,
    2,
    "Chapter 5 — question 2 of 3",
    "Another Chapter 5 beat—future planning, supports, and next steps will live here.",
    "c5-lin-end"
  ),
  [
    "c5-lin-end",
    {
      id: "c5-lin-end",
      chapter: 5,
      title: "Chapter 5 — final screen",
      mood: "hopeful",
      situation:
        "You have finished all five chapters in this build. When new beats ship, this ending can celebrate your path and suggest concrete next steps.",
      choices: [
        {
          id: 1,
          text: "Return to the chapter list",
          moneyDelta: 0,
          stressDelta: 0,
          mentalBatteryDelta: 0,
          consequence: "positive",
          outcome: "",
          lesson: "",
          nextId: null,
        },
      ],
    },
  ],
]);
