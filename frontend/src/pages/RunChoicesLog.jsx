import { Link } from "react-router-dom";
import GameNavActions from "../components/GameNavActions";
import NavBackButton from "../components/NavBackButton";
import { getResumeGameHref, loadPersistedRun, RESTART_GAME_HREF } from "../game/playerSessionPersist";
import { GAME_CHAPTERS } from "../game/gameStructure";

function countChoices(answersByChapter) {
  if (!answersByChapter || typeof answersByChapter !== "object") return 0;
  return Object.values(answersByChapter).reduce(
    (n, arr) => n + (Array.isArray(arr) ? arr.length : 0),
    0
  );
}

export default function RunChoicesLog() {
  const resumeHref = getResumeGameHref();
  const snapshot = loadPersistedRun();

  const answersByChapter = snapshot?.answersByChapter ?? {};
  const total = countChoices(answersByChapter);
  const stats = snapshot?.stats;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#090909",
        color: "#fafafa",
        padding: "clamp(1rem, 4vw, 2.5rem)",
        maxWidth: "52rem",
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: "1.75rem" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <NavBackButton fallback={resumeHref} label="Back" />
        </div>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", letterSpacing: "0.08em", color: "#71717a" }}>
          Current saved run
        </p>
        <h1 style={{ margin: "0 0 0.75rem", fontSize: "1.5rem", fontWeight: 700 }}>Your choices</h1>
        <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.55, color: "#a1a1aa", maxWidth: "48ch" }}>
          Every response you picked in this browser session, grouped by day. Open the game in another tab to add more —
          refresh this page to update.
        </p>
        {stats ? (
          <p style={{ margin: "1rem 0 0", fontSize: "0.8125rem", color: "#52525b" }}>
            Last saved meters: <span style={{ color: "#e4e4e7" }}>${stats.money}</span>
            {" · "}
            <span style={{ color: "#e4e4e7" }}>{stats.stress}</span> / 100
          </p>
        ) : null}
      </header>

      <div style={{ marginBottom: "2rem" }}>
        <GameNavActions showBack backFallback={resumeHref} />
      </div>

      {!snapshot ? (
        <p style={{ color: "#a1a1aa", fontSize: "0.9375rem" }}>
          No saved run in this session yet.{" "}
          <Link to={RESTART_GAME_HREF} style={{ color: "#93c5fd" }}>
            Start a new run
          </Link>
          .
        </p>
      ) : total === 0 ? (
        <p style={{ color: "#a1a1aa", fontSize: "0.9375rem" }}>
          No choices logged yet. Play a beat and return here — or{" "}
          <Link to={RESTART_GAME_HREF} style={{ color: "#93c5fd" }}>
            Start a new run
          </Link>
          .
        </p>
      ) : (
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {GAME_CHAPTERS.map((ch) => {
            const rows = answersByChapter[String(ch.chapter)] ?? [];
            if (rows.length === 0) return null;
            return (
              <li key={ch.chapter}>
                <h2
                  style={{
                    margin: "0 0 0.75rem",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#fde68a",
                  }}
                >
                  Day {ch.chapter} — {ch.shortTitle}
                </h2>
                <ol style={{ margin: 0, paddingLeft: "1.15rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {rows.map((row, idx) => (
                    <li key={`${row.scenarioId}-${idx}`} style={{ fontSize: "0.875rem", lineHeight: 1.5, color: "#d4d4d8" }}>
                      <div style={{ fontWeight: 600, color: "#e4e4e7", marginBottom: "0.2rem" }}>{row.scenarioTitle}</div>
                      <div style={{ color: "#a1a1aa" }}>You chose: {row.choiceText}</div>
                    </li>
                  ))}
                </ol>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
