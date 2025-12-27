import express from "express";
import { speakTTS } from "../controllers/ttsController.js";

const router = express.Router();

router.post("/", speakTTS);

export default router;
