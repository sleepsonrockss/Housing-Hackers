/**
 * Chapter 1 — Survival Money (linear tour: every beat in order, then outro → Chapter 2).
 * Replace `videoSrc` / `outcomeVideoSrc` with your per-question MP4 paths under `public/`.
 */

const VID = {
  /** Placeholder paths — drop files here or change URLs when assets exist */
  q1scene: "/media/ch1/c1-q1-scene.mp4",
  q1outBuy: "/media/ch1/c1-q1-outcome-buy.mp4",
  q1outWait: "/media/ch1/c1-q1-outcome-wait.mp4",
  q1outSkip: "/media/ch1/c1-q1-outcome-skip.mp4",
  tightScene: "/media/ch1/c1-tight-scene.mp4",
  biteScene: "/media/ch1/c1-bite-scene.mp4",
  calmScene: "/media/ch1/c1-calm-scene.mp4",
};

export const CHAPTER_1_SCENARIOS = {
  "c1-q1": {
    id: "c1-q1",
    chapter: 1,
    title: "First week — impulse vs plan",
    mood: "uncertain",
    videoSrc: VID.q1scene,
    situation: `It's your first week in your own place. After rent and what you've already spent, you have about {{balance}} left for the rest of the month. Your phone buzzes — a "limited time sale" from a store you love. It's a hoodie you've been wanting for {{amt:65}}. You think: I deserve something nice. This place feels so empty.`,
    choices: [
      {
        id: 1,
        text: "Buy it — you've been through a lot and you deserve it.",
        moneyDelta: -65,
        mentalBatteryDelta: 8,
        stressDelta: 12,
        flagsSet: ["splurged_hoodie_c1"],
        consequence: "negative",
        outcome:
          "You tap checkout. The hoodie arrives fast — small win. Then you look at your accounts: the margin you had for food and transit just got thinner.",
        lesson: "Impulse comfort buys shrink the cushion that keeps you safe when the next bill lands.",
        nextId: "c1-tight_week",
        outcomeVideoSrc: VID.q1outBuy,
      },
      {
        id: 2,
        text: "Use the 24-hour rule — wait until tomorrow to decide.",
        moneyDelta: 0,
        mentalBatteryDelta: -4,
        stressDelta: -6,
        consequence: "positive",
        outcome:
          "You set the phone down. The next day the urge is quieter; you keep the cash in your pocket for what actually shows up this month.",
        lesson: "Pausing breaks the autopilot spend — the same skill that protects rent week.",
        nextId: "c1-tight_week",
        outcomeVideoSrc: VID.q1outWait,
      },
      {
        id: 3,
        text: "Skip it — look for something similar secondhand instead.",
        moneyDelta: -18,
        mentalBatteryDelta: -2,
        stressDelta: 2,
        consequence: "positive",
        outcome:
          "You find a used option for less. It's not the exact hoodie, but your balance stays healthier for groceries and surprises.",
        lesson: "Trade-offs beat all-or-nothing: you still get warmth without carving rent-week safety.",
        nextId: "c1-tight_week",
        outcomeVideoSrc: VID.q1outSkip,
      },
    ],
  },

  "c1-tight_week": {
    id: "c1-tight_week",
    chapter: 1,
    title: "Mid-month — less margin",
    mood: "stressed",
    videoSrc: VID.tightScene,
    situation:
      "Rent cleared, but you're feeling the squeeze. Transit pass renews soon, and a friend wants to meet for food downtown. You open your banking app: {{balance}} is what's left until payday.",
    choices: [
      {
        id: 1,
        text: "Pay for transit and say no to the pricey dinner — cook at home.",
        moneyDelta: -85,
        stressDelta: 6,
        mentalBatteryDelta: -8,
        consequence: "positive",
        outcome: "It's awkward to say no, but you keep mobility and food covered. The month stays ugly-but-survivable.",
        lesson: "When the cushion is thin, fixed costs win over social pressure.",
        nextId: "c1-bite_back",
      },
      {
        id: 2,
        text: "Go out anyway — you'll figure out groceries later.",
        moneyDelta: -55,
        stressDelta: 18,
        mentalBatteryDelta: 6,
        consequence: "negative",
        outcome: "Fun for one night. Three days later you're stacking cheap carbs and counting coins — stress spikes.",
        lesson: "Social spending after a splurge stacks risk fast.",
        nextId: "c1-bite_back",
      },
    ],
  },

  /** Only reached from the “tight week” path — references earlier splurge. */
  "c1-bite_back": {
    id: "c1-bite_back",
    chapter: 1,
    title: "When earlier choices show up",
    mood: "anxious",
    videoSrc: VID.biteScene,
    situation:
      "A small emergency hits: not huge, but not zero. Because your margin was already shaved, this feels bigger than it is. That earlier \"treat yourself\" moment flashes in your head — not as guilt, as math. You have {{balance}} on hand right now.",
    choices: [
      {
        id: 1,
        text: "Borrow from a friend to bridge — pay them back on payday.",
        moneyDelta: 80,
        stressDelta: 14,
        mentalBatteryDelta: -10,
        consequence: "negative",
        outcome:
          "It solves the week, but dependency grows. You promised yourself independence — now you're rehearsing awkward texts.",
        lesson: "Short-term relief can mortgage dignity; better to guard margin before the crisis.",
        nextId: "c1-calm_week",
      },
      {
        id: 2,
        text: "Call 211 / community intake and ask what emergency supports exist (food bank, utility arrear help).",
        moneyDelta: 0,
        stressDelta: -8,
        mentalBatteryDelta: -12,
        consequence: "positive",
        outcome:
          "It's humbling to ask — and you get a real path: food hamper, a payment plan worksheet, a caseworker who doesn't judge.",
        lesson: "Systems exist because margins fail sometimes; using them early beats hiding until collapse.",
        nextId: "c1-calm_week",
      },
    ],
  },

  "c1-calm_week": {
    id: "c1-calm_week",
    chapter: 1,
    title: "Mid-month — more breathing room",
    mood: "hopeful",
    videoSrc: VID.calmScene,
    situation:
      "Nothing heroic — just a normal week. Bills land, but you still see {{balance}} left with room to handle small surprises. You skim a tenant-rights article: it keeps saying RTA for your province, while a group chat about deposits mentions RTDRS for Alberta hearings—same stress, different acronyms.",
    choices: [
      {
        id: 1,
        text: "Move $25 into a tiny emergency jar anyway — boring, but future-you insurance.",
        moneyDelta: -25,
        stressDelta: -10,
        mentalBatteryDelta: 4,
        consequence: "excellent",
        outcome: "The week stays calm. When a small fee hits, you don't spiral — you adjust once and keep going.",
        lesson: "Boring wins compound: margin is the antidote to panic.",
        nextId: "c1-chapter-outro",
      },
      {
        id: 2,
        text: "Spend the cushion on a night out — you'll rebuild next cheque.",
        moneyDelta: -70,
        stressDelta: 4,
        mentalBatteryDelta: 10,
        consequence: "negative",
        outcome: "Fun now. If anything else breaks this month, you'll feel that choice — not as morality, as arithmetic.",
        lesson: "Even after a good week, spending the whole cushion invites the next week to hurt.",
        nextId: "c1-chapter-outro",
      },
    ],
  },

  "c1-chapter-outro": {
    id: "c1-chapter-outro",
    chapter: 1,
    title: "Chapter 1 complete — Survival Money",
    mood: "hopeful",
    situation:
      "You have played through every Survival Money beat in this chapter. Your choices still matter for stress and battery, but the scripted tour is done for now. Next: Chapter 2 focuses on rental safety and paperwork.",
    choices: [
      {
        id: 1,
        text: "Continue to Chapter 2 — Rental Survival",
        moneyDelta: 0,
        stressDelta: 0,
        mentalBatteryDelta: 0,
        consequence: "positive",
        outcome: "",
        lesson: "",
        nextId: "c2-lin-1",
      },
    ],
  },
};
