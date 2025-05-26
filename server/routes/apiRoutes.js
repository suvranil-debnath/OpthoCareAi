import express from 'express';
import { handleChat, clearChat } from '../controllers/chatController.js';
import { findNearbyDoctors } from '../controllers/doctorController.js';
import { analyzeImage } from '../controllers/imageController.js';

const router = express.Router();

// Chat routes
router.post('/chat', handleChat);
router.post('/clear-chat', clearChat); // Add this line
router.post('/analyze-image', analyzeImage);

// Doctor routes
router.get('/nearby-doctors', findNearbyDoctors);

export default router;