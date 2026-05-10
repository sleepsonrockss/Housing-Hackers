/**
 * Inline glossary for housing, income-support, and tenancy terms used in scenario copy.
 *
 * **Single-token entries** — `Object.keys` become match tokens (case-insensitive, word boundaries).
 * Use UPPERCASE keys; in prose you can write `RTA`, `rta`, etc.
 *
 * **Phrases** — Add to `GLOSSARY_PHRASES` when the term is multiple words (e.g. "food bank").
 * Phrase matches win over shorter overlaps when they start at the same index; longer spans win
 * on overlap (e.g. a phrase vs an acronym inside it—usually phrases are separate).
 */

/** @param {string} text */
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const HOUSING_GLOSSARY = {
  RTDRS: {
    title: "RTDRS",
    expandedName: "Residential Tenancy Dispute Resolution Service (Alberta)",
    whatItIs:
      "Alberta’s tribunal-style service for most residential landlord–tenant disputes. It is separate from criminal court and is focused on tenancy issues.",
    whatItDoes:
      "Tenants and landlords can apply for a hearing. An officer can issue binding orders about topics like security deposits, unpaid rent, repairs, and ending a tenancy—depending on the claim.",
    whyRelevant:
      "If a scenario mentions RTDRS, it usually means a formal dispute path: evidence, timelines, and written decisions instead of only negotiating with the other side.",
  },
  RTA: {
    title: "RTA",
    expandedName: "Residential Tenancies Act (provincial rental law)",
    whatItIs:
      "In several Canadian provinces, the law that governs most residential tenancies is called the Residential Tenancies Act (RTA). The exact rules differ by province.",
    whatItDoes:
      "It sets the legal floor for things like rent increases, notice to enter, maintenance duties, ending a tenancy, and what landlords and tenants can ask of each other.",
    whyRelevant:
      "When copy mentions the RTA, it is pointing you to written rules—not just what feels fair—so you can check notice periods, allowed charges, and lawful reasons to end a lease.",
  },
  LTB: {
    title: "LTB",
    expandedName: "Landlord and Tenant Board (Ontario)",
    whatItIs:
      "Ontario’s tribunal that handles most disputes between renters and landlords under the Residential Tenancies Act.",
    whatItDoes:
      "It receives applications (for example rent issues, maintenance, or eviction challenges), schedules hearings or mediations, and can issue orders that both sides may have to follow.",
    whyRelevant:
      "Scenarios that mention the LTB are usually about a formal next step after notices or broken agreements—not just a private argument.",
  },
  CMHC: {
    title: "CMHC",
    expandedName: "Canada Mortgage and Housing Corporation",
    whatItIs:
      "A federal Crown corporation focused on housing policy, research, and some housing programs.",
    whatItDoes:
      "It publishes data and guidance for renters and buyers, supports affordable housing initiatives, and runs programs like mortgage insurance for lenders (not the same as cash help for rent in every situation).",
    whyRelevant:
      "You might see CMHC in articles about national housing strategy, market data, or program eligibility—use it as a signpost to read the details rather than assuming a benefit applies to you.",
  },
  /** Community and social services helpline (many regions). */
  "211": {
    title: "211",
    expandedName: "211 community and social services helpline",
    whatItIs:
      "A free phone, text, or web service in many Canadian regions that connects people to local programs (housing help, food, mental health, utilities, and more).",
    whatItDoes:
      "Trained navigators or searchable directories point you to services near you and how to access them.",
    whyRelevant:
      "When a scenario says “call 211,” it means a real intake path for non-emergency help—often faster than guessing which agency name to search.",
  },
  ODSP: {
    title: "ODSP",
    expandedName: "Ontario Disability Support Program",
    whatItIs:
      "A provincial income and health benefit program for eligible adults with disabilities in Ontario.",
    whatItDoes:
      "It can include monthly income support and drug benefits, with reporting rules when income or housing costs change.",
    whyRelevant:
      "Rent math and allowed deductions can interact with ODSP rules—scenarios may flag “check your worker or official materials” because details are person-specific.",
  },
  OW: {
    title: "OW",
    expandedName: "Ontario Works",
    whatItIs:
      "Ontario’s social assistance program for people who need financial help while looking for work or stabilizing a crisis.",
    whatItDoes:
      "It provides income support tied to eligibility and participation expectations, and may connect people to employment or community supports.",
    whyRelevant:
      "Housing scenarios sometimes mention OW when a missed paycheque or job loss changes what someone can afford the same month rent is due.",
  },
  RGI: {
    title: "RGI",
    expandedName: "Rent-geared-to-income (subsidized rent)",
    whatItIs:
      "A subsidy model where rent is tied to household income rather than full market rent (common in social and community housing).",
    whatItDoes:
      "You report income changes on a schedule; rent adjusts within program rules so the unit stays more affordable as income goes up or down.",
    whyRelevant:
      "If copy says RGI, the story is often about paperwork, reporting deadlines, or waiting lists—not just “find any apartment.”",
  },
  N12: {
    title: "N12",
    expandedName: "Ontario Form N12 (landlord’s own use / purchaser’s own use)",
    whatItIs:
      "A prescribed notice form landlords may use in Ontario for specific “own use” ending-of-tenancy situations, when the rules allow it.",
    whatItDoes:
      "It starts a notice timeline; tenants may have options to dispute or discuss timing depending on facts and the Residential Tenancies Act.",
    whyRelevant:
      "Seeing “N12” in a scenario usually signals a high-stakes housing moment—deadlines and evidence matter, and local tenant services can help interpret it.",
  },
  N13: {
    title: "N13",
    expandedName: "Ontario Form N13 (demolition / renovation / conversion)",
    whatItIs:
      "A prescribed notice form related to ending tenancies for major repairs, demolition, or conversion in Ontario, when allowed under the rules.",
    whatItDoes:
      "It triggers specific timelines and sometimes compensation or relocation concepts that depend on the case.",
    whyRelevant:
      "N13 situations are often about displacement risk—understanding the form name helps you look up current LTB guidance rather than relying on the landlord’s summary alone.",
  },
  ACTO: {
    title: "ACTO",
    expandedName: "Advocacy Centre for Tenants Ontario",
    whatItIs:
      "A legal clinic organization in Ontario focused on tenants’ rights and systemic housing issues.",
    whatItDoes:
      "It provides legal information, represents tenants in some public interest cases, and publishes plain-language resources.",
    whyRelevant:
      "Scenarios may name ACTO when pointing readers toward credible tenant-law context—not quick fixes, but accurate framing.",
  },
  CERA: {
    title: "CERA",
    expandedName: "Centre for Equality Rights in Accommodation",
    whatItIs:
      "A Canadian organization focused on housing equality and human rights in housing (including discrimination cases).",
    whatItDoes:
      "It offers public legal education, referrals, and sometimes support related to human rights and housing access.",
    whyRelevant:
      "If a scenario mentions CERA, the theme is often fair treatment in rental searches, income discrimination, or accessibility—not only “how much is rent.”",
  },
  FOOD_BANK: {
    title: "Food bank",
    expandedName: "Food bank (emergency food programs)",
    whatItIs:
      "Community programs that distribute groceries or meals so people can eat when money is tight.",
    whatItDoes:
      "They use donations and partners; many use intake questions to match you to hampers, pantries, or hot meals—rules vary by location.",
    whyRelevant:
      "In money-stress storylines, food banks are a real relief valve that frees cash for rent or transit—but dignity, hours, and eligibility are part of the lived experience.",
  },
  LEGAL_AID: {
    title: "Legal aid",
    expandedName: "Legal aid services",
    whatItIs:
      "Publicly funded or nonprofit legal help for people who cannot pay full private lawyer fees. Names and eligibility differ by province.",
    whatItDoes:
      "May cover summary advice, duty counsel at hearings, or full representation for qualifying issues (often criminal, family, or some housing matters depending on funding).",
    whyRelevant:
      "When a scenario says “legal aid,” it’s nudging you toward formal rights help—not informal advice from a landlord or neighbour.",
  },
  COMMUNITY_LEGAL_CLINIC: {
    title: "Community legal clinic",
    expandedName: "Community legal clinics (Ontario and similar models)",
    whatItIs:
      "Nonprofit legal clinics that serve defined communities or issue areas (including housing) for people with low incomes.",
    whatItDoes:
      "They may give summary advice, help with tribunal forms, or represent clients in some disputes—capacity and scope vary.",
    whyRelevant:
      "Clinics are a common “next step” in Canadian renter storylines when a notice arrives or a landlord stops answering about repairs.",
  },
  UNITED_WAY: {
    title: "United Way",
    expandedName: "United Way (local fundraising and community programs)",
    whatItIs:
      "A network of charities that raise money and fund local agencies (211 in some regions, youth programs, shelters, and more).",
    whatItDoes:
      "Donations are pooled and granted to partner organizations; many regions also coordinate information and referral with other services.",
    whyRelevant:
      "You might see United Way when a scenario points to coordinated community support rather than a single government office.",
  },
  RENT_BANK: {
    title: "Rent bank",
    expandedName: "Rent bank programs",
    whatItIs:
      "Local programs (often nonprofit or municipal) that may offer one-time loans or grants to prevent eviction when someone faces a short-term rent shortfall.",
    whatItDoes:
      "Eligibility, maximum amounts, and repayment rules differ by city; they are not universal across Canada.",
    whyRelevant:
      "If copy mentions a rent bank, the plot is usually “bridge this month” urgency—useful if real programs exist where the story is set.",
  },
};

/**
 * Multi-word patterns. Each `key` must exist on `HOUSING_GLOSSARY`.
 * Longer / more specific phrases should appear first when one could overlap another.
 * @type {Array<{ key: string, re: RegExp }>}
 */
export const GLOSSARY_PHRASES = [
  { key: "COMMUNITY_LEGAL_CLINIC", re: /\bcommunity\s+legal\s+clinics?\b/gi },
  { key: "LEGAL_AID", re: /\blegal\s+aid\b/gi },
  { key: "FOOD_BANK", re: /\bfood\s+banks?\b/gi },
  { key: "UNITED_WAY", re: /\bunited\s+way\b/gi },
  { key: "RENT_BANK", re: /\brent\s+banks?\b/gi },
];

/**
 * @param {string} text
 * @returns {Array<{ type: 'text', text: string } | { type: 'term', key: string, surface: string }>}
 */
export function parseGlossarySegments(text) {
  if (!text) return [{ type: "text", text: "" }];

  const keys = Object.keys(HOUSING_GLOSSARY).sort((a, b) => b.length - a.length);
  /** @type {Array<{ key: string, re: RegExp }>} */
  const tokenPatterns = keys.map((key) => ({
    key,
    re: new RegExp(`\\b${escapeRegExp(key)}\\b`, "gi"),
  }));

  const phrasePatterns = GLOSSARY_PHRASES.map(({ key, re }) => ({
    key,
    re: new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`),
  }));

  /** @type {Array<{ start: number, end: number, key: string, surface: string }>} */
  const raw = [];

  function collect({ key, re }) {
    const r = new RegExp(re.source, re.flags);
    let m;
    while ((m = r.exec(text)) !== null) {
      const surface = m[0];
      raw.push({ start: m.index, end: m.index + surface.length, key, surface });
    }
  }

  for (const p of phrasePatterns) collect(p);
  for (const p of tokenPatterns) collect(p);

  raw.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end - (a.end - a.start);
  });

  /** @type {typeof raw} */
  const picked = [];
  for (const m of raw) {
    const overlaps = picked.some((p) => m.start < p.end && m.end > p.start);
    if (overlaps) continue;
    picked.push(m);
  }
  picked.sort((a, b) => a.start - b.start);

  /** @type {ReturnType<typeof parseGlossarySegments>} */
  const parts = [];
  let lastIndex = 0;
  for (const m of picked) {
    if (m.start > lastIndex) parts.push({ type: "text", text: text.slice(lastIndex, m.start) });
    parts.push({ type: "term", key: m.key, surface: m.surface });
    lastIndex = m.end;
  }
  if (lastIndex < text.length) parts.push({ type: "text", text: text.slice(lastIndex) });
  return parts.length ? parts : [{ type: "text", text }];
}
