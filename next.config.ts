import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}
  },
  images: {
    domains: [
      "firebasestorage.googleapis.com"
    ]
  }
};

export default nextConfig;
