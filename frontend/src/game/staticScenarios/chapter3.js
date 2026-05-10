/**
 * Chapter 3 — People & safety (NextTenant v2).
 */

export const CHAPTER_3_SCENARIOS = {
  "c3-q1": {
    id: "c3-q1",
    chapter: 3,
    title: "3.1",
    mood: "uneasy",
    situation: `Someone you know shows up at 9pm with a bag. "Can I crash for just two nights? I've got nowhere to go." Your lease says no unauthorized occupants.`,
    choices: [
      {
        id: 1,
        text: 'Let them stay — two nights won\'t hurt ({{loss:8}} food / supplies).',
        moneyDelta: -8,
        stressDelta: 8,
        consequence: "negative",
        outcome:
          "Two nights can stretch. Lease risk rises; your space stops feeling fully yours.",
        lesson: "Teaching: Chapter 8 — escalation pattern; two nights can become a week.",
        nextId: "c3-q2",
      },
      {
        id: 2,
        text: "Set a firm boundary: exactly two nights and a plan for where they go after ({{loss:6}} basics).",
        moneyDelta: -6,
        stressDelta: 5,
        consequence: "positive",
        outcome:
          "Hard conversation. (Design: they may leave on time or push back on day two.)",
        lesson: "Teaching: Chapter 8 Activity 1 — boundaries with clarity.",
        nextId: "c3-q2",
      },
      {
        id: 3,
        text: "Call 211 to find emergency shelter tonight.",
        moneyDelta: 0,
        stressDelta: -5,
        consequence: "excellent",
        outcome:
          "You help without converting your lease into someone else's address problem.",
        lesson: "Often the best housing-stability outcome is routing crisis to systems built for it.",
        nextId: "c3-q2",
      },
      {
        id: 4,
        text: "Say no — you can't risk your lease.",
        moneyDelta: 0,
        stressDelta: 5,
        consequence: "positive",
        outcome:
          "Guilt is heavy; your housing stays less exposed.",
        lesson: "Relationship tension can surface later — Chapter 5 notes in design.",
        nextId: "c3-q2",
      },
    ],
  },

  "c3-q2": {
    id: "c3-q2",
    chapter: 3,
    title: "3.2",
    mood: "serious",
    situation: `Someone asks: "Can I get my mail sent to your place? I just need an address for my benefits — only for a little while."`,
    choices: [
      {
        id: 1,
        text: "Sure — it's just mail.",
        moneyDelta: 0,
        stressDelta: 9,
        consequence: "negative",
        outcome:
          "It sounds harmless — but your address becomes a foothold for entanglement risk.",
        lesson: "Teaching: Chapter 8 Activity 1 — mail at your address can create legal/admin risk.",
        nextId: "c3-q3",
      },
      {
        id: 2,
        text: "Explain you can't — suggest a P.O. Box or another address.",
        moneyDelta: 0,
        stressDelta: -4,
        consequence: "positive",
        outcome:
          "Awkward, but you protected your tenancy footprint.",
        lesson: "A firm redirect is still help — it routes them to safer options.",
        nextId: "c3-q3",
      },
      {
        id: 3,
        text: "Ask your support worker if this is a problem before agreeing.",
        moneyDelta: 0,
        stressDelta: -5,
        consequence: "excellent",
        outcome:
          "You decline from knowledge, not panic.",
        lesson: "Teaching: Chapter 8 — informed refusal beats accidental exposure.",
        nextId: "c3-q3",
      },
    ],
  },

  "c3-q3": {
    id: "c3-q3",
    chapter: 3,
    title: "3.3",
    mood: "practical",
    situation: `Your kitchen faucet has been dripping for two weeks. You've mentioned it verbally twice in the hallway. Nothing's happened. Your water bill is climbing.`,
    choices: [
      {
        id: 1,
        text: "Mention it again next time you see them in person.",
        moneyDelta: 0,
        stressDelta: 6,
        consequence: "negative",
        outcome:
          "No dated record — the drip continues and stress builds.",
        lesson: "Teaching: Chapter 6 Activity 4 — documentation beats hallway promises.",
        nextId: "c3-q4",
      },
      {
        id: 2,
        text: "Send a formal email: date, problem, and urgency.",
        moneyDelta: 0,
        stressDelta: -6,
        consequence: "positive",
        outcome:
          "You build a paper trail. (Design: fix speed varies.)",
        lesson: "Email creates a dated legal record.",
        nextId: "c3-q4",
      },
      {
        id: 3,
        text: "Fix it yourself — call a plumber (about {{loss:25}}).",
        moneyDelta: -25,
        stressDelta: -3,
        consequence: "negative",
        outcome:
          "It stops dripping — but you may have paid for landlord duty without reimbursement.",
        lesson: "Keep receipts if you pursue reimbursement; habitability is usually landlord work.",
        nextId: "c3-q4",
      },
    ],
  },

  "c3-q4": {
    id: "c3-q4",
    chapter: 3,
    title: "3.4",
    mood: "stressed",
    situation: `Music until midnight on weeknights — you haven't slept well in five days. A note under your door says the landlord heard a complaint about you in retaliation (for what, you don't know).`,
    choices: [
      {
        id: 1,
        text: "Knock on the neighbor's door and address it directly.",
        moneyDelta: 0,
        stressDelta: 4,
        consequence: "positive",
        outcome:
          "Confrontation is costly. (Design: neighbor may be reasonable or hostile.)",
        lesson: "Teaching: Chapter 7 — neighborly relations ladder.",
        nextId: "c3-outro",
      },
      {
        id: 2,
        text: "Write a calm, factual email to the landlord documenting noise and the false complaint.",
        moneyDelta: 0,
        stressDelta: -6,
        consequence: "positive",
        outcome:
          "You get your side on record — less likely to be flattened into a one-sided story.",
        lesson: "Documentation protects you when conflict becomes administrative.",
        nextId: "c3-outro",
      },
      {
        id: 3,
        text: "Do nothing — you don't want to be \"that person\".",
        moneyDelta: 0,
        stressDelta: 8,
        consequence: "negative",
        outcome:
          "Sleep debt stacks; decisions get worse while the noise continues.",
        lesson: "Follow-up risk (design): sleep deprivation can echo in Chapter 4.",
        nextId: "c3-outro",
      },
      {
        id: 4,
        text: "Call the city's non-emergency line about noise bylaws.",
        moneyDelta: 0,
        stressDelta: -4,
        consequence: "positive",
        outcome:
          "Formal channel — slower, but it can shift dynamics.",
        lesson: "Teaching: Chapter 7 — bylaw route after direct and landlord paths.",
        nextId: "c3-outro",
      },
    ],
  },

  "c3-outro": {
    id: "c3-outro",
    chapter: 3,
    title: "Continue",
    mood: "hopeful",
    situation: "",
    choices: [
      {
        id: 1,
        text: "Next chapter",
        moneyDelta: 0,
        stressDelta: 0,
        consequence: "positive",
        outcome: "",
        lesson: "",
        nextId: "c4-q1",
      },
    ],
  },
};
