import express from "express";
import { getAllRecipes } from "../controllers/recipeListController.js";
import { getAIRecipeController } from "../controllers/aiRecipeController.js";

const router = express.Router();

router.post("/", getAllRecipes);  // ✅ homepage list
router.post("/recipe/ai", getAIRecipeController); // ✅ AI fallback

export default router;
