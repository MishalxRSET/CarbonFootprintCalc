import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are a helpful climate action and decarbonization assistant for the CarbonZero platform. 
You answer user questions about reducing their carbon footprint, finding solutions, and navigating the platform.
Be concise, practical, and knowledgeable about IPCC standards, biospheric sinks, and sustainable practices.`;

    const formattedHistory = (messages || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({
      message: message
    });

    res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
}
