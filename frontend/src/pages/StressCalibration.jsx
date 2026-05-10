import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GameNavActions from "../components/GameNavActions";
import NavBackButton from "../components/NavBackButton";
import SiteAuthHeaderLinks from "../components/SiteAuthHeaderLinks";
import { setPendingInitialStress } from "../game/playerSessionPersist";

const CALIBRATION_SECONDS = 10;

/** In dev, use same-origin `/api` so Vite can proxy; in prod, use configured API origin. */
function getCalibrateUrl() {
  if (import.meta.env.DEV) return "/api/eeg/calibrate";
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "");
  return `${base}/api/eeg/calibrate`;
}

export default function StressCalibration() {
  const navigate = useNavigate();
  const [displaySec, setDisplaySec] = useState(CALIBRATION_SECONDS);
  const [countdownDone, setCountdownDone] = useState(false);
  const [stress, setStress] = useState(null);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(true);
  const abortRef = useRef(null);

  useEffect(() => {
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;
    setFetching(true);
    setError(null);
    fetch(getCalibrateUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      signal,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const detail = [data.message, data.hint].filter(Boolean).join(" — ");
          throw new Error(detail || `Calibration failed (${res.status})`);
        }
        const s = typeof data.stress === "number" && Number.isFinite(data.stress) ? data.stress : null;
        if (s == null) throw new Error("Invalid stress from server");
        setStress(Math.min(100, Math.max(0, Math.round(s))));
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(e.message || "Could not reach calibration service.");
      })
      .finally(() => setFetching(false));

    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    let n = CALIBRATION_SECONDS;
    setDisplaySec(n);
    const id = window.setInterval(() => {
      n -= 1;
      if (n <= 0) {
        window.clearInterval(id);
        setDisplaySec(0);
        setCountdownDone(true);
        return;
      }
      setDisplaySec(n);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const canContinue = countdownDone && stress != null && !error;
  const stillWaiting = countdownDone && stress == null && !error && fetching;

  const handleContinue = () => {
    if (stress == null) return;
    setPendingInitialStress(stress);
    // `state` survives React Strict Mode double-mount; sessionStorage alone is consumed on first effect pass.
    navigate("/game?day=1&reset=1", { state: { initialStress: stress } });
  };

  return (
    <div style={{ background: "#090909", color: "#fff", minHeight: "100vh" }}>
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
                <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.02em" }}>TenantTales</span>
              </Link>
              <SiteAuthHeaderLinks />
            </div>
          </div>
          <Link to="/" style={{ fontSize: "13px", color: "#71717a", textDecoration: "none" }}>
            Home
          </Link>
        </div>
      </header>

      <main
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: "48px 24px 80px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 12px", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b" }}>
          Muse S · customized play
        </p>
        <h1 style={{ margin: "0 0 16px", fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
          Calculating your stress level
        </h1>
        <p style={{ margin: "0 0 32px", fontSize: "14px", color: "#a1a1aa", lineHeight: 1.6 }}>
          Wear your Muse and stay still for the full window. The app measures about {CALIBRATION_SECONDS} seconds of EEG
          (via the calibration service) to set your <strong style={{ color: "#e4e4e7" }}>starting stress</strong> instead
          of the default 50. In-game stress still rises and falls with your choices the same way as regular play.
        </p>

        <div
          style={{
            borderRadius: "12px",
            border: "1px solid #27272a",
            background: "rgba(24,24,27,0.35)",
            padding: "36px 24px",
            marginBottom: "28px",
          }}
        >
          {!countdownDone ? (
            <>
              <div style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#fafafa" }}>
                {displaySec}
              </div>
              <p style={{ margin: "16px 0 0", fontSize: "13px", color: "#71717a" }}>Seconds remaining</p>
            </>
          ) : error ? (
            <>
              <p style={{ margin: 0, fontSize: "14px", color: "#f87171" }}>{error}</p>
              <p style={{ margin: "16px 0 0", fontSize: "13px", color: "#71717a" }}>
                In dev, run the backend on the same port as <code style={{ color: "#a1a1aa" }}>VITE_API_URL</code> (see{" "}
                <code style={{ color: "#a1a1aa" }}>vite.config.js</code> proxy) or use{" "}
                <Link to="/" style={{ color: "#93c5fd" }}>
                  Play (regular)
                </Link>
                .
              </p>
            </>
          ) : stillWaiting ? (
            <>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid #1c1c1f",
                  borderTopColor: "#60a5fa",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <p style={{ margin: 0, fontSize: "13px", color: "#a1a1aa" }}>Finishing measurement…</p>
            </>
          ) : (
            <>
              <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Starting stress
              </p>
              <div style={{ fontSize: "48px", fontWeight: 700, color: "#93c5fd" }}>{stress}</div>
              <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#52525b" }}>out of 100</p>
            </>
          )}
        </div>

        {canContinue ? (
          <button
            type="button"
            onClick={handleContinue}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#fff",
              color: "#09090b",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            Continue to game
          </button>
        ) : null}

        <div style={{ marginTop: "36px" }}>
          <GameNavActions compact showBack backFallback="/" />
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
