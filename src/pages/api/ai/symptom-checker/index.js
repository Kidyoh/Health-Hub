import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');

  // Ensure the user is authenticated
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { prompt, chatSessionId } = req.body;  // userId is now retrieved from session
    const API_KEY = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);

    // Initialize markdown renderer for AI output
    const md = new MarkdownIt();

    // AI safety settings
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    try {
      // Send prompt to AI
      const contents = [{ role: 'user', parts: [{ text: prompt }] }];
      const result = await model.generateContentStream({ contents });

      let buffer = [];
      for await (let response of result.stream) {
        buffer.push(response.text());
      }
      const markdownOutput = md.render(buffer.join(''));

      // Step 1: Check if the session exists, otherwise create a new session
      let sessionId = chatSessionId;
      if (!sessionId) {
        const newSession = await prisma.chatSession.create({
          data: {
            userId: session.id,  // Use user ID from the session
            sessionName: `Session on ${new Date().toLocaleString()}`, // Optionally give it a name
          },
        });
        sessionId = newSession.id;
      }

      // Step 2: Save the AI diagnosis to the Diagnosis table, linked to the session
      const newDiagnosis = await prisma.diagnosis.create({
        data: {
          chatSessionId: sessionId,  // Link the diagnosis to the session
          userId: session.id,        // Use user ID from the session
          diagnosisText: markdownOutput,  // The diagnosis (AI response)
        },
      });

      // Step 3: Send the response and saved diagnosis back to the client
      res.status(200).json({
        response: markdownOutput,
        savedDiagnosis: {
          id: newDiagnosis.id,
          chatSessionId: sessionId,
          diagnosisText: newDiagnosis.diagnosisText,
        },
      });
    } catch (error) {
      console.error('Error generating response or saving diagnosis:', error);
      res.status(500).json({ error: 'Error generating response or saving diagnosis' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
