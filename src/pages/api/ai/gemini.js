// import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
// import MarkdownIt from 'markdown-it';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { prompt } = req.body;
//     const API_KEY = process.env.GEMINI_API_KEY;
//     const genAI = new GoogleGenerativeAI(API_KEY);

//     const model = genAI.getGenerativeModel({
//       model: "gemini-pro-vision",
//       safetySettings: [
//         {
//           category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//           threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
//         },
//       ],
//     });

//     try {
//       const contents = [
//         {
//           role: 'user',
//           parts: [
//             { text: prompt }
//           ]
//         }
//       ];
//       const result = await model.generateContentStream({ contents });
//       let buffer = [];
//       let md = new MarkdownIt();
//       for await (let response of result.stream) {
//         buffer.push(response.text());
//       }
//       const markdownOutput = md.render(buffer.join(''));
//       res.status(200).json({ response: markdownOutput });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error generating response' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }