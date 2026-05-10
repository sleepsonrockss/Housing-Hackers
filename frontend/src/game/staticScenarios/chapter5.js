/**
 * Chapter 5 — The future (NextTenant v2).
 */

export const CHAPTER_5_SCENARIOS = {
  "c5-q1": {
    id: "c5-q1",
    chapter: 5,
    title: "Q5.1",
    mood: "determined",
    situation: `A part-time job appears — 15 hours/week at about {{amt:16}}/hour. You want it. Your income support may claw back if you earn over a threshold — you are not sure exactly where the cutoff is.`,
    choices: [
      {
        id: 1,
        text: "Take the job without checking the income rules.",
        moneyDelta: 72,
        stressDelta: 6,
        flagsSet: ["job_no_rules_check"],
        consequence: "negative",
        outcome:
          "Paycheques start — relief mixes with dread. (Design: clawback risk can hit next month on replay.)",
        lesson: "Teaching: Chapter 12 — inventory assets; informed decisions protect income stability.",
        nextId: "c5-q2",
      },
      {
        id: 2,
        text: "Ask your worker to map the threshold before you decide.",
        moneyDelta: 0,
        stressDelta: -6,
        consequence: "excellent",
        outcome:
          "You decide with numbers instead of vibes — fewer surprises later.",
        lesson: "Teaching: Chapter 12 — know the rules before you commit.",
        nextId: "c5-q2",
      },
      {
        id: 3,
        text: "Decline for now — you're not ready and that's valid.",
        moneyDelta: 0,
        stressDelta: -3,
        consequence: "positive",
        outcome:
          "No penalty in this build — self-knowledge is also a housing skill.",
        lesson: "Teaching: Chapter 12 — know rights; know limits; decide on purpose.",
        nextId: "c5-q2",
      },
      {
        id: 4,
        text: "Take the job and don't report it.",
        moneyDelta: 72,
        stressDelta: 10,
        flagsSet: ["unreported_income_risk"],
        consequence: "negative",
        outcome:
          "Cash flows while fear sits in your chest — audits and overpayments are real risks.",
        lesson: "Teaching: Chapter 12 — fraud anxiety is a housing stability risk too.",
        nextId: "c5-q2",
      },
    ],
  },

  "c5-q2": {
    id: "c5-q2",
    chapter: 5,
    title: "Q5.2",
    mood: "practical",
    situation: `Your lease is up in six weeks. The landlord emails a renewal — about {{amt:85}}/month rent increase. You can barely afford it.`,
    choices: [
      {
        id: 1,
        text: "Sign immediately — don't rock the boat.",
        moneyDelta: -22,
        stressDelta: 3,
        consequence: "negative",
        outcome:
          "Short relief, longer squeeze — the budget tightens month after month.",
        lesson: "Teaching: Chapter 13 — budget feasibility is part of signing.",
        nextId: "c5-q3",
      },
      {
        id: 2,
        text: "Run the 50% rule check from your budget before signing.",
        moneyDelta: 0,
        stressDelta: -5,
        consequence: "positive",
        outcome:
          "Math is uncomfortable — but it prevents signing a trap you cannot survive.",
        lesson: "Teaching: Chapter 13 Go/No-Go — TCH ÷ income feasibility.",
        nextId: "c5-q3",
      },
      {
        id: 3,
        text: "Ask a housing advocate or tenant services to review the increase.",
        moneyDelta: 0,
        stressDelta: -4,
        consequence: "positive",
        outcome:
          "Sometimes you negotiate lower; sometimes you learn your rights anyway.",
        lesson: "Teaching: Chapter 13 — professional tenant moves.",
        nextId: "c5-q3",
      },
      {
        id: 4,
        text: 'Draft a professional email: intent to sign with clarifications.',
        moneyDelta: 0,
        stressDelta: -6,
        consequence: "excellent",
        outcome:
          "You sound like someone who keeps records — landlords respond differently.",
        lesson: "Teaching: Chapter 13 Activity III — email as legal shield.",
        nextId: "c5-q3",
      },
    ],
  },

  "c5-q3": {
    id: "c5-q3",
    chapter: 5,
    title: "Q5.3",
    mood: "hopeful",
    situation: `Things are okay this week. You have a small surplus — about {{amt:75}} — you did not spend. Your first instinct is to treat yourself.`,
    choices: [
      {
        id: 1,
        text: "Spend the $75 — you've earned it.",
        moneyDelta: -22,
        stressDelta: -4,
        consequence: "positive",
        outcome:
          "Joy is real — the contingency fund stays flat if emergencies hit.",
        lesson: "Teaching: Chapter 12 Activity 4 — contingency = monthly needs × 3 concept.",
        nextId: "c5-q4",
      },
      {
        id: 2,
        text: "Transfer {{amt:50}} to emergency savings, spend {{amt:25}} on something small.",
        moneyDelta: -22,
        stressDelta: -3,
        consequence: "positive",
        outcome:
          "You split the win — future-you gets a foothold, today-you still gets air.",
        lesson: "Teaching: Chapter 12 — automatic transfers build freedom quietly.",
        nextId: "c5-q4",
      },
      {
        id: 3,
        text: "Transfer the full $75 to savings.",
        moneyDelta: 0,
        stressDelta: -3,
        consequence: "excellent",
        outcome:
          "You move the whole surplus toward the safety net — strongest buffer, if you can tolerate the pinch.",
        lesson: "Starter funds can be small; zero is the only size that cannot compound.",
        nextId: "c5-q4",
      },
    ],
  },

  "c5-q4": {
    id: "c5-q4",
    chapter: 5,
    title: "Q5.4",
    mood: "reflective",
    situation: `You're still housed. There are things on your walls now — sometimes a routine works. Some nights are still hard.

A community worker asks if you'd share one thing — just one — with people starting where you were.`,
    choices: [
      {
        id: 1,
        text: "Yes — share one thing I know now that I wish I knew then.",
        moneyDelta: 0,
        stressDelta: -10,
        consequence: "excellent",
        outcome:
          "Vulnerability costs something — meaning can pull stress down hard when it lands.",
        lesson: "Design reward: peer mentor energy — stability is also social.",
        nextId: "c5-outro",
      },
      {
        id: 2,
        text: "Maybe later — I'm still figuring things out.",
        moneyDelta: 0,
        stressDelta: 0,
        consequence: "positive",
        outcome:
          "Honouring your pace is a valid ending.",
        lesson: "Limits are skills too.",
        nextId: "c5-outro",
      },
      {
        id: 3,
        text: "No — I need to focus on myself right now.",
        moneyDelta: 0,
        stressDelta: -4,
        consequence: "positive",
        outcome:
          "The most important skill is knowing what you can give — and when.",
        lesson: "Independence includes protecting your bandwidth.",
        nextId: "c5-outro",
      },
    ],
  },

  "c5-outro": {
    id: "c5-outro",
    chapter: 5,
    title: "Continue",
    mood: "hopeful",
    situation: "",
    choices: [
      {
        id: 1,
        text: "Finish",
        moneyDelta: 0,
        stressDelta: 0,
        consequence: "positive",
        outcome: "",
        lesson: "",
        nextId: null,
      },
    ],
  },
};
