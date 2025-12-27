import fetch from "node-fetch";

let cache = {
  data: [],
  lastFetched: 0
};

const CACHE_TIME = 1000 * 60 * 60; // 1 hour

export async function getCachedRecipes() {
  const now = Date.now();

  if (cache.data.length > 0 && now - cache.lastFetched < CACHE_TIME) {
    return cache.data;
  }

  const res = await fetch("https://dummyjson.com/recipes");
  const json = await res.json();

  cache = {
    data: json.recipes || [],
    lastFetched: now
  };

  return cache.data;
}
