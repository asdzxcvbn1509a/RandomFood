import { Router } from "express";
import { z } from "zod";
import { fetchNearbyRestaurants } from "../services/googlePlaces.js";

const router = Router();

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(100).max(50000).default(1000),
  type: z.string().optional(),
  cuisine: z.string().optional(),
});
const photoQuerySchema = z.object({
  photoName: z.string().min(1),
});

router.get("/nearby", async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid query parameters",
      details: parsed.error.flatten(),
    });
  }

  try {
    const restaurants = await fetchNearbyRestaurants({
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      radius: parsed.data.radius,
      type: parsed.data.type ?? parsed.data.cuisine,
    });
    return res.json({ restaurants });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to fetch restaurants",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/photo", async (req, res) => {
  const parsed = photoQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid photo query parameters" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GOOGLE_MAPS_API_KEY is missing" });
  }

  const url = `https://places.googleapis.com/v1/${parsed.data.photoName}/media?maxHeightPx=240&maxWidthPx=360`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Unable to fetch photo from Places API" });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", contentType);
    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    return res.status(500).json({
      error: "Unable to proxy restaurant photo",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
