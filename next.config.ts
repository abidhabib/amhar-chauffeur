import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Externalize PGlite and the Prisma adapter so Next.js doesn't try to bundle
  // their WASM/Node.js native modules.
  serverExternalPackages: [
    "@electric-sql/pglite",
    "pglite-prisma-adapter",
    "@prisma/adapter-pg",
  ],
  // Empty turbopack config to silence the webpack warning
  turbopack: {},
};

export default nextConfig;
