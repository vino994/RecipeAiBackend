import "./config/env.js"; // 👈 MUST BE FIRST LINE

import express from "express";
import cors from "cors";
import recipeRoutes from "./routes/recipeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/recipe", recipeRoutes);



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
