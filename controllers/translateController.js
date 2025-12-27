import fs from "fs";
import { generateTTS } from "../services/ttsService.js";

export const speakTTS = async (req, res) => {
  const { text, lang } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text required" });
  }

  try {
    const filePath = await generateTTS(text, lang);

    // 🔥 FALLBACK HANDLING
    if (!filePath) {
      return res.status(500).json({
        message: "TTS unavailable",
        fallback: true,
      });
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline",
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on("end", () => {
      fs.unlink(filePath, () => {});
    });
  } catch (err) {
    console.error("TTS controller error:", err);
    res.status(500).json({ message: "TTS failed" });
  }
};
