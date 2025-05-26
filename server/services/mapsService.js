import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const findNearbyDoctors = async (lat, lng, specialty = "ophthalmologist") => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          key: GOOGLE_MAPS_API_KEY,
          location: `${lat},${lng}`,
          radius: 5000,
          keyword: specialty,
          type: "doctor",
        },
      }
    );

    const doctors = response.data.results.map(place => ({
      name: place.name,
      specialty,
      address: place.vicinity,
      distance: "", // Could enhance with Distance Matrix API
      phone: "N/A"  // Phone usually not available in Nearby Search
    }));
    
    const mapUrl = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
      specialty
    )}&center=${lat},${lng}&zoom=14`;

    return { doctors, mapUrl };
  } catch (error) {
    console.error("Google Maps API Error:", error);
    throw new Error("Failed to fetch doctors");
  }
};