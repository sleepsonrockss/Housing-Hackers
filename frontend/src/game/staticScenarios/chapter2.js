/**
 * Chapter 2 — Rental survival (NextTenant v2).
 */

export const CHAPTER_2_SCENARIOS = {
  "c2-q1": {
    id: "c2-q1",
    chapter: 2,
    title: "2.1",
    mood: "focused",
    situation: `You're reviewing your lease (finally). You find this clause: "All security deposits are non-refundable regardless of condition of unit upon move-out." You want the apartment badly. The landlord says "everyone signs this, it's standard." You have about {{balance}} available if fees hit today.`,
    choices: [
      {
        id: 1,
        text: 'Sign it — you need the apartment and don\'t want to lose it.',
        moneyDelta: -85,
        stressDelta: 6,
        consequence: "negative",
        outcome:
          "You sign. The tension drops — but the clause may cost you the deposit story later.",
        lesson: "Teaching: Chapter 4 Activity 3 — void clause test; RTA outlines when deposits can be kept.",
        nextId: "c2-q2",
      },
      {
        id: 2,
        text: "Ask your support worker or housing advocate to review it first.",
        moneyDelta: 0,
        stressDelta: -5,
        consequence: "positive",
        outcome:
          "A second set of eyes catches the problem early — you negotiate or walk away informed.",
        lesson: "Golden rule: statute beats scary lease language when the clause is void.",
        nextId: "c2-q2",
      },
      {
        id: 3,
        text: "Tell the landlord you know this clause is void under the RTA.",
        moneyDelta: 0,
        stressDelta: 6,
        consequence: "positive",
        outcome:
          "Confrontation spikes adrenaline. (Design: landlord may back down or get hostile — varies on replay.)",
        lesson: "Teaching: Chapter 4 — void clauses and professional escalation paths.",
        nextId: "c2-q2",
      },
      {
        id: 4,
        text: "Sign it but take photos of everything before moving in.",
        moneyDelta: -85,
        stressDelta: 5,
        consequence: "negative",
        outcome:
          "Photos help evidence — but the void clause can still hurt deposit recovery.",
        lesson: "Evidence helps; it doesn't replace illegal terms.",
        nextId: "c2-q2",
      },
    ],
  },

  "c2-q2": {
    id: "c2-q2",
    chapter: 2,
    title: "2.2",
    mood: "tense",
    situation: `It's Tuesday morning, 8am. You get a text from your landlord: "Hey I'm in the area, gonna pop by in 10 min to check the furnace." You're still in bed recovering from a hard week. You haven't given permission.`,
    choices: [
      {
        id: 1,
        text: "Say nothing — quickly tidy up and let them in.",
        moneyDelta: 0,
        stressDelta: 9,
        consequence: "negative",
        outcome:
          "You scramble. Your home stops feeling like a predictable boundary.",
        lesson: "Pattern risk: if unchallenged, repeat entry pressure can escalate.",
        nextId: "c2-q3",
      },
      {
        id: 2,
        text: 'Text back: "I need 24-hour written notice per the RTA. Please reschedule."',
        moneyDelta: 0,
        stressDelta: -7,
        consequence: "positive",
        outcome:
          "Awkward send — but you used the shield. (Design: landlord may apologize or get defensive.)",
        lesson: "Teaching: Chapter 5 — 10-minute text is not proper notice.",
        nextId: "c2-q3",
      },
      {
        id: 3,
        text: "Don't respond and lock the door.",
        moneyDelta: 0,
        stressDelta: 7,
        consequence: "negative",
        outcome:
          "Silence doesn't resolve the request — conflict can still arrive at the door.",
        lesson: "Teaching: Chapter 5 red-flag role-play — notice rules protect tenants.",
        nextId: "c2-q3",
      },
    ],
  },

  "c2-q3": {
    id: "c2-q3",
    chapter: 2,
    title: "2.3",
    mood: "serious",
    situation: `Mold appeared in the corner of your bathroom ceiling two weeks ago. It's getting bigger. You're scared of conflict with your landlord. You're also not sure if it's your fault.`,
    choices: [
      {
        id: 1,
        text: "Report it in writing by email — include the date you noticed it.",
        moneyDelta: 0,
        stressDelta: -5,
        consequence: "positive",
        outcome:
          "You create a dated record. (Design: landlord may fix quickly or drag — health risk later.)",
        lesson: "Teaching: Chapter 6 — written records; landlord duty to habitable premises (RTA s.16 idea).",
        nextId: "c2-q4",
      },
      {
        id: 2,
        text: "Try to clean it yourself with bleach from the dollar store ({{loss:4}}).",
        moneyDelta: -4,
        stressDelta: 0,
        consequence: "positive",
        outcome:
          "Sometimes it looks better briefly. (Design: mold may return worse.)",
        lesson: "Surface clean isn't the same as fixing moisture source.",
        nextId: "c2-q4",
      },
      {
        id: 3,
        text: "Do nothing — you don't want to make trouble.",
        moneyDelta: 0,
        stressDelta: 8,
        consequence: "negative",
        outcome:
          "Avoidance buys quiet today — worry compounds with health risk.",
        lesson: "Follow-up risk (design): health impacts can echo in Chapter 4.",
        nextId: "c2-q4",
      },
      {
        id: 4,
        text: "Ask your support worker whether this is your responsibility or the landlord's.",
        moneyDelta: 0,
        stressDelta: -6,
        consequence: "excellent",
        outcome:
          "Reassurance: usually landlord maintenance — you proceed to written notice with confidence.",
        lesson: "Teaching: Chapter 5 broken heater logic applies to habitability issues like mold.",
        nextId: "c2-q4",
      },
    ],
  },

  "c2-q4": {
    id: "c2-q4",
    chapter: 2,
    title: "2.4",
    mood: "stressed",
    situation: `Your first utility bill arrived. It's {{amt:210}}. You thought utilities were included in rent. In the lease, a section you skimmed says tenant pays power and heat. You have about {{balance}} left this month.`,
    choices: [
      {
        id: 1,
        text: "Pay what you can ({{loss:42}}) and call the utility company about the rest.",
        moneyDelta: -42,
        stressDelta: 6,
        consequence: "negative",
        outcome:
          "Hard call. (Design: payment plan vs late fee varies.)",
        lesson: "Teaching: Chapter 4 — utility audit before signing; negotiate early.",
        nextId: "c2-q5",
      },
      {
        id: 2,
        text: "Call your support worker — 211 / FCSS / emergency funds for utilities.",
        moneyDelta: 0,
        stressDelta: -6,
        consequence: "positive",
        outcome:
          "Sometimes a program covers part; sometimes not this week — either way you asked.",
        lesson: "Teaching: Chapter 4 Activity 4 — utility audit; stack supports.",
        nextId: "c2-q5",
      },
      {
        id: 3,
        text: "Ignore the bill this month and pay double next month.",
        moneyDelta: 0,
        stressDelta: 8,
        consequence: "negative",
        outcome:
          "Avoidance compounds — disconnect warnings can arrive later.",
        lesson: "Follow-up risk: late fees + disconnect pressure can hit Chapter 3.",
        nextId: "c2-q5",
      },
    ],
  },

  "c2-q5": {
    id: "c2-q5",
    chapter: 2,
    title: "2.5",
    mood: "conflicted",
    situation: `Your landlord says you can have a cat — but adds a handwritten note: "{{loss:52}} non-refundable pet fee in addition to damage deposit." You already have the cat. You're attached and you need her for emotional support.`,
    choices: [
      {
        id: 1,
        text: "Pay {{loss:52}} — you need to keep your cat.",
        moneyDelta: -52,
        stressDelta: 5,
        consequence: "negative",
        outcome:
          "You pay. It may be an illegal stacked fee — recovery might require a dispute path later.",
        lesson: "Teaching: Chapter 4 — total deposit rules; extra pet fees can be void.",
        nextId: "c2-outro",
      },
      {
        id: 2,
        text: "Ask your support worker if this is legal before you pay.",
        moneyDelta: 0,
        stressDelta: -5,
        consequence: "excellent",
        outcome:
          "Worker confirms the risk — you negotiate from knowledge, not panic.",
        lesson: "Teaching: Chapter 4 void clause test #3 — deposit cap concepts.",
        nextId: "c2-outro",
      },
      {
        id: 3,
        text: "Sign and pay, but document the clause as potentially void.",
        moneyDelta: -52,
        stressDelta: 7,
        consequence: "negative",
        outcome:
          "You preserve evidence while paying — RTDRS-style recovery may be possible later.",
        lesson: "Documentation turns a bad moment into a recoverable file.",
        nextId: "c2-outro",
      },
    ],
  },

  "c2-outro": {
    id: "c2-outro",
    chapter: 2,
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
        nextId: "c3-q1",
      },
    ],
  },
};
