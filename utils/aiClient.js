// backend/utils/aiClient.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function getAIResponse(prompt) {
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ ACTIVE & SUPPORTED
      messages: [
        {
          role: "system",
          content:
            "You are a professional travel planner. Return ONLY valid JSON. No explanation text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    return res.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ Groq SDK error:", err.message);
    throw new Error("Groq AI failed");
  }
}
