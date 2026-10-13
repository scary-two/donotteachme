import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phone testing through this computer's local network address.
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
