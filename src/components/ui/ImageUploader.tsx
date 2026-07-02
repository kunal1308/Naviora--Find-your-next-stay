"use client";

// Reusable Cloudinary uploader. Shared across features → lives in components/ui.
// Picks a file, uploads it to Cloudinary via lib/cloudinary, and hands the
// resulting URL back to the parent through onUploaded. The parent decides what
// to do with the URL (save to a user doc, a hotel doc, etc.).
//
// The SAME component plugs into the admin hotel form later to replace the
// seeded placeholder images with real photos.

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/cloudinary";

export default function ImageUploader({
  onUploaded,
  label = "Upload image",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = ""; // allow re-selecting same file
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-60"
      >
        {uploading ? "Uploading…" : label}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
