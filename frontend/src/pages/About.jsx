import { Link } from "react-router-dom";
import GameNavActions from "../components/GameNavActions";
import NavBackButton from "../components/NavBackButton";
import SiteAuthHeaderLinks from "../components/SiteAuthHeaderLinks";
import { getResumeGameHref } from "../game/playerSessionPersist";

export default function About() {
  const playHref = getResumeGameHref();
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
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0, gap: "12px" }}>
            <NavBackButton fallback="/" compact />
            <div style={{ display: "flex", alignItems: "center" }}>
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
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {[
              { label: "How it works", href: "/how-it-works" },
              { label: "Days", href: "/chapters" },
              { label: "About", href: "/about", active: true },
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

      {/* ── HERO ── */}
      <section style={{ borderBottom: "1px solid #111", padding: "96px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "24px",
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
              Our Mission
            </span>
            <span style={{ height: "1px", width: "32px", background: "#27272a" }}></span>
          </div>
          <h1
            style={{
              fontSize: "clamp(36px,5vw,54px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              marginBottom: "24px",
            }}
          >
            Empower renters with knowledge.
          </h1>
          <p style={{ fontSize: "16px", color: "#52525b", lineHeight: 1.6 }}>
            Too many tenants make decisions in ignorance of their rights. TenantTales exists to
            change that through immersive, interactive learning.
          </p>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section style={{ borderBottom: "1px solid #111", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "24px" }}>
                The Problem We Solve
              </h2>
              <p style={{ fontSize: "15px", color: "#52525b", lineHeight: 1.6, marginBottom: "16px" }}>
                Tenant rights are complex, vary by region, and are poorly understood. Most renters
                learn too late—after signing a bad lease, paying illegal fees, or facing unlawful
                eviction.
              </p>
              <p style={{ fontSize: "15px", color: "#52525b", lineHeight: 1.6 }}>
                Traditional resources are dry, inaccessible, and don't stick. People learn best by
                doing, not reading. That's where TenantTales comes in.
              </p>
            </div>

            <div
              style={{
                padding: "32px",
                borderRadius: "8px",
                border: "1px solid #27272a",
                background: "rgba(24,24,27,0.2)",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "24px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
                  1 in 4
                </div>
                <p style={{ fontSize: "12px", color: "#52525b" }}>
                  Tenants are unaware of basic rights
                </p>
              </div>

              <div style={{ borderTop: "1px solid #27272a", paddingTop: "16px", marginBottom: "16px" }}>
                <div style={{ fontSize: "24px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
                  $500M+
                </div>
                <p style={{ fontSize: "12px", color: "#52525b" }}>
                  In illegal landlord fees paid annually
                </p>
              </div>

              <div style={{ borderTop: "1px solid #27272a", paddingTop: "16px" }}>
                <div style={{ fontSize: "24px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
                  40%
                </div>
                <p style={{ fontSize: "12px", color: "#52525b" }}>
                  Of evictions lack proper legal notice
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR APPROACH ── */}
      <section style={{ borderBottom: "1px solid #111", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "48px" }}>
            Our Approach
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
            {[
              {
                title: "Scenario-Based",
                desc: "Learn through real situations, not lectures. Every scenario is grounded in actual tenant law.",
              },
              {
                title: "Interactive",
                desc: "Make decisions, see consequences. Learning sticks when you choose and experience outcomes.",
              },
              {
                title: "Accessible",
                desc: "Clear, jargon-free language. Designed for anyone, regardless of background or experience.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "24px",
                  borderRadius: "8px",
                  border: "1px solid #27272a",
                  background: "rgba(24,24,27,0.15)",
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ borderBottom: "1px solid #111", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "48px" }}>
            Our Values
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {[
              {
                title: "Accuracy",
                desc: "Every scenario and legal detail is fact-checked against current tenant law. We take responsibility for accuracy seriously.",
              },
              {
                title: "Neutrality",
                desc: "We present the law as it stands, not advocacy. Players see both tenant protections and landlord perspectives.",
              },
              {
                title: "Accessibility",
                desc: "Tenant rights education should be free and available to everyone, regardless of income or privilege.",
              },
              {
                title: "Empowerment",
                desc: "Knowledge is power. We equip renters to negotiate, advocate, and protect themselves.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ borderBottom: "1px solid #111", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "48px" }}>
            The Team
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "32px",
            }}
          >
            {[
              "Kaila Commet",
              "Animesh Tirkey",
              "Estella Li",
              "Ucchena Ibeziako",
              "Rafiul Alam Khan",
            ].map((name) => (
              <div
                key={name}
                style={{
                  padding: "24px",
                  borderRadius: "8px",
                  border: "1px solid #27272a",
                  background: "rgba(24,24,27,0.15)",
                  minHeight: "100px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#fff", margin: 0 }}>
                  {name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "16px" }}>
            Join the Movement
          </h2>
          <p style={{ fontSize: "15px", color: "#52525b", marginBottom: "32px", lineHeight: 1.6 }}>
            Help us empower the next generation of informed, confident renters.
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
            Play now
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
        <GameNavActions showBack backFallback="/" />
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
      </footer>
    </div>
  );
}