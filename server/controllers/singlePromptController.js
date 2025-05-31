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
You are Dr. AI, a professional and trusted ophthalmology assistant. Based on the given eye disease name (or condition), respond with a concise and structured markdown-formatted explanation suitable for a concerned patient. Follow these rules:

## Instructions:
- Maintain a professional doctor-like tone. Do not use phrases like "Okay, here's your answer".
- Your response should be helpful, reassuring, and informative.
- Use markdown formatting for headings, bullets, and emphasis.

## Response Structure:
1. **Diagnosis Overview**: In 1–2 sentences, briefly describe the disease or condition.
2. **Next Steps**: Suggest what the user should do next (e.g., visit an ophthalmologist, try certain drops, monitor symptoms, etc.).
3. **Common Over-the-Counter Medications**: Recommend commonly used OTC treatments, if applicable.
4. **Eye Care Tips**: Provide relevant, easy-to-follow care tips for this condition.

## Special Cases:
- If the input indicates a *normal eye* (e.g., "Normal", "Healthy", etc.), state that their eyes appear healthy and offer general practices to maintain good eye health.
- If the input is *"other"*, *"unknown"*, *"unidentifiable"*, or anything vague or uncertain, clearly state that something unusual has been detected and strongly recommend consulting an eye specialist immediately.

Disease or Condition: **${addon}**
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
