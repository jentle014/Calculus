import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

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
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Study Suite API' });
  });

  // AI Option Fixer & Question Parser Endpoint
  app.post('/api/generate-options', async (req, res) => {
    try {
      const { rawQuestion, topic } = req.body;
      if (!rawQuestion || typeof rawQuestion !== 'string') {
        res.status(400).json({ error: 'rawQuestion parameter is required' });
        return;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analyze the following study question. If it lacks 4 distinct multiple choice options (A, B, C, D) or solution steps, generate four high-quality plausible multiple choice options (where exactly one is mathematically correct and three are plausible distractors). Also extract or generate a formula pattern float, a hint, and a step-by-step solution breakdown.

Question Input:
${rawQuestion}

Topic / Context: ${topic || 'Calculus & General STEM'}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              q: { type: Type.STRING, description: 'Clean formatted question text' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array of exactly 4 plausible multiple choice options'
              },
              answer: { type: Type.INTEGER, description: '0-based index of the correct option in options array (0 to 3)' },
              pattern: { type: Type.STRING, description: 'Key formula identity or rule pattern (e.g. Identity: sin²x + cos²x = 1)' },
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
