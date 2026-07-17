/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@paddle-club/ui", "@paddle-club/feature-flags"],
  reactStrictMode: true
};

export default nextConfig;
