import { useMemo, useState } from "react";
import { Controls } from "./components/Controls.jsx";
import { LocationButton } from "./components/LocationButton.jsx";
import { RestaurantCard } from "./components/RestaurantCard.jsx";
import { filterRestaurantsByCuisine } from "./lib/filter.js";
import { getCurrentPosition } from "./lib/geolocation.js";
import { pickRandomOne } from "./lib/randomize.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

function App() {
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(1000);
  const [placeType, setPlaceType] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [error, setError] = useState(null);

  const filteredRestaurants = useMemo(
    () => filterRestaurantsByCuisine(restaurants, placeType),
    [restaurants, placeType],
  );

  const onRequestLocation = async () => {
    try {
      setLoadingLocation(true);
      setError(null);
      const currentLocation = await getCurrentPosition();
      setLocation(currentLocation);
    } catch {
      setError("Could not access your location. Please allow geolocation and try again.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const onFetchRestaurants = async () => {
    if (!location) return;
    try {
      setLoadingFetch(true);
      setError(null);
      const query = new URLSearchParams({
        lat: String(location.lat),
        lng: String(location.lng),
        radius: String(radius),
        type: placeType,
      });
      const response = await fetch(`${API_URL}/api/restaurants/nearby?${query.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch restaurants");
      }
      setRestaurants(data.restaurants);
      setSelectedRestaurant(null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch restaurants.");
    } finally {
      setLoadingFetch(false);
    }
  };

  const onRandomize = () => {
    if (!filteredRestaurants.length || isRandomizing) return;

    setIsRandomizing(true);
    let ticks = 0;
    const maxTicks = 15;

    const intervalId = window.setInterval(() => {
      const previewPick = pickRandomOne(filteredRestaurants);
      if (previewPick) {
        setSelectedRestaurant(previewPick);
      }
      ticks += 1;
      if (ticks >= maxTicks) {
        window.clearInterval(intervalId);
        setSelectedRestaurant(pickRandomOne(filteredRestaurants));
        setIsRandomizing(false);
      }
    }, 100);
  };

  return (
    <main className="mx-auto max-w-3xl space-y-5 p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Random Restaurant Picker</h1>
        <p className="text-slate-600">
          Find nearby places, filter by cuisine, and let the app choose one for you.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <LocationButton onClick={onRequestLocation} loading={loadingLocation} />
          <span className="text-sm text-slate-600">
            {location
              ? `Location set (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
              : "Location not set"}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <Controls
          radius={radius}
          placeType={placeType}
          onRadiusChange={setRadius}
          onPlaceTypeChange={setPlaceType}
          onFetch={onFetchRestaurants}
          loading={loadingFetch}
          canFetch={Boolean(location)}
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-700">
            {restaurants.length} fetched, {filteredRestaurants.length} after filters
          </p>
          <button
            type="button"
            onClick={onRandomize}
            disabled={!filteredRestaurants.length || isRandomizing}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRandomizing ? "Randomizing..." : "Randomize"}
          </button>
        </div>

        {isRandomizing ? (
          <p className="mb-3 text-sm font-medium text-emerald-700">
            Picking a restaurant...
          </p>
        ) : null}

        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
        {!filteredRestaurants.length && !error ? (
          <p className="mb-3 text-sm text-slate-500">
            Fetch restaurants first or widen your search.
          </p>
        ) : null}

        {filteredRestaurants.length ? (
          <div className="mb-4 overflow-hidden rounded-lg border border-slate-200">
            <div className="max-h-72 overflow-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Image</th>
                    <th className="px-3 py-2 font-semibold">Name</th>
                    <th className="px-3 py-2 font-semibold">Rating</th>
                    <th className="px-3 py-2 font-semibold">Price</th>
                    <th className="px-3 py-2 font-semibold">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRestaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="border-t border-slate-100">
                      <td className="px-3 py-2">
                        {restaurant.imageUrl ? (
                          <img
                            src={restaurant.imageUrl}
                            alt={restaurant.name}
                            className="h-12 w-16 rounded object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-12 w-16 items-center justify-center rounded bg-slate-100 text-xs text-slate-500">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-800">{restaurant.name}</td>
                      <td className="px-3 py-2 text-slate-600">{restaurant.rating ?? "N/A"}</td>
                      <td className="px-3 py-2 text-slate-600">{restaurant.priceLevel ?? "N/A"}</td>
                      <td className="px-3 py-2 text-slate-600">{restaurant.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <RestaurantCard restaurant={selectedRestaurant} />
      </section>
    </main>
  );
}

export default App;
