import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow development scripts and live updates when testing from a phone on Wi-Fi.
  allowedDevOrigins: ["192.168.1.14"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
