import { INGREDIENT_MAP } from "./ingredientMap.js";

export function extractIngredients(text = "") {
  const lower = text.toLowerCase();
  const found = new Set();

  for (const key in INGREDIENT_MAP) {
    if (lower.includes(key)) {
      found.add(INGREDIENT_MAP[key]);
    }
  }

  return [...found]; // ["tomato", "onion"]
}
