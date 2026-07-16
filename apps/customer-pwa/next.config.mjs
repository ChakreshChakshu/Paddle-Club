/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@paddle-club/ui", "@paddle-club/feature-flags", "@paddle-club/db"],
  reactStrictMode: true
};

export default nextConfig;
