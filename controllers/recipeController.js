import { searchDummyRecipes } from "../services/dummyService.js";
import { getAIRecipe, translateToTamil } from "../services/aiService.js";

export const getRecipe = async (req, res) => {
  const { text, lang = "ta" } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text required" });
  }

  try {
    // 🔍 1. Try DummyJSON FIRST
    const matches = await searchDummyRecipes(text);

    let recipeText = "";

    if (matches.length > 0) {
      const r = matches[0]; // take first match

      recipeText = `
🍽 ${r.name}

🧂 Ingredients:
${r.ingredients.join(", ")}

👩‍🍳 Instructions:
${r.instructions.join("\n")}
`.trim();
    } else {
      // 🤖 2. AI fallback
      recipeText = await getAIRecipe(
        `Create a cooking recipe using these ingredients: ${text}`
      );
    }

    if (!recipeText || recipeText.trim().length === 0) {
      return res.json({ mainRecipe: "" });
    }

    // 🌐 3. Translate if Tamil
  if (lang !== "en") {
  recipeText = await translateToTamil(recipeText);
}

    res.json({ mainRecipe: recipeText });

  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ message: "Recipe failed" });
  }
};
