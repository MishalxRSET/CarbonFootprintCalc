import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
// Requires GEMINI_API_KEY to be set in environment
const ai = new GoogleGenAI({});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are a helpful climate action and decarbonization assistant for the CarbonZero platform. 
You answer user questions about reducing their carbon footprint, finding solutions, and navigating the platform.
Be concise, practical, and knowledgeable about IPCC standards, biospheric sinks, and sustainable practices.`;

    const formattedHistory = (messages || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Choose model based on complexity (here we just use flash as a default, or gemini-3.5-flash as instructed)
    const model = 'gemini-3.5-flash';

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({
      message: message
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Static legal pages (public/privacy.html, public/terms.html) at clean URLs; mirrors vercel.json
const LEGAL_PAGES: Record<string, string> = { '/privacy': '/privacy.html', '/terms': '/terms.html' };
app.use((req, _res, next) => {
  const page = LEGAL_PAGES[req.path];
  if (page) req.url = page;
  next();
});

async function startServer() {
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
