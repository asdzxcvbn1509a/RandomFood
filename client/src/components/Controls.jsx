const radiusOptions = [
  { value: 1000, label: "1 km" },
  { value: 3000, label: "3 km" },
  { value: 5000, label: "5 km" },
  { value: 10000, label: "10 km" },
];

const typeGroups = [
  {
    label: "Broad Categories",
    options: [
      { value: "restaurant", label: "Restaurant" },
      { value: "cafe", label: "Cafe / Coffee Shop" },
      { value: "bakery", label: "Bakery" },
      { value: "bar", label: "Bar" },
      { value: "fast_food_restaurant", label: "Fast Food" },
      { value: "meal_takeaway", label: "Meal Takeaway" },
      { value: "meal_delivery", label: "Meal Delivery" },
    ],
  },
  {
    label: "Cuisines",
    options: [
      { value: "thai_restaurant", label: "Thai" },
      { value: "japanese_restaurant", label: "Japanese" },
      { value: "chinese_restaurant", label: "Chinese" },
      { value: "korean_restaurant", label: "Korean" },
      { value: "italian_restaurant", label: "Italian" },
      { value: "indian_restaurant", label: "Indian" },
      { value: "american_restaurant", label: "American" },
    ],
  },
  {
    label: "Specific Food Types",
    options: [
      { value: "seafood_restaurant", label: "Seafood" },
      { value: "pizza_restaurant", label: "Pizza" },
      { value: "hamburger_restaurant", label: "Hamburger" },
      { value: "steak_house", label: "Steak House" },
      { value: "sushi_restaurant", label: "Sushi" },
      { value: "ramen_restaurant", label: "Ramen" },
      { value: "ice_cream_shop", label: "Ice Cream" },
      { value: "bubble_tea_shop", label: "Bubble Tea" },
    ],
  },
  {
    label: "Dietary",
    options: [
      { value: "vegetarian_restaurant", label: "Vegetarian" },
      { value: "vegan_restaurant", label: "Vegan" },
    ],
  },
];

export function Controls({
  radius,
  placeType,
  onRadiusChange,
  onPlaceTypeChange,
  onFetch,
  loading,
  canFetch,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="flex flex-col gap-1 text-sm">
        Radius
        <select
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2"
        >
          {radiusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Type
        <select
          value={placeType}
          onChange={(e) => onPlaceTypeChange(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2"
        >
          <option value="">Select a type</option>
          {typeGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="flex items-end">
        <button
          type="button"
          disabled={!canFetch || loading}
          onClick={onFetch}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Fetching..." : "Fetch restaurants"}
        </button>
      </div>
    </div>
  );
}
