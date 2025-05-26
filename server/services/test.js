





// import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();

// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// export const queryChatModel = async (message, chatHistory = []) => {
//   try {
//     const messages = [
//       {
//         role: "system",
//         content: `You are Dr. AI, an ophthalmology specialist assistant. Strict rules:
// 1. Only answer questions about eyes, vision, or ophthalmology
// 2. For non-eye questions, respond: "I specialize in eye health only. Please ask about vision or eye-related concerns."
// 3. For eye-related issues:
//    - Ask about symptoms and duration
//    - Request an eye photo when needed with [REQUEST_PHOTO]
//    - Provide professional but friendly advice
//    - Recommend specialists with [DOCTORS_NEARBY] when appropriate
// 4. Always include: "Remember, this isn't a substitute for professional medical care."`
//       },
//       ...chatHistory.map(msg => ({
//         role: msg.sender === 'user' ? 'user' : 'assistant',
//         content: msg.text
//       })),
//       {
//         role: "user",
//         content: message
//       }
//     ];

//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "meta-llama/llama-3.3-8b-instruct:free",
//         messages
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//           "HTTP-Referer": process.env.APP_URL,
//           "X-Title": "Medical Chatbot",
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const aiResponse = response.data.choices?.[0]?.message?.content || 
//       "I couldn't process that request. Please try again.";

//     return {
//       text: aiResponse,
//       requiresPhoto: aiResponse.includes('[REQUEST_PHOTO]'),
//       requiresDoctors: aiResponse.includes('[DOCTORS_NEARBY]')
//     };
//   } catch (error) {
//     console.error('Error querying chat model:', error);
//     return {
//       text: "I'm experiencing technical difficulties. Please try again later.",
//       requiresPhoto: false,
//       requiresDoctors: false
//     };
//   }
// };

// export const analyzeImageWithAI = async (imageBase64, question = '') => {
//   try {
//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "meta-llama/llama-4-maverick:free",
//         messages: [
//           {
//             role: "system",
//             content: "You are an ophthalmology image analysis specialist. Strictly analyze only eye images. Provide:\n" +
//                     "1. Observed conditions (if clearly visible)\n" + 
//                     "2. Confidence levels\n" +
//                     "3. Recommended specialist types\n" +
//                     "If image isn't clearly an eye, state: 'Please upload a clear photo of the eye'"
//           },
//           {
//             role: "user",
//             content: [
//               {
//                 type: "text",
//                 text: question || "Please analyze this eye image"
//               },
//               {
//                 type: "image_url",
//                 image_url: {
//                   url: imageBase64
//                 }
//               }
//             ]
//           }
//         ]
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//           "HTTP-Referer": process.env.APP_URL,
//           "X-Title": "Medical Chatbot",
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const analysis = response.data.choices?.[0]?.message?.content || 
//       "Unable to analyze the image properly.";

//     // Get patient-friendly explanation
//     const explanation = await queryChatModel(
//       `Specialist analysis:\n${analysis}\n\nExplain this to the patient simply with next steps:`
//     );

//     return {
//       analysis,
//       explanation: explanation.text,
//       requiresDoctors: analysis.toLowerCase().includes('recommend') || 
//                       analysis.toLowerCase().includes('see a')
//     };
//   } catch (error) {
//     console.error('Error analyzing image:', error);
//     return {
//       analysis: "Technical error during image analysis.",
//       explanation: "Sorry, we encountered an error analyzing your image. Please try again or consult an eye doctor.",
//       requiresDoctors: false
//     };
//   }
// };


// import dotenv from 'dotenv';
// dotenv.config();

// import { Mistral } from '@mistralai/mistralai';

// // Initialize the Mistral client
// const mistralClient = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// /**
//  * Handles text-based chat interaction using open-mistral-nemo
//  */
// export const queryChatModel = async (message, chatHistory = []) => {
//   try {
//     const messages = [
//       {
//         role: "system",
//         content: `You are Dr. AI, an ophthalmology specialist assistant. Strict rules:
// 1. Only answer questions about eyes, vision, or ophthalmology
// 2. For non-eye questions, respond: "I specialize in eye health only. Please ask about vision or eye-related concerns."
// 3. For eye-related issues:
//    - Ask about symptoms and duration
//    - Request an eye photo when needed with [REQUEST_PHOTO]
//    - Provide professional but friendly advice
//    - Recommend specialists with [DOCTORS_NEARBY] when appropriate
// 4. Always include: "Remember, this isn't a substitute for professional medical care."`
//       },
//       ...chatHistory.map(msg => ({
//         role: msg.sender === 'user' ? 'user' : 'assistant',
//         content: msg.text
//       })),
//       {
//         role: "user",
//         content: message
//       }
//     ];

//     const response = await mistralClient.chat.complete({
//       model: 'devstral-small-2505',
//       messages
//     });

//     const aiResponse = response.choices?.[0]?.message?.content || 
//       "I couldn't process that request. Please try again.";

//     return {
//       text: aiResponse,
//       requiresPhoto: aiResponse.includes('[REQUEST_PHOTO]'),
//       requiresDoctors: aiResponse.includes('[DOCTORS_NEARBY]')
//     };
//   } catch (error) {
//     console.error('Error querying chat model:', error);
//     return {
//       text: "I'm experiencing technical difficulties. Please try again later.",
//       requiresPhoto: false,
//       requiresDoctors: false
//     };
//   }
// };

// /**
//  * Handles image analysis using pixtral-12b-2409
//  */
// export const analyzeImageWithAI = async (imageBase64, question = '') => {
//   try {
//     const response = await mistralClient.chat.complete({
//       model: 'pixtral-12b-2409',
//       messages: [
//         {
//           role: "system",
//           content: "You are an ophthalmology image analysis specialist. Strictly analyze only eye images. Provide:\n" +
//                    "1. Observed conditions (if clearly visible)\n" + 
//                    "2. Confidence levels\n" +
//                    "3. Recommended specialist types\n" +
//                    "If image isn't clearly an eye, state: 'Please upload a clear photo of the eye'"
//         },
//         {
//           role: "user",
//           content: `${question || "Please analyze this eye image"}\n[IMAGE_BASE64_START]${imageBase64}[IMAGE_BASE64_END]`
//         }
//       ]
//     });

//     const analysis = response.choices?.[0]?.message?.content || 
//       "Unable to analyze the image properly.";

//     // Get a simpler patient-friendly explanation
//     const explanation = await queryChatModel(
//       `Specialist analysis:\n${analysis}\n\nExplain this to the patient simply with next steps:`
//     );

//     return {
//       analysis,
//       explanation: explanation.text,
//       requiresDoctors: analysis.toLowerCase().includes('recommend') || 
//                       analysis.toLowerCase().includes('see a')
//     };
//   } catch (error) {
//     console.error('Error analyzing image with pixtral-12b-2409:', error);
//     return {
//       analysis: "Technical error during image analysis.",
//       explanation: "Sorry, we encountered an error analyzing your image. Please try again or consult an eye doctor.",
//       requiresDoctors: false
//     };
//   }
// };
