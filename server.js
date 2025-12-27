import "./config/env.js";
import express from "express";
import cors from "cors";

import recipeRoutes from "./routes/recipeRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import ttsRoutes from './routes/ttsRoutes.js'
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/recipes", recipeRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/tts", ttsRoutes);

app.get("/", (req, res) => {
  res.send("Recipe AI Backend running 🚀");
});
console.log("GCP:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
