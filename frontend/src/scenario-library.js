/**
 * SCENARIO LIBRARY - TenantTales Game
 *
 * Player-facing arc: 5 chapters (see `src/game/gameStructure.js`) condensing many workbook “days”.
 * This library may still be organized in legacy blocks — align counts with GAME_CHAPTERS as you author content.
 *
 * Structure:
 * - Chapter (theme)
 * - Day (progression)
 * - Scenario (situation)
 * - Character mood/emotion
 * - 3 Choices (each with outcome + lesson)
 * - Consequence rating: excellent, positive, negative
 */

export const SCENARIO_LIBRARY = {
  // ============================================
  // CHAPTER 1: FOUNDATIONS (The First Viewing)
  // ============================================
  chapter1: [
    {
      id: 1,
      day: 1,
      chapter: "The First Week",
      title: "First Week Survival",
      situation:
        "It's your first week in your own place. You get $900 from income support. Rent is $750. That leaves $150 for the month. Your phone buzzes — a 'limited time sale' from a store you love. It's a hoodie you've been wanting for $65. You think: I deserve something nice. This place feels so empty.",
      character: "alex",
      mood: "uncertain",
      choices: [
        {
          text: "Buy the hoodie now. You need something to lift your mood.",
          outcome:
            "You buy the hoodie. You feel good for a day, but soon realize you only have $85 left for food, transport, and emergencies. When your phone breaks the next week, you're in trouble.",
          consequence: "negative",
          lesson:
            "Budget discipline matters. Impulse purchases can leave you vulnerable to emergencies.",
        },
        {
          text: "Wait. Check what you actually need for the month first.",
          outcome:
            "You list your needs: food ($80), transport ($40), utilities emergency fund ($30). You have $150 left. The hoodie could work, but barely. You decide to wait for payday.",
          consequence: "positive",
          lesson:
            "Planning ahead prevents financial stress. Your future self will thank you.",
        },
        {
          text: "Ignore it. Your money is for survival, not wants.",
          outcome:
            "You skip the hoodie. Your budget is tight, but you're covered for the month. You even set aside $20 in case of emergency. By month-end, you feel stable.",
          consequence: "excellent",
          lesson:
            "Living within your means builds security. Small sacrifices now mean peace of mind later.",
        },
      ],
    },
    {
      id: 2,
      day: 1,
      chapter: "The First Viewing",
      title: "The Too-Good-To-Be-True Listing",
      situation:
        "You find a 2-bedroom apartment listed at $600/month in a good neighborhood. Every other listing is $950+. The landlord is vague about why it's so cheap. They want you to decide TODAY and pay a 'holding deposit' of $300 in cash to 'secure' the unit.",
        character: "alex",
        mood: "excited",
        choices: [
          {
            text: "Pay the $300 cash right now. You don't want to lose this deal.",
            outcome:
              "You pay cash with no receipt. A week later, the landlord stops responding. You later find out they rented it to someone else. Your $300 is gone, and you have no proof.",
            consequence: "negative",
            lesson:
              "Beware of pressure tactics. Legitimate landlords don't rush you or demand cash without receipts.",
          },
          {
            text: "Ask for a written offer and time to think, but decline the cash deposit.",
            outcome:
              "The landlord gets annoyed and shows the unit to others. You go home and research. You realize the cheap rent might indicate poor maintenance. You check reviews—they're terrible. You dodged a bullet.",
            consequence: "positive",
            lesson:
              "Pressure = red flag. Good landlords are patient and transparent. Trust your gut.",
          },
          {
            text: "Decline and report the situation to the rental board. It's likely a scam.",
            outcome:
              "You report the sketchy listing. The rental board confirms it's a known scam. You save money and help protect others. You find a legitimate place the next week.",
            consequence: "excellent",
            lesson:
              "If it feels wrong, it probably is. Report scams to protect the community.",
          },
        ],
      },
    },
    {
      id: 3,
      day: 1,
      chapter: "The First Viewing",
      title: "Mold in the Basement",
      situation:
        "During your viewing, you notice black mold in the basement storage area. The landlord says, 'It's just cosmetic. Won't affect the unit.' But you wonder if it could spread. How do you respond?",
        character: "alex",
        mood: "concerned",
        choices: [
          {
            text: "Believe them. They're the expert.",
            outcome:
              "You move in. Within 3 months, mold appears in your closet. You develop respiratory issues. The landlord refuses to treat it, saying you caused it.",
            consequence: "negative",
            lesson:
              "Mold is never 'cosmetic.' It's a serious habitability issue and a health hazard.",
          },
          {
            text: "Request a mold inspection before signing the lease.",
            outcome:
              "The landlord agrees. An inspector confirms active mold growth. The landlord hires professionals to remediate it. You move in knowing it's fixed.",
            consequence: "positive",
            lesson:
              "Get professional inspections for visible problems. Document everything in writing.",
          },
          {
            text: "Walk away and report this to health & housing authorities.",
            outcome:
              "You report it. Authorities inspect and shut down the unit until remediation. You find a clean unit nearby. The landlord faces fines for negligence.",
            consequence: "excellent",
            lesson:
              "Health issues supersede any rental. Your safety is non-negotiable.",
          },
        ],
      },
    },
    {
      id: 4,
      day: 1,
      chapter: "The First Viewing",
      title: "Questions About the Building",
      situation:
        "You love the apartment, but you notice the building has no fire escape, the elevator is broken, and the hallways are dark. When you ask the landlord about these issues, they say, 'Don't worry. We'll fix them eventually.' Do you ask more questions?",
        character: "alex",
        mood: "uncertain",
        choices: [
          {
            text: "Don't push it. You don't want to seem like a problem tenant.",
            outcome:
              "You move in. The elevator stays broken for 8 months. You're on the 4th floor. The missing fire escape becomes an issue when there's an emergency. You feel trapped.",
            consequence: "negative",
            lesson:
              "Safety standards aren't optional. A landlord who ignores them will ignore other problems too.",
          },
          {
            text: "Ask for these issues to be documented in writing and given a repair timeline.",
            outcome:
              "The landlord puts repairs in writing with 30-day timelines. It holds them accountable. The elevator gets fixed in 3 weeks. The fire escape is added within the month.",
            consequence: "positive",
            lesson:
              "Written commitments work. Verbal promises fade. Always document.",
          },
          {
            text: "Look up housing codes for your area and request compliance before moving in.",
            outcome:
              "You cite the fire escape code violation and elevator safety requirements. The landlord must comply before you can legally occupy the unit. All repairs are completed.",
            consequence: "excellent",
            lesson:
              "Know your local housing codes. They're your rights. Landlords must meet them by law.",
          },
        ],
      },
    },
    {
      id: 5,
      day: 1,
      chapter: "The First Viewing",
      title: "The Illegal Sublet",
      situation:
        "You find the perfect apartment. During your viewing, you realize the 'landlord' showing you around isn't the owner—they're a tenant. They say they have permission from the owner to sublet. You ask to confirm with the owner. They get nervous and say, 'Don't worry. It's fine. Just trust me.'",
        character: "alex",
        mood: "suspicious",
        choices: [
          {
            text: "Trust them and sign the lease. You need a place ASAP.",
            outcome:
              "You move in. Two weeks later, the actual landlord shows up. The sublet was unauthorized. You're evicted immediately with no notice. You lose your deposit and move-in costs.",
            consequence: "negative",
            lesson:
              "Always verify the person renting to you is the actual landlord or has written authorization.",
          },
          {
            text: "Ask for written confirmation from the actual owner before signing.",
            outcome:
              "The tenant says the owner is out of town. You wait. The owner never confirms the sublet is allowed. You walk away. You find another unit a week later.",
            consequence: "positive",
            lesson:
              "Verification prevents landlord disputes. Wait for written confirmation.",
          },
          {
            text: "Contact the actual owner directly before viewing again.",
            outcome:
              "You find the owner's information online. You call them directly. They confirm the tenant has NO permission to sublet. You report the unauthorized sublet to the board. You find a legitimate place.",
            consequence: "excellent",
            lesson:
              "Always verify directly with the registered landlord. Unauthorized sublets are a scam.",
          },
        ],
      },
    },
  ],

  // ============================================
  // CHAPTER 2: LEGAL (Signing the Lease)
  // ============================================
  chapter2: [
    {
      id: 6,
      day: 2,
      chapter: "The Lease",
      title: "Reading the Fine Print",
      situation:
        "You're reviewing your lease for the first time. You notice a clause: 'Tenant responsible for all repairs under $200.' Your landlord also says you're responsible for painting before move-out. This doesn't sound right. You have a $200 deposit. What do you do?",
        character: "alex",
        mood: "cautious",
        choices: [
          {
            text: "Just sign it. Most leases probably have this.",
            outcome:
              "You sign. Six months later, a pipe leaks under the sink. The repair is $180. You pay it. Later, you lose $150 of your deposit on painting.",
            consequence: "negative",
            lesson:
              "Landlord responsibilities exist by law. Clauses contradicting them are often unenforceable.",
          },
          {
            text: "Ask your landlord to explain the clauses before signing.",
            outcome:
              "Your landlord gets defensive. But you stand firm. They remove the $200 clause and clarify painting is 'normal wear.' You sign with confidence.",
            consequence: "positive",
            lesson:
              "Asking questions protects you. Most landlords respect tenants who know their rights.",
          },
          {
            text: "Research tenant rights in your area first, then negotiate.",
            outcome:
              "You find the provincial tenant act. You show your landlord which clauses violate it. They revise the lease. You sign a fair agreement.",
            consequence: "excellent",
            lesson:
              "Knowledge is power. Tenants have legal protections. Use them.",
          },
        ],
      },
    },
    {
      id: 7,
      day: 2,
      chapter: "The Lease",
      title: "The Security Deposit Trap",
      situation:
        "Your landlord says, 'The security deposit is $800. But I also need a 'damage deposit' for an extra $500, and a 'pet deposit' of $300 even though you have no pets. Plus the first and last month's rent. That's $4,100 upfront. They say it's 'standard.'",
        character: "alex",
        mood: "overwhelmed",
        choices: [
          {
            text: "Pay it all. They seem to know what's standard.",
            outcome:
              "You pay $4,100. Later you learn most places only ask for first month + deposit ($1,200). The extra $2,900 goes into the landlord's personal account. You never see it again.",
            consequence: "negative",
            lesson:
              "Know the legal limits. Excessive deposits are illegal and a sign of a bad landlord.",
          },
          {
            text: "Ask them to itemize each fee and why it's needed.",
            outcome:
              "They can't justify the pet deposit (you have no pet). You negotiate the damage deposit down. You agree on first + last + one legitimate deposit ($1,200 total).",
            consequence: "positive",
            lesson:
              "Asking for clarity reveals scams. Legitimate charges can be explained.",
          },
          {
            text: "Look up your province's deposit limits and refuse to pay more.",
            outcome:
              "You cite the Residential Tenancy Act. Deposits are capped at one month's rent. You refuse to pay more. The landlord backs down and accepts the legal amount.",
            consequence: "excellent",
            lesson:
              "Laws protect you. Know them and enforce them.",
          },
        ],
      },
    },
    // ... continue with 3 more scenarios for Chapter 2 (48 total across all chapters)
  ],

  // ============================================
  // Similar structure for Chapters 3-10
  // (Abbreviated for space, but follow the same format)
  // ============================================

  chapter3: [
    // Move-In Day scenarios
  ],
  chapter4: [
    // Noisy Neighbour scenarios
  ],
  chapter5: [
    // Maintenance Request scenarios
  ],
  chapter6: [
    // Rent Increase scenarios
  ],
  chapter7: [
    // Subletting scenarios
  ],
  chapter8: [
    // Notice to Vacate scenarios
  ],
  chapter9: [
    // Final Inspection scenarios
  ],
  chapter10: [
    // Tribunal scenarios
  ],
};

// SCENARIO VARIATIONS BY CONSEQUENCE
export const CONSEQUENCE_EXAMPLES = {
  negative: [
    "You're vulnerable to exploitation.",
    "You lose money and documentation.",
    "The situation escalates negatively.",
    "You're evicted or lose rights.",
    "Your health or safety is compromised.",
  ],
  positive: [
    "You protect yourself with documentation.",
    "The landlord respects your boundaries.",
    "You resolve the issue peacefully.",
    "You recover some money or rights.",
    "You learn an important lesson without major loss.",
  ],
  excellent: [
    "You assert your legal rights clearly.",
    "You prevent future problems.",
    "You help protect other tenants.",
    "You resolve the issue permanently and fairly.",
    "You build a strong legal record.",
  ],
};

// CHARACTER MOODS
export const CHARACTER_MOODS = [
  "uncertain",
  "excited",
  "concerned",
  "cautious",
  "overwhelmed",
  "angry",
  "hopeful",
  "stressed",
];

// SCENARIO CATEGORIES
export const SCENARIO_CATEGORIES = {
  financial: "Money & Budget",
  legal: "Rights & Lease",
  safety: "Safety & Health",
  conflict: "Disputes & Neighbors",
  maintenance: "Repairs & Upkeep",
  moving: "Moving In/Out",
  communication: "Talking to Landlord",
};