// Thin Server Component shell (keeps metadata); the interactive, per-user list
// is the client <WishlistList />.

import type { Metadata } from "next";
import WishlistList from "@/features/wishlist/components/WishlistList";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-[96rem] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Your wishlist
      </h1>
      <p className="mt-2 text-slate-600">Stays you&apos;ve saved for later.</p>
      <div className="mt-8">
        <WishlistList />
      </div>
    </div>
  );
}
