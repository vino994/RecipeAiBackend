import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * GET place image by name
 * /api/tour/place-image?name=Marina Beach Chennai
 */
router.get("/place-image", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json({ success: false });

    // 1️⃣ Find place
    const findRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: name,
          inputtype: "textquery",
          fields: "photos",
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      }
    );

    const photos = findRes.data.candidates?.[0]?.photos;
    if (!photos?.length) {
      return res.json({ success: false });
    }

    // 2️⃣ Build photo URL
    const photoRef = photos[0].photo_reference;
    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error("Place image error", err.message);
    res.json({ success: false });
  }
});

export default router;
