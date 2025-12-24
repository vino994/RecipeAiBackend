import fetch from "node-fetch";

export async function searchDummyRecipes(query) {
  const res = await fetch("https://dummyjson.com/recipes");
  const data = await res.json();

  const q = query.toLowerCase();

  const matches = data.recipes.filter((recipe) => {
    return (
      recipe.name.toLowerCase().includes(q) ||
      recipe.ingredients.some((i) => q.includes(i.toLowerCase()))
    );
  });

  return matches;
}
