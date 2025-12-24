import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import path from "path";

const client = new textToSpeech.TextToSpeechClient();

export async function generateTTS(text, lang) {
  const request = {
    input: { text },
    voice: {
      languageCode:
        lang === "ta" ? "ta-IN"
        : lang === "hi" ? "hi-IN"
        : lang === "ml" ? "ml-IN"
        : "en-US",
      ssmlGender: "FEMALE"
    },
    audioConfig: {
      audioEncoding: "MP3"
    }
  };

  const [response] = await client.synthesizeSpeech(request);

  const filePath = `./tmp/voice-${Date.now()}.mp3`;
  fs.writeFileSync(filePath, response.audioContent, "binary");

  return filePath;
}
