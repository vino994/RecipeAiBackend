import { INGREDIENT_MAP } from "./ingredientMap.js";
import { DISH_MAP } from "./dishMap.js";

export function extractIntent(text = "") {
  const lower = text.toLowerCase();
  const found = new Set();

  for (const k in DISH_MAP) {
    if (lower.includes(k)) found.add(DISH_MAP[k]);
  }

  for (const k in INGREDIENT_MAP) {
    if (lower.includes(k)) found.add(INGREDIENT_MAP[k]);
  }

  return [...found];
}
