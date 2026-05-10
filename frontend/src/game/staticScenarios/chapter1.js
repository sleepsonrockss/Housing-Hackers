/**
 * Chapter 1 — Survival Money (NextTenant v2).
 * `{{balance}}` = live cash. `{{loss:N}}` = dollar copy scaled like negative moneyDelta (see playerModel). `{{amt:N}}` = literal (wages, bill totals, cash-in).
 * Deltas are study-scaled (~50/50 money vs stress in each beat). Negative `moneyDelta` is inflated at runtime (`MONEY_LOSS_SCALE` in playerModel) toward ~70% money survival.
 * Titles use "1.1" style (chapter.question); header derives the same from scenario id.
 */

export const CHAPTER_1_SCENARIOS = {
  "c1-q1": {
    id: "c1-q1",
    chapter: 1,
    title: "1.1",
    mood: "uncertain",
    situation: `It's your first week in your own place. Income support and rent already cleared — you have about {{balance}} left for the rest of the month. Your phone buzzes — a "limited time sale" from a store you love. It's a hoodie you've been wanting for {{loss:28}}. You think: I deserve something nice. This place feels so empty.`,
    choices: [
      {
        id: 1,
        text: "Buy it ({{loss:28}}) — you've been through a lot and you deserve it.",
        moneyDelta: -28,
        stressDelta: 8,
        flagsSet: ["splurged_hoodie_c1"],
        consequence: "negative",
        outcome:
          "You tap checkout. The hoodie arrives fast — a small win in the moment. Then the month feels thinner; money anxiety can spike after the dopamine fades.",
        lesson:
          "Follow-up (design): by Day 20 you could be down to very little — grocery pressure can surface in Chapter 2. Teaching: Chapter 1 Money DNA — The Spender's Final Boss is impulse.",
        nextId: "c1-q2",
      },
      {
        id: 2,
        text: "Use the 24-Hour Rule — wait until tomorrow to decide.",
        moneyDelta: 0,
        stressDelta: -5,
        consequence: "positive",
        outcome:
          "You set the phone down. The next day the urge is often quieter; you keep cash for what actually shows up this month. (Design: 70% urge passes, 30% you buy anyway — outcomes vary on replay.)",
        lesson: "Pausing breaks autopilot spend — the same skill that protects rent week.",
        nextId: "c1-q2",
      },
      {
        id: 3,
        text: "Compromise — look for the same thing secondhand online ({{loss:9}}).",
        moneyDelta: -9,
        stressDelta: 0,
        consequence: "positive",
        outcome:
          "You find a similar hoodie for less. It's not the exact one, but your margin stays healthier for groceries and surprises.",
        lesson: "Trade-offs beat all-or-nothing. Teaching: Chapter 1 Money DNA.",
        nextId: "c1-q2",
      },
    ],
  },

  "c1-q2": {
    id: "c1-q2",
    chapter: 1,
    title: "1.2",
    mood: "stressed",
    situation: `You set up automatic rent payment. But groceries cleaned out your account more than you expected. It's the 1st. Your rent autopay bounced — an NSF (Non-Sufficient Funds) fee just hit: {{loss:18}}. Your landlord texts: "Payment didn't go through." You have about {{balance}} on hand right now.`,
    choices: [
      {
        id: 1,
        text: "Immediately e-transfer the rent manually and call the bank about the NSF fee ({{loss:18}}).",
        moneyDelta: -18,
        stressDelta: -6,
        consequence: "positive",
        outcome:
          "You handle the rent and start the fee dispute. (Design: 60% bank applies the cap and refunds part of the fee, 40% they don't — varies on replay.)",
        lesson: "Teaching: Chapter 2 Rules of Engagement — NSF fee cap, timelines, and documentation.",
        nextId: "c1-q3",
      },
      {
        id: 2,
        text: "Pay the rent — deal with the NSF fee later (still {{loss:18}} on the fee).",
        moneyDelta: -18,
        stressDelta: 6,
        consequence: "negative",
        outcome:
          "Rent moves, but the fee sits unresolved. Lingering fees can stack if another payment bounces later.",
        lesson: "Follow-up risk: another bounce in Chapter 2 can compound costs.",
        nextId: "c1-q3",
      },
      {
        id: 3,
        text: "Text the landlord explaining what happened and ask for 48 hours.",
        moneyDelta: 0,
        stressDelta: 4,
        consequence: "positive",
        outcome:
          "Hard message to send. (Design: landlord tone can be warm or cold — stress might drop or spike on replay.)",
        lesson: "Teaching: Chapter 2 — 48-hour rule and professional communication.",
        nextId: "c1-q3",
      },
    ],
  },

  "c1-q3": {
    id: "c1-q3",
    chapter: 1,
    title: "1.3",
    mood: "anxious",
    situation: `You're several days from your next cheque. You have about {{balance}}. You need about {{loss:60}} for groceries and a bus pass to make appointments this week. A "QuickCash" sign is on your way home. No credit check. Money in 10 minutes.`,
    choices: [
      {
        id: 1,
        text: "Take the payday loan ({{amt:24}} now — {{loss:95}} due on payday).",
        moneyDelta: 24,
        stressDelta: 9,
        flagsSet: ["payday_loan_c1"],
        consequence: "negative",
        outcome:
          "Cash lands fast — relief now, pressure later. The repayment window can pull you back into shortfall next cycle.",
        lesson: "Teaching: Chapter 3 — predatory debt and payday loans.",
        nextId: "c1-q4",
      },
      {
        id: 2,
        text: "Call 211 Alberta — ask about emergency food and transit support.",
        moneyDelta: 0,
        stressDelta: -6,
        consequence: "positive",
        outcome:
          "It's hard to ask. (Design: sometimes a referral exists this week, sometimes not — vary on replay.) Long hold times add stress in real life.",
        lesson: "Systems exist because margins fail sometimes; using them early beats hiding until collapse.",
        nextId: "c1-q4",
      },
      {
        id: 3,
        text: "Ask your support worker if there's an emergency fund.",
        moneyDelta: 0,
        stressDelta: -7,
        consequence: "positive",
        outcome:
          "Vulnerability costs something upfront. (Design: often a small fund exists, sometimes not this cycle.)",
        lesson: "Formal support is part of your safety net when cash and time don't line up.",
        nextId: "c1-q4",
      },
      {
        id: 4,
        text: "Skip the bus pass — walk to only the most critical appointment.",
        moneyDelta: 0,
        stressDelta: 5,
        consequence: "negative",
        outcome:
          "You protect cash, but you pay in time, weather, and fatigue — missed non-critical supports can echo later.",
        lesson: "Follow-up risk (design): missed appointments can ripple into Chapter 4 supports.",
        nextId: "c1-q4",
      },
    ],
  },

  "c1-q4": {
    id: "c1-q4",
    chapter: 1,
    title: "1.4",
    mood: "tense",
    situation: `Your budget is stretched. You have about {{balance}} left for the next stretch of the month. You're weighing Netflix ({{loss:18}}), a bus pass ({{loss:35}} — you need it for appointments), groceries (about {{loss:40}}), and your phone bill ({{loss:45}} — autopay in 4 days). The bills coming up add up to more than what you have. What do you cut?`,
    choices: [
      {
        id: 1,
        text: "Cancel Netflix, buy groceries, keep bus pass — let phone bill bounce ({{loss:32}} net squeeze).",
        moneyDelta: -32,
        stressDelta: 8,
        consequence: "negative",
        outcome:
          "Food and mobility stay safer short-term, but a bounced phone bill can trigger fees and chaos.",
        lesson: "Follow-up risk: phone NSF can open Chapter 2 with fee pressure.",
        nextId: "c1-q5",
      },
      {
        id: 2,
        text: "Cancel Netflix, pay phone bill, skip groceries this week ({{loss:28}}).",
        moneyDelta: -28,
        stressDelta: 9,
        consequence: "negative",
        outcome:
          "Bills look calmer on paper, but hunger hits focus and stability — stress climbs.",
        lesson: "Follow-up (design): low energy can blunt gains for the next beats.",
        nextId: "c1-q5",
      },
      {
        id: 3,
        text: "Cancel Netflix, buy partial groceries (basics only), keep bus pass, pay phone bill ({{loss:35}}).",
        moneyDelta: -35,
        stressDelta: -7,
        consequence: "excellent",
        outcome:
          "Tight, but you kept the core needs first — the month stays ugly-but-survivable.",
        lesson: "Teaching: Chapter 1 Activity 1.5 — Needs vs wants framework.",
        nextId: "c1-q5",
      },
      {
        id: 4,
        text: "Keep everything and hope something comes through.",
        moneyDelta: 0,
        stressDelta: 10,
        consequence: "negative",
        outcome:
          "Avoidance feels like rest until the inbox fills with warnings.",
        lesson: "Follow-up risk (design): multiple bounces can stack NSF fees in Chapter 2.",
        nextId: "c1-q5",
      },
    ],
  },

  "c1-q5": {
    id: "c1-q5",
    chapter: 1,
    title: "1.5",
    mood: "conflicted",
    situation: `Someone from your old situation texts: "Hey can u lend me {{loss:80}} just till friday I swear ill pay back." Friday came and went last time. You have about {{balance}} left for the next ten days.`,
    choices: [
      {
        id: 1,
        text: "Send {{loss:80}} — they sound desperate.",
        moneyDelta: -80,
        stressDelta: 9,
        consequence: "negative",
        outcome:
          "You move money fast. (Design: often they don't repay on time — grocery danger follows.)",
        lesson: "Teaching: Chapter 1 The Giver — pay bills and stabilize before giving.",
        nextId: "c1-outro",
      },
      {
        id: 2,
        text: "Offer {{loss:10}} and say it's genuinely all you can spare.",
        moneyDelta: -10,
        stressDelta: 5,
        consequence: "negative",
        outcome:
          "Compromise is uncomfortable. (Design: they may accept or push for more.)",
        lesson: "Boundaries protect housing stability, not coldness.",
        nextId: "c1-outro",
      },
      {
        id: 3,
        text: "Say no — explain you're tight this month.",
        moneyDelta: 0,
        stressDelta: 5,
        consequence: "positive",
        outcome:
          "Guilt is heavy, but your rent week stays less exposed.",
        lesson: "Relationship tension can surface later — housing margin stays safer now.",
        nextId: "c1-outro",
      },
      {
        id: 4,
        text: "Leave it on read.",
        moneyDelta: 0,
        stressDelta: 7,
        consequence: "negative",
        outcome:
          "Short-term avoidance — the message sits in your chest and can escalate later.",
        lesson: "Silence isn't neutral; it often purchases future conflict.",
        nextId: "c1-outro",
      },
    ],
  },

  "c1-outro": {
    id: "c1-outro",
    chapter: 1,
    title: "Continue",
    mood: "reflective",
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
        nextId: "c2-q1",
      },
    ],
  },
};
