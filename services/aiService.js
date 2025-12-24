import Groq from "groq-sdk";

const ai = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function getAIRecipe(text) {
  const res = await ai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{
      role: "user",
      content: `Give a simple cooking recipe with ingredients and steps:\n${text}`
    }]
  });

  return res.choices[0].message.content.trim();
}

export async function translateToTamil(text) {
  const res = await ai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are a Tamil language expert."
      },
      {
        role: "user",
        content: `
Translate the following cooking recipe into PURE SPOKEN TAMIL.

STRICT RULES:
- DO NOT include ANY English words
- DO NOT include transliteration (like Kozhi, Curry, Fry)
- DO NOT use markdown (**, ##, :)
- Use simple everyday Tamil
- Use Tamil words for headings

Recipe:
${text}
`
      }
    ]
  });

  return res.choices[0].message.content.trim();
}
