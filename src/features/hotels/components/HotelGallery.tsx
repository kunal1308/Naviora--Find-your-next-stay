"use client";

// Photo gallery for the hotel detail page. Client Component because clicking an
// image opens a lightbox (zoomed view over a blurred, dimmed backdrop) with a
// close button, prev/next, and keyboard support (Esc / ← / →).

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function HotelGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const isOpen = openAt !== null;

  const show = (i: number) => setOpenAt(((i % images.length) + images.length) % images.length);
  const close = () => setOpenAt(null);
  const next = () => setOpenAt((i) => (i === null ? i : (i + 1) % images.length));
  const prev = () =>
    setOpenAt((i) => (i === null ? i : (i - 1 + images.length) % images.length));

  // Keyboard controls + lock scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenAt(null);
      else if (e.key === "ArrowRight")
        setOpenAt((i) => (i === null ? i : (i + 1) % images.length));
      else if (e.key === "ArrowLeft")
        setOpenAt((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, images.length]);

  const initial = name.charAt(0);

  return (
    <>
      {/* Gallery grid (taller than before) */}
      <div className="mt-5 grid gap-2 sm:h-[30rem] sm:grid-cols-4 sm:grid-rows-2">
        <button
          type="button"
          onClick={() => images[0] && show(0)}
          className="relative h-80 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 sm:col-span-2 sm:row-span-2 sm:h-full"
        >
          {images[0] ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority
            />
          ) : (
            <span className="flex h-full items-center justify-center text-6xl font-bold text-white/90">
              {initial}
            </span>
          )}
        </button>

        {Array.from({ length: 4 }).map((_, i) => {
          const src = images[i + 1];
          return (
            <button
              type="button"
              key={i}
              onClick={() => src && show(i + 1)}
              disabled={!src}
              className="relative hidden overflow-hidden rounded-2xl bg-gradient-to-br from-brand-200 to-brand-400 sm:block sm:h-full"
            >
              {src && (
                <Image
                  src={src}
                  alt={`${name} photo ${i + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openAt]}
              alt={`${name} photo ${openAt + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 bottom-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            {openAt + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
