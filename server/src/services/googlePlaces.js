import { z } from "zod";

const baseUrl = "https://places.googleapis.com/v1/places:searchNearby";

const placeSchema = z.object({
  id: z.string(),
  displayName: z.object({ text: z.string() }).optional(),
  formattedAddress: z.string().optional(),
  rating: z.number().nullable().optional(),
  priceLevel: z
    .enum(["PRICE_LEVEL_FREE", "PRICE_LEVEL_INEXPENSIVE", "PRICE_LEVEL_MODERATE", "PRICE_LEVEL_EXPENSIVE", "PRICE_LEVEL_VERY_EXPENSIVE"])
    .nullable()
    .optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  types: z.array(z.string()).optional(),
  googleMapsUri: z.string().optional(),
  photos: z.array(z.object({ name: z.string() })).optional(),
});

const responseSchema = z.object({
  places: z.array(placeSchema).optional(),
});

const placeTypeMap = {
  restaurant: ["restaurant"],
  cafe: ["cafe", "coffee_shop"],
  coffee_shop: ["coffee_shop"],
  bakery: ["bakery"],
  bar: ["bar"],
  fast_food_restaurant: ["fast_food_restaurant"],
  meal_takeaway: ["meal_takeaway"],
  meal_delivery: ["meal_delivery"],
  thai_restaurant: ["thai_restaurant"],
  thai: ["thai_restaurant"],
  japanese_restaurant: ["japanese_restaurant"],
  japanese: ["japanese_restaurant"],
  chinese_restaurant: ["chinese_restaurant"],
  chinese: ["chinese_restaurant"],
  korean_restaurant: ["korean_restaurant"],
  korean: ["korean_restaurant"],
  italian_restaurant: ["italian_restaurant"],
  italian: ["italian_restaurant"],
  indian_restaurant: ["indian_restaurant"],
  indian: ["indian_restaurant"],
  american_restaurant: ["american_restaurant"],
  american: ["american_restaurant"],
  seafood_restaurant: ["seafood_restaurant"],
  pizza_restaurant: ["pizza_restaurant"],
  hamburger_restaurant: ["hamburger_restaurant"],
  steak_house: ["steak_house"],
  sushi_restaurant: ["sushi_restaurant"],
  ramen_restaurant: ["ramen_restaurant"],
  ice_cream_shop: ["ice_cream_shop"],
  bubble_tea_shop: ["bubble_tea_shop"],
  vegetarian_restaurant: ["vegetarian_restaurant"],
  vegetarian: ["vegetarian_restaurant"],
  vegan_restaurant: ["vegan_restaurant"],
  vegan: ["vegan_restaurant"],
};
const accommodationTypes = new Set([
  "lodging",
  "hotel",
  "motel",
  "hostel",
  "guest_house",
  "bed_and_breakfast",
  "extended_stay_hotel",
  "resort_hotel",
]);

function toPriceLevel(level) {
  if (!level) return null;
  const mapping = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  };
  return mapping[level] ?? null;
}

function normalizePlaceType(type) {
  if (!type) return ["restaurant"];
  const normalized = type.toLowerCase().trim();
  return placeTypeMap[normalized] ?? [normalized];
}

export async function fetchNearbyRestaurants(params) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is missing");
  }

  const includedTypes = normalizePlaceType(params.type);
  const requestBody = {
    includedTypes,
    excludedTypes: Array.from(accommodationTypes),
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: {
          latitude: params.lat,
          longitude: params.lng,
        },
        radius: Math.min(Math.max(params.radius, 100), 50000),
      },
    },
  };

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.types,places.location,places.googleMapsUri,places.photos",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Places API failed: ${response.status} ${errorBody}`);
  }

  const json = await response.json();
  const parsed = responseSchema.parse(json);

  return (parsed.places ?? [])
    .filter((place) => {
      const categories = place.types ?? [];
      const hasMatchingType = includedTypes.some((type) => categories.includes(type));
      const hasAccommodationType = categories.some((type) => accommodationTypes.has(type));
      return hasMatchingType && !hasAccommodationType;
    })
    .map((place) => ({
      id: place.id,
      name: place.displayName?.text ?? "Unknown restaurant",
      address: place.formattedAddress ?? "Address unavailable",
      rating: place.rating ?? null,
      priceLevel: toPriceLevel(place.priceLevel),
      categories: place.types ?? [],
      location: {
        lat: place.location.latitude,
        lng: place.location.longitude,
      },
      mapsUrl: place.googleMapsUri ?? `https://www.google.com/maps/search/?api=1&query=${place.location.latitude},${place.location.longitude}`,
      imageUrl: place.photos?.[0]?.name
        ? `/api/restaurants/photo?photoName=${encodeURIComponent(place.photos[0].name)}`
        : null,
    }));
}
