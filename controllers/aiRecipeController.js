import { searchDummyRecipes } from "../services/dummyService.js";
import { getAIRecipe } from "../services/aiService.js";

export const getAIRecipeController = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Text required" });

  try {
    const matches = await searchDummyRecipes(text);

    if (matches.length > 0) {
      return res.json({ recipe: matches[0] });
    }

    const aiRecipe = await getAIRecipe(
      `Create a cooking recipe using ingredients: ${text}`
    );

    res.json({ aiRecipe });

  } catch (err) {
    res.status(500).json({ message: "AI recipe failed" });
  }
};
