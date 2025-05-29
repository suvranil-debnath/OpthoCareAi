import express from 'express';
import { handleChat, clearChat } from '../controllers/chatController.js';
import { findNearbyDoctors } from '../controllers/doctorController.js';
import { analyzeImage } from '../controllers/imageController.js';
import { respondToSinglePrompt } from '../controllers/singlePromptController.js'; // ✅ Import this

const router = express.Router();

// Chat routes
router.post('/chat', handleChat);
router.post('/clear-chat', clearChat);
router.post('/analyze-image', analyzeImage);

// Doctor routes
router.get('/nearby-doctors', findNearbyDoctors);

// ✅ New single prompt route
router.post('/single-prompt', respondToSinglePrompt);

export default router;
