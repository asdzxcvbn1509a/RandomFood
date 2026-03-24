import { describe, expect, it } from "vitest";
import { filterRestaurantsByCuisine } from "./filter.js";

const restaurants = [
  {
    id: "1",
    name: "Thai Spot",
    address: "A",
    rating: 4.5,
    priceLevel: 2,
    categories: ["restaurant", "thai_restaurant"],
    location: { lat: 1, lng: 1 },
    mapsUrl: "https://maps.example/1",
    imageUrl: null,
  },
  {
    id: "2",
    name: "Pizza Hub",
    address: "B",
    rating: 4.1,
    priceLevel: 2,
    categories: ["restaurant", "italian_restaurant"],
    location: { lat: 1, lng: 1 },
    mapsUrl: "https://maps.example/2",
    imageUrl: null,
  },
];

describe("filterRestaurantsByCuisine", () => {
  it("returns all restaurants for all cuisine", () => {
    expect(filterRestaurantsByCuisine(restaurants, "all")).toHaveLength(2);
  });

  it("filters by cuisine", () => {
    const result = filterRestaurantsByCuisine(restaurants, "thai");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Thai Spot");
  });
});
