import { queryChatModel } from '../services/aiService.js';

export const handleChat = async (req, res) => {
  try {
    const { userId, message, chatHistory } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const response = await queryChatModel(userId, message, chatHistory || []);
    res.json(response);
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
};

import { clearChatSession } from '../services/aiService.js';

export const clearChat = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    clearChatSession(userId);
    res.json({ success: true, message: 'Chat session cleared' });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({ error: 'Failed to clear chat session' });
  }
};