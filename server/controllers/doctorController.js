import { findNearbyDoctors as findDoctors } from '../services/mapsService.js';

export const findNearbyDoctors = async (req, res) => {
  try {
    const { lat, lng, specialty = 'ophthalmologist' } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const results = await findDoctors(lat, lng, specialty);
    res.json(results);
  } catch (error) {
    console.error('Doctor search error:', error);
    res.status(500).json({ error: 'Failed to find nearby doctors' });
  }
};