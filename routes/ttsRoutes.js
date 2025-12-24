import express from "express";
import { speakTamil } from "../controllers/ttsController.js";

const router = express.Router();

router.post("/", speakTamil);

export default router;
