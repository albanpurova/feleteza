import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Lejojmë ngarkimin e imazheve nga publik/uploads
  experimental: {},
};

export default nextConfig;
