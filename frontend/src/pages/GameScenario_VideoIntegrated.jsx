import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVeoVideo } from "../hooks/useVeoVideo";
import { interpolateScenarioText } from "../game/interpolate";
import { applyChoiceDeltas, INITIAL_PLAYER_STATS, mergeFlags } from "../game/playerModel";
import { clearPersistedRun, loadPersistedRun, savePersistedRun } from "../game/playerSessionPersist";
import { getScenario, getStartScenarioId } from "../game/staticScenarios/index";
import { CHAPTER_COUNT } from "../game/gameStructure";
import { HOUSING_GLOSSARY } from "../game/housingGlossary";
import { GlossaryRichText } from "../components/GlossaryRichText";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/** If true and no `videoSrc`, fall back to Veo-style generation (dev only). */
const USE_VEO_WHEN_NO_FILE =
  import.meta.env.VITE_USE_VEO_VIDEO_FALLBACK === "true";

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Wait after choice before loading next beat (ms). */
const ADVANCE_NO_SPEND_MS = 320;
const ADVANCE_AFTER_SPEND_MS = 1850;
const ADVANCE_REDUCED_MOTION_CAP_MS = 480;

export default function GameScenario() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dayParam = searchParams.get("day") || "1";

  const [stats, setStats] = useState(() => {
    const saved = loadPersistedRun();
    return saved?.stats ? { ...INITIAL_PLAYER_STATS, ...saved.stats } : { ...INITIAL_PLAYER_STATS };
  });
  const [flags, setFlags] = useState(() => {
    const saved = loadPersistedRun();
    return saved?.flags ? { ...saved.flags } : {};
  });
  const [scenarioId, setScenarioId] = useState(() => getStartScenarioId(dayParam));
  const [beatIndex, setBeatIndex] = useState(1);
  /** While set, choice UI is locked and we auto-advance after a short delay (or money float). */
  const [pendingAdvance, setPendingAdvance] = useState(null);
  const [runComplete, setRunComplete] = useState(false);
  const [spendAnimKey, setSpendAnimKey] = useState(0);
  const [videoBroken, setVideoBroken] = useState(false);
  const [glossaryKey, setGlossaryKey] = useState(null);
  const glossaryDialogRef = useRef(null);

  const scenario = getScenario(scenarioId);

  /** Optional `?reset=1` — new run: clear meters, flags, and saved session. */
  useEffect(() => {
    if (searchParams.get("reset") !== "1") return;
    clearPersistedRun();
    setStats({ ...INITIAL_PLAYER_STATS });
    setFlags({});
    const next = new URLSearchParams(searchParams);
    next.delete("reset");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  /** Jumping chapter from the list only moves the starting beat; money, stress, battery, and flags carry on. */
  useEffect(() => {
    setScenarioId(getStartScenarioId(dayParam));
    setBeatIndex(1);
    setPendingAdvance(null);
    setRunComplete(false);
    setVideoBroken(false);
  }, [dayParam]);

  useEffect(() => {
    savePersistedRun(stats, flags);
  }, [stats, flags]);

  useEffect(() => {
    setVideoBroken(false);
  }, [scenarioId]);

  useEffect(() => {
    if (!pendingAdvance) return;
    const { nextId, spendAmount } = pendingAdvance;
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const baseMs = spendAmount != null ? ADVANCE_AFTER_SPEND_MS : ADVANCE_NO_SPEND_MS;
    const ms = reduced ? Math.min(baseMs, ADVANCE_REDUCED_MOTION_CAP_MS) : baseMs;
    const id = window.setTimeout(() => {
      setPendingAdvance(null);
      if (nextId && getScenario(nextId)) {
        setRunComplete(false);
        setScenarioId(nextId);
        setBeatIndex((n) => n + 1);
        setVideoBroken(false);
      } else {
        setRunComplete(true);
      }
    }, ms);
    return () => window.clearTimeout(id);
  }, [pendingAdvance]);

  useEffect(() => {
    const d = glossaryDialogRef.current;
    if (!d) return;
    if (glossaryKey && HOUSING_GLOSSARY[glossaryKey]) {
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [glossaryKey]);

  const situationDisplay = useMemo(
    () => (scenario ? interpolateScenarioText(scenario.situation, stats) : ""),
    [scenario, stats]
  );

  const veo = useVeoVideo();

  const activeFileVideo = useMemo(() => {
    if (!scenario) return null;
    if (scenario.videoSrc) return scenario.videoSrc;
    return null;
  }, [scenario]);

  useEffect(() => {
    if (activeFileVideo || !scenario || !USE_VEO_WHEN_NO_FILE) {
      veo.reset();
      return;
    }
    let cancelled = false;
    (async () => {
      veo.reset();
      const prompt = await buildPromptRemote(scenario, null);
      if (!cancelled) veo.startGenerationFromPrompt(prompt);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id, activeFileVideo]);

  const handleChoiceSelect = (choiceId) => {
    if (!scenario || pendingAdvance) return;
    const chosen = scenario.choices.find((ch) => String(ch.id) === String(choiceId));
    if (!chosen) return;
    setStats((prev) => applyChoiceDeltas(prev, chosen));
    setFlags((prev) => mergeFlags(prev, chosen));
    const spendAmount =
      typeof chosen.moneyDelta === "number" && chosen.moneyDelta < 0 ? -chosen.moneyDelta : null;
    if (spendAmount != null) setSpendAnimKey((k) => k + 1);
    setPendingAdvance({ nextId: chosen.nextId ?? null, spendAmount });
  };

  if (!scenario) {
    return (
      <div style={{ background: "#090909", color: "#fff", minHeight: "100vh", padding: 48 }}>
        <p>Unknown scenario.</p>
        <Link to="/chapters" style={{ color: "#93c5fd" }}>
          ← Chapters
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#090909", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: "1px solid #111",
          background: "rgba(9,9,9,0.95)",
          backdropFilter: "blur(12px)",
          padding: "0 24px",
          minHeight: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Beat {beatIndex} · Chapter {scenario.chapter} of {CHAPTER_COUNT}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600 }}>{scenario.title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#a1a1aa" }}>
            <span>
              Money <strong style={{ color: "#fafafa" }}>${stats.money}</strong>
            </span>
            <span>
              Battery <strong style={{ color: "#fafafa" }}>{stats.mentalBattery}</strong>
            </span>
            <span>
              Stress <strong style={{ color: "#fafafa" }}>{stats.stress}</strong>
            </span>
          </div>
          <Link
            to="/chapters"
            style={{ fontSize: "12px", color: "#e4e4e7", textDecoration: "underline", textUnderlineOffset: "3px" }}
            aria-label="Back to chapter list"
          >
            ← Chapters
          </Link>
        </div>
      </header>

      <main className="game-scenario-main">
        <div className="game-scenario-media-col">
          <div
            className="game-scenario-video-wrap"
            style={{
              position: "relative",
              background: "#000",
              width: "100%",
              flex: "1 1 42%",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {activeFileVideo && !videoBroken ? (
              <>
                <video
                  key={activeFileVideo}
                  autoPlay
                  loop
                  controls
                  playsInline
                  title={`Scene: ${scenario.title}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={activeFileVideo}
                  onError={() => setVideoBroken(true)}
                />
                <div className="game-video-badge" aria-hidden="true">
                  <span className="game-video-badge-dot" />
                  Scene clip
                </div>
              </>
            ) : activeFileVideo && videoBroken ? (
              <div style={{ textAlign: "center", padding: "24px", maxWidth: "360px" }}>
                <div style={{ fontSize: "13px", color: "#fbbf24", marginBottom: "8px" }}>Video missing or blocked</div>
                <div style={{ fontSize: "12px", color: "#71717a" }}>
                  Place file at <code style={{ color: "#e4e4e7" }}>{activeFileVideo}</code> (under <code>public/</code>) or
                  update paths in <code>src/game/staticScenarios/chapter1.js</code>.
                </div>
              </div>
            ) : veo.status === "done" && veo.videoUrl ? (
              <video
                key={veo.videoUrl}
                autoPlay
                loop
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={veo.videoUrl}
              />
            ) : veo.status === "error" ? (
              <div style={{ textAlign: "center", padding: "24px" }}>
                <div style={{ fontSize: "12px", color: "#f87171", maxWidth: "320px" }}>{veo.error}</div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    border: "2px solid #1c1c1f",
                    borderTopColor: "#60a5fa",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 16px",
                  }}
                />
                <div style={{ fontSize: "13px", color: "#e4e4e7", fontWeight: 500, marginBottom: "6px" }}>
                  {veo.retryIn
                    ? `Rate limited — retrying in ${veo.retryIn}s…`
                    : veo.status === "generating"
                      ? "Generating video…"
                      : "Starting generation…"}
                </div>
                <div style={{ fontSize: "12px", color: "#52525b" }}>{formatTime(veo.elapsedSeconds)} elapsed</div>
              </div>
            )}
          </div>
        </div>

        <div
          className="game-scenario-decision-col"
          aria-busy={pendingAdvance ? "true" : "false"}
          style={pendingAdvance ? { opacity: 0.55, pointerEvents: "none" } : undefined}
        >
          {runComplete ? (
            <section className="game-scenario-question-block" aria-labelledby="chapter-end-heading">
              <h2 id="chapter-end-heading" className="game-scenario-title">
                {scenario.chapter >= CHAPTER_COUNT
                  ? "You finished all chapters"
                  : `Chapter ${scenario.chapter} complete`}
              </h2>
              <p className="game-scenario-situation" style={{ marginBottom: "1.25rem" }}>
                {scenario.chapter >= CHAPTER_COUNT
                  ? "That is the end of the five-chapter run in this build. Use the chapter list to replay from any chapter."
                  : "This chapter has no further beats in the current story file. Open the next chapter to keep going, or return to the list."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                {scenario.chapter < CHAPTER_COUNT ? (
                  <Link
                    to={`/game?day=${scenario.chapter + 1}`}
                    className="game-chapters-link"
                    style={{
                      fontSize: "15px",
                      color: "#93c5fd",
                      textUnderlineOffset: "4px",
                      fontWeight: 600,
                    }}
                    aria-label={`Start chapter ${scenario.chapter + 1}`}
                  >
                    Continue to chapter {scenario.chapter + 1} →
                  </Link>
                ) : null}
                <Link
                  to="/chapters"
                  className="game-chapters-link"
                  style={{
                    fontSize: "15px",
                    color: "#a1a1aa",
                    textUnderlineOffset: "4px",
                    fontWeight: 600,
                  }}
                  aria-label="Return to full chapter list"
                >
                  All chapters
                </Link>
              </div>
            </section>
          ) : (
            <>
              <section
                key={scenarioId}
                className="game-scenario-question-block"
                aria-labelledby="scenario-heading"
                aria-live="polite"
                aria-atomic="true"
              >
                <h2 id="scenario-heading" className="game-scenario-title">
                  {scenario.title}
                </h2>
                <p id="scenario-situation-live" className="game-scenario-situation">
                  <GlossaryRichText text={situationDisplay} onOpenTerm={setGlossaryKey} />
                </p>
              </section>

              <fieldset className="game-choice-fieldset" disabled={!!pendingAdvance}>
                <legend className="game-choice-legend">Choose a response</legend>
                <div className="game-choice-list" role="presentation">
                  {scenario.choices.map((ch, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const labelText = interpolateScenarioText(ch.text, stats);
                    return (
                      <div
                        key={ch.id}
                        role="button"
                        tabIndex={pendingAdvance ? -1 : 0}
                        className="game-choice-btn"
                        onClick={() => handleChoiceSelect(ch.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleChoiceSelect(ch.id);
                          }
                        }}
                        aria-disabled={pendingAdvance ? "true" : undefined}
                        aria-label={`Option ${letter}: ${labelText}`}
                      >
                        <span className="game-choice-key" aria-hidden="true">
                          {letter}
                        </span>
                        <span className="game-choice-text">
                          <GlossaryRichText
                            text={labelText}
                            onOpenTerm={setGlossaryKey}
                            stopPropagation
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </>
          )}
        </div>
      </main>

      {pendingAdvance?.spendAmount != null ? (
        <div className="money-spend-overlay" aria-hidden="true">
          <span className="money-spend-amount" key={spendAnimKey}>
            -${pendingAdvance.spendAmount}
          </span>
        </div>
      ) : null}
      {pendingAdvance?.spendAmount != null ? (
        <span className="visually-hidden" aria-live="polite">
          {`Spent ${pendingAdvance.spendAmount} dollars. Balance updated.`}
        </span>
      ) : null}

      <dialog
        ref={glossaryDialogRef}
        className="housing-glossary-dialog"
        aria-labelledby="glossary-dialog-title"
        onClose={() => setGlossaryKey(null)}
      >
        {glossaryKey && HOUSING_GLOSSARY[glossaryKey] ? (
          <div className="housing-glossary-dialog-inner">
            <div className="housing-glossary-dialog-toolbar">
              <h2 id="glossary-dialog-title" className="housing-glossary-dialog-title">
                {HOUSING_GLOSSARY[glossaryKey].expandedName}
              </h2>
              <form method="dialog">
                <button type="submit" className="housing-glossary-dialog-close">
                  Close
                </button>
              </form>
            </div>
            <p className="housing-glossary-dialog-acronym">
              <span className="housing-glossary-dialog-acronym-label">Term</span>{" "}
              <strong>{HOUSING_GLOSSARY[glossaryKey].title}</strong>
            </p>
            <section className="housing-glossary-dialog-section" aria-labelledby="glossary-what-is">
              <h3 id="glossary-what-is" className="housing-glossary-dialog-h3">
                What it is
              </h3>
              <p className="housing-glossary-dialog-p">{HOUSING_GLOSSARY[glossaryKey].whatItIs}</p>
            </section>
            <section className="housing-glossary-dialog-section" aria-labelledby="glossary-does">
              <h3 id="glossary-does" className="housing-glossary-dialog-h3">
                What it does
              </h3>
              <p className="housing-glossary-dialog-p">{HOUSING_GLOSSARY[glossaryKey].whatItDoes}</p>
            </section>
            <section className="housing-glossary-dialog-section" aria-labelledby="glossary-why">
              <h3 id="glossary-why" className="housing-glossary-dialog-h3">
                Why it matters here
              </h3>
              <p className="housing-glossary-dialog-p">{HOUSING_GLOSSARY[glossaryKey].whyRelevant}</p>
            </section>
          </div>
        ) : null}
      </dialog>

      <style>{`
        .game-scenario-main {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 46%);
          overflow: hidden;
          min-height: 0;
        }
        @media (max-width: 960px) {
          .game-scenario-main {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            overflow-y: auto;
          }
          .game-scenario-media-col {
            max-height: 48vh;
          }
        }
        .game-scenario-media-col {
          border-right: 1px solid #111;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 56px);
          min-height: 0;
          overflow: hidden;
        }
        .game-scenario-decision-col {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 56px);
          min-height: 0;
          overflow-y: auto;
          padding: 1.25rem 1.5rem 1.75rem;
          gap: 1.25rem;
          background: #050506;
        }
        .game-video-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.82);
          border: 1px solid #3f3f46;
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 12px;
          color: #e4e4e7;
          pointer-events: none;
        }
        .game-video-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f87171;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .game-video-badge-dot {
            animation: none;
          }
        }
        .game-scenario-question-block {
          flex-shrink: 0;
          padding: 1.25rem 1.35rem;
          border-radius: 12px;
          border: 2px solid #3f3f46;
          background: #0f0f12;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
        }
        .game-scenario-title {
          margin: 0 0 0.75rem;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fde68a;
          line-height: 1.35;
        }
        .game-scenario-situation {
          margin: 0;
          font-size: clamp(1.0625rem, 2.15vw, 1.35rem);
          font-weight: 500;
          line-height: 1.65;
          color: #fafafa;
          letter-spacing: 0.01em;
          max-width: 52ch;
        }
        .game-choice-fieldset {
          margin: 0;
          padding: 0;
          border: none;
          min-width: 0;
        }
        .game-choice-legend {
          float: left;
          width: 100%;
          padding: 0;
          margin: 0 0 0.65rem;
          font-size: 0.9375rem;
          font-weight: 700;
          color: #fafafa;
          letter-spacing: 0.02em;
        }
        .game-choice-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          clear: both;
        }
        .game-choice-btn {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          width: 100%;
          min-height: 52px;
          padding: 1rem 1rem 1rem 1rem;
          border-radius: 10px;
          border: 2px solid #52525b;
          background: #18181b;
          color: #fafafa;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.55;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
        }
        .game-choice-btn:hover {
          border-color: #93c5fd;
          background: #1f1f23;
        }
        .game-choice-btn:focus {
          outline: none;
        }
        .game-choice-btn:focus-visible {
          outline: 3px solid #93c5fd;
          outline-offset: 3px;
          border-color: #bfdbfe;
          box-shadow: 0 0 0 1px rgba(147, 197, 253, 0.35);
        }
        .game-choice-fieldset:disabled .game-choice-btn {
          cursor: not-allowed;
          opacity: 0.72;
        }
        .money-spend-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .money-spend-amount {
          font-size: clamp(2.25rem, 9vw, 4.25rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f87171;
          text-shadow: 0 6px 40px rgba(0, 0, 0, 0.9), 0 0 1px rgba(0, 0, 0, 1);
          animation: moneySpendFloat 1.55s ease-out forwards;
        }
        @keyframes moneySpendFloat {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.88);
          }
          12% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          55% {
            opacity: 1;
            transform: translateY(-6px) scale(1.02);
          }
          100% {
            opacity: 0;
            transform: translateY(-36px) scale(1.06);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .money-spend-amount {
            animation-name: moneySpendFloatReduced;
            animation-duration: 0.38s;
          }
        }
        @keyframes moneySpendFloatReduced {
          0% {
            opacity: 0;
          }
          35% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .game-choice-key {
          flex-shrink: 0;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 10px;
          border: 2px solid #71717a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 800;
          color: #e4e4e7;
          margin-top: 2px;
        }
        .game-choice-text {
          flex: 1;
          min-width: 0;
        }
        .glossary-term-btn {
          display: inline;
          margin: 0 0.1em;
          padding: 0 0.15em;
          border: none;
          border-bottom: 2px dotted #93c5fd;
          background: rgba(147, 197, 253, 0.12);
          color: #e0f2fe;
          font: inherit;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          border-radius: 4px 4px 0 0;
          vertical-align: baseline;
        }
        .glossary-term-btn:hover {
          background: rgba(147, 197, 253, 0.22);
          border-bottom-color: #bfdbfe;
        }
        .glossary-term-btn:focus {
          outline: none;
        }
        .glossary-term-btn:focus-visible {
          outline: 3px solid #93c5fd;
          outline-offset: 2px;
        }
        .housing-glossary-dialog {
          max-width: min(36rem, calc(100vw - 2rem));
          width: 100%;
          padding: 0;
          border: 2px solid #3f3f46;
          border-radius: 14px;
          background: #0c0c0f;
          color: #fafafa;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.65);
        }
        .housing-glossary-dialog::backdrop {
          background: rgba(0, 0, 0, 0.72);
        }
        .housing-glossary-dialog-inner {
          padding: 1.25rem 1.35rem 1.5rem;
        }
        .housing-glossary-dialog-toolbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        .housing-glossary-dialog-title {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.35;
          color: #fafafa;
          flex: 1;
          min-width: 0;
        }
        .housing-glossary-dialog-close {
          flex-shrink: 0;
          min-height: 44px;
          padding: 0 1rem;
          border-radius: 10px;
          border: 2px solid #52525b;
          background: #18181b;
          color: #fafafa;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }
        .housing-glossary-dialog-close:focus-visible {
          outline: 3px solid #93c5fd;
          outline-offset: 2px;
        }
        .housing-glossary-dialog-acronym {
          margin: 0 0 1rem;
          font-size: 0.875rem;
          color: #a1a1aa;
        }
        .housing-glossary-dialog-acronym-label {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.7rem;
          font-weight: 700;
          color: #71717a;
          margin-right: 0.35rem;
        }
        .housing-glossary-dialog-section {
          margin-top: 1rem;
        }
        .housing-glossary-dialog-h3 {
          margin: 0 0 0.4rem;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fde68a;
        }
        .housing-glossary-dialog-p {
          margin: 0;
          font-size: 0.9375rem;
          line-height: 1.65;
          color: #e4e4e7;
        }
        .game-chapters-link:focus-visible {
          outline: 3px solid #93c5fd;
          outline-offset: 3px;
          border-radius: 4px;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.45;
          }
        }
      `}</style>
    </div>
  );
}

async function buildPromptRemote(scenario, choice) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/video/visual-prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        situation: scenario.situation,
        mood: scenario.mood,
        choiceText: choice?.text,
        outcome: choice?.outcome,
        consequence: choice?.consequence,
      }),
    });
    if (!res.ok) throw new Error("prompt fetch failed");
    const { visualPrompt } = await res.json();
    return visualPrompt;
  } catch {
    if (choice) {
      return `Young person in a modest apartment, ${choice.consequence === "negative" ? "looking stressed and regretful" : "looking relieved and calm"}, cinematic lighting, 16:9, no text.`;
    }
    return `Young person in a small apartment looking ${scenario.mood}, surrounded by moving boxes and sparse furniture. Cinematic lighting, 16:9, no text.`;
  }
}
