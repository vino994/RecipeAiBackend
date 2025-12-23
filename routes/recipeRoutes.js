import express from "express";
import { getRecipe, translateToLanguage } from "../controllers/recipeController.js";

const router = express.Router();

router.post("/", getRecipe);
router.post("/translate", translateToLanguage);

export default router;
