import { useState } from "react";

const CHAPTERS = [
  {
    day: 1,
    title: "The First Viewing",
    description: "You find a listing. Is it too good to be true?",
    tag: "Foundations",
    scenarios: 5,
    status: "complete",
    details: "Learn how to evaluate a rental listing, spot red flags, and ask the right questions during a viewing.",
  },
  {
    day: 2,
    title: "Signing the Lease",
    description: "Clauses, deposits, and red flags in fine print.",
    tag: "Legal",
    scenarios: 6,
    status: "complete",
    details: "Understand lease agreements, identify problematic clauses, and know your rights before signing.",
  },
  {
    day: 3,
    title: "Moving In Day",
    description: "Inventory checks, broken fixtures, your first dispute.",
    tag: "Conflicts",
    scenarios: 4,
    status: "active",
    details: "Master move-in procedures, document property condition, and handle initial landlord disputes.",
  },
  {
    day: 4,
    title: "The Noisy Neighbour",
    description: "Conflict, mediation, and your legal options.",
    tag: "Conflicts",
    scenarios: 5,
    status: "locked",
    details: "Navigate neighbor disputes, understand tenant responsibilities, and know when to involve authorities.",
  },
  {
    day: 5,
    title: "Maintenance Request",
    description: "Mould, leaks, and landlord obligations.",
    tag: "Rights",
    scenarios: 5,
    status: "locked",
    details: "Learn landlord maintenance obligations, proper request procedures, and what to do if repairs are ignored.",
  },
  {
    day: 6,
    title: "Rent Increase Notice",
    description: "What's legal, negotiable, when to push back.",
    tag: "Legal",
    scenarios: 4,
    status: "locked",
    details: "Understand rent increase laws, permitted increases, and strategies for negotiating or challenging.",
  },
  {
    day: 7,
    title: "Subletting & Guests",
    description: "The grey zones of occupancy and permission.",
    tag: "Rights",
    scenarios: 4,
    status: "locked",
    details: "Know the rules around subletting, long-term guests, and your rights to occupy the unit.",
  },
  {
    day: 8,
    title: "Notice to Vacate",
    description: "Receiving a notice — your rights and timeline.",
    tag: "Legal",
    scenarios: 5,
    status: "locked",
    details: "Understand eviction notice types, legal timelines, and your options when facing eviction.",
  },
  {
    day: 9,
    title: "The Final Inspection",
    description: "Wear and tear, damage claims, deposit recovery.",
    tag: "Finances",
    scenarios: 5,
    status: "locked",
    details: "Navigate move-out inspections, challenge unfair damage claims, and recover your security deposit.",
  },
  {
    day: 10,
    title: "The Reckoning",
    description: "Tribunal, resolution, and the aftermath.",
    tag: "Resolution",
    scenarios: 5,
    status: "locked",
    details: "Prepare for and navigate the rental tribunal, present your case, and understand dispute resolution.",
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

const TAG_FILTERS = ["All", "Foundations", "Legal", "Conflicts", "Rights", "Finances", "Resolution"];

function StatusBadge({ status }) {
  const badges = {
    complete: <span className="text-[11px] font-medium text-green-400">Completed</span>,
    active: <span className="text-[11px] font-medium text-white">In Progress</span>,
    locked: <span className="text-[11px] font-medium text-zinc-500">Locked</span>,
  };
  return badges[status];
}

export default function Chapters() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? CHAPTERS : CHAPTERS.filter((ch) => ch.tag === filter);

  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-[#090909]/80 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="h-5 w-5 rounded bg-white flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 10L5.5 1 10 10H1z" fill="#090909" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold tracking-tight">TenantTales</span>
          </a>

          <nav className="hidden md:flex items-center gap-5">
            {[
              { label: "How it works", href: "/how-it-works" },
              { label: "Chapters", href: "/chapters", active: true },
              { label: "About", href: "/about" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-[13px] transition-colors ${
                  l.active ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="/login" className="text-[13px] text-zinc-400 hover:text-white px-3 py-1.5 transition-colors">
              Sign in
            </a>
            <a href="/signup" className="text-[13px] font-medium bg-white text-zinc-950 px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors">
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-zinc-900 py-16 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-8 bg-zinc-700" />
            <span className="text-[11px] tracking-widest uppercase text-zinc-500">All Chapters</span>
            <span className="h-px w-8 bg-zinc-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] mb-3">
            The Complete Journey
          </h1>
          <p className="text-[15px] text-zinc-500 leading-relaxed">
            10 chapters covering every aspect of tenant rights. Progress through them in order.
          </p>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="border-b border-zinc-900 px-6 py-6">
        <div className="max-w-[900px] mx-auto">
          <div className="flex flex-wrap gap-2">
            {TAG_FILTERS.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`text-[12px] font-medium px-3 py-1.5 rounded-md transition-all ${
                  filter === tag
                    ? "bg-white text-zinc-950"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTERS GRID */}
      <section className="py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((ch) => (
              <div
                key={ch.day}
                className={`p-6 rounded-lg border transition-all ${
                  ch.status === "locked"
                    ? "border-zinc-800 bg-zinc-950/40 opacity-60 cursor-not-allowed"
                    : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-semibold">Day {String(ch.day).padStart(2, "0")}</span>
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-md ${TAG_COLORS[ch.tag]}`}>
                      {ch.tag}
                    </span>
                  </div>
                  <StatusBadge status={ch.status} />
                </div>

                {/* Title & desc */}
                <h3 className="text-[18px] font-semibold mb-1.5">{ch.title}</h3>
                <p className="text-[13px] text-zinc-500 mb-3">{ch.description}</p>

                {/* Expanded details */}
                <p className="text-[13px] text-zinc-600 leading-relaxed mb-4">{ch.details}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-[12px] text-zinc-500">
                  <span>{ch.scenarios} scenarios</span>
                  {ch.status !== "locked" && (
                    <a
                      href={ch.status === "active" ? `/game?day=${ch.day}` : "#"}
                      className={`text-white font-medium ${
                        ch.status === "active" ? "hover:underline cursor-pointer" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {ch.status === "complete" ? "Review" : "Continue"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[14px] text-zinc-500">No chapters match that filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center text-[12px] text-zinc-600">
        <div className="max-w-[1280px] mx-auto">
          <p>© 2026 TenantTales. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}