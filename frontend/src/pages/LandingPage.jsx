import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CHAPTER_COUNT,
  DISPLAY_SCENARIO_TOTAL,
  getLandingChapterStrip,
} from "../game/gameStructure";
import GameNavActions from "../components/GameNavActions";
import SiteAuthHeaderLinks from "../components/SiteAuthHeaderLinks";
import { getResumeGameHref, loadPersistedRun } from "../game/playerSessionPersist";

export default function LandingPage() {
  // ─────────────────────────────────
  // Data
  // ─────────────────────────────────
  const CHAPTERS = useMemo(() => getLandingChapterStrip(), []);
  /** Re-read on each mount (e.g. return from `/game`) so CTA matches session. */
  const persistedRun = useMemo(() => loadPersistedRun(), []);
  const hasStarted = persistedRun != null;
  const continueDay = hasStarted
    ? Math.max(1, Math.min(CHAPTER_COUNT, Math.floor(persistedRun.unlockedDay) || 1))
    : 1;
  const primaryGameHref = useMemo(() => getResumeGameHref(), []);
  const primaryCtaLabel = hasStarted
    ? `Continue — Day ${String(continueDay).padStart(2, "0")}`
    : "Start";

  const TAG_COLORS = {
    Money: "background:#1c1200;color:#fbbf24;",
    Rental: "background:#0c1829;color:#60a5fa;",
    People: "background:#110b1e;color:#a78bfa;",
    Burnout: "background:#1c0a0a;color:#f87171;",
    Future: "background:#021c10;color:#34d399;",
  };

  const chaptersComplete = CHAPTERS.filter((c) => c.s === "complete").length;

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
          {/* Logo + preview-only auth (no other app surfaces link here) */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
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
            <SiteAuthHeaderLinks />
          </div>

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
              Days
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

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Link
              to={primaryGameHref}
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
              Play
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
            five-day game.
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
                {chaptersComplete} / {CHAPTER_COUNT} days
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
              to={primaryGameHref}
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
              aria-label={hasStarted ? `Continue game at day ${continueDay}` : "Start game from day 1"}
            >
              {primaryCtaLabel}
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

          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", width: "100%" }}>
            <GameNavActions compact />
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
              gap: "56px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>{CHAPTER_COUNT}</div>
              <div style={{ fontSize: "11px", color: "#3f3f46", marginTop: "3px" }}>
                Days
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>{DISPLAY_SCENARIO_TOTAL}</div>
              <div style={{ fontSize: "11px", color: "#3f3f46", marginTop: "3px" }}>
                Scenarios
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
              Days
            </span>
            <span style={{ fontSize: "11px", color: "#27272a" }}>{chaptersComplete} done</span>
          </div>

          {/* Day list */}
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
                      {ch.day < CHAPTER_COUNT && (
                        <div style={{ width: "1px", height: "22px", background: lineColor }}></div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: ch.day < CHAPTER_COUNT ? "4px" : "0" }}>
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
                          margin: 0,
                        }}
                      >
                        {ch.desc}
                      </p>
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
            Complete each day to unlock the next. Progress saves automatically.
          </p>
        </aside>
      </div>
    </div>
  );
}