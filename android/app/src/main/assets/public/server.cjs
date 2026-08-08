var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured");
    }
    return new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "study-suite-app"
        }
      }
    });
  };
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Study Suite API" });
  });
  const cleanMathTextServer = (text) => {
    if (!text) return "";
    let cleaned = String(text);
    cleaned = cleaned.replace(/\$\$(.*?)\$\$/g, "$1");
    cleaned = cleaned.replace(/\$(.*?)\$/g, "$1");
    cleaned = cleaned.replace(/\\sqrt\{([^}]+)\}/g, "\u221A($1)").replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)").replace(/\\cdot/g, "\xB7").replace(/\\times/g, "\xD7").replace(/\\pi/g, "\u03C0").replace(/\\theta/g, "\u03B8").replace(/\\infty/g, "\u221E").replace(/\\leq/g, "\u2264").replace(/\\geq/g, "\u2265").replace(/\\neq/g, "\u2260").replace(/\\pm/g, "\xB1").replace(/\\int/g, "\u222B").replace(/\\lim/g, "lim").replace(/\\to/g, "\u2192").replace(/\^2\b/g, "\xB2").replace(/\^3\b/g, "\xB3").replace(/\$/g, "");
    return cleaned.trim();
  };
  app.post("/api/generate-options", async (req, res) => {
    try {
      const { rawQuestion, topic, imageBase64, imageMime } = req.body;
      if (!rawQuestion && !imageBase64) {
        res.status(400).json({ error: "Either rawQuestion text or imageBase64 image is required" });
        return;
      }
      const contents = [];
      if (imageBase64 && typeof imageBase64 === "string") {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contents.push({
          inlineData: {
            mimeType: imageMime || "image/jpeg",
            data: cleanBase64
          }
        });
      }
      const promptText = `Analyze the study question from the provided image and/or text.

CRITICAL MANDATE FOR QUESTION PRESERVATION:
- If user text input is provided ("${rawQuestion}"), you MUST solve that EXACT problem. DO NOT alter, rewrite, or replace the equation or numbers given by the user (for example, if the user asks "y = 8, find the root" or "find root of y = 8", solve for y = 8, DO NOT change it to y\xB3 = 8 or any other equation).
- Set 'q' to a clear, verbatim formulation of the user's exact problem statement.
- Generate four high-quality options (A, B, C, D) where ONE is mathematically correct for THAT EXACT problem and three are plausible distractors.
- Provide a key formula pattern, a short conceptual hint, and a step-by-step solution breakdown for THAT EXACT problem.

STRICT FORMATTING MANDATE:
Do NOT wrap math expressions, equations, or variables in LaTeX dollar signs (e.g. NEVER output $y$, $$y^3 = 8$$, or $y = 2$). Write clean readable plain math text with standard Unicode math symbols (e.g. y = 8, \u221A2, \u222B, \u03C0, d/dx).

Text Input / Notes:
${rawQuestion || "Read question directly from the snapped image."}

Topic / Context: ${topic || "Calculus & General STEM"}`;
      contents.push(promptText);
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              q: { type: import_genai.Type.STRING, description: "Clean formatted question text extracted from photo or text" },
              options: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING },
                description: "Array of exactly 4 plausible multiple choice options"
              },
              answer: { type: import_genai.Type.INTEGER, description: "0-based index of the correct option in options array (0 to 3)" },
              pattern: { type: import_genai.Type.STRING, description: "Key formula identity or rule pattern (e.g. Identity: d/dx[sin x] = cos x)" },
              hint: { type: import_genai.Type.STRING, description: "Short conceptual hint for Q&A mode" },
              steps: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    title: { type: import_genai.Type.STRING, description: "Step title e.g. Step 1: Identify rule" },
                    body: { type: import_genai.Type.STRING, description: "Step mathematical explanation" }
                  },
                  required: ["title", "body"]
                },
                description: "Step-by-step solution breakdown"
              }
            },
            required: ["q", "options", "answer", "pattern", "hint", "steps"]
          }
        }
      });
      const jsonText = response.text || "{}";
      const parsed = JSON.parse(jsonText);
      if (parsed.q) parsed.q = cleanMathTextServer(parsed.q);
      if (Array.isArray(parsed.options)) parsed.options = parsed.options.map((o) => cleanMathTextServer(o));
      if (parsed.hint) parsed.hint = cleanMathTextServer(parsed.hint);
      if (parsed.pattern) parsed.pattern = cleanMathTextServer(parsed.pattern);
      if (Array.isArray(parsed.steps)) {
        parsed.steps = parsed.steps.map((st) => ({
          title: cleanMathTextServer(st.title),
          body: cleanMathTextServer(st.body)
        }));
      }
      res.json({ success: true, question: parsed });
    } catch (err) {
      console.error("Error generating options via Gemini:", err);
      res.status(500).json({
        error: err.message || "Failed to process question via AI",
        fallbackApplied: true
      });
    }
  });
  app.post("/api/ai-explain", async (req, res) => {
    try {
      const { questionText, selectedOptionText, correctOptionText, steps } = req.body;
      const ai = getGeminiClient();
      const prompt = `You are a world-class Calculus Professor and STEM Tutor. Provide a friendly, crystal-clear, encouraging explanation for the following study problem. Explain why the correct answer is "${correctOptionText}" and why "${selectedOptionText}" might be a common misconception or trap.

Question: ${questionText}
Correct Answer: ${correctOptionText}
User Selected: ${selectedOptionText || "N/A"}
Step Solution Provided: ${JSON.stringify(steps || [])}

Keep your answer concise (under 250 words), encouraging, and visually clear using markdown formatting.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });
      res.json({ success: true, explanation: response.text });
    } catch (err) {
      console.error("Error getting AI explanation:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI explanation" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Study Suite server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
