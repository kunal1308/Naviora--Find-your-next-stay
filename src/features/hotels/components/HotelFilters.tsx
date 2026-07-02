"use client";

// Filters. Client Component because it reads the URL (useSearchParams) and
// navigates on change — the URL is the single source of truth.
//
// Desktop (lg+): a sticky sidebar.
// Mobile: a floating "Filters" button pinned to the bottom that opens a
// bottom-sheet (the same fields), like HomeSphere.

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  const selectedAmenities = (params.get("amenities") ?? "")
    .split(",")
    .filter(Boolean);
  const hasFilters = FILTER_KEYS.some((k) => params.get(k));

  // While the mobile sheet is open: lock background scroll + close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function push(next: URLSearchParams) {
    next.delete("page"); // any filter change returns to page 1
    const qs = next.toString();
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

  const selectClass =
    "w-full rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none";

  const clearButton = hasFilters ? (
    <button
      type="button"
      onClick={clearFilters}
      className="text-xs font-medium text-brand-700 hover:underline"
    >
      Clear all
    </button>
  ) : null;

  // The filter controls, reused in the desktop sidebar and the mobile sheet.
  const filterFields = (
    <>
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
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden space-y-5 rounded-2xl border border-slate-200 bg-white p-5 lg:block lg:sticky lg:top-20 lg:self-start">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Filters</h2>
          {clearButton}
        </div>
        {filterFields}
      </aside>

      {/* Mobile: floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters{hasFilters ? " · active" : ""}
      </button>

      {/* Mobile: bottom sheet. Backdrop is a real <button> (like MUI's Drawer)
          so tap-to-close works reliably on mobile. Sheet is a sibling on top. */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/50"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] space-y-5 overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <div className="flex items-center gap-3">
                {clearButton}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close filters"
                  className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {filterFields}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
