import express from 'express';
import { handleChat, clearChat } from '../controllers/chatController.js';
import { findNearbyDoctors } from '../controllers/doctorController.js';
import { analyzeImage } from '../controllers/imageController.js';
import { respondToSinglePrompt } from '../controllers/singlePromptController.js';
import { createOrder, verifyPayment } from '../controllers/razorpayController.js'; // ✅ One-time payment routes

const router = express.Router();

// Chat routes
router.post('/chat', handleChat);
router.post('/clear-chat', clearChat);
router.post('/analyze-image', analyzeImage);

// Doctor routes
router.get('/nearby-doctors', findNearbyDoctors);

// Prompt route
router.post('/single-prompt', respondToSinglePrompt);

// ✅ Razorpay payment routes
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

export default router;
