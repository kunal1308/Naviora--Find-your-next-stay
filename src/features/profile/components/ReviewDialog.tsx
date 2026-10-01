"use client";

// Modal for reviewing a finished stay: 1–5 stars + a short comment.
// Same look and Escape/backdrop behaviour as ConfirmDialog.

import { useEffect, useState } from "react";
import { submitReview } from "@/services/reviews";
import { useToast } from "@/components/ui/ToastProvider";
import type { Booking } from "@/types";

const MAX_COMMENT = 1000;

export default function ReviewDialog({
  booking,
  hotelName,
  userId,
  author,
  onClose,
  onSaved,
}: {
  booking: Booking;
  hotelName: string;
  userId: string;
  author: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saving, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a short comment.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await submitReview({
        booking,
        userId,
        author,
        rating,
        comment: comment.trim(),
      });
      toast.success("Thanks for your review!");
      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't save review.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  const shown = hovered || rating;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="presentation"
      onClick={() => !saving && onClose()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label="Write a review"
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-slate-900">Write a review</h3>
        <p className="mt-1 text-sm text-slate-600">
          How was your stay at{" "}
          <span className="font-medium text-slate-700">{hotelName}</span>?
        </p>

        <div
          className="mt-4 flex gap-1"
          onMouseLeave={() => setHovered(0)}
          role="radiogroup"
          aria-label="Rating"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star === 1 ? "" : "s"}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              className={`text-3xl leading-none transition-colors ${
                star <= shown ? "text-amber-400" : "text-slate-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Your review</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
            rows={4}
            placeholder="What did you like? What could be better?"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none"
          />
          <span className="text-xs text-slate-400">
            {comment.length}/{MAX_COMMENT}
          </span>
        </label>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Submitting…" : "Submit review"}
          </button>
        </div>
      </form>
    </div>
  );
}
