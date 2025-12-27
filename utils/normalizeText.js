import Groq from "groq-sdk";

const ai = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Tamil / Tanglish / English → English keywords
export async function normalizeToEnglish(text) {
  // if already English, return directly
  if (/^[a-zA-Z0-9\s]+$/.test(text)) {
    return text.toLowerCase();
  }

  // AI translate Tamil → English
  const res = await ai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You convert food ingredient text to simple English keywords only."
      },
      {
        role: "user",
        content: `Convert this food query to simple English ingredients only, comma separated:\n${text}`
      }
    ]
  });

  return res.choices[0].message.content
    .toLowerCase()
    .replace(/[^a-z,\s]/g, "");
}
