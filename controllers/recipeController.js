import { getAIRecipe, translateText } from "../services/aiService.js";
import { findRecipeFromDummyAPI } from "../services/dummyRecipeService.js";

export const getRecipe = async (req, res) => {
  const { text } = req.body;

  try {
    const dummy = await findRecipeFromDummyAPI(text);
    if (dummy) {
      return res.json({
        recipe: `
🍽 ${dummy.name}

🧂 Ingredients:
${dummy.ingredients.join(", ")}

👩‍🍳 Instructions:
${dummy.instructions.join("\n")}
`
      });
    }

    const aiRecipe = await getAIRecipe(text, "en");
    res.json({ recipe: aiRecipe });

  } catch (e) {
    res.status(500).json({ message: "Recipe failed" });
  }
};

export const translateToLanguage = async (req, res) => {
  const { text, lang } = req.body;
  try {
    const translated = await translateText(text, lang);
    res.json({ translated });
  } catch {
    res.status(500).json({ message: "Translation failed" });
  }
};
