import { useState } from "react";
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

export default function GameScenario() {
  const [currentScenarioId, setCurrentScenarioId] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [showVideo, setShowVideo] = useState(false);

  const {
    loading: videoLoading,
    error: videoError,
    videoData,
    generateFullVideo,
    clearVideo,
  } = useVideoGeneration();

  const scenario = SCENARIOS.find((s) => s.id === currentScenarioId);
  const choice = scenario?.choices.find((c) => c.id === selectedChoice);

  const handleChoiceSelect = (choiceId) => {
    setSelectedChoice(choiceId);
    setShowOutcome(true);
  };

  const handleGenerateVideo = async () => {
    try {
      await generateFullVideo(currentScenarioId, selectedChoice);
      setShowVideo(true);
    } catch (error) {
      console.error("Failed to generate video:", error);
    }
  };

  const handleNextScenario = () => {
    if (!completedScenarios.includes(currentScenarioId)) {
      setCompletedScenarios([...completedScenarios, currentScenarioId]);
    }

    if (currentScenarioId < SCENARIOS.length) {
      setCurrentScenarioId(currentScenarioId + 1);
      setSelectedChoice(null);
      setShowOutcome(false);
      clearVideo();
      setShowVideo(false);
    }
  };

  if (!scenario) {
    return (
      <div
        style={{
          background: "#090909",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 600, marginBottom: "16px" }}>
            All Scenarios Complete!
          </h1>
          <p style={{ fontSize: "15px", color: "#52525b", marginBottom: "24px" }}>
            Great job! You've completed all scenarios.
          </p>
          <Link
            to="/chapters"
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
            Back to Chapters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#090909", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: "1px solid #111",
          background: "rgba(9,9,9,0.95)",
          backdropFilter: "blur(12px)",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#52525b",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Day {scenario.day} — {scenario.chapter}
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: 600, margin: 0 }}>
              {scenario.title}
            </h1>
          </div>
          <div style={{ fontSize: "13px", color: "#71717a" }}>
            {currentScenarioId} / {SCENARIOS.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
          {/* Left Side: Scenario Setup */}
          <div>
            <div
              style={{
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid #27272a",
                background: "rgba(24,24,27,0.3)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#52525b",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Scene
              </div>
              <p style={{ fontSize: "14px", color: "#e4e4e7", lineHeight: 1.8 }}>
                {scenario.situation}
              </p>
            </div>
          </div>

          {/* Right Side: Choices & Outcome */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {!showOutcome ? (
              <>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#52525b",
                      marginBottom: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    What do you do?
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {scenario.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoiceSelect(choice.id)}
                        style={{
                          padding: "20px",
                          borderRadius: "8px",
                          border: "2px solid #27272a",
                          background: "rgba(24,24,27,0.4)",
                          color: "#e4e4e7",
                          fontSize: "14px",
                          fontWeight: 500,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.12s ease",
                          lineHeight: 1.6,
                          position: "relative",
                          paddingLeft: "48px",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(24,24,27,0.6)";
                          e.target.style.borderColor = "#3f3f46";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(24,24,27,0.4)";
                          e.target.style.borderColor = "#27272a";
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "2px solid #52525b",
                          }}
                        />
                        {choice.text}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    fontSize: "12px",
                    color: "#86efac",
                  }}
                >
                  💡 Each choice has different consequences. Choose wisely!
                </div>
              </>
            ) : (
              <>
                {/* Outcome Card */}
                <div
                  style={{
                    padding: "24px",
                    borderRadius: "8px",
                    border:
                      "2px solid " +
                      (choice.consequence === "excellent"
                        ? "#22c55e"
                        : choice.consequence === "positive"
                        ? "#60a5fa"
                        : "#f87171"),
                    background:
                      choice.consequence === "excellent"
                        ? "rgba(34, 197, 94, 0.1)"
                        : choice.consequence === "positive"
                        ? "rgba(96, 165, 250, 0.1)"
                        : "rgba(248, 113, 113, 0.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color:
                        choice.consequence === "excellent"
                          ? "#22c55e"
                          : choice.consequence === "positive"
                          ? "#60a5fa"
                          : "#f87171",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "8px",
                    }}
                  >
                    {choice.consequence === "excellent"
                      ? "✓ Excellent Choice"
                      : choice.consequence === "positive"
                      ? "✓ Good Choice"
                      : "✗ Not Ideal"}
                  </div>

                  <p style={{ fontSize: "14px", color: "#e4e4e7", lineHeight: 1.8, marginBottom: "16px" }}>
                    {choice.outcome}
                  </p>

                  <div style={{ paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#52525b",
                        marginBottom: "6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      💡 Lesson Learned
                    </div>
                    <p style={{ fontSize: "13px", color: "#a1a1aa", lineHeight: 1.6 }}>
                      {choice.lesson}
                    </p>
                  </div>
                </div>

                {/* Video Section */}
                {!showVideo && (
                  <button
                    onClick={handleGenerateVideo}
                    disabled={videoLoading}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "8px",
                      border: "2px solid #60a5fa",
                      background: "rgba(96, 165, 250, 0.1)",
                      color: "#60a5fa",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: videoLoading ? "not-allowed" : "pointer",
                      transition: "all 0.12s ease",
                      opacity: videoLoading ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!videoLoading) {
                        e.target.style.background = "rgba(96, 165, 250, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(96, 165, 250, 0.1)";
                    }}
                  >
                    {videoLoading ? "🎬 Generating Video..." : "🎬 Watch Learning Video"}
                  </button>
                )}

                {videoError && (
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: "rgba(248, 113, 113, 0.1)",
                      border: "1px solid rgba(248, 113, 113, 0.3)",
                      fontSize: "12px",
                      color: "#fca5a5",
                    }}
                  >
                    ⚠️ Error generating video: {videoError}
                  </div>
                )}

                {showVideo && videoData && (
                  <div
                    style={{
                      padding: "24px",
                      borderRadius: "8px",
                      border: "1px solid #27272a",
                      background: "rgba(24,24,27,0.4)",
                    }}
                  >
                    <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
                      📹 Learning Video
                    </h3>

                    {/* Script */}
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ fontSize: "11px", color: "#52525b", marginBottom: "6px", textTransform: "uppercase" }}>
                        Script
                      </div>
                      <p style={{ fontSize: "12px", color: "#a1a1aa", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {videoData.video.script}
                      </p>
                    </div>

                    {/* Narration */}
                    <div style={{ marginBottom: "16px", paddingTop: "16px", borderTop: "1px solid #27272a" }}>
                      <div style={{ fontSize: "11px", color: "#52525b", marginBottom: "6px", textTransform: "uppercase" }}>
                        Narration
                      </div>
                      <p style={{ fontSize: "12px", color: "#a1a1aa", lineHeight: 1.6 }}>
                        {videoData.video.narration}
                      </p>
                    </div>

                    {/* Visuals */}
                    <div style={{ paddingTop: "16px", borderTop: "1px solid #27272a" }}>
                      <div style={{ fontSize: "11px", color: "#52525b", marginBottom: "6px", textTransform: "uppercase" }}>
                        Visual Description
                      </div>
                      <p style={{ fontSize: "12px", color: "#a1a1aa", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {videoData.video.visualDescription}
                      </p>
                    </div>
                  </div>
                )}

                {/* Next Button */}
                <button
                  onClick={handleNextScenario}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#fff",
                    color: "#09090b",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#e4e4e7")}
                  onMouseLeave={(e) => (e.target.style.background = "#fff")}
                >
                  {currentScenarioId === SCENARIOS.length ? "Complete & Review" : "Next Scenario →"}
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Progress Bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "#0a0a0f",
          borderTop: "1px solid #111",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(completedScenarios.length / SCENARIOS.length) * 100}%`,
            background: "#22c55e",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}