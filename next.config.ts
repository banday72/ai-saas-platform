import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: "/dashboard",
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: "/dashboard",
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
