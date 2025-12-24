import gTTS from "gtts";
import fs from "fs";
import path from "path";

export const speakTamil = async (req, res) => {
  const { text, lang = "ta" } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text required" });
  }

  try {
    const ttsLang = lang === "ta" ? "ta" : "en";
    const filePath = path.join("tmp", `tts-${Date.now()}.mp3`);

    const gtts = new gTTS(text, ttsLang);
    gtts.save(filePath, () => {
      res.setHeader("Content-Type", "audio/mpeg");
      const stream = fs.createReadStream(filePath);

      stream.pipe(res);

      stream.on("end", () => {
        fs.unlinkSync(filePath); // cleanup
      });
    });

  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ message: "TTS failed" });
  }
};
