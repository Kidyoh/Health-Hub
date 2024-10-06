import { PrismaClient } from '@prisma/client';  // Prisma to interact with the database
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, userId } = req.body;  // Ensure to pass userId
    const API_KEY = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);

    // Set up the AI model with safety features
    const model = genAI.getGenerativeModel({
      model: "gemini-pro-vision",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    try {
      // Prepare the prompt and generate response
      const contents = [
        {
          role: 'user',
          parts: [
            { text: prompt }  // User input (symptoms)
          ]
        }
      ];
      const result = await model.generateContentStream({ contents });

      let buffer = [];
      let md = new MarkdownIt();

      // Stream and store AI response
      for await (let response of result.stream) {
        buffer.push(response.text());
      }

      // Render response in markdown format
      const markdownOutput = md.render(buffer.join(''));

      // Save diagnosis to the database after receiving the AI's response
      const newDiagnosis = await prisma.diagnosis.create({
        data: {
          userId,  // The ID of the user who requested the diagnosis
          diagnosisText: markdownOutput,  // Save the AI-generated response (diagnosis)
        },
      });

      // Send the response and saved diagnosis to the client
      res.status(200).json({ response: markdownOutput, savedDiagnosis: newDiagnosis });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error generating response or saving diagnosis' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
