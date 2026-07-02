import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { WishlistProvider } from "@/features/wishlist/WishlistProvider";
import FirebaseAnalytics from "@/components/analytics/FirebaseAnalytics";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// In the App Router, SEO is just a metadata export — no <head> juggling.
// metadataBase makes relative OG/sitemap URLs absolute; the opengraph-image.tsx
// file is auto-attached to openGraph + twitter.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find your next stay`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "hotels",
    "hotel booking",
    "travel",
    "stays",
    "resorts",
    "destinations",
    "book hotels",
    SITE_NAME,
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — Find your next stay`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Find your next stay`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* AuthProvider makes the current user available app-wide via useAuth(). */}
        <AuthProvider>
          <WishlistProvider>
            <Navbar />
            {/* Every page renders here, between the shared navbar and footer. */}
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </AuthProvider>
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
