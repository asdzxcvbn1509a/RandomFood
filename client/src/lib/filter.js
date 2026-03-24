export function filterRestaurantsByCuisine(restaurants, cuisine) {
  if (!cuisine || cuisine === "all") return restaurants;
  const needle = cuisine.toLowerCase();
  return restaurants.filter((restaurant) =>
    restaurant.categories.some((category) => category.toLowerCase().includes(needle)),
  );
}
