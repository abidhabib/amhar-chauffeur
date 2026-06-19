import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Externalize the pg driver and Prisma adapter so Next.js doesn't try to
  // bundle them. `pg` uses Node.js native modules that don't play well with
  // bundlers.
  serverExternalPackages: [
    "pg",
    "@prisma/adapter-pg",
  ],
  // Empty turbopack config (silences the webpack warning in Next.js 16)
  turbopack: {},
};

export default nextConfig;
