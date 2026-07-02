import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // next/image only optimizes remote images from allow-listed hosts.
  // picsum.photos = seed placeholders; res.cloudinary.com = where our real
  // images will live once Cloudinary is set up.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
