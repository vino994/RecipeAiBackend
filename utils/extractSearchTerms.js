import { INGREDIENT_MAP } from "./ingredientMap.js";
import { DISH_MAP } from "./dishMap.js";

export function extractSearchTerms(text = "") {
  const lower = text.toLowerCase();
  const found = new Set();

  // Dish names
  for (const key in DISH_MAP) {
    if (lower.includes(key)) {
      found.add(DISH_MAP[key]);
    }
  }

  // Ingredients
  for (const key in INGREDIENT_MAP) {
    if (lower.includes(key)) {
      found.add(INGREDIENT_MAP[key]);
    }
  }

  return [...found];
}
