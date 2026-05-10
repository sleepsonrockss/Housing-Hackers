import { Link, useParams } from "react-router-dom";
import { loadPersistedRun } from "../game/playerSessionPersist";
import { CHAPTER_COUNT, GAME_CHAPTERS } from "../game/gameStructure";

function answersForChapter(answersByChapter, chapter) {
  const rows = answersByChapter?.[String(chapter)];
  return Array.isArray(rows) ? rows : [];
}

function AnswerList({ rows }) {
  if (!rows.length) {
    return null;
  }
  return (
    <ol style={{ margin: "0.5rem 0 0", paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {rows.map((row, idx) => (
        <li key={`${row.scenarioId}-${idx}`} style={{ fontSize: "0.875rem", lineHeight: 1.5, color: "#d4d4d8" }}>
          <div style={{ fontWeight: 600, color: "#e4e4e7", marginBottom: "0.2rem" }}>{row.scenarioTitle}</div>
          <div style={{ color: "#a1a1aa" }}>{row.choiceText}</div>
        </li>
      ))}
    </ol>
  );
}

export default function DayChapterReview() {
  const { day: dayParam } = useParams();
  const parsed = parseInt(String(dayParam ?? ""), 10);
  const day = Number.isFinite(parsed) ? Math.max(1, Math.min(CHAPTER_COUNT, parsed)) : 1;

  const snapshot = loadPersistedRun();
  const answersByChapter = snapshot?.answersByChapter ?? {};

  const meta = GAME_CHAPTERS[day - 1];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#090909",
        color: "#fafafa",
        padding: "clamp(1rem, 4vw, 2.5rem)",
        maxWidth: "46rem",
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: "1.5rem" }}>
        <p style={{ margin: "0 0 0.35rem", fontSize: "0.75rem", letterSpacing: "0.08em", color: "#71717a" }}>
          Day {day}
        </p>
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "1.35rem", fontWeight: 700 }}>{meta?.shortTitle ?? `Chapter ${day}`}</h1>
        <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.55, color: "#a1a1aa", maxWidth: "48ch" }}>
          Answers from your current saved run. Earlier chapters show everything logged so far; this day shows only the
          questions you have already answered here.
        </p>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
        <Link
          to={`/game?day=${day}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.5rem 0.9rem",
            borderRadius: "8px",
            border: "1px solid #3f3f46",
            background: "#141418",
            color: "#93c5fd",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Play / continue this chapter →
        </Link>
        <Link
          to="/game/run-log"
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#a1a1aa",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            alignSelf: "center",
          }}
        >
          Full run log
        </Link>
        <Link
          to="/chapters"
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#a1a1aa",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            alignSelf: "center",
          }}
        >
          ← Chapters
        </Link>
      </div>

      {!snapshot ? (
        <p style={{ color: "#a1a1aa", fontSize: "0.9375rem" }}>
          No saved run yet.{" "}
          <Link to="/game?day=1" style={{ color: "#93c5fd" }}>
            Start the game
          </Link>
          .
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {day > 1 ? (
            <section aria-labelledby="prior-chapters-heading">
              <h2
                id="prior-chapters-heading"
                style={{
                  margin: "0 0 0.75rem",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#fde68a",
                }}
              >
                Chapters you&apos;ve already started (days 1–{day - 1})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {GAME_CHAPTERS.filter((c) => c.chapter < day).map((c) => {
                  const rows = answersForChapter(answersByChapter, c.chapter);
                  return (
                    <div
                      key={c.chapter}
                      style={{
                        border: "1px solid #27272a",
                        borderRadius: "10px",
                        padding: "1rem 1rem 1.1rem",
                        background: "#0c0c0e",
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#fafafa" }}>
                        Day {c.chapter} — {c.shortTitle}
                      </h3>
                      {rows.length === 0 ? (
                        <p style={{ margin: "0.65rem 0 0", fontSize: "0.875rem", color: "#71717a" }}>
                          No answers recorded for this chapter in this run.
                        </p>
                      ) : (
                        <AnswerList rows={rows} />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section aria-labelledby="this-day-heading">
            <h2
              id="this-day-heading"
              style={{
                margin: "0 0 0.75rem",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#93c5fd",
              }}
            >
              This chapter (day {day})
            </h2>
            <div
              style={{
                border: "1px solid #3f3f46",
                borderRadius: "10px",
                padding: "1rem 1rem 1.1rem",
                background: "#0f0f12",
              }}
            >
              {answersForChapter(answersByChapter, day).length === 0 ? (
                <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.55, color: "#a1a1aa" }}>
                  No questions answered yet in this chapter. Play a beat in the game and come back — your choices will
                  show up here.
                </p>
              ) : (
                <AnswerList rows={answersForChapter(answersByChapter, day)} />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
