import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";

if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("❌ GOOGLE_CREDENTIALS env variable is missing");
}

const client = new textToSpeech.TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
});

export async function generateTTS(text, lang) {
  try {
    const request = {
      input: { text },
      voice: {
        languageCode: lang === "ta" ? "ta-IN" : "en-US",
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    const dir = "./tmp";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const filePath = `${dir}/voice-${Date.now()}.mp3`;
    fs.writeFileSync(filePath, response.audioContent, "binary");

    return filePath;
  } catch (err) {
    console.error("❌ Google TTS failed:", err.message);
    return null;
  }
}
