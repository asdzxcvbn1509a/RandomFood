import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/app.js";

describe("GET /api/restaurants/nearby", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 for invalid query", async () => {
    const response = await request(app).get("/api/restaurants/nearby?lat=foo&lng=bar");
    expect(response.status).toBe(400);
  });

  it("returns normalized restaurants", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          places: [
            {
              id: "abc",
              displayName: { text: "Thai House" },
              formattedAddress: "123 Main St",
              rating: 4.7,
              priceLevel: "PRICE_LEVEL_MODERATE",
              types: ["restaurant", "thai_restaurant"],
              location: { latitude: 10, longitude: 20 },
              googleMapsUri: "https://maps.google.com/?q=10,20",
            },
            {
              id: "hotel-1",
              displayName: { text: "Hotel Downtown" },
              formattedAddress: "456 Center St",
              rating: 4.3,
              priceLevel: "PRICE_LEVEL_MODERATE",
              types: ["lodging", "hotel"],
              location: { latitude: 11, longitude: 21 },
              googleMapsUri: "https://maps.google.com/?q=11,21",
            },
          ],
        }),
      }),
    );
    process.env.GOOGLE_MAPS_API_KEY = "test-key";

    const response = await request(app).get("/api/restaurants/nearby?lat=10&lng=20&radius=1000&cuisine=thai");
    expect(response.status).toBe(200);
    expect(response.body.restaurants).toHaveLength(1);
    expect(response.body.restaurants[0].name).toBe("Thai House");
  });
});
