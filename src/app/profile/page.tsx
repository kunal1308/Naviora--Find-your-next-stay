import type { Metadata } from "next";
import ProfileView from "@/features/profile/components/ProfileView";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Profile
      </h1>
      <div className="mt-6">
        <ProfileView />
      </div>
    </div>
  );
}
