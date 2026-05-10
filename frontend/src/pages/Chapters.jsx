import { useState } from "react";
import { Link } from "react-router-dom";
import { CHAPTER_TAG_FILTERS, getChaptersPageItems } from "../game/gameStructure";
import { getResumeGameHref } from "../game/playerSessionPersist";

const CHAPTERS = getChaptersPageItems();

const TAG_COLORS = {
  Money: { background: "#1c1200", color: "#fbbf24" },
  Rental: { background: "#0c1829", color: "#60a5fa" },
  People: { background: "#110b1e", color: "#a78bfa" },
  Burnout: { background: "#1c0a0a", color: "#f87171" },
  Future: { background: "#021c10", color: "#34d399" },
};

const TAG_FILTERS = CHAPTER_TAG_FILTERS;

export default function Chapters() {
  const [filter, setFilter] = useState("All");
  const playHref = getResumeGameHref();

  const filtered =
    filter === "All" ? CHAPTERS : CHAPTERS.filter((ch) => ch.tag === filter);

  return (
    <div style={{ background: "#090909", color: "#fff", minHeight: "100vh" }}>
      {/* ── NAV ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid #111",
          background: "rgba(9,9,9,0.88)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                height: "20px",
                width: "20px",
                background: "#fff",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 10L5.5 1 10 10H1z" fill="#090909" />
              </svg>
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.02em" }}>
              TenantTales
            </span>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {[
              { label: "How it works", href: "/how-it-works" },
              { label: "Chapters", href: "/chapters", active: true },
              { label: "About", href: "/about" },
            ].map((l) => (
              <Link
                key={l.href}
                to={l.href}
                style={{
                  fontSize: "13px",
                  color: l.active ? "#fff" : "#71717a",
                  fontWeight: l.active ? 500 : 400,
                  transition: "color 0.12s",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              to="/login"
              style={{
                fontSize: "13px",
                color: "#71717a",
                padding: "6px 12px",
                textDecoration: "none",
                transition: "color 0.12s",
              }}
            >
              Sign in
            </Link>
            <Link
              to={playHref}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                background: "#fff",
                color: "#09090b",
                padding: "6px 14px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Play
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ borderBottom: "1px solid #111", padding: "64px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <span style={{ height: "1px", width: "32px", background: "#27272a" }}></span>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#52525b",
              }}
            >
              All Chapters
            </span>
            <span style={{ height: "1px", width: "32px", background: "#27272a" }}></span>
          </div>
          <h1
            style={{
              fontSize: "clamp(32px,5vw,48px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              marginBottom: "12px",
            }}
          >
            The Complete Journey
          </h1>
          <p style={{ fontSize: "15px", color: "#52525b", lineHeight: 1.6 }}>
            Five chapters condense the full workbook arc. Progress through them in order — each chapter maps
            several curriculum “days” into one playable beat.
          </p>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <section style={{ borderBottom: "1px solid #111", padding: "24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {TAG_FILTERS.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: filter === tag ? "#fff" : "#111",
                  color: filter === tag ? "#09090b" : "#71717a",
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAPTERS GRID ── */}
      <section style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.map((ch) => (
              <div
                key={ch.day}
                style={{
                  padding: "24px",
                  borderRadius: "8px",
                  border: "1px solid #27272a",
                  background:
                    ch.status === "locked"
                      ? "rgba(24,24,27,0.2)"
                      : "rgba(24,24,27,0.3)",
                  opacity: ch.status === "locked" ? 0.6 : 1,
                  cursor: ch.status === "locked" ? "not-allowed" : "pointer",
                  transition: "all 0.12s",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                    <span style={{ fontSize: "24px", fontWeight: 600 }}>
                      Chapter {String(ch.day).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "4px 12px",
                        borderRadius: "4px",
                        ...TAG_COLORS[ch.tag],
                      }}
                    >
                      {ch.tag}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color:
                        ch.status === "complete"
                          ? "#22c55e"
                          : ch.status === "active"
                          ? "#fff"
                          : "#71717a",
                    }}
                  >
                    {ch.status === "complete"
                      ? "Completed"
                      : ch.status === "active"
                      ? "In Progress"
                      : "Locked"}
                  </span>
                </div>

                {/* Title & desc */}
                <p style={{ fontSize: "11px", color: "#52525b", marginBottom: "6px", letterSpacing: "0.04em" }}>
                  Workbook days {ch.workbookDayFrom}–{ch.workbookDayTo} · {ch.subtitle}
                </p>
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                  {ch.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#a1a1aa", marginBottom: "12px", fontStyle: "italic" }}>
                  {ch.description}
                </p>

                {/* Details */}
                <p
                  style={{
                    fontSize: "13px",
                    color: "#71717a",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                  }}
                >
                  {ch.details}
                </p>

                {/* Meta */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    fontSize: "12px",
                    color: "#52525b",
                  }}
                >
                  <span>{ch.scenarios} scenarios</span>
                  {ch.status !== "locked" && (
                    <Link
                      to={
                        ch.status === "active"
                          ? `/game/day/${ch.day}`
                          : "#"
                      }
                      style={{
                        color: ch.status === "active" ? "#fff" : "#52525b",
                        fontWeight: 500,
                        textDecoration: ch.status === "active" ? "none" : "none",
                        cursor: ch.status === "active" ? "pointer" : "not-allowed",
                      }}
                    >
                      {ch.status === "complete" ? "Review" : "Continue"}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: "14px", color: "#52525b" }}>
                No chapters match that filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #111",
          padding: "32px 24px",
          textAlign: "center",
          fontSize: "12px",
          color: "#52525b",
        }}
      >
        <p>© 2026 TenantTales. All rights reserved.</p>
        <p style={{ marginTop: "12px" }}>
          <Link to="/game?day=1&reset=1" style={{ color: "#71717a", textDecoration: "underline" }}>
            Start a new run (reset money, stress, and story flags)
          </Link>
        </p>
      </footer>
    </div>
  );
}