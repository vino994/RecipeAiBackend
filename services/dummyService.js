import fetch from "node-fetch";

export async function searchDummyRecipes(query) {
  const res = await fetch("https://dummyjson.com/recipes");
  const data = await res.json();

  const tokens = query
    .split(/[,\s]+/)
    .map(t => t.trim())
    .filter(Boolean);

  return data.recipes.filter(recipe => {
    const name = recipe.name.toLowerCase();
    const ingredients = recipe.ingredients.join(" ").toLowerCase();

    return tokens.some(token =>
      name.includes(token) || ingredients.includes(token)
    );
  });
}

