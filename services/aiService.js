import Groq from "groq-sdk";

const ai = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getAIRecipe(text) {
  const res = await ai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: text }]
  });
  return res.choices[0].message.content;
}

export async function translateText(text, lang) {
  const prompt = `
Translate the following cooking recipe into ${lang}.
Return ONLY translated text.

${text}
`;
  const res = await ai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }]
  });
  return res.choices[0].message.content;
}
