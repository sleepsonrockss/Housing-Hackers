import { Link } from "react-router-dom";
import GameNavActions from "../components/GameNavActions";
import SiteAuthHeaderLinks from "../components/SiteAuthHeaderLinks";
import { CHAPTER_COUNT, DISPLAY_SCENARIO_TOTAL } from "../game/gameStructure";
import { getResumeGameHref } from "../game/playerSessionPersist";

export default function HowItWorks() {
  const playHref = getResumeGameHref();
  return (
    <div style={{ background: "#090909", color: "#fff", minHeight: "100vh" }}>
      {/* NAV */}
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
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
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

          <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {[
              { label: "How it works", href: "/how-it-works", active: true },
              { label: "Days", href: "/chapters" },
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

      {/* HERO */}
      <section style={{ borderBottom: "1px solid #111", padding: "80px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
            <span style={{ height: "1px", width: "32px", background: "#27272a", display: "block" }}></span>
            <span style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b" }}>
              The Method
            </span>
            <span style={{ height: "1px", width: "32px", background: "#27272a", display: "block" }}></span>
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 600, letterSpacing: "-0.04em", marginBottom: "16px" }}>
            How TenantTales Works
          </h1>
          <p style={{ fontSize: "15px", color: "#52525b", lineHeight: 1.6 }}>
            A five-day, decision-driven experience that teaches you tenant rights through real scenarios.
          </p>
        </div>
      </section>

      {/* STEP-BY-STEP */}
      <section style={{ borderBottom: "1px solid #111", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "48px" }}>The Journey</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {[
              {
                step: 1,
                title: "Start your day",
                desc: "You arrive at a new scenario: an inspection, a neighbor issue, a lease notice, or another real renting moment.",
              },
              {
                step: 2,
                title: "Face the decision",
                desc: "Read the situation and choose from several realistic options.",
              },
              {
                step: 3,
                title: "Make your choice",
                desc: "Select an action. The story reacts with immediate feedback you can learn from.",
              },
              {
                step: 4,
                title: "Learn and progress",
                desc: "See what changed and why it matters for tenants. Then move on to the next beat.",
              },
              {
                step: 5,
                title: "Complete the day",
                desc: "Finish the day’s beats to unlock the next one. Your place in the run is saved automatically.",
              },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      border: "1px solid #27272a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#0a0a0f",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {item.step}
                  </div>
                  {item.step < 5 && <div style={{ width: "1px", height: "48px", background: "#27272a" }} />}
                </div>

                <div style={{ paddingTop: "4px", paddingBottom: "16px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section style={{ borderBottom: "1px solid #111", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "48px" }}>
            What Makes It Work
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px" }}>
            {[
              {
                title: "Scenario-Based Learning",
                desc: "Learn from realistic situations, not textbooks. Each scenario mirrors real-world tenant challenges.",
              },
              {
                title: "Progressive Difficulty",
                desc: "Start with basics (viewings, leases). Progress to complex issues (disputes, tribunals).",
              },
              {
                title: "Immediate Feedback",
                desc: "See the consequences of your choices instantly. Understand cause and effect.",
              },
              {
                title: "Guided by Law",
                desc: "Every scenario is grounded in real tenant rights. Learn what the law actually says.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                style={{
                  padding: "24px",
                  borderRadius: "8px",
                  border: "1px solid #27272a",
                  background: "rgba(24,24,27,0.3)",
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderBottom: "1px solid #111", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "32px" }}>
            Track Your Progress
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "24px" }}>
            {[
              { n: String(CHAPTER_COUNT), l: "Days" },
              { n: String(DISPLAY_SCENARIO_TOTAL), l: "Scenarios" },
            ].map(({ n, l }) => (
              <div key={l} style={{ padding: "24px", borderRadius: "8px", border: "1px solid #27272a", background: "rgba(24,24,27,0.2)" }}>
                <div style={{ fontSize: "24px", fontWeight: 600, marginBottom: "4px" }}>
                  {n}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>
                  {l}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.6 }}>
            Your progress is saved automatically. Resume from where you left off anytime.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 600, marginBottom: "16px" }}>
            Ready to start?
          </h2>
          <p style={{ fontSize: "15px", color: "#52525b", marginBottom: "32px", lineHeight: 1.6 }}>
            Begin your journey through the renting world. Learn by doing, not by reading.
          </p>
          <Link
            to={playHref}
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
            Start now
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      <section
        style={{
          borderTop: "1px solid #111",
          padding: "28px 24px 36px",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", color: "#71717a", textTransform: "uppercase" }}>
          Navigate
        </p>
        <GameNavActions />
      </section>

      {/* FOOTER */}
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
      </footer>
    </div>
  );
}