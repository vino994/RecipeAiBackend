import fetch from "node-fetch";
import { normalizeToEnglish } from "../utils/normalizeText.js";

export const getAllRecipes = async (req, res) => {
  try {
    let { text = "", page = 1, limit = 12 } = req.body;

    page = Number(page);
    limit = Number(limit);

    if (typeof text !== "string") text = "";

    const normalized = text
      ? await normalizeToEnglish(text)
      : "";

    const tokens = normalized
      .toLowerCase()
      .split(/[,\s]+/)
      .filter(Boolean);

    const response = await fetch("https://dummyjson.com/recipes");
    const data = await response.json();

    let recipes = data.recipes || [];

    if (tokens.length) {
      recipes = recipes.filter(r => {
        const name = r.name.toLowerCase();
        const ingredients = r.ingredients.join(" ").toLowerCase();
        return tokens.some(t => name.includes(t) || ingredients.includes(t));
      });
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    res.json({
      recipes: recipes.slice(start, end),
      hasMore: end < recipes.length
    });

  } catch (err) {
    console.error("getAllRecipes error:", err);
    res.status(500).json({ message: "Recipe fetch failed" });
  }
};
