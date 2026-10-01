"use client";

// Create/edit form for a hotel. Handles both modes: pass `initial` to edit,
// omit it to create. Images are uploaded to Cloudinary via <ImageUploader />;
// we store the returned URLs on the hotel. Submitting writes to Firestore
// (allowed only for the admin email per firestore.rules).

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Hotel } from "@/types";
import { AMENITIES, ROUTES } from "@/constants";
import { slugify } from "@/utils";
import { createHotel, updateHotel } from "@/services/hotels";
import { newHotelId, validateHotelForm } from "@/features/admin/hotelFormRules";
import ImageUploader from "@/components/ui/ImageUploader";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { trackEvent } from "@/lib/analytics";

const CURRENCIES = ["INR", "AED", "SGD", "JPY", "USD", "EUR"];

// Red asterisk for required field labels
const Required = () => <span className="text-red-500"> *</span>;

// Shared by /admin (curated hotels) and /host (user listings). In host mode it
// stamps the current user as the owner and returns to the host dashboard.
export default function HotelForm({
  initial,
  asHost = false,
}: {
  initial?: Hotel;
  asHost?: boolean;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const editing = Boolean(initial);
  const redirectTo = asHost ? ROUTES.host : ROUTES.admin;

  const [name, setName] = useState(initial?.name ?? "");
  const [destination, setDestination] = useState(initial?.destination ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [pricePerNight, setPricePerNight] = useState(
    initial?.pricePerNight?.toString() ?? "",
  );
  const [currency, setCurrency] = useState(initial?.currency ?? "INR");
  const [maxGuests, setMaxGuests] = useState(
    initial?.maxGuests?.toString() ?? "",
  );
  const [amenities, setAmenities] = useState<string[]>(
    initial?.amenities ?? [],
  );
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  const [saving, setSaving] = useState(false);

  function toggleAmenity(id: string) {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const problem = validateHotelForm({
      name,
      destination,
      country,
      description,
      pricePerNight,
      maxGuests,
      images,
    });
    if (problem) {
      toast.error(problem);
      return;
    }

    // Rating and review count aren't in the form: they come from guest
    // reviews (see services/reviews), so edits leave them untouched.
    const details: Omit<Hotel, "rating" | "reviewCount"> = {
      id: initial?.id ?? newHotelId(name),
      slug: slugify(name),
      name: name.trim(),
      destination: destination.trim(),
      country: country.trim(),
      description: description.trim(),
      pricePerNight: Number(pricePerNight),
      currency,
      images,
      amenities: amenities as Hotel["amenities"],
      maxGuests: Number(maxGuests),
      // No longer edited in the form: keep existing coordinates on edit
      coordinates: initial?.coordinates ?? { lat: 0, lng: 0 },
    };

    // Preserve owner on edit; stamp current user as owner for new host listings.
    const owner = initial?.ownerId ?? (asHost ? user?.uid : undefined);
    if (owner) details.ownerId = owner;

    setSaving(true);
    try {
      if (editing) {
        await updateHotel(initial!.id, details);
      } else {
        await createHotel({ ...details, rating: 0, reviewCount: 0 });
      }
      void trackEvent(editing ? "edit_listing" : "create_listing", { asHost });
      toast.success(editing ? "Listing updated." : "Listing created.");
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Name<Required />
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Destination (city)<Required />
          </span>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Country<Required />
          </span>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Description<Required />
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Price / night<Required />
          </span>
          <input
            type="number"
            min="0"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Currency<Required />
          </span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={inputClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Max guests<Required />
          </span>
          <input
            type="number"
            min="1"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      {/* Amenities */}
      <div>
        <span className="text-sm font-medium text-slate-700">Amenities</span>
        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {AMENITIES.map((a) => (
            <label
              key={a.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
            >
              <input
                type="checkbox"
                checked={amenities.includes(a.id)}
                onChange={() => toggleAmenity(a.id)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              {a.icon} {a.label}
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <span className="text-sm font-medium text-slate-700">
          Images<Required />
        </span>
        <p className="text-xs text-slate-400">
          At least one photo is required.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((url) => (
            <div
              key={url}
              className="relative h-24 w-32 overflow-hidden rounded-lg border border-slate-200"
            >
              <Image
                src={url}
                alt="Hotel"
                fill
                sizes="128px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setImages((p) => p.filter((u) => u !== url))}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-xs text-white"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <ImageUploader
            label="+ Upload image"
            onUploaded={(url) => setImages((p) => [...p, url])}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : editing ? "Save changes" : "Create hotel"}
        </button>
        <button
          type="button"
          onClick={() => router.push(redirectTo)}
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
