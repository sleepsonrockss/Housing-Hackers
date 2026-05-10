import { Link } from "react-router-dom";
import { GAME_CHAPTERS } from "../game/gameStructure";

function countChoices(answersByChapter) {
  if (!answersByChapter || typeof answersByChapter !== "object") return 0;
  return Object.values(answersByChapter).reduce(
    (n, arr) => n + (Array.isArray(arr) ? arr.length : 0),
    0
  );
}

/**
 * @param {{
 *   unlockedDay: number,
 *   currentChapter: number,
 *   runComplete: boolean,
 *   answersByChapter: Record<string, Array<{ scenarioId: string, scenarioTitle: string, choiceText: string }>>,
 *   navigationLocked?: boolean,
 * }} props
 */
export default function FiveDayProgress({
  unlockedDay,
  currentChapter,
  runComplete,
  answersByChapter,
  navigationLocked = false,
}) {
  const totalLogged = countChoices(answersByChapter);

  return (
    <section className="five-day-progress" aria-labelledby="five-day-progress-heading">
      <div className="five-day-progress-head">
        <div>
          <h2 id="five-day-progress-heading" className="five-day-progress-title">
            Your five days
          </h2>
          <p className="five-day-progress-lead">
            Open a day to see answers so far (this day and earlier chapters). Full log is a separate screen.
          </p>
        </div>
        <Link to="/game/run-log" className="five-day-progress-log-btn">
          {totalLogged > 0 ? `See all choices (${totalLogged})` : "See all choices"}
        </Link>
      </div>
      {navigationLocked ? (
        <p className="five-day-progress-locked-nav" role="status">
          This run has ended — day links are disabled until you start a new run.
        </p>
      ) : null}
      <div className="five-day-progress-row" role="list">
        {GAME_CHAPTERS.map((ch) => {
          const day = ch.chapter;
          const locked = day > unlockedDay;
          const isCurrent = day === currentChapter && !runComplete;
          const isDone = day < currentChapter || (runComplete && day === currentChapter);
          const nAnswers = (answersByChapter[String(day)] ?? []).length;

          const badge = locked ? (
            <span className="five-day-progress-badge five-day-progress-badge-locked">Locked</span>
          ) : isCurrent ? (
            <span className="five-day-progress-badge five-day-progress-badge-current">Now</span>
          ) : isDone ? (
            <span className="five-day-progress-badge five-day-progress-badge-done">Done</span>
          ) : (
            <span className="five-day-progress-badge five-day-progress-badge-open">Open</span>
          );

          const inner = (
            <>
              <div className="five-day-progress-chip-top">
                <span className="five-day-progress-day">Day {day}</span>
                {badge}
              </div>
              <span className="five-day-progress-chip-title">{ch.shortTitle}</span>
              {nAnswers > 0 ? (
                <span className="five-day-progress-chip-meta">{nAnswers} picked</span>
              ) : (
                <span className="five-day-progress-chip-meta muted">—</span>
              )}
            </>
          );

          return (
            <div key={day} className="five-day-progress-cell" role="listitem">
              {locked ? (
                <div className="five-day-progress-chip five-day-progress-chip-locked" aria-disabled="true">
                  {inner}
                </div>
              ) : navigationLocked ? (
                <div
                  className={`five-day-progress-chip five-day-progress-chip-static${day === currentChapter ? " is-current" : ""}`}
                >
                  {inner}
                </div>
              ) : (
                <Link
                  to={`/game/day/${day}`}
                  className={`five-day-progress-chip five-day-progress-chip-link${day === currentChapter ? " is-current" : ""}`}
                  aria-current={day === currentChapter ? "page" : undefined}
                >
                  {inner}
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        .five-day-progress {
          border-top: 1px solid #1a1a1c;
          background: #060607;
          padding: 1rem 1rem 1.25rem;
          flex-shrink: 0;
        }
        .five-day-progress-head {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem 1rem;
          margin-bottom: 0.75rem;
        }
        .five-day-progress-title {
          margin: 0 0 0.25rem;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fde68a;
        }
        .five-day-progress-lead {
          margin: 0;
          font-size: 0.8125rem;
          line-height: 1.45;
          color: #71717a;
          max-width: 42ch;
        }
        .five-day-progress-log-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          border: 1px solid #3f3f46;
          background: #141418;
          color: #e4e4e7;
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
        }
        .five-day-progress-log-btn:hover {
          border-color: #60a5fa;
          color: #93c5fd;
          background: #18181c;
        }
        .five-day-progress-log-btn:focus-visible {
          outline: 2px solid #93c5fd;
          outline-offset: 2px;
        }
        .five-day-progress-locked-nav {
          margin: 0 0 0.65rem;
          font-size: 0.75rem;
          line-height: 1.45;
          color: #fbbf24;
          max-width: 70ch;
        }
        .five-day-progress-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: stretch;
        }
        .five-day-progress-cell {
          flex: 1 1 5.5rem;
          min-width: 0;
          max-width: 10rem;
        }
        @media (min-width: 720px) {
          .five-day-progress-cell {
            flex: 1 1 0;
            max-width: none;
          }
        }
        .five-day-progress-chip {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding: 0.5rem 0.55rem;
          border-radius: 8px;
          border: 1px solid #2a2a2e;
          background: #0f0f12;
          min-height: 0;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }
        .five-day-progress-chip-link {
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .five-day-progress-chip-link:hover {
          border-color: #52525b;
          background: #141418;
        }
        .five-day-progress-chip-link:focus {
          outline: none;
        }
        .five-day-progress-chip-link:focus-visible {
          outline: 2px solid #93c5fd;
          outline-offset: 2px;
        }
        .five-day-progress-chip-link.is-current {
          border-color: #60a5fa;
          box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.2);
        }
        .five-day-progress-chip-static.is-current {
          border-color: #52525b;
        }
        .five-day-progress-chip-locked {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .five-day-progress-chip-static {
          cursor: default;
          opacity: 0.92;
        }
        .five-day-progress-chip-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.35rem;
        }
        .five-day-progress-day {
          font-size: 0.625rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #71717a;
        }
        .five-day-progress-badge {
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.12rem 0.35rem;
          border-radius: 4px;
        }
        .five-day-progress-badge-locked {
          background: #1c1c1f;
          color: #52525b;
        }
        .five-day-progress-badge-current {
          background: rgba(96, 165, 250, 0.2);
          color: #93c5fd;
        }
        .five-day-progress-badge-done {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
        }
        .five-day-progress-badge-open {
          background: #1c1c1f;
          color: #a1a1aa;
        }
        .five-day-progress-chip-title {
          font-size: 0.8125rem;
          font-weight: 600;
          line-height: 1.25;
          color: #fafafa;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .five-day-progress-chip-meta {
          font-size: 0.6875rem;
          color: #71717a;
        }
        .five-day-progress-chip-meta.muted {
          color: #3f3f46;
        }
      `}</style>
    </section>
  );
}
