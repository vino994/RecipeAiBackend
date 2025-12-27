import express from "express";
import { translateToTamil } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, lang } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text required" });
  }

  try {
    if (lang === "ta") {
      const tamil = await translateToTamil(text);
      return res.json({ text: tamil });
    }

    res.json({ text }); // English passthrough
  } catch (err) {
    console.error("Translate error:", err);
    res.status(500).json({ message: "Translate failed" });
  }
});

export default router;
