import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI SDK server-side
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'study-suite-app'
        }
      }
    });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Study Suite API' });
  });

  // Helper to sanitize math text (remove LaTeX dollar signs like $y$, $$x^2$$)
  const cleanMathTextServer = (text?: string): string => {
    if (!text) return '';
    let cleaned = String(text);
    cleaned = cleaned.replace(/\$\$(.*?)\$\$/g, '$1');
    cleaned = cleaned.replace(/\$(.*?)\$/g, '$1');
    cleaned = cleaned
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
      .replace(/\\cdot/g, '·')
      .replace(/\\times/g, '×')
      .replace(/\\pi/g, 'π')
      .replace(/\\theta/g, 'θ')
      .replace(/\\infty/g, '∞')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\pm/g, '±')
      .replace(/\\int/g, '∫')
      .replace(/\\lim/g, 'lim')
      .replace(/\\to/g, '→')
      .replace(/\^2\b/g, '²')
      .replace(/\^3\b/g, '³')
      .replace(/\$/g, '');
    return cleaned.trim();
  };

  // AI Option Fixer & Image Snap Question Parser Endpoint
  app.post('/api/generate-options', async (req, res) => {
    try {
      const { rawQuestion, topic, imageBase64, imageMime } = req.body;
      if (!rawQuestion && !imageBase64) {
        res.status(400).json({ error: 'Either rawQuestion text or imageBase64 image is required' });
        return;
      }

      const contents: any[] = [];

      if (imageBase64 && typeof imageBase64 === 'string') {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents.push({
          inlineData: {
            mimeType: imageMime || 'image/jpeg',
            data: cleanBase64
          }
        });
      }

      const promptText = `Analyze the study question from the provided image and/or text.

CRITICAL MANDATE FOR QUESTION PRESERVATION:
- If user text input is provided ("${rawQuestion}"), you MUST solve that EXACT problem. DO NOT alter, rewrite, or replace the equation or numbers given by the user (for example, if the user asks "y = 8, find the root" or "find root of y = 8", solve for y = 8, DO NOT change it to y³ = 8 or any other equation).
- Set 'q' to a clear, verbatim formulation of the user's exact problem statement.
- Generate four high-quality options (A, B, C, D) where ONE is mathematically correct for THAT EXACT problem and three are plausible distractors.
- Provide a key formula pattern, a short conceptual hint, and a step-by-step solution breakdown for THAT EXACT problem.

STRICT FORMATTING MANDATE:
Do NOT wrap math expressions, equations, or variables in LaTeX dollar signs (e.g. NEVER output $y$, $$y^3 = 8$$, or $y = 2$). Write clean readable plain math text with standard Unicode math symbols (e.g. y = 8, √2, ∫, π, d/dx).

Text Input / Notes:
${rawQuestion || 'Read question directly from the snapped image.'}

Topic / Context: ${topic || 'Calculus & General STEM'}`;

      contents.push(promptText);

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              q: { type: Type.STRING, description: 'Clean formatted question text extracted from photo or text' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array of exactly 4 plausible multiple choice options'
              },
              answer: { type: Type.INTEGER, description: '0-based index of the correct option in options array (0 to 3)' },
              pattern: { type: Type.STRING, description: 'Key formula identity or rule pattern (e.g. Identity: d/dx[sin x] = cos x)' },
              hint: { type: Type.STRING, description: 'Short conceptual hint for Q&A mode' },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Step title e.g. Step 1: Identify rule' },
                    body: { type: Type.STRING, description: 'Step mathematical explanation' }
                  },
                  required: ['title', 'body']
                },
                description: 'Step-by-step solution breakdown'
              }
            },
            required: ['q', 'options', 'answer', 'pattern', 'hint', 'steps']
          }
        }
      });

      const jsonText = response.text || '{}';
      const parsed = JSON.parse(jsonText);

      // Clean LaTeX dollar signs from all fields
      if (parsed.q) parsed.q = cleanMathTextServer(parsed.q);
      if (Array.isArray(parsed.options)) parsed.options = parsed.options.map((o: string) => cleanMathTextServer(o));
      if (parsed.hint) parsed.hint = cleanMathTextServer(parsed.hint);
      if (parsed.pattern) parsed.pattern = cleanMathTextServer(parsed.pattern);
      if (Array.isArray(parsed.steps)) {
        parsed.steps = parsed.steps.map((st: any) => ({
          title: cleanMathTextServer(st.title),
          body: cleanMathTextServer(st.body)
        }));
      }

      res.json({ success: true, question: parsed });
    } catch (err: any) {
      console.error('Error generating options via Gemini:', err);
      res.status(500).json({
        error: err.message || 'Failed to process question via AI',
        fallbackApplied: true
      });
    }
  });

  // AI Tutor / Deep Explanation Endpoint
  app.post('/api/ai-explain', async (req, res) => {
    try {
      const { questionText, selectedOptionText, correctOptionText, steps } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are a world-class Calculus Professor and STEM Tutor. Provide a friendly, crystal-clear, encouraging explanation for the following study problem. Explain why the correct answer is "${correctOptionText}" and why "${selectedOptionText}" might be a common misconception or trap.

Question: ${questionText}
Correct Answer: ${correctOptionText}
User Selected: ${selectedOptionText || 'N/A'}
Step Solution Provided: ${JSON.stringify(steps || [])}

Keep your answer concise (under 250 words), encouraging, and visually clear using markdown formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      res.json({ success: true, explanation: response.text });
    } catch (err: any) {
      console.error('Error getting AI explanation:', err);
      res.status(500).json({ error: err.message || 'Failed to generate AI explanation' });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Study Suite server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
