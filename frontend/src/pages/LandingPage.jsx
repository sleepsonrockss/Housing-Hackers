import { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  // ─────────────────────────────────
  // Data
  // ─────────────────────────────────
  const CHAPTERS = [
    {
      day: 1,
      title: "The First Viewing",
      desc: "You find a listing. Is it too good to be true?",
      tag: "Foundations",
      n: 5,
      s: "complete",
    },
    {
      day: 2,
      title: "Signing the Lease",
      desc: "Clauses, deposits, and red flags in fine print.",
      tag: "Legal",
      n: 6,
      s: "complete",
    },
    {
      day: 3,
      title: "Moving In Day",
      desc: "Inventory checks, broken fixtures, your first dispute.",
      tag: "Conflicts",
      n: 4,
      s: "active",
    },
    {
      day: 4,
      title: "The Noisy Neighbour",
      desc: "Conflict, mediation, and your legal options.",
      tag: "Conflicts",
      n: 5,
      s: "locked",
    },
    {
      day: 5,
      title: "Maintenance Request",
      desc: "Mould, leaks, and landlord obligations.",
      tag: "Rights",
      n: 5,
      s: "locked",
    },
    {
      day: 6,
      title: "Rent Increase Notice",
      desc: "What's legal, negotiable, when to push back.",
      tag: "Legal",
      n: 4,
      s: "locked",
    },
    {
      day: 7,
      title: "Subletting & Guests",
      desc: "The grey zones of occupancy and permission.",
      tag: "Rights",
      n: 4,
      s: "locked",
    },
    {
      day: 8,
      title: "Notice to Vacate",
      desc: "Receiving a notice — your rights and timeline.",
      tag: "Legal",
      n: 5,
      s: "locked",
    },
    {
      day: 9,
      title: "The Final Inspection",
      desc: "Wear and tear, damage claims, deposit recovery.",
      tag: "Finances",
      n: 5,
      s: "locked",
    },
    {
      day: 10,
      title: "The Reckoning",
      desc: "Tribunal, resolution, and the aftermath.",
      tag: "Resolution",
      n: 5,
      s: "locked",
    },
  ];

  const TAG_COLORS = {
    Foundations: "background:#18181b;color:#71717a;",
    Legal: "background:#0c1829;color:#60a5fa;",
    Conflicts: "background:#1c0a0a;color:#f87171;",
    Rights: "background:#1c1200;color:#fbbf24;",
    Finances: "background:#021c10;color:#34d399;",
    Resolution: "background:#110b1e;color:#a78bfa;",
  };

  const ICON = {
    complete: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#22c55e" strokeWidth="1" />
        <path
          d="M4 7l2 2 4-4"
          stroke="#22c55e"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    active: (
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "14px",
          height: "14px",
        }}
      >
        <span
          className="ping"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
          }}
        ></span>
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#fff",
            display: "block",
          }}
        ></span>
      </span>
    ),
    locked: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#27272a" strokeWidth="1" />
      </svg>
    ),
  };

  const [selected, setSelected] = useState(3);

  // ─────────────────────────────────
  // Helpers
  // ─────────────────────────────────
  const parseTagStyle = (tagString) => {
    return Object.fromEntries(
      tagString
        .split(";")
        .filter(Boolean)
        .map((pair) => pair.split(":"))
        .map(([k, v]) => [k.trim(), v.trim()])
    );
  };

  // ─────────────────────────────────
  // Render
  // ─────────────────────────────────
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
          backdropFilter: "blur(14px)",
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
          {/* Logo */}
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

          {/* Nav Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link
              to="/how-it-works"
              style={{
                fontSize: "13px",
                color: "#71717a",
                transition: "color 0.12s",
                textDecoration: "none",
              }}
            >
              How it works
            </Link>
            <Link
              to="/chapters"
              style={{
                fontSize: "13px",
                color: "#71717a",
                transition: "color 0.12s",
                textDecoration: "none",
              }}
            >
              Chapters
            </Link>
            <Link
              to="/about"
              style={{
                fontSize: "13px",
                color: "#71717a",
                transition: "color 0.12s",
                textDecoration: "none",
              }}
            >
              About
            </Link>
          </nav>

          {/* Auth Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Link
              to="/login"
              style={{
                fontSize: "13px",
                color: "#71717a",
                padding: "6px 14px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                background: "#fff",
                color: "#09090b",
                padding: "7px 14px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div
        style={{
          display: "flex",
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          minHeight: "calc(100vh - 56px)",
        }}
      >
        {/* ── MAIN ── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 48px",
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
            <span style={{ height: "1px", width: "28px", background: "#27272a", display: "block" }}></span>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#52525b",
                fontWeight: 500,
              }}
            >
              Interactive Learning
            </span>
            <span style={{ height: "1px", width: "28px", background: "#27272a", display: "block" }}></span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(38px,5vw,54px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              textAlign: "center",
              lineHeight: 1.05,
              marginBottom: "18px",
              maxWidth: "500px",
            }}
          >
            Navigate life as
            <br />
            <span style={{ color: "#52525b" }}>a renter.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "15px",
              color: "#52525b",
              textAlign: "center",
              maxWidth: "360px",
              lineHeight: 1.65,
              marginBottom: "40px",
              fontWeight: 300,
            }}
          >
            Face real scenarios. Make decisions. Learn tenant rights through an immersive,
            chapter-based game.
          </p>

          {/* Progress Section */}
          <div style={{ width: "100%", maxWidth: "380px", marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "9px" }}>
              <span
                style={{
                  fontSize: "11px",
                  color: "#3f3f46",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Progress
              </span>
              <span style={{ fontSize: "11px", color: "#52525b", fontWeight: 500 }}>
                2 / 10 chapters
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ display: "flex", gap: "3px", height: "3px" }}>
              {CHAPTERS.map((ch) => (
                <div
                  key={ch.day}
                  style={{
                    flex: 1,
                    borderRadius: "9px",
                    background:
                      ch.s === "complete" ? "#fff" : ch.s === "active" ? "#3f3f46" : "#1c1c1f",
                  }}
                ></div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px" }}>
              <span style={{ fontSize: "10px", color: "#27272a" }}>Start</span>
              <span style={{ fontSize: "10px", color: "#27272a" }}>Complete</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Link
              to="/game"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#fff",
                color: "#09090b",
                fontSize: "13px",
                fontWeight: 600,
                padding: "10px 20px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Continue — Day 03
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M7 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              to="/how-it-works"
              style={{
                fontSize: "13px",
                color: "#52525b",
                textDecoration: "none",
              }}
            >
              How it works
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              marginTop: "60px",
              borderTop: "1px solid #111",
              paddingTop: "28px",
              width: "100%",
              maxWidth: "380px",
              display: "flex",
              justifyContent: "center",
              gap: "48px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>10</div>
              <div style={{ fontSize: "11px", color: "#3f3f46", marginTop: "3px" }}>
                Chapters
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>48</div>
              <div style={{ fontSize: "11px", color: "#3f3f46", marginTop: "3px" }}>
                Scenarios
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>120+</div>
              <div style={{ fontSize: "11px", color: "#3f3f46", marginTop: "3px" }}>
                Outcomes
              </div>
            </div>
          </div>
        </main>

        {/* ── RIGHT SIDEBAR ── */}
        <aside
          style={{
            width: "320px",
            flexShrink: 0,
            borderLeft: "1px solid #111",
            overflowY: "auto",
            maxHeight: "calc(100vh - 56px)",
            position: "sticky",
            top: "56px",
            padding: "22px 14px",
          }}
        >
          {/* Panel Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              padding: "0 4px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#3f3f46",
                fontWeight: 500,
              }}
            >
              Chapters
            </span>
            <span style={{ fontSize: "11px", color: "#27272a" }}>2 done</span>
          </div>

          {/* Chapter List */}
          <div>
            {CHAPTERS.map((ch) => {
              const locked = ch.s === "locked";
              const isSel = selected === ch.day && !locked;
              const titleColor =
                ch.s === "active" ? "#fff" : ch.s === "complete" ? "#d4d4d8" : "#52525b";
              const lineColor = ch.s === "complete" ? "#27272a" : "#1c1c1f";
              const tagStyle = parseTagStyle(TAG_COLORS[ch.tag]);

              return (
                <div
                  key={ch.day}
                  className="chapter-row"
                  onClick={!locked ? () => setSelected(ch.day) : undefined}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: locked ? "not-allowed" : "pointer",
                    opacity: locked ? 0.35 : 1,
                    marginBottom: "2px",
                    border: isSel ? "1px solid #3f3f46" : "1px solid transparent",
                    background: isSel ? "rgba(24,24,27,0.7)" : undefined,
                    transition: "all 0.1s",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    {/* Status Icon + Line */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        paddingTop: "2px",
                        flexShrink: 0,
                      }}
                    >
                      {ICON[ch.s]}
                      {ch.day < 10 && (
                        <div style={{ width: "1px", height: "22px", background: lineColor }}></div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: ch.day < 10 ? "4px" : "0" }}>
                      {/* Title + Tag */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          marginBottom: "3px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: titleColor,
                            lineHeight: 1.3,
                          }}
                        >
                          {ch.title}
                        </span>

                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 500,
                            padding: "2px 7px",
                            borderRadius: "4px",
                            ...tagStyle,
                          }}
                        >
                          {ch.tag}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#3f3f46",
                          lineHeight: 1.5,
                          margin: "0 0 5px",
                        }}
                      >
                        {ch.desc}
                      </p>

                      {/* Metadata */}
                      <div style={{ display: "flex", gap: "8px", fontSize: "10px", color: "#27272a" }}>
                        <span>Day {String(ch.day).padStart(2, "0")}</span>
                        <span>·</span>
                        <span>{ch.n} scenarios</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <p
            style={{
              marginTop: "20px",
              padding: "0 4px",
              fontSize: "10px",
              color: "#27272a",
              lineHeight: 1.6,
            }}
          >
            Complete each chapter to unlock the next. Progress saves automatically.
          </p>
        </aside>
      </div>
    </div>
  );
}