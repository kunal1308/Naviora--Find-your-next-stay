"use client";

// Mounted on the marketing home page: once Firebase restores the session,
// signed-in users skip the landing page — admins to their listings, everyone
// else to the hotel catalog. Signed-out visitors see the landing page as-is.
// Renders nothing; auth is client-side, so this can't be done on the server.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { ROUTES, isAdmin } from "@/constants";

export default function HomeRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(isAdmin(user.email) ? ROUTES.admin : ROUTES.hotels);
  }, [user, loading, router]);

  return null;
}
