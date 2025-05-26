import { analyzeImageWithAI } from '../services/aiService.js';

export const analyzeImage = async (req, res) => {
  try {
    const { userId, imageBase64, question } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const analysis = await analyzeImageWithAI(userId, imageBase64, question);
    res.json(analysis);
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
};