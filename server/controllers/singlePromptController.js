import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemma-3n-e4b-it",
  generationConfig: {
    maxOutputTokens: 2000,
    temperature: 0.7,
  },
});

export const respondToSinglePrompt = async (req, res) => {
  const { addon } = req.body; // addon = disease name

  if (!addon) {
    return res.status(400).json({ error: "Disease name is required" });
  }

  // Existing fixed prompt
  const basePrompt = `
You are Dr. AI, a trusted ophthalmology assistant. Given an eye disease name, provide a concise and helpful response with the following structure:
0. Use professional doctor like tone. Dont use "Okay, here's the response to your answer" or similar phrases.
1. Briefly describe the disease in 1–2 sentences.
2. Suggest what the user should do next (like visiting a specialist, using eye drops, lifestyle tips, etc.).
3. Suggest commonly used over-the-counter medications.
4. Provide eye care tips relevant to the condition.
5. Alway give visually appealing response with markdown formatting.
Disease: ${addon}
`;

  try {
    const result = await model.generateContent(basePrompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ text });
  } catch (error) {
    console.error("Error generating disease response:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
