import { useEffect, useState } from "react";
import FiveDayProgress from "./FiveDayProgress";
import { GAME_CHAPTERS } from "../game/gameStructure";

const HINT_KEY = "housing-hackers-run-dock-hint-v1";

function scrollToId(id) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Fixed bottom control so chapter map / choice log stay discoverable without moving
 * the video or scenario text. Opens a sheet with the same FiveDayProgress + shortcuts.
 */
export default function GameRunDock({
  unlockedDay,
  currentChapter,
  runComplete,
  answersByChapter,
  navigationLocked,
  choicesAvailable,
}) {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(HINT_KEY)) {
        setShowHint(true);
        const t = window.setTimeout(() => {
          setShowHint(false);
          sessionStorage.setItem(HINT_KEY, "1");
        }, 7000);
        return () => window.clearTimeout(t);
      }
    } catch {
      setShowHint(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const goChoices = () => {
    scrollToId("game-choice-anchor");
    close();
  };

  return (
    <>
      {showHint ? (
        <div className="game-run-dock-hint" role="status">
          Tip: your five-day map and full choice log are in <strong>Run &amp; answers</strong> — tap the bar
          anytime.
        </div>
      ) : null}

      <div className={`game-run-dock-root${open ? " is-open" : ""}`}>
        {open ? (
          <button
            type="button"
            className="game-run-dock-backdrop"
            aria-label="Close run map"
            onClick={close}
          />
        ) : null}

        <div className={`game-run-dock-panel${open ? " is-open" : ""}`}>
          {open ? (
            <div className="game-run-dock-panel-inner" id="game-run-dock-panel-content" role="dialog" aria-modal="true" aria-label="Run progress and chapters">
              <div className="game-run-dock-panel-head">
                <h2 className="game-run-dock-panel-title">Your run</h2>
                <button type="button" className="game-run-dock-close" onClick={close}>
                  Close
                </button>
              </div>
              <p className="game-run-dock-lead">
                Jump back to the scenario choices in the panel above, or use the day links below.
              </p>
              <div className="game-run-dock-actions">
                {choicesAvailable ? (
                  <button type="button" className="game-run-dock-action" onClick={goChoices}>
                    Scroll to choices
                  </button>
                ) : null}
              </div>
              <FiveDayProgress
                unlockedDay={unlockedDay}
                currentChapter={currentChapter}
                runComplete={runComplete}
                answersByChapter={answersByChapter}
                navigationLocked={navigationLocked}
                instanceId="sheet"
              />
            </div>
          ) : null}

          <button
            type="button"
            className="game-run-dock-trigger"
            title="Open your five-day map, day reviews, and shortcuts to choices"
            aria-expanded={open}
            aria-controls={open ? "game-run-dock-panel-content" : undefined}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="game-run-dock-dots" aria-hidden="true">
              {GAME_CHAPTERS.map((ch) => {
                const day = ch.chapter;
                const locked = day > unlockedDay;
                const isCurrent = day === currentChapter && !runComplete;
                const done = day < currentChapter || (runComplete && day === currentChapter);
                let cls = "game-run-dock-dot";
                if (locked) cls += " game-run-dock-dot-locked";
                else if (isCurrent) cls += " game-run-dock-dot-current";
                else if (done) cls += " game-run-dock-dot-done";
                else cls += " game-run-dock-dot-open";
                return <span key={day} className={cls} title={`Day ${day}`} />;
              })}
            </span>
            <span className="game-run-dock-trigger-label">
              <span className="game-run-dock-trigger-kicker">Day {currentChapter} of 5</span>
              <span className="game-run-dock-trigger-main">Run &amp; answers</span>
            </span>
            <span className={`game-run-dock-chevron${open ? " is-open" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <style>{`
        .game-run-dock-hint {
          position: fixed;
          left: 50%;
          bottom: calc(58px + env(safe-area-inset-bottom, 0px));
          transform: translateX(-50%);
          z-index: 56;
          max-width: min(360px, calc(100vw - 32px));
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #3f3f46;
          background: rgba(15, 15, 18, 0.96);
          color: #e4e4e7;
          font-size: 12px;
          line-height: 1.45;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);
          pointer-events: none;
          animation: gameRunDockHintIn 0.35s ease-out;
        }
        @keyframes gameRunDockHintIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .game-run-dock-root {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 55;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          pointer-events: none;
        }
        .game-run-dock-root > * {
          pointer-events: auto;
        }
        .game-run-dock-backdrop {
          position: fixed;
          inset: 0;
          z-index: 53;
          border: none;
          margin: 0;
          padding: 0;
          background: rgba(0, 0, 0, 0.5);
          cursor: pointer;
          pointer-events: auto;
        }
        .game-run-dock-panel {
          position: relative;
          z-index: 54;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 720px;
          width: 100%;
          margin: 0 auto;
        }
        .game-run-dock-panel.is-open {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;
          max-height: min(78vh, 620px);
          background: #070708;
          border-top: 1px solid #3f3f46;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -16px 48px rgba(0, 0, 0, 0.65);
          overflow: hidden;
          pointer-events: auto;
        }
        .game-run-dock-panel-inner {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          padding: 14px 16px 10px;
          width: 100%;
          box-sizing: border-box;
        }
        .game-run-dock-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }
        .game-run-dock-panel-title {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fde68a;
        }
        .game-run-dock-close {
          flex-shrink: 0;
          font-size: 12px;
          font-weight: 600;
          color: #93c5fd;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 6px;
        }
        .game-run-dock-close:hover {
          background: rgba(96, 165, 250, 0.12);
        }
        .game-run-dock-close:focus-visible {
          outline: 2px solid #93c5fd;
          outline-offset: 2px;
        }
        .game-run-dock-lead {
          margin: 0 0 12px;
          font-size: 12px;
          line-height: 1.45;
          color: #71717a;
          max-width: 52ch;
        }
        .game-run-dock-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }
        .game-run-dock-action {
          font-size: 12px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #60a5fa;
          background: rgba(96, 165, 250, 0.12);
          color: #bfdbfe;
          cursor: pointer;
        }
        .game-run-dock-action:hover {
          background: rgba(96, 165, 250, 0.2);
        }
        .game-run-dock-action-secondary {
          border-color: #52525b;
          background: #141418;
          color: #e4e4e7;
        }
        .game-run-dock-action-secondary:hover {
          border-color: #71717a;
        }
        .game-run-dock-trigger {
          pointer-events: auto;
          width: 100%;
          max-width: min(520px, calc(100vw - 20px));
          margin: 0 auto max(10px, env(safe-area-inset-bottom, 0px));
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px 12px 0 0;
          border: 1px solid #3f3f46;
          border-bottom: none;
          background: rgba(12, 12, 14, 0.94);
          backdrop-filter: blur(12px);
          color: #fafafa;
          cursor: pointer;
          text-align: left;
          box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.35);
        }
        .game-run-dock-panel.is-open .game-run-dock-trigger {
          flex-shrink: 0;
          border-radius: 0;
          border: none;
          border-top: 1px solid #27272a;
          margin-bottom: 0;
          max-width: none;
          box-shadow: none;
        }
        .game-run-dock-trigger:hover {
          border-color: #52525b;
          background: rgba(18, 18, 22, 0.96);
        }
        .game-run-dock-trigger:focus-visible {
          outline: 2px solid #93c5fd;
          outline-offset: 2px;
        }
        .game-run-dock-dots {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
        }
        .game-run-dock-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #27272a;
        }
        .game-run-dock-dot-current {
          background: #60a5fa;
          box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.35);
        }
        .game-run-dock-dot-done {
          background: #22c55e;
        }
        .game-run-dock-dot-open {
          background: #52525b;
        }
        .game-run-dock-dot-locked {
          background: #1c1c1f;
          opacity: 0.55;
        }
        .game-run-dock-trigger-label {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .game-run-dock-trigger-kicker {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #71717a;
        }
        .game-run-dock-trigger-main {
          font-size: 13px;
          font-weight: 600;
          color: #fafafa;
        }
        .game-run-dock-chevron {
          display: block;
          flex-shrink: 0;
          width: 10px;
          height: 10px;
          border-right: 2px solid #a1a1aa;
          border-bottom: 2px solid #a1a1aa;
          transform: rotate(45deg);
          margin-top: -4px;
          transition: transform 0.2s ease;
        }
        .game-run-dock-chevron.is-open {
          transform: rotate(-135deg);
          margin-top: 4px;
        }
      `}</style>
    </>
  );
}
