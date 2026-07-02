"use client";

// The heart toggle. Used inside HotelCard (which is a <Link>) and on the detail
// page. It preventDefault/stopPropagation so clicking the heart never triggers
// the surrounding card navigation. Signed-out users are sent to /login.

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";
import { trackEvent } from "@/lib/analytics";

export default function WishlistButton({
  hotelId,
  className,
}: {
  hotelId: string;
  className?: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(hotelId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(ROUTES.login);
      return;
    }
    void trackEvent(saved ? "remove_from_wishlist" : "add_to_wishlist", {
      item_id: hotelId,
    });
    toggle(hotelId);
  }

  // Wishlist is hidden for signed-out visitors — they browse freely, but the
  // save affordance only appears once logged in.
  if (!user) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      className={cn(
        "grid place-items-center rounded-full bg-white/95 shadow-sm transition hover:scale-105",
        className,
      )}
    >
      <span className={saved ? "text-red-500" : "text-slate-500"}>
        {saved ? "♥" : "♡"}
      </span>
    </button>
  );
}
