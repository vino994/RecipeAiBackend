import express from "express";
import { getRecipe } from "../controllers/recipeController.js";

const router = express.Router();
router.post("/", getRecipe);

export default router;
