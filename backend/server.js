import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// SCENARIO LIBRARY
// ============================================
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

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate a video script using Gemini
 * This creates a detailed script for the scenario
 */
async function generateVideoScript(scenario, choiceId) {
  const choice = scenario.choices.find((c) => c.id === choiceId);

  const prompt = `
You are a scriptwriter for an educational game about tenant rights. Create a short, engaging video script (30-60 seconds) for the following tenant scenario.

Scenario: ${scenario.situation}

Character: Alex, a young tenant navigating housing challenges
Mood: ${scenario.mood}

The player chose: "${choice.text}"

Outcome: ${choice.outcome}

Lesson: ${choice.lesson}

Create a script with:
1. **OPENING (5 sec)** - Set the scene, introduce Alex's emotional state
2. **SITUATION (10 sec)** - Show the problem/decision point
3. **CHOICE (5 sec)** - Show Alex making the choice
4. **CONSEQUENCE (15 sec)** - Show what happens as a result
5. **LESSON (15 sec)** - Key takeaway about tenant rights or smart decision-making

Format as:
[SCENE]
[NARRATION/DIALOGUE]
[ACTION]

Make it conversational, relatable, and educational. Use simple language. Include tenant rights information naturally.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const script = result.response.text();
    return script;
  } catch (error) {
    console.error("Error generating script:", error);
    throw new Error("Failed to generate video script");
  }
}

/**
 * Generate visual description for animation
 * This helps create AI-generated visuals or guides animators
 */
async function generateVisualDescription(scenario, choiceId) {
  const choice = scenario.choices.find((c) => c.id === choiceId);

  const prompt = `
You are a visual director for an educational animated video. Describe the visual elements needed for this tenant scenario.

Scenario: ${scenario.situation}
Character: Alex (cartoon character, young tenant)
Mood: ${scenario.mood}
Choice: ${choice.text}

Create a detailed visual breakdown with:
1. **CHARACTER STATE** - How Alex looks/moves (happy, stressed, confused, etc.)
2. **SETTING** - Where the scene takes place (apartment, landlord's office, phone screen, etc.)
3. **KEY VISUALS** - Objects/elements to show (lease document, budget spreadsheet, calendar, etc.)
4. **COLOR PALETTE** - Emotional tone (warm/cool, bright/dim, etc.)
5. **TRANSITIONS** - How to move between scenes visually

Make it specific enough for an animator or AI video generator to create from.
Format as a structured visual storyboard.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const visualDesc = result.response.text();
    return visualDesc;
  } catch (error) {
    console.error("Error generating visual description:", error);
    throw new Error("Failed to generate visual description");
  }
}

/**
 * Generate audio narration text
 * This can be used with text-to-speech APIs like Google Cloud TTS
 */
async function generateNarration(scenario, choiceId) {
  const choice = scenario.choices.find((c) => c.id === choiceId);

  const prompt = `
You are a narrator for an educational video game about tenant rights. Create a clear, friendly narration script for this scenario.

Scenario: ${scenario.situation}
The player chose: "${choice.text}"
Outcome: ${choice.outcome}
Lesson: ${choice.lesson}

Write 2-3 sentences of narration that:
1. Acknowledges the choice they made
2. Explains what happens as a result
3. Delivers the key lesson in simple, relatable language

Format as a single paragraph of natural, conversational speech.
Use "you" to address the player directly.
Keep it under 60 seconds of spoken time.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const narration = result.response.text();
    return narration;
  } catch (error) {
    console.error("Error generating narration:", error);
    throw new Error("Failed to generate narration");
  }
}

/**
 * Generate a scene intro (no choice required) — shown on page load
 */
async function generateSceneIntro(scenario) {
  const prompt = `
You are a narrator for an educational video game about tenant rights.
Describe the opening scene for this scenario in a way that immerses the player.

Scenario title: ${scenario.title}
Chapter: ${scenario.chapter}
Situation: ${scenario.situation}
Character mood: ${scenario.mood}

Produce THREE short sections:

**NARRATION** (2-3 sentences): Set the emotional scene. Speak directly to the player as "you". Conversational and empathetic.

**SCRIPT** (3-5 lines of dialogue/action): Show how the situation unfolds. Include character actions and brief dialogue if appropriate.

**VISUAL DIRECTION** (2-3 sentences): Describe the visual setting — colours, camera angle, props, lighting — so an animator can render it.

Keep the total under 150 words. Do not reveal the choices yet.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ============================================
// API ROUTES
// ============================================

/**
 * GET /api/scenarios
 * Get all scenarios or a specific scenario
 */
app.get("/api/scenarios", (req, res) => {
  const { id } = req.query;

  if (id) {
    const scenario = SCENARIOS.find((s) => s.id === parseInt(id));
    if (!scenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }
    return res.json(scenario);
  }

  res.json(SCENARIOS);
});

/**
 * GET /api/scenarios/:id
 * Get a specific scenario by ID
 */
app.get("/api/scenarios/:id", (req, res) => {
  const scenario = SCENARIOS.find((s) => s.id === parseInt(req.params.id));

  if (!scenario) {
    return res.status(404).json({ error: "Scenario not found" });
  }

  res.json(scenario);
});

/**
 * POST /api/video/scene
 * Generate scene intro for a scenario (no choice needed — called on page load)
 * Body: { scenarioId: number }
 */
app.post("/api/video/scene", async (req, res) => {
  try {
    const { scenarioId } = req.body;
    if (!scenarioId) {
      return res.status(400).json({ error: "scenarioId is required" });
    }
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }
    const sceneContent = await generateSceneIntro(scenario);
    res.json({ scenarioId, sceneContent, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/video/script
 * Generate video script for a scenario choice
 * Body: { scenarioId: number, choiceId: number }
 */
app.post("/api/video/script", async (req, res) => {
  try {
    const { scenarioId, choiceId } = req.body;

    if (!scenarioId || !choiceId) {
      return res
        .status(400)
        .json({ error: "scenarioId and choiceId are required" });
    }

    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    const script = await generateVideoScript(scenario, choiceId);

    res.json({
      scenarioId,
      choiceId,
      script,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/video/visuals
 * Generate visual description for a scenario choice
 * Body: { scenarioId: number, choiceId: number }
 */
app.post("/api/video/visuals", async (req, res) => {
  try {
    const { scenarioId, choiceId } = req.body;

    if (!scenarioId || !choiceId) {
      return res
        .status(400)
        .json({ error: "scenarioId and choiceId are required" });
    }

    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    const visualDescription = await generateVisualDescription(
      scenario,
      choiceId
    );

    res.json({
      scenarioId,
      choiceId,
      visualDescription,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/video/narration
 * Generate narration for a scenario choice
 * Body: { scenarioId: number, choiceId: number }
 */
app.post("/api/video/narration", async (req, res) => {
  try {
    const { scenarioId, choiceId } = req.body;

    if (!scenarioId || !choiceId) {
      return res
        .status(400)
        .json({ error: "scenarioId and choiceId are required" });
    }

    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    const narration = await generateNarration(scenario, choiceId);

    res.json({
      scenarioId,
      choiceId,
      narration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/video/full
 * Generate complete video content (script + visuals + narration)
 * Body: { scenarioId: number, choiceId: number }
 */
app.post("/api/video/full", async (req, res) => {
  try {
    const { scenarioId, choiceId } = req.body;

    if (!scenarioId || !choiceId) {
      return res
        .status(400)
        .json({ error: "scenarioId and choiceId are required" });
    }

    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    // Generate all components in parallel
    const [script, visualDescription, narration] = await Promise.all([
      generateVideoScript(scenario, choiceId),
      generateVisualDescription(scenario, choiceId),
      generateNarration(scenario, choiceId),
    ]);

    res.json({
      scenarioId,
      choiceId,
      scenario: {
        title: scenario.title,
        situation: scenario.situation,
      },
      video: {
        script,
        visualDescription,
        narration,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TenantTales Video Generation API is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ TenantTales API running on http://localhost:${PORT}`);
  console.log(`📡 Video generation endpoints ready`);
  console.log(`🎬 POST /api/video/script - Generate video script`);
  console.log(`🎨 POST /api/video/visuals - Generate visual description`);
  console.log(`🎙️  POST /api/video/narration - Generate narration`);
  console.log(`🎥 POST /api/video/full - Generate complete video content`);
});

export default app;