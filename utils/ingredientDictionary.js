// Tamil + Tanglish + English → English
export const INGREDIENT_MAP = {
  "தக்காளி": "tomato",
  "thakkali": "tomato",
  "tomato": "tomato",

  "வெங்காயம்": "onion",
  "vengayam": "onion",
  "onion": "onion",

  "கோழி": "chicken",
  "kozhi": "chicken",
  "chicken": "chicken",

  "முட்டை": "egg",
  "mutta": "egg",
  "egg": "egg",

  "உருளைக்கிழங்கு": "potato",
  "urulaikilangu": "potato",
  "potato": "potato"
};

export function normalizeIngredients(text) {
  const lower = text.toLowerCase();
  const found = new Set();

  for (const key in INGREDIENT_MAP) {
    if (lower.includes(key)) {
      found.add(INGREDIENT_MAP[key]);
    }
  }

  return [...found];
}
