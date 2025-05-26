import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initialize models
const chatModel = genAI.getGenerativeModel({ 
  model: "gemma-3n-e4b-it",
  generationConfig: {
    maxOutputTokens: 8000,
    temperature: 0.5,
  }
});

const visionModel = genAI.getGenerativeModel({ 
  model: "gemma-3-12b-it",
  generationConfig: {
    maxOutputTokens: 5000,
    temperature: 0.2,
  }
});

// Session storage for ongoing chats
const chatSessions = new Map();

export const startNewChatSession = (userId) => {
  const chat = chatModel.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: `You are Dr. AI, an ophthalmology specialist assistant. Strict rules:
1. Only answer questions about eyes, vision, or ophthalmology
2. For non-eye questions, respond: "I specialize in eye health only. Please ask about vision or eye-related concerns."
3. For eye-related issues:
   - Ask about symptoms and duration
   - Request an eye photo at the end for better analysis. just add this to your response [REQUEST_PHOTO] when asking for a photo.
   - Provide professional but friendly advice
   - Ask for permission before showing nearby specialists.just add this to your response [REQUEST_DOCTORS] when asking for doctors.
4. Always include at near ending of the coversation : "Remember, this isn't a substitute for professional medical care."
5.you can give medicine names, but only if they are commonly used and safe for general advice.`}],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I will follow all guidelines as Dr. AI, specializing exclusively in ophthalmology and eye health concerns." }],
      }
    ],
  });
  
  chatSessions.set(userId, chat);
  return chat;
};

export const clearChatSession = (userId) => {
  if (chatSessions.has(userId)) {
    chatSessions.delete(userId);
    return true;
  }
  return false;
};

export const queryChatModel = async (userId, message, chatHistory = []) => {
  try {
    let chat = chatSessions.get(userId);
    if (!chat) {
      chat = startNewChatSession(userId);
    }

    // Convert chat history to Gemini format
    const history = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Start new chat with updated history if needed
    if (history.length > 0) {
      chat = chatModel.startChat({
        history: [
          ...chat._history, // Include initial system messages
          ...history
        ],
      });
      chatSessions.set(userId, chat);
    }

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const aiResponse = response.text();

    return {
      text: aiResponse,
      requiresPhoto: aiResponse.includes('[REQUEST_PHOTO]'),
      requestsDoctors: aiResponse.includes('[REQUEST_DOCTORS]')
    };
  } catch (error) {
    console.error('Error querying chat model:', error);
    
    if (error.message.includes('maximum context length')) {
      clearChatSession(userId);
      return {
        text: "Our conversation has reached its limit. I've cleared the chat history. Please continue with your questions.",
        requiresPhoto: false,
        requestsDoctors: false
      };
    }
    
    return {
      text: "I'm experiencing technical difficulties. Please try again later.",
      requiresPhoto: false,
      requestsDoctors: false
    };
  }
};

export const analyzeImageWithAI = async (userId, imageBase64, question = '') => {
  try {
    if (!imageBase64) {
      throw new Error('Image data is required');
    }

    // Remove the data URL prefix if present
    const base64Data = imageBase64.startsWith('data:image') 
      ? imageBase64.split(',')[1] 
      : imageBase64;

    const imageParts = [{
      inlineData: {
        data: base64Data,
        mimeType: getMimeType(imageBase64) // Helper function to detect mime type
      }
    }];

    const prompt = `You are an ophthalmology image analysis specialist. Analyze this eye image and:
1. Describe any visible conditions (if clearly identifiable)
2. Rate your confidence in the observations (low/medium/high)
3. Suggest possible specialist referrals if needed
4. If the image isn't clearly an eye, request a better image

${question || "Please analyze this eye image"}

Respond in this structured format:
**Observations**: [your observations]
**Confidence**: [confidence level]
**Recommendations**: [any recommendations]`;

    const result = await visionModel.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const analysis = response.text();

    // Get patient-friendly explanation from the chat model
    const explanationResponse = await queryChatModel(
      userId,
      `Specialist analysis:\n${analysis}\n\nExplain this to the patient simply with next steps:`
    );

    return {
      analysis,
      explanation: explanationResponse.text,
      requestsDoctors: analysis.toLowerCase().includes('recommend') || 
                      analysis.toLowerCase().includes('see a')
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      analysis: "Technical error during image analysis.",
      explanation: "Sorry, we encountered an error analyzing your image. Please try again or consult an eye doctor.",
      requestsDoctors: false
    };
  }
};

// Helper function to detect mime type from data URL
function getMimeType(base64String) {
  const mimeMatch = base64String.match(/^data:(.+?);base64/);
  return mimeMatch ? mimeMatch[1] : 'image/jpeg'; // default to jpeg
}