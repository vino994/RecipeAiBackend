import "./config/env.js";
import express from "express";
import cors from "cors";

import recipeRoutes from "./routes/recipeRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import placeImageRoutes from "./routes/placesRoutes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ ROUTES (NO CONFLICT)
app.use("/api/recipes", recipeRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/tts", ttsRoutes);

app.use("/api/tour", tourRoutes);               // search, nearby, weather, itinerary
app.use("/api/tour/place-image", placeImageRoutes); // image ONLY

app.get("/", (req, res) => {
  res.send("Global Tour AI Backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} - Global Tour AI ready!`)
);
