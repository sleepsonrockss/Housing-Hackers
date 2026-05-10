import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVeoVideo } from "../hooks/useVeoVideo";
import { interpolateScenarioText } from "../game/interpolate";
import {
  applyChoiceDeltas,
  applyScaledMoneyDelta,
  getGameOverReason,
  INITIAL_PLAYER_STATS,
  mergeFlags,
  normalizeStats,
} from "../game/playerModel";
import { clearPersistedRun, loadPersistedRun, savePersistedRun } from "../game/playerSessionPersist";
import { getScenario, getStartScenarioId } from "../game/staticScenarios/index";
import { CHAPTER_COUNT } from "../game/gameStructure";
import { playChoiceStatSfx } from "../game/statChangeSfx";
import { HOUSING_GLOSSARY } from "../game/housingGlossary";
import { GlossaryRichText } from "../components/GlossaryRichText";
import GameRunDock from "../components/GameRunDock";
import GameNavActions from "../components/GameNavActions";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/** If true and no `videoSrc`, fall back to Veo-style generation (dev only). */
const USE_VEO_WHEN_NO_FILE =
  import.meta.env.VITE_USE_VEO_VIDEO_FALLBACK === "true";

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** e.g. c1-q3 → "1.3"; c1-outro → falls back to scenario.title */
function scenarioIndexLabel(s) {
  if (!s?.id) return "";
  const m = /^c(\d+)-q(\d+)$/.exec(s.id);
  return m ? `${m[1]}.${m[2]}` : s.title || "";
}

/**
 * `cN-outro` is a bridge beat with a single "continue" choice; skip it so the
 * player lands on the next real scenario (or run-complete after chapter 5).
 */
function resolveNextScenarioJump(fromId) {
  if (!fromId) return { targetId: null, runComplete: true };
  let id = fromId;
  for (let hop = 0; hop < 8; hop++) {
    const sc = getScenario(id);
    if (!sc) return { targetId: null, runComplete: true };
    if (/^c\d+-outro$/i.test(sc.id)) {
      const onward = sc.choices?.[0]?.nextId ?? null;
      if (onward == null) return { targetId: null, runComplete: true };
      id = onward;
      continue;
    }
    return { targetId: id, runComplete: false };
  }
  return { targetId: null, runComplete: true };
}

/** Wait after choice before loading next beat (ms). */
const ADVANCE_NO_SPEND_MS = 320;
const ADVANCE_AFTER_SPEND_MS = 1850;
const ADVANCE_REDUCED_MOTION_CAP_MS = 480;

/** If URL has `reset=1`, do not hydrate from session on first paint (effect clears save next tick). */
function shouldHydrateRunFromSession() {
  if (typeof window === "undefined") return true;
  try {
    return new URLSearchParams(window.location.search).get("reset") !== "1";
  } catch {
    return true;
  }
}

export default function GameScenario() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dayParam = searchParams.get("day") || "1";

  const [stats, setStats] = useState(() => {
    if (!shouldHydrateRunFromSession()) return { ...INITIAL_PLAYER_STATS };
    const saved = loadPersistedRun();
    return saved?.stats ? normalizeStats({ ...INITIAL_PLAYER_STATS, ...saved.stats }) : { ...INITIAL_PLAYER_STATS };
  });
  const [gameOverReason, setGameOverReason] = useState(() => {
    if (!shouldHydrateRunFromSession()) return null;
    const saved = loadPersistedRun();
    if (!saved) return null;
    if (saved.gameOverReason === "money" || saved.gameOverReason === "stress") return saved.gameOverReason;
    const s = saved.stats ? normalizeStats({ ...INITIAL_PLAYER_STATS, ...saved.stats }) : { ...INITIAL_PLAYER_STATS };
    return getGameOverReason(s);
  });
  const [flags, setFlags] = useState(() => {
    if (!shouldHydrateRunFromSession()) return {};
    const saved = loadPersistedRun();
    return saved?.flags ? { ...saved.flags } : {};
  });
  const [unlockedDay, setUnlockedDay] = useState(() => {
    if (!shouldHydrateRunFromSession()) return 1;
    const saved = loadPersistedRun();
    return typeof saved?.unlockedDay === "number" ? saved.unlockedDay : 1;
  });
  const [answersByChapter, setAnswersByChapter] = useState(() => {
    if (!shouldHydrateRunFromSession()) return {};
    const saved = loadPersistedRun();
    return saved?.answersByChapter && typeof saved.answersByChapter === "object" ? { ...saved.answersByChapter } : {};
  });
  const [scenarioId, setScenarioId] = useState(() => getStartScenarioId(dayParam));
  /** While set, choice UI is locked and we auto-advance after a short delay (or money float). */
  const [pendingAdvance, setPendingAdvance] = useState(null);
  const [runComplete, setRunComplete] = useState(false);
  const [spendAnimKey, setSpendAnimKey] = useState(0);
  const [videoBroken, setVideoBroken] = useState(false);
  const [glossaryKey, setGlossaryKey] = useState(null);
  const glossaryDialogRef = useRef(null);
  /** Only reset to chapter start when `?day=` changes — not when `unlockedDay` bumps mid-run. */
  const lastSyncedDayParamRef = useRef(null);

  const scenario = getScenario(scenarioId);

  /** Optional `?reset=1` — new run: clear meters, flags, and saved session. */
  useEffect(() => {
    if (searchParams.get("reset") !== "1") return;
    clearPersistedRun();
    setStats({ ...INITIAL_PLAYER_STATS });
    setFlags({});
    setUnlockedDay(1);
    setAnswersByChapter({});
    setGameOverReason(null);
    const dayFromUrl = Math.max(1, Math.min(CHAPTER_COUNT, parseInt(String(searchParams.get("day") || "1"), 10) || 1));
    lastSyncedDayParamRef.current = null;
    setScenarioId(getStartScenarioId(String(dayFromUrl)));
    setPendingAdvance(null);
    setRunComplete(false);
    const next = new URLSearchParams(searchParams);
    next.delete("reset");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  /** When `?day=` changes, jump to that chapter's first beat. Do not reset when only `unlockedDay` changes (e.g. entering ch2). */
  useEffect(() => {
    if (gameOverReason) return;
    const requested = Math.max(1, Math.min(CHAPTER_COUNT, parseInt(String(dayParam), 10) || 1));
    const safe = Math.min(requested, unlockedDay);
    if (safe !== requested) {
      setSearchParams({ day: String(safe) }, { replace: true });
      lastSyncedDayParamRef.current = String(safe);
      return;
    }
    const dayKey = String(safe);
    if (lastSyncedDayParamRef.current === dayKey) return;
    lastSyncedDayParamRef.current = dayKey;
    setScenarioId(getStartScenarioId(dayKey));
    setPendingAdvance(null);
    setRunComplete(false);
    setVideoBroken(false);
  }, [dayParam, unlockedDay, gameOverReason, setSearchParams]);

  useEffect(() => {
    savePersistedRun({ stats, flags, unlockedDay, answersByChapter, gameOverReason });
  }, [stats, flags, unlockedDay, answersByChapter, gameOverReason]);

  useEffect(() => {
    setVideoBroken(false);
  }, [scenarioId]);

  useEffect(() => {
    if (!pendingAdvance) return;
    const { nextId, moneyDelta: md, stressDelta: sd } = pendingAdvance;
    const hasDeltaMotion =
      (md != null && md !== 0) || (sd != null && sd !== 0);
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const baseMs = hasDeltaMotion ? ADVANCE_AFTER_SPEND_MS : ADVANCE_NO_SPEND_MS;
    const ms = reduced ? Math.min(baseMs, ADVANCE_REDUCED_MOTION_CAP_MS) : baseMs;
    const id = window.setTimeout(() => {
      const go = pendingAdvance?.gameOverReason;
      setPendingAdvance(null);
      if (go === "money" || go === "stress") {
        setGameOverReason(go);
        return;
      }
      const { targetId, runComplete: chapterDone } = resolveNextScenarioJump(nextId);
      if (chapterDone || !targetId) {
        setRunComplete(true);
        return;
      }
      const nextSc = getScenario(targetId);
      if (!nextSc) {
        setRunComplete(true);
        return;
      }
      setUnlockedDay((u) => Math.max(u, nextSc.chapter));
      setSearchParams({ day: String(nextSc.chapter) }, { replace: true });
      setRunComplete(false);
      setScenarioId(targetId);
      setVideoBroken(false);
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
    if (!scenario || pendingAdvance || gameOverReason) return;
    const chosen = scenario.choices.find((ch) => String(ch.id) === String(choiceId));
    if (!chosen) return;
    const nextStats = applyChoiceDeltas(stats, chosen);
    setStats(nextStats);
    const over = getGameOverReason(nextStats);
    setFlags((prev) => mergeFlags(prev, chosen));
    const chKey = String(scenario.chapter);
    const choiceLabel = interpolateScenarioText(chosen.text, stats);
    const logAnswer = /^c\d+-q\d+$/.test(scenario.id);
    if (logAnswer) {
      setAnswersByChapter((prev) => ({
        ...prev,
        [chKey]: [
          ...(Array.isArray(prev[chKey]) ? prev[chKey] : []),
          { scenarioId: scenario.id, scenarioTitle: scenarioIndexLabel(scenario), choiceText: choiceLabel },
        ],
      }));
    }
    const md =
      typeof chosen.moneyDelta === "number" ? applyScaledMoneyDelta(chosen.moneyDelta) : null;
    const sd = typeof chosen.stressDelta === "number" ? chosen.stressDelta : null;
    playChoiceStatSfx(md, sd);
    const hasDeltaMotion = (md != null && md !== 0) || (sd != null && sd !== 0);
    if (hasDeltaMotion) setSpendAnimKey((k) => k + 1);
    setPendingAdvance({
      nextId: chosen.nextId ?? null,
      moneyDelta: md,
      stressDelta: sd,
      gameOverReason: over,
    });
  };

  if (!scenario) {
    return (
      <div style={{ background: "#090909", color: "#fff", minHeight: "100vh", padding: 48, display: "flex", flexDirection: "column", gap: 20 }}>
        <p>Unknown scenario.</p>
        <GameNavActions />
      </div>
    );
  }

  const showRunDock = !gameOverReason;

  return (
    <div
      style={{
        background: "#090909",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        paddingBottom: showRunDock ? "max(52px, env(safe-area-inset-bottom, 0px))" : 0,
      }}
    >
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
        <div id="scenario-heading" style={{ fontSize: "16px", fontWeight: 600 }}>
          {runComplete && scenario.chapter >= CHAPTER_COUNT ? "Done" : scenarioIndexLabel(scenario)}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
            maxWidth: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#a1a1aa", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span>
              Money <strong style={{ color: "#fafafa" }}>${stats.money}</strong>
            </span>
            <span>
              Stress <strong style={{ color: "#fafafa" }}>{stats.stress}</strong>
              <span style={{ color: "#52525b", fontWeight: 400 }}> / 100</span>
            </span>
          </div>
          <GameNavActions omitContinue compact />
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
                  title={`Scene: ${scenarioIndexLabel(scenario)}`}
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
          aria-busy={pendingAdvance || gameOverReason ? "true" : "false"}
          style={pendingAdvance || gameOverReason ? { opacity: gameOverReason ? 1 : 0.55, pointerEvents: gameOverReason ? "auto" : "none" } : undefined}
        >
          {gameOverReason ? (
            <section className="game-scenario-question-block" aria-labelledby="game-over-heading">
              <h2 id="game-over-heading" className="game-scenario-title">
                Game over
              </h2>
              <p className="game-scenario-situation" style={{ marginBottom: "1.25rem" }}>
                {gameOverReason === "money"
                  ? "You ran out of money. The run ends when cash hits $0 or below."
                  : "Your stress meter hit the maximum (100). Higher numbers mean more strain all along — this is the limit."}
              </p>
              <div style={{ marginTop: "4px" }}>
                <GameNavActions omitContinue compact />
              </div>
            </section>
          ) : runComplete ? (
            <section className="game-scenario-question-block" aria-labelledby="chapter-end-heading">
              <h2 id="chapter-end-heading" className="game-scenario-title">
                {scenario.chapter >= CHAPTER_COUNT
                  ? "You finished all five days"
                  : `Day ${scenario.chapter} complete`}
              </h2>
              <p className="game-scenario-situation" style={{ marginBottom: "1.25rem" }}>
                {scenario.chapter >= CHAPTER_COUNT
                  ? "That is the end of this build’s five-day run. Use the day list to replay from any day."
                  : "This day has no further beats in the current story file. Open the next day to keep going, or return to the list."}
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
                    aria-label={`Start day ${scenario.chapter + 1}`}
                  >
                    Continue to day {scenario.chapter + 1} →
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
                  aria-label="Return to day list"
                >
                  All days
                </Link>
              </div>
              <div style={{ marginTop: "16px" }}>
                <GameNavActions omitContinue compact />
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
                {situationDisplay.trim() ? (
                  <p id="scenario-situation-live" className="game-scenario-situation">
                    <GlossaryRichText text={situationDisplay} onOpenTerm={setGlossaryKey} />
                  </p>
                ) : null}
              </section>

              <div id="game-choice-anchor">
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
              </div>
            </>
          )}
        </div>
      </main>

      {showRunDock ? (
        <GameRunDock
          unlockedDay={unlockedDay}
          currentChapter={scenario.chapter}
          runComplete={runComplete}
          answersByChapter={answersByChapter}
          navigationLocked={!!gameOverReason}
          choicesAvailable={
            !runComplete && Array.isArray(scenario?.choices) && scenario.choices.length > 0
          }
        />
      ) : null}

      {pendingAdvance &&
      ((pendingAdvance.moneyDelta != null && pendingAdvance.moneyDelta !== 0) ||
        (pendingAdvance.stressDelta != null && pendingAdvance.stressDelta !== 0)) ? (
        <div className="stat-delta-overlay" aria-hidden="true">
          <div className="stat-delta-row" key={spendAnimKey}>
            {pendingAdvance.moneyDelta != null && pendingAdvance.moneyDelta !== 0 ? (
              <span className="stat-delta-money">
                {pendingAdvance.moneyDelta > 0
                  ? `+$${pendingAdvance.moneyDelta}`
                  : `-$${Math.abs(pendingAdvance.moneyDelta)}`}
              </span>
            ) : null}
            {pendingAdvance.stressDelta != null && pendingAdvance.stressDelta !== 0 ? (
              <span className="stat-delta-stress">
                {pendingAdvance.stressDelta > 0 ? "+" : ""}
                {pendingAdvance.stressDelta}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
      {pendingAdvance &&
      ((pendingAdvance.moneyDelta != null && pendingAdvance.moneyDelta !== 0) ||
        (pendingAdvance.stressDelta != null && pendingAdvance.stressDelta !== 0)) ? (
        <span className="visually-hidden" aria-live="polite">
          {[
            pendingAdvance.moneyDelta != null && pendingAdvance.moneyDelta !== 0
              ? `Money ${pendingAdvance.moneyDelta > 0 ? "gained" : "spent"} ${Math.abs(pendingAdvance.moneyDelta)} dollars.`
              : null,
            pendingAdvance.stressDelta != null && pendingAdvance.stressDelta !== 0
              ? `Strain ${pendingAdvance.stressDelta > 0 ? "up" : "down"} ${Math.abs(pendingAdvance.stressDelta)}.`
              : null,
          ]
            .filter(Boolean)
            .join(" ")}
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
        .stat-delta-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .stat-delta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: center;
          gap: clamp(0.75rem, 3vw, 1.75rem);
          font-size: clamp(1.75rem, 7vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          text-shadow: 0 6px 40px rgba(0, 0, 0, 0.9), 0 0 1px rgba(0, 0, 0, 1);
          animation: statDeltaFloat 1.55s ease-out forwards;
        }
        .stat-delta-money {
          color: #4ade80;
        }
        .stat-delta-stress {
          color: #f87171;
        }
        @keyframes statDeltaFloat {
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
          .stat-delta-row {
            animation-name: statDeltaFloatReduced;
            animation-duration: 0.38s;
          }
        }
        @keyframes statDeltaFloatReduced {
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
