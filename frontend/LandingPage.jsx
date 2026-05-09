import { useState } from "react";

// ── Utility ──────────────────────────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ── Data ─────────────────────────────────────────────────
const CHAPTERS = [
  {
    day: 1,
    title: "The First Viewing",
    description: "You find a listing. Is it too good to be true?",
    tag: "Foundations",
    scenarios: 5,
    status: "complete",
  },
  {
    day: 2,
    title: "Signing the Lease",
    description: "Clauses, deposits, and red flags in fine print.",
    tag: "Legal",
    scenarios: 6,
    status: "complete",
  },
  {
    day: 3,
    title: "Moving In Day",
    description: "Inventory checks, broken fixtures, your first dispute.",
    tag: "Conflicts",
    scenarios: 4,
    status: "active",
  },
  {
    day: 4,
    title: "The Noisy Neighbour",
    description: "Conflict, mediation, and your legal options.",
    tag: "Conflicts",
    scenarios: 5,
    status: "locked",
  },
  {
    day: 5,
    title: "Maintenance Request",
    description: "Mould, leaks, and landlord obligations.",
    tag: "Rights",
    scenarios: 5,
    status: "locked",
  },
  {
    day: 6,
    title: "Rent Increase Notice",
    description: "What's legal, what's negotiable, when to push back.",
    tag: "Legal",
    scenarios: 4,
    status: "locked",
  },
  {
    day: 7,
    title: "Subletting & Guests",
    description: "The grey zones of occupancy and permission.",
    tag: "Rights",
    scenarios: 4,
    status: "locked",
  },
  {
    day: 8,
    title: "Notice to Vacate",
    description: "Receiving a notice — your rights and timeline.",
    tag: "Legal",
    scenarios: 5,
    status: "locked",
  },
  {
    day: 9,
    title: "The Final Inspection",
    description: "Wear and tear, damage claims, deposit recovery.",
    tag: "Finances",
    scenarios: 5,
    status: "locked",
  },
  {
    day: 10,
    title: "The Reckoning",
    description: "Tribunal, resolution, and the aftermath.",
    tag: "Resolution",
    scenarios: 5,
    status: "locked",
  },
];

const TAG_COLORS = {
  Foundations: "bg-zinc-800 text-zinc-400",
  Legal: "bg-blue-950 text-blue-400",
  Conflicts: "bg-red-950 text-red-400",
  Rights: "bg-amber-950 text-amber-400",
  Finances: "bg-emerald-950 text-emerald-400",
  Resolution: "bg-purple-950 text-purple-400",
};

const PROGRESS = (2 / 10) * 100; // 2 complete out of 10

// ── Sub-components ────────────────────────────────────────

function StatusIcon({ status }) {
  if (status === "complete")
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#22c55e" strokeWidth="1" />
        <path d="M4 7l2 2 4-4" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (status === "active")
    return (
      <span className="relative flex h-[14px] w-[14px] items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-20" />
        <span className="inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke="#3f3f46" strokeWidth="1" />
    </svg>
  );
}

function ChapterCard({ chapter, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={chapter.status === "locked"}
      className={cn(
        "group w-full text-left px-3 py-3 rounded-lg border transition-all duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        isSelected && chapter.status !== "locked"
          ? "border-zinc-600 bg-zinc-800/60"
          : "border-transparent hover:border-zinc-800 hover:bg-zinc-900/60"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Left: status dot + day */}
        <div className="flex flex-col items-center gap-1.5 pt-[2px]">
          <StatusIcon status={chapter.status} />
          {/* connector line */}
          {chapter.day < 10 && (
            <div
              className={cn(
                "w-px h-5",
                chapter.status === "complete" ? "bg-zinc-700" : "bg-zinc-800"
              )}
            />
          )}
        </div>

        {/* Right: content */}
        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className={cn(
                "text-[13px] font-medium leading-snug",
                chapter.status === "active"
                  ? "text-white"
                  : chapter.status === "complete"
                  ? "text-zinc-300"
                  : "text-zinc-500"
              )}
            >
              {chapter.title}
            </span>
            <span
              className={cn(
                "shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-md",
                TAG_COLORS[chapter.tag]
              )}
            >
              {chapter.tag}
            </span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-2">
            {chapter.description}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] text-zinc-700">
              Day {String(chapter.day).padStart(2, "0")}
            </span>
            <span className="text-zinc-800">·</span>
            <span className="text-[10px] text-zinc-700">{chapter.scenarios} scenarios</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function ProgressBar({ percent }) {
  const complete = CHAPTERS.filter((c) => c.status === "complete").length;
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-zinc-500 tracking-wide uppercase">
          Progress
        </span>
        <span className="text-[11px] text-zinc-400 font-medium">
          {complete} / {CHAPTERS.length} chapters
        </span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-0.5 h-1">
        {CHAPTERS.map((ch) => (
          <div
            key={ch.day}
            className={cn(
              "flex-1 rounded-full transition-all duration-500",
              ch.status === "complete"
                ? "bg-white"
                : ch.status === "active"
                ? "bg-zinc-500"
                : "bg-zinc-800"
            )}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <span className="text-[10px] text-zinc-700">Start</span>
        <span className="text-[10px] text-zinc-700">Complete</span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────

export default function LandingPage() {
  const [selectedDay, setSelectedDay] = useState(3);

  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans antialiased flex flex-col">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-[#090909]/80 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-5 rounded bg-white flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 10L5.5 1 10 10H1z" fill="#090909" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-white">
              TenantTales
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-5">
            {["How it works", "Chapters", "About"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="text-[13px] text-zinc-400 hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="text-[13px] font-medium bg-white text-zinc-950 px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex flex-1 max-w-[1280px] mx-auto w-full">
        {/* ── LEFT / CENTRE MAIN ── */}
        <main className="flex-1 flex flex-col items-center justify-center px-8 py-20 min-h-[calc(100vh-56px)]">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <span className="h-px w-8 bg-zinc-700" />
            <span className="text-[11px] tracking-widest uppercase text-zinc-500">
              Interactive Learning
            </span>
            <span className="h-px w-8 bg-zinc-700" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-semibold tracking-tight text-white text-center leading-[1.08] mb-5 max-w-[520px]">
            Navigate life as
            <br />
            <span className="text-zinc-500">a renter.</span>
          </h1>

          {/* Sub */}
          <p className="text-[15px] text-zinc-500 text-center max-w-[380px] leading-relaxed mb-10">
            Face real scenarios. Make decisions. Learn tenant rights through
            an immersive, chapter-based game.
          </p>

          {/* Progress */}
          <div className="w-full max-w-[380px] mb-10">
            <ProgressBar percent={PROGRESS} />
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="/game"
              className="inline-flex items-center gap-2 bg-white text-zinc-950 text-[13px] font-semibold px-5 py-2.5 rounded-md hover:bg-zinc-100 transition-all"
            >
              Continue — Day 03
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-[13px] text-zinc-500 hover:text-white transition-colors"
            >
              How it works
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex items-center gap-8 border-t border-zinc-900 pt-8 w-full max-w-[380px] justify-center">
            {[
              { n: "10", l: "Chapters" },
              { n: "48", l: "Scenarios" },
              { n: "120+", l: "Outcomes" },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <div className="text-xl font-semibold text-white">{n}</div>
                <div className="text-[11px] text-zinc-600 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </main>

        {/* ── RIGHT PANEL: CHAPTERS ── */}
        <aside className="w-[320px] shrink-0 border-l border-zinc-900 overflow-y-auto max-h-[calc(100vh-56px)] sticky top-14 py-6 px-4">
          {/* Panel header */}
          <div className="flex items-center justify-between mb-5 px-1">
            <span className="text-[11px] tracking-widest uppercase text-zinc-600">
              Chapters
            </span>
            <span className="text-[11px] text-zinc-700">
              {CHAPTERS.filter((c) => c.status === "complete").length} done
            </span>
          </div>

          {/* Chapter list */}
          <div className="space-y-0">
            {CHAPTERS.map((ch) => (
              <ChapterCard
                key={ch.day}
                chapter={ch}
                isSelected={selectedDay === ch.day}
                onClick={() => setSelectedDay(ch.day)}
              />
            ))}
          </div>

          {/* Bottom hint */}
          <p className="mt-6 px-1 text-[10px] text-zinc-800 leading-relaxed">
            Complete each chapter to unlock the next. Your progress is saved automatically.
          </p>
        </aside>
      </div>
    </div>
  );
}