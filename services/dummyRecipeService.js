import fetch from "node-fetch";

export async function findRecipeFromDummyAPI(query) {
  const res = await fetch("https://dummyjson.com/recipes");
  const data = await res.json();

  const q = query.toLowerCase();

  const match = data.recipes.find((recipe) => {
    const nameMatch = recipe.name.toLowerCase().includes(q);

    const ingredientMatch = recipe.ingredients.some((ing) =>
      q.includes(ing.toLowerCase())
    );

    return nameMatch || ingredientMatch;
  });

  return match || null;
}
