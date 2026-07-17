import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@paddle-club/ui", "@paddle-club/feature-flags", "@paddle-club/db"],
  reactStrictMode: true
};

export default withPWA(nextConfig);
