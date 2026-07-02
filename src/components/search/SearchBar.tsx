"use client";

// Client Component: it has form state and pushes to a new route on submit.
// On submit it navigates to /hotels?destination=...&guests=... — the /hotels
// page will later read those from searchParams to filter results.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export default function SearchBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [guests, setGuests] = useState(2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set("destination", destination.trim());
    params.set("guests", String(guests));
    void trackEvent("search", {
      search_term: destination.trim() || "(any)",
      guests,
    });
    router.push(`/hotels?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200 sm:flex-row sm:items-end"
    >
      <label className="flex flex-1 flex-col gap-1 px-2 text-left">
        <span className="text-xs font-medium text-slate-500">Where to?</span>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Goa, Dubai, Tokyo…"
          className="w-full border-0 bg-transparent p-0 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
        />
      </label>

      <div className="hidden w-px self-stretch bg-slate-200 sm:block" />

      <label className="flex flex-col gap-1 px-2 text-left">
        <span className="text-xs font-medium text-slate-500">Guests</span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="border-0 bg-transparent p-0 text-slate-900 focus:outline-none focus:ring-0"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Search
      </button>
    </form>
  );
}
