import "./config/env.js";
import express from "express";
import cors from "cors";
import recipeRoutes from "./routes/recipeRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js";
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/recipe", recipeRoutes);

app.get("/", (req, res) => {
  res.send("Recipe AI Backend is running 🚀");
});
app.use("/api/tts", ttsRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
