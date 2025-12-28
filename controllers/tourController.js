import axios from "axios";
import { getAIResponse } from "../utils/aiClient.js";

const WEATHER_URL = "https://api.openweathermap.org/data/2.5";
const GEO_ROUTING_URL = "https://api.geoapify.com/v1";


const GEO_GEOCODE_URL = "https://api.geoapify.com/v1";

export const searchPlaces = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json({ success: true, results: [] });
    }

    const response = await axios.get(
      `${GEO_GEOCODE_URL}/geocode/autocomplete`,
      {
        params: {
          text: query,
          type: "city",
          lang: "en",
          limit: 10,
          apiKey: process.env.GEOAPIFY_API_KEY
        }
      }
    );

    const results = response.data.features.map((f) => ({
      name:
        f.properties.city ||
        f.properties.county ||
        f.properties.state ||
        f.properties.name,
      country: f.properties.country,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      type: f.properties.result_type
    }));

    res.json({
      success: true,
      results
    });

  } catch (err) {
    console.error("searchPlaces error:", err.message);
    res.status(500).json({
      success: false,
      results: []
    });
  }
};


/* =========================
   2️⃣ NEARBY TOURIST PLACES (OSM)
========================= */
export const getNearbyPlaces = async (req, res) => {
  try {
    let { lat, lng, radius = 30000 } = req.query;

    // ✅ HARD LIMIT (Overpass-safe)
    radius = Math.min(Number(radius), 30000);

    const overpassQuery = `
[out:json][timeout:25];
(
  node["tourism"](around:${radius},${lat},${lng});
  node["historic"](around:${radius},${lat},${lng});
  node["leisure"](around:${radius},${lat},${lng});
);
out 50;
`;

    // ✅ MULTIPLE MIRRORS (VERY IMPORTANT)
    const OVERPASS_SERVERS = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass.nchc.org.tw/api/interpreter"
    ];

    let response;

    for (const url of OVERPASS_SERVERS) {
      try {
        response = await axios.post(url, overpassQuery, {
          headers: { "Content-Type": "text/plain" },
          timeout: 25000
        });
        break; // ✅ success → stop loop
      } catch (err) {
        console.warn("Overpass failed:", url);
      }
    }

    if (!response) {
      return res.json({ success: true, places: [] });
    }

    res.json({
      success: true,
      places: response.data.elements.map(p => ({
        id: p.id,
        name: p.tags?.name || "Tourist Place",
        category:
          p.tags?.tourism ||
          p.tags?.historic ||
          p.tags?.leisure ||
          "place",
        lat: p.lat,
        lng: p.lon
      }))
    });

  } catch (err) {
    console.error("getNearbyPlaces error:", err.message);
    res.json({ success: true, places: [] });
  }
};


/* =========================
   3️⃣ WEATHER
========================= */
export const getWeather = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const r = await axios.get(`${WEATHER_URL}/weather`, {
      params: {
        lat,
        lon: lng,
        units: "metric",
        appid: process.env.OPENWEATHER_API_KEY
      }
    });

    res.json({
      success: true,
      weather: {
        temperature: Math.round(r.data.main.temp),
        condition: r.data.weather[0].main,
        humidity: r.data.main.humidity,
        windSpeed: r.data.wind.speed
      }
    });
  } catch (e) {
    console.error("getWeather error:", e.message);
    res.json({ success: false });
  }
};

/* =========================
   4️⃣ AI ITINERARY (SAFE)
========================= */
export const generateItinerary = async (req, res) => {
  try {
    const { location, duration, budget, interests = [] } = req.body;

    if (!location || !duration) {
      return res.status(400).json({
        success: false,
        message: "Location and duration required"
      });
    }

    const prompt = `
Create a ${duration}-day travel itinerary for ${location}.
Budget: ${budget}
Interests: ${interests.join(", ")}

Return ONLY valid JSON:
{
  "location": "${location}",
  "duration": "${duration} days",
  "budget": "${budget}",
  "totalEstimatedCost": "₹25000",
  "dailyPlans": [
    {
      "day": 1,
      "title": "Arrival & Sightseeing",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Visit popular attractions",
          "description": "Explore famous places",
          "type": "sightseeing",
          "duration": "4 hours"
        }
      ]
    }
  ]
}
`;

    const aiText = await getAIResponse(prompt);

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON from AI");
    }

    const itinerary = JSON.parse(jsonMatch[0]);

    res.json({ success: true, itinerary });

  } catch (err) {
    console.error("❌ generateItinerary error:", err.message);

    // ✅ SAFE FALLBACK (never breaks UI)
    res.json({
      success: true,
      itinerary: {
        location: req.body.location,
        duration: `${req.body.duration} days`,
        budget: req.body.budget,
        totalEstimatedCost: "₹20000 - ₹30000",
        dailyPlans: [
          {
            day: 1,
            title: "Local Exploration",
            activities: [
              {
                time: "10:00 AM",
                activity: "City tour",
                description: "Visit nearby tourist attractions",
                type: "sightseeing",
                duration: "4 hours"
              }
            ]
          }
        ]
      }
    });
  }
};

/* =========================
   6️⃣ GOOGLE PLACE IMAGE
========================= */
export const getPlaceImage = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Place name required"
      });
    }

    // 1️⃣ Find place ID
    const findRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: name,
          inputtype: "textquery",
          fields: "place_id",
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      }
    );

    const placeId = findRes.data.candidates?.[0]?.place_id;

    if (!placeId) {
      return res.json({
        success: true,
        imageUrl: null
      });
    }

    // 2️⃣ Get photo reference
    const detailsRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields: "photos",
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      }
    );

    const photoRef =
      detailsRes.data.result?.photos?.[0]?.photo_reference;

    if (!photoRef) {
      return res.json({
        success: true,
        imageUrl: null
      });
    }

    // 3️⃣ Build image URL (NO extra API call)
    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    res.json({
      success: true,
      imageUrl
    });

  } catch (err) {
    console.error("getPlaceImage error:", err.message);
    res.json({
      success: false,
      imageUrl: null
    });
  }
};


/* =========================
   5️⃣ ROUTING (GEOAPIFY)
========================= */
export const getDirections = async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;

    const r = await axios.get(`${GEO_ROUTING_URL}/routing`, {
      params: {
        waypoints: `${fromLat},${fromLng}|${toLat},${toLng}`,
        mode: "drive",
        apiKey: process.env.GEOAPIFY_API_KEY
      }
    });

    res.json({
      success: true,
      distanceKm: (
        r.data.features[0].properties.distance / 1000
      ).toFixed(2),
      timeMin: Math.round(
        r.data.features[0].properties.time / 60
      )
    });
  } catch {
    res.json({ success: false });
  }
};
