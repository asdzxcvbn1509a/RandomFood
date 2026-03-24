export function RestaurantCard({ restaurant }) {
  if (!restaurant) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">
        No restaurant selected yet.
      </div>
    );
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {restaurant.imageUrl ? (
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="mb-4 h-48 w-full rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500">
          No image available
        </div>
      )}
      <h2 className="text-xl font-semibold">{restaurant.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{restaurant.address}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
        <span>Rating: {restaurant.rating ?? "N/A"}</span>
        <span>Price: {restaurant.priceLevel ?? "N/A"}</span>
      </div>
      <a
        href={restaurant.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline"
      >
        Open in Google Maps
      </a>
    </article>
  );
}
