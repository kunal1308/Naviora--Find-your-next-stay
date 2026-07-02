"use client";

// The filter sidebar. It's a Client Component because it reads the current URL
// (useSearchParams) and navigates on change (useRouter). It stores NO local
// state — the URL is the single source of truth, so the server page re-renders
// with fresh data on every change, and the filters survive refresh/share.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AMENITIES } from "@/constants";
import { trackEvent } from "@/lib/analytics";

const SORTS = [
  { value: "", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const PRICES = [
  { value: "", label: "Any price" },
  { value: "5000", label: "Under ₹5,000" },
  { value: "8000", label: "Under ₹8,000" },
  { value: "12000", label: "Under ₹12,000" },
  { value: "25000", label: "Under ₹25,000" },
];

const RATINGS = [
  { value: "", label: "Any rating" },
  { value: "4", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];

const FILTER_KEYS = ["minRating", "maxPrice", "amenities", "sort"];

export default function HotelFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const selectedAmenities = (params.get("amenities") ?? "")
    .split(",")
    .filter(Boolean);

  function push(next: URLSearchParams) {
    next.delete("page"); // any filter change returns to page 1
    const qs = next.toString();
    // scroll: false keeps the viewport steady while results update.
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    void trackEvent("filter_hotels", { filter: key, value: value || "any" });
    push(next);
  }

  function toggleAmenity(id: string) {
    const set = new Set(selectedAmenities);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    const next = new URLSearchParams(params.toString());
    const value = [...set].join(",");
    if (value) next.set("amenities", value);
    else next.delete("amenities");
    void trackEvent("filter_hotels", { filter: "amenity", value: id });
    push(next);
  }

  function clearFilters() {
    const next = new URLSearchParams(params.toString());
    FILTER_KEYS.forEach((k) => next.delete(k));
    push(next);
  }

  const hasFilters = FILTER_KEYS.some((k) => params.get(k));

  const selectClass =
    "w-full rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none";

  return (
    <aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-20 lg:self-start">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Filters</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-brand-700 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Sort by
        </span>
        <select
          value={params.get("sort") ?? ""}
          onChange={(e) => setParam("sort", e.target.value)}
          className={selectClass}
        >
          {SORTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Max price / night
        </span>
        <select
          value={params.get("maxPrice") ?? ""}
          onChange={(e) => setParam("maxPrice", e.target.value)}
          className={selectClass}
        >
          {PRICES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-400">
          Compared in ₹ across currencies.
        </p>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Guest rating
        </span>
        <select
          value={params.get("minRating") ?? ""}
          onChange={(e) => setParam("minRating", e.target.value)}
          className={selectClass}
        >
          {RATINGS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Amenities
        </span>
        <div className="space-y-1.5">
          {AMENITIES.map((a) => (
            <label
              key={a.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a.id)}
                onChange={() => toggleAmenity(a.id)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span>
                {a.icon} {a.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
