import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useVideoGeneration } from "../hooks/useVideoGeneration";

const SCENARIOS = [
  {
    id: 1,
    day: 1,
    chapter: "The First Week",
    title: "First Week Survival",
    situation:
      "It's your first week in your own place. You get $900 from income support. Rent is $750. That leaves $150 for the month. Your phone buzzes — a 'limited time sale' from a store you love. It's a hoodie you've been wanting for $65. You think: I deserve something nice. This place feels so empty.",
    character: "alex",
    mood: "uncertain",
    choices: [
      {
        id: 1,
        text: "Buy the hoodie now. You need something to lift your mood.",
        outcome:
          "You buy the hoodie. You feel good for a day, but soon realize you only have $85 left for food, transport, and emergencies. When your phone breaks the next week, you're in trouble.",
        consequence: "negative",
        lesson:
          "Budget discipline matters. Impulse purchases can leave you vulnerable to emergencies.",
      },
      {
        id: 2,
        text: "Wait. Check what you actually need for the month first.",
        outcome:
          "You list your needs: food ($80), transport ($40), utilities emergency fund ($30). You have $150 left. The hoodie could work, but barely. You decide to wait for payday.",
        consequence: "positive",
        lesson:
          "Planning ahead prevents financial stress. Your future self will thank you.",
      },
      {
        id: 3,
        text: "Ignore it. Your money is for survival, not wants.",
        outcome:
          "You skip the hoodie. Your budget is tight, but you're covered for the month. You even set aside $20 in case of emergency. By month-end, you feel stable.",
        consequence: "excellent",
        lesson:
          "Living within your means builds security. Small sacrifices now mean peace of mind later.",
      },
    ],
  },
  {
    id: 2,
    day: 2,
    chapter: "The Lease",
    title: "Reading the Fine Print",
    situation:
      "You're reviewing your lease for the first time. You notice a clause: 'Tenant responsible for all repairs under $200.' Your landlord also says you're responsible for painting before move-out. This doesn't sound right. You have a $200 deposit. What do you do?",
    character: "alex",
    mood: "cautious",
    choices: [
      {
        id: 1,
        text: "Just sign it. Most leases probably have this.",
        outcome:
          "You sign. Six months later, a pipe leaks under the sink. The repair is $180. You pay it. Later, you lose $150 of your deposit on painting.",
        consequence: "negative",
        lesson:
          "Landlord responsibilities exist by law. Clauses contradicting them are often unenforceable.",
      },
      {
        id: 2,
        text: "Ask your landlord to explain the clauses before signing.",
        outcome:
          "Your landlord gets defensive. But you stand firm. They remove the $200 clause and clarify painting is 'normal wear.' You sign with confidence.",
        consequence: "positive",
        lesson:
          "Asking questions protects you. Most landlords respect tenants who know their rights.",
      },
      {
        id: 3,
        text: "Research tenant rights in your area first, then negotiate.",
        outcome:
          "You find the provincial tenant act. You show your landlord which clauses violate it. They revise the lease. You sign a fair agreement.",
        consequence: "excellent",
        lesson:
          "Knowledge is power. Tenants have legal protections. Use them.",
      },
    ],
  },
];

const CONSEQUENCE_COLOR = {
  excellent: { border: "#22c55e", bg: "rgba(34,197,94,0.08)", label: "#22c55e", icon: "✓", text: "Excellent Choice" },
  positive:  { border: "#60a5fa", bg: "rgba(96,165,250,0.08)", label: "#60a5fa", icon: "✓", text: "Good Choice" },
  negative:  { border: "#f87171", bg: "rgba(248,113,113,0.08)", label: "#f87171", icon: "✗", text: "Not Ideal" },
};

// Parse Gemini markdown into sections
function parseSceneContent(raw) {
  const sections = { narration: "", script: "", visual: "" };
  if (!raw) return sections;

  const narrationMatch = raw.match(/\*\*NARRATION\*\*([\s\S]*?)(?=\*\*SCRIPT\*\*|\*\*VISUAL|\z)/i);
  const scriptMatch    = raw.match(/\*\*SCRIPT\*\*([\s\S]*?)(?=\*\*VISUAL|\z)/i);
  const visualMatch    = raw.match(/\*\*VISUAL DIRECTION\*\*([\s\S]*)/i);

  sections.narration = narrationMatch ? narrationMatch[1].trim() : "";
  sections.script    = scriptMatch    ? scriptMatch[1].trim()    : "";
  sections.visual    = visualMatch    ? visualMatch[1].trim()    : "";

  // Fallback: show raw if sections didn't parse
  if (!sections.narration && !sections.script && !sections.visual) {
    sections.narration = raw.trim();
  }
  return sections;
}

// Parse full video (choice-based) Gemini response
function parseFullVideoContent(data) {
  if (!data || !data.video) return null;
  return {
    narration: data.video.narration || "",
    script: data.video.script || "",
    visual: data.video.visualDescription || "",
  };
}

// Typing animation component
function TypedText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    if (!text) return;

    const id = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) clearInterval(id);
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return <span>{displayed}</span>;
}

export default function GameScenario() {
  const [currentScenarioId, setCurrentScenarioId] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState([]);

  // Separate hooks: one for scene intro, one for full (choice-based) video
  const sceneHook = useVideoGeneration();
  const videoHook = useVideoGeneration();

  const scenario = SCENARIOS.find((s) => s.id === currentScenarioId);
  const choice = scenario?.choices.find((c) => c.id === selectedChoice);

  // Auto-generate scene intro whenever scenario changes
  useEffect(() => {
    if (!scenario) return;
    sceneHook.clearVideo();
    sceneHook.generateScene(scenario.id).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenarioId]);

  const handleChoiceSelect = (choiceId) => {
    setSelectedChoice(choiceId);
    setShowOutcome(true);
    // Generate outcome video on the left
    videoHook.clearVideo();
    videoHook.generateFullVideo(scenario.id, choiceId).catch(() => {});
  };

  const handleNextScenario = () => {
    if (!completedScenarios.includes(currentScenarioId)) {
      setCompletedScenarios([...completedScenarios, currentScenarioId]);
    }
    if (currentScenarioId < SCENARIOS.length) {
      setCurrentScenarioId(currentScenarioId + 1);
      setSelectedChoice(null);
      setShowOutcome(false);
      videoHook.clearVideo();
    }
  };

  if (!scenario) {
    return (
      <div style={{ background: "#090909", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 600, marginBottom: "16px" }}>All Scenarios Complete!</h1>
          <p style={{ fontSize: "15px", color: "#52525b", marginBottom: "24px" }}>Great job! You've completed all scenarios.</p>
          <Link to="/chapters" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "#09090b", fontSize: "13px", fontWeight: 600, padding: "10px 20px", borderRadius: "6px", textDecoration: "none" }}>
            Back to Chapters
          </Link>
        </div>
      </div>
    );
  }

  const sceneSections = parseSceneContent(sceneHook.videoData?.sceneContent);
  const outcomeVideo  = parseFullVideoContent(videoHook.videoData);
  const c = choice ? CONSEQUENCE_COLOR[choice.consequence] : null;

  // Decide what the left panel shows
  const leftLoading  = showOutcome ? videoHook.loading : sceneHook.loading;
  const leftError    = showOutcome ? videoHook.error   : sceneHook.error;
  const leftSections = showOutcome && outcomeVideo ? outcomeVideo : sceneSections;
  const leftLabel    = showOutcome ? "Outcome Video" : "Scene Intro";

  return (
    <div style={{ background: "#090909", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid #111", background: "rgba(9,9,9,0.95)", backdropFilter: "blur(12px)", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Day {scenario.day} — {scenario.chapter}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600 }}>{scenario.title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "12px", color: "#71717a" }}>{currentScenarioId} / {SCENARIOS.length}</span>
          <Link to="/chapters" style={{ fontSize: "12px", color: "#71717a", textDecoration: "none" }}>← Chapters</Link>
        </div>
      </header>

      {/* ── MAIN SPLIT ── */}
      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "55% 45%", overflow: "hidden" }}>

        {/* ════ LEFT: VIDEO PANEL ════ */}
        <div style={{ borderRight: "1px solid #111", display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", overflowY: "auto" }}>

          {/* Cinematic screen */}
          <div style={{ position: "relative", background: "#030303", borderBottom: "1px solid #111", minHeight: "220px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {/* Subtle gradient overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(96,165,250,0.04) 0%, transparent 60%)" }} />

            {leftLoading ? (
              <div style={{ textAlign: "center", zIndex: 1 }}>
                <div style={{ width: "40px", height: "40px", border: "2px solid #27272a", borderTopColor: "#60a5fa", borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 12px" }} />
                <div style={{ fontSize: "12px", color: "#52525b", letterSpacing: "0.06em" }}>Generating {leftLabel}…</div>
              </div>
            ) : leftError ? (
              <div style={{ textAlign: "center", zIndex: 1, padding: "0 24px" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>⚠️</div>
                <div style={{ fontSize: "12px", color: "#f87171" }}>{leftError}</div>
              </div>
            ) : leftSections.narration ? (
              <div style={{ zIndex: 1, padding: "32px", textAlign: "center", maxWidth: "480px" }}>
                <div style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                  {leftLabel}
                </div>
                <p style={{ fontSize: "15px", color: "#e4e4e7", lineHeight: 1.8, fontStyle: "italic" }}>
                  <TypedText text={leftSections.narration} speed={16} />
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "center", zIndex: 1, padding: "0 24px" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎬</div>
                <div style={{ fontSize: "12px", color: "#3f3f46" }}>Scene will generate shortly…</div>
              </div>
            )}

            {/* Now playing pill */}
            {!leftLoading && !leftError && leftSections.narration && (
              <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.7)", border: "1px solid #27272a", borderRadius: "20px", padding: "4px 10px", fontSize: "11px", color: "#71717a" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: showOutcome ? "#f87171" : "#22c55e", animation: "pulse 1.5s ease-in-out infinite", display: "inline-block" }} />
                {leftLabel}
              </div>
            )}
          </div>

          {/* Generated content sections */}
          <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Scenario situation */}
            <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid #1c1c1f", background: "rgba(24,24,27,0.3)" }}>
              <div style={{ fontSize: "10px", color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Scene</div>
              <p style={{ fontSize: "13px", color: "#a1a1aa", lineHeight: 1.75 }}>{scenario.situation}</p>
            </div>

            {/* Script section */}
            {leftSections.script && (
              <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid #1c1c1f", background: "rgba(24,24,27,0.2)" }}>
                <div style={{ fontSize: "10px", color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Script</div>
                <p style={{ fontSize: "12px", color: "#71717a", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{leftSections.script}</p>
              </div>
            )}

            {/* Visual direction section */}
            {leftSections.visual && (
              <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid #1c1c1f", background: "rgba(24,24,27,0.2)" }}>
                <div style={{ fontSize: "10px", color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Visual Direction</div>
                <p style={{ fontSize: "12px", color: "#71717a", lineHeight: 1.75 }}>{leftSections.visual}</p>
              </div>
            )}
          </div>
        </div>

        {/* ════ RIGHT: ANSWERS PANEL ════ */}
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", overflowY: "auto", padding: "32px 28px", gap: "20px" }}>

          {!showOutcome ? (
            <>
              <div style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase" }}>What do you do?</div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {scenario.choices.map((ch, i) => (
                  <button
                    key={ch.id}
                    onClick={() => handleChoiceSelect(ch.id)}
                    style={{
                      padding: "18px 20px 18px 52px",
                      borderRadius: "8px",
                      border: "2px solid #27272a",
                      background: "rgba(24,24,27,0.4)",
                      color: "#e4e4e7",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                      lineHeight: 1.6,
                      position: "relative",
                      transition: "border-color 0.12s, background 0.12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(24,24,27,0.7)"; e.currentTarget.style.borderColor = "#3f3f46"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(24,24,27,0.4)"; e.currentTarget.style.borderColor = "#27272a"; }}
                  >
                    <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", width: "22px", height: "22px", borderRadius: "50%", border: "2px solid #3f3f46", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#52525b" }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {ch.text}
                  </button>
                ))}
              </div>

              <div style={{ padding: "14px", borderRadius: "8px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", fontSize: "12px", color: "#86efac", lineHeight: 1.6 }}>
                Each choice leads to a different outcome. The video on the left will update once you decide.
              </div>
            </>
          ) : (
            <>
              {/* Loading state for outcome video */}
              {videoHook.loading && (
                <div style={{ padding: "14px", borderRadius: "8px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)", fontSize: "12px", color: "#93c5fd", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "14px", height: "14px", border: "2px solid #1e3a5f", borderTopColor: "#60a5fa", borderRadius: "50%", animation: "spin 0.9s linear infinite", flexShrink: 0 }} />
                  Generating outcome video on the left…
                </div>
              )}

              {/* Outcome card */}
              {choice && (
                <div style={{ padding: "22px", borderRadius: "8px", border: `2px solid ${c.border}`, background: c.bg }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: c.label, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                    {c.icon} {c.text}
                  </div>
                  <p style={{ fontSize: "13px", color: "#e4e4e7", lineHeight: 1.8, marginBottom: "16px" }}>{choice.outcome}</p>
                  <div style={{ paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: "10px", color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>Lesson Learned</div>
                    <p style={{ fontSize: "12px", color: "#a1a1aa", lineHeight: 1.7 }}>{choice.lesson}</p>
                  </div>
                </div>
              )}

              {/* Next button */}
              <button
                onClick={handleNextScenario}
                style={{ padding: "12px 20px", borderRadius: "8px", border: "none", background: "#fff", color: "#09090b", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "background 0.12s", marginTop: "auto" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#e4e4e7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
              >
                {currentScenarioId === SCENARIOS.length ? "Complete & Review" : "Next Scenario →"}
              </button>
            </>
          )}
        </div>
      </main>

      {/* ── PROGRESS BAR ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "3px", background: "#0a0a0f" }}>
        <div style={{ height: "100%", width: `${(completedScenarios.length / SCENARIOS.length) * 100}%`, background: "#22c55e", transition: "width 0.4s ease" }} />
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}
