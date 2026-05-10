/**
 * Chapter 4 — Burnout & recovery (NextTenant v2).
 */

export const CHAPTER_4_SCENARIOS = {
  "c4-q1": {
    id: "c4-q1",
    chapter: 4,
    title: "Q4.1",
    mood: "exhausted",
    situation: `You haven't left your apartment in three days. Nine unread messages. Dishes everywhere. Two appointments you didn't make. Sleep feels 1/5; stress feels 5/5; connection feels 1/5. Something has to change — but where do you start?`,
    choices: [
      {
        id: 1,
        text: 'Text your support worker: "I\'m not doing well."',
        moneyDelta: 0,
        stressDelta: -10,
        consequence: "excellent",
        outcome:
          "Relief of being seen. (Design: worker may help reschedule and stabilize supports.)",
        lesson: "Teaching: Chapter 10 Activity 3 — formal support in Code Red.",
        nextId: "c4-q2",
      },
      {
        id: 2,
        text: "Do one micro-action: drink a glass of water and open a window.",
        moneyDelta: 0,
        stressDelta: -3,
        consequence: "positive",
        outcome:
          "Small momentum. (Design: sometimes sparks a second action, sometimes not.)",
        lesson: "Teaching: Chapter 10 Activity 2 — anxiety is energy without a plan.",
        nextId: "c4-q2",
      },
      {
        id: 3,
        text: "Call a crisis or warmline number.",
        moneyDelta: 0,
        stressDelta: -11,
        consequence: "excellent",
        outcome:
          "Talking helps; appointments may become survivable again.",
        lesson: "Teaching: Chapter 10 — map formal supports before you need them in a spiral.",
        nextId: "c4-q2",
      },
      {
        id: 4,
        text: "Stay in bed. Tomorrow will be different.",
        moneyDelta: 0,
        stressDelta: 8,
        consequence: "negative",
        outcome:
          "Sometimes rest is survival — but missed obligations can generate formal notices.",
        lesson: "Follow-up risk (design): housing support notices can fire later.",
        nextId: "c4-q2",
      },
    ],
  },

  "c4-q2": {
    id: "c4-q2",
    chapter: 4,
    title: "Q4.2",
    mood: "grief",
    situation: `You just got a call: someone close to you passed away. You're in shock. Rent is due in four days and an inspection is next week. Everything feels impossible.`,
    choices: [
      {
        id: 1,
        text: "Push through — handle rent and inspection first, grieve later.",
        moneyDelta: 0,
        stressDelta: 10,
        consequence: "negative",
        outcome:
          "You hold the line on paper while your body pays a brutal price.",
        lesson: "Follow-up risk (design): burnout crash can make the next beats harder.",
        nextId: "c4-q3",
      },
      {
        id: 2,
        text: "Contact your support worker and let them know what happened.",
        moneyDelta: 0,
        stressDelta: -8,
        consequence: "positive",
        outcome:
          "You don't carry it alone — worker can coordinate landlord timing sometimes.",
        lesson: "Teaching: Chapter 10 support map + Chapter 9 unexpected events.",
        nextId: "c4-q3",
      },
      {
        id: 3,
        text: "Write a short message to your landlord explaining a family emergency.",
        moneyDelta: 0,
        stressDelta: -2,
        consequence: "positive",
        outcome:
          "Proactive communication. (Design: landlord may extend inspection window or not.)",
        lesson: "Teaching: Chapter 7 — proactive communication before escalation.",
        nextId: "c4-q3",
      },
      {
        id: 4,
        text: "Do nothing for today — you just need today.",
        moneyDelta: 0,
        stressDelta: 4,
        consequence: "positive",
        outcome:
          "Sometimes surviving the hour is the win — follow-up can arrive tomorrow.",
        lesson: "Honouring limits is also a skill — pair it with one reach-out when you can.",
        nextId: "c4-q3",
      },
    ],
  },

  "c4-q3": {
    id: "c4-q3",
    chapter: 4,
    title: "Q4.3",
    mood: "panicked",
    situation: `Your income support is delayed — a processing error. It's been ten days. Rent is in eight days. You have about {{balance}}. You've been here before and you know the panic.`,
    choices: [
      {
        id: 1,
        text: "Call the benefits office daily until it's resolved.",
        moneyDelta: 0,
        stressDelta: 7,
        consequence: "negative",
        outcome:
          "Navigation exhausts you. (Design: resolution timing varies.)",
        lesson: "Persistence matters — pair it with written follow-up and dates.",
        nextId: "c4-q4",
      },
      {
        id: 2,
        text: "Name the anxiety, name the real problem, and take one concrete action today (benefits office + landlord in writing).",
        moneyDelta: 0,
        stressDelta: -7,
        consequence: "excellent",
        outcome:
          "You put both systems in the loop — less silent dread.",
        lesson: "Teaching: Chapter 10 Activity 2 — anxiety-to-action SMART plan.",
        nextId: "c4-q4",
      },
      {
        id: 3,
        text: "Tell the landlord proactively and ask for five extra days.",
        moneyDelta: 0,
        stressDelta: 3,
        consequence: "positive",
        outcome:
          "Hard conversation. (Design: landlord may agree or respond coldly.)",
        lesson: "Written + proactive beats surprise bounce.",
        nextId: "c4-q4",
      },
      {
        id: 4,
        text: "Say nothing and hope the cheque comes in time.",
        moneyDelta: 0,
        stressDelta: 9,
        consequence: "negative",
        outcome:
          "Silent dread compounds — late fees and notices become more likely.",
        lesson: "Follow-up risk: past-due rent paths can open in Chapter 5.",
        nextId: "c4-q4",
      },
    ],
  },

  "c4-q4": {
    id: "c4-q4",
    chapter: 4,
    title: "Q4.4",
    mood: "overwhelmed",
    situation: `Construction starts at 7am. You must dispute a billing error — about {{amt:45}} — but the noise makes a phone call feel impossible. It's been three weeks unresolved.`,
    choices: [
      {
        id: 1,
        text: "Force yourself to make the call now.",
        moneyDelta: 12,
        stressDelta: -2,
        consequence: "positive",
        outcome:
          "Brutal while it happens. (Design: may resolve or fail on hold — vary.)",
        lesson: "Sometimes the window is now — pair with notes so you can callback.",
        nextId: "c4-outro",
      },
      {
        id: 2,
        text: "Wait until afternoon when construction stops.",
        moneyDelta: 0,
        stressDelta: 3,
        consequence: "positive",
        outcome:
          "Better conditions later — odds improve when you're not shaking from noise.",
        lesson: "Timing is a disability-accommodation style strategy, not laziness.",
        nextId: "c4-outro",
      },
      {
        id: 3,
        text: "Ask someone you trust to make the call on your behalf.",
        moneyDelta: 0,
        stressDelta: -7,
        consequence: "positive",
        outcome:
          "Delegation can be dignity. (Design: helper may be available or not today.)",
        lesson: "Teaching: Chapter 10 Activity 3 — who handles what when you can't?",
        nextId: "c4-outro",
      },
      {
        id: 4,
        text: "Send a secure message instead of calling.",
        moneyDelta: 0,
        stressDelta: -5,
        consequence: "positive",
        outcome:
          "Quieter channel — slower resolution, but progress without the call spike.",
        lesson: "Async routes are valid when phone capacity is zero.",
        nextId: "c4-outro",
      },
    ],
  },

  "c4-outro": {
    id: "c4-outro",
    chapter: 4,
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
        nextId: "c5-q1",
      },
    ],
  },
};
