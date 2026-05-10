import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useVeoVideo } from "../hooks/useVeoVideo";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const SEED_SCENARIOS = [
  {
    id: 1,
    day: 1,
    chapter: "The First Week",
    title: "First Week Survival",
    mood: "uncertain",
    situation:
      "It's your first week in your own place. You get $900 from income support. Rent is $750. That leaves $150 for the month. Your phone buzzes — a 'limited time sale' from a store you love. It's a hoodie you've been wanting for $65. You think: I deserve something nice. This place feels so empty.",
    choices: [
      {
        id: 1,
        text: "Buy the hoodie now. You need something to lift your mood.",
        outcome: "You buy the hoodie. You feel good for a day, but soon realize you only have $85 left for food, transport, and emergencies. When your phone breaks the next week, you're in trouble.",
        consequence: "negative",
        lesson: "Budget discipline matters. Impulse purchases can leave you vulnerable to emergencies.",
      },
      {
        id: 2,
        text: "Wait. Check what you actually need for the month first.",
        outcome: "You list your needs: food ($80), transport ($40), utilities emergency fund ($30). You have $150 left. The hoodie could work, but barely. You decide to wait for payday.",
        consequence: "positive",
        lesson: "Planning ahead prevents financial stress. Your future self will thank you.",
      },
      {
        id: 3,
        text: "Ignore it. Your money is for survival, not wants.",
        outcome: "You skip the hoodie. Your budget is tight, but you're covered for the month. You even set aside $20 in case of emergency. By month-end, you feel stable.",
        consequence: "excellent",
        lesson: "Living within your means builds security. Small sacrifices now mean peace of mind later.",
      },
    ],
  },
];

const CONSEQUENCE_COLOR = {
  excellent: { border: "#22c55e", bg: "rgba(34,197,94,0.08)", label: "#22c55e", icon: "✓", text: "Excellent Choice" },
  positive:  { border: "#60a5fa", bg: "rgba(96,165,250,0.08)", label: "#60a5fa", icon: "✓", text: "Good Choice" },
  negative:  { border: "#f87171", bg: "rgba(248,113,113,0.08)", label: "#f87171", icon: "✗", text: "Not Ideal" },
};

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

async function fetchNextScenario(prev, choice, chapterNumber) {
  const res = await fetch(`${API_BASE_URL}/api/scenario/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      previousSituation: prev.situation,
      chosenText: choice.text,
      outcome: choice.outcome,
      consequence: choice.consequence,
      lesson: choice.lesson,
      chapterNumber,
    }),
  });
  if (!res.ok) throw new Error("Failed to generate next scenario");
  return res.json();
}

export default function GameScenario() {
  const [scenario, setScenario] = useState(SEED_SCENARIOS[0]);
  const [scenarioIndex, setScenarioIndex] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);

  // Next scenario state (pre-generated while player reads outcome)
  const [nextScenario, setNextScenario] = useState(null);
  const [nextLoading, setNextLoading] = useState(false);
  const [nextError, setNextError] = useState(null);

  const veo = useVeoVideo();
  // Pre-generate video for next scenario in background
  const nextVeo = useVeoVideo();

  const choice = scenario.choices.find((c) => c.id === selectedChoice);
  const c = choice ? CONSEQUENCE_COLOR[choice.consequence] : null;

  // Generate scene video when scenario changes
  useEffect(() => {
    veo.reset();
    // Pass scenario as a fake "scenarioId" won't work for dynamic scenarios
    // Instead we trigger generation with a special dynamic route
    startSceneVideo(scenario);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  const startSceneVideo = useCallback(async (scen) => {
    veo.reset();
    const prompt = await buildPrompt(scen, null);
    veo.startGenerationFromPrompt(prompt);
  }, []);

  const handleChoiceSelect = async (choiceId) => {
    const chosen = scenario.choices.find((c) => c.id === choiceId);
    setSelectedChoice(choiceId);
    setShowOutcome(true);

    // Start outcome video with AI-generated visual prompt
    veo.reset();
    buildPrompt(scenario, chosen).then((p) => veo.startGenerationFromPrompt(p));

    // Pre-generate next scenario + its video in background
    setNextScenario(null);
    setNextError(null);
    setNextLoading(true);
    fetchNextScenario(scenario, chosen, scenarioIndex + 1)
      .then(async (next) => {
        setNextScenario(next);
        setNextLoading(false);
        // Kick off next scenario's video with AI visual prompt
        const p = await buildPrompt(next, null);
        nextVeo.reset();
        nextVeo.startGenerationFromPrompt(p);
      })
      .catch((err) => {
        setNextError(err.message);
        setNextLoading(false);
      });
  };

  const handleNextScenario = () => {
    if (!nextScenario) return;
    setScenario(nextScenario);
    setScenarioIndex((i) => i + 1);
    setSelectedChoice(null);
    setShowOutcome(false);
    setNextScenario(null);
    // Swap pre-generated video into main veo
    veo.reset();
    // The nextVeo is already generating — move its state to main veo
    veo.inheritFrom(nextVeo);
    nextVeo.reset();
  };

  return (
    <div style={{ background: "#090909", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid #111", background: "rgba(9,9,9,0.95)", backdropFilter: "blur(12px)", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Scenario {scenarioIndex} — {scenario.chapter}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600 }}>{scenario.title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "12px", color: "#71717a" }}>#{scenarioIndex}</span>
          <Link to="/chapters" style={{ fontSize: "12px", color: "#71717a", textDecoration: "none" }}>← Chapters</Link>
        </div>
      </header>

      {/* ── MAIN SPLIT ── */}
      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "55% 45%", overflow: "hidden" }}>

        {/* ════ LEFT: VIDEO PANEL ════ */}
        <div style={{ borderRight: "1px solid #111", display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", overflowY: "auto" }}>

          {/* Video screen */}
          <div style={{ position: "relative", background: "#000", aspectRatio: "16/9", width: "100%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {veo.status === "done" && veo.videoUrl ? (
              <>
                <video key={veo.videoUrl} autoPlay loop controls style={{ width: "100%", height: "100%", objectFit: "cover" }} src={veo.videoUrl} />
                <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.75)", border: "1px solid #27272a", borderRadius: "20px", padding: "4px 10px", fontSize: "11px", color: "#71717a", pointerEvents: "none" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f87171", animation: "pulse 1.5s ease-in-out infinite", display: "inline-block" }} />
                  {showOutcome ? "Outcome Video" : "Scene Video"}
                </div>
              </>
            ) : veo.status === "error" ? (
              <div style={{ textAlign: "center", padding: "24px" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>⚠️</div>
                <div style={{ fontSize: "12px", color: "#f87171", maxWidth: "320px" }}>{veo.error}</div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "44px", height: "44px", border: "2px solid #1c1c1f", borderTopColor: "#60a5fa", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <div style={{ fontSize: "13px", color: "#e4e4e7", fontWeight: 500, marginBottom: "6px" }}>
                  {veo.retryIn ? `Rate limited — retrying in ${veo.retryIn}s…` : veo.status === "generating" ? "Generating video…" : "Starting generation…"}
                </div>
                <div style={{ fontSize: "12px", color: "#52525b" }}>{formatTime(veo.elapsedSeconds)} elapsed · usually 1–2 min</div>
                <div style={{ width: "180px", height: "2px", background: "#1c1c1f", borderRadius: "1px", margin: "14px auto 0", overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#60a5fa", width: `${Math.min((veo.elapsedSeconds / 120) * 100, 92)}%`, transition: "width 1s linear" }} />
                </div>
              </div>
            )}
          </div>

          {/* Scenario situation */}
          <div style={{ flex: 1, padding: "24px" }}>
            <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid #1c1c1f", background: "rgba(24,24,27,0.3)" }}>
              <div style={{ fontSize: "10px", color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Scene</div>
              <p style={{ fontSize: "13px", color: "#a1a1aa", lineHeight: 1.75 }}>{scenario.situation}</p>
            </div>
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
                    style={{ padding: "18px 20px 18px 52px", borderRadius: "8px", border: "2px solid #27272a", background: "rgba(24,24,27,0.4)", color: "#e4e4e7", fontSize: "13px", fontWeight: 500, cursor: "pointer", textAlign: "left", lineHeight: 1.6, position: "relative", transition: "border-color 0.12s, background 0.12s" }}
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
                Each choice leads to a different outcome. The video on the left updates once you decide.
              </div>
            </>
          ) : (
            <>
              {/* Outcome card */}
              {choice && c && (
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

              {/* Next scenario status */}
              <div style={{ padding: "14px", borderRadius: "8px", border: "1px solid #1c1c1f", background: "rgba(24,24,27,0.3)", fontSize: "12px" }}>
                {nextLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#71717a" }}>
                    <div style={{ width: "14px", height: "14px", border: "2px solid #27272a", borderTopColor: "#60a5fa", borderRadius: "50%", animation: "spin 0.9s linear infinite", flexShrink: 0 }} />
                    Generating next scenario…
                  </div>
                ) : nextError ? (
                  <div style={{ color: "#f87171" }}>⚠️ Could not generate next scenario: {nextError}</div>
                ) : nextScenario ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#86efac" }}>
                    <span>✓</span>
                    <span>Next scenario ready: <strong style={{ color: "#e4e4e7" }}>{nextScenario.title}</strong></span>
                  </div>
                ) : null}
              </div>

              {/* Next button */}
              <button
                onClick={handleNextScenario}
                disabled={!nextScenario}
                style={{ padding: "12px 20px", borderRadius: "8px", border: "none", background: nextScenario ? "#fff" : "#1c1c1f", color: nextScenario ? "#09090b" : "#52525b", fontSize: "13px", fontWeight: 600, cursor: nextScenario ? "pointer" : "not-allowed", transition: "background 0.12s", marginTop: "auto" }}
                onMouseEnter={(e) => { if (nextScenario) e.currentTarget.style.background = "#e4e4e7"; }}
                onMouseLeave={(e) => { if (nextScenario) e.currentTarget.style.background = "#fff"; }}
              >
                {nextScenario ? `Next: ${nextScenario.title} →` : "Preparing next scenario…"}
              </button>
            </>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}

async function buildPrompt(scenario, choice) {
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
    // Fallback to a simple but still visual prompt
    if (choice) {
      return `Young person in a modest apartment, ${choice.consequence === "negative" ? "looking stressed and regretful" : "looking relieved and calm"}, holding a ${choice.consequence === "negative" ? "crumpled receipt" : "signed document"}. Cinematic lighting, 16:9, no text.`;
    }
    return `Young person in a small apartment looking ${scenario.mood}, surrounded by moving boxes and sparse furniture. Cinematic lighting, 16:9, no text.`;
  }
}
