import express from "express";
import {
  searchPlaces,
  getNearbyPlaces,   // ✅ ADD THIS
  getPlaceImage,
  getWeather,
  generateItinerary,
  getDirections
} from "../controllers/tourController.js";

const router = express.Router();

// 🔍 Search city
router.get("/places/search", searchPlaces);

// 📍 Nearby tourist places (OSM)
router.get("/places/nearby", getNearbyPlaces); // ✅ FIX

// 🖼 Google Place image
router.get("/place-image", getPlaceImage);

// 🌤 Weather
router.get("/weather", getWeather);

// 🤖 AI itinerary
router.post("/itinerary", generateItinerary);

// 🛣 Directions
router.get("/directions", getDirections);

export default router;
