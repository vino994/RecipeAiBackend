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
        content: `
You are a STRICT Tamil language expert.

RULES (VERY IMPORTANT):
- Output ONLY Tamil script
- NO English words
- NO Tanglish
- NO transliteration (oil, add, fry, cook, etc.)
- Use SIMPLE SPOKEN TAMIL
- Replace ALL cooking terms with Tamil words
`
      },
      {
        role: "user",
        content: `
Translate the following cooking steps into PURE SPOKEN TAMIL:

${text}
`
      }
    ]
  });

  return res.choices[0].message.content.trim();
}
