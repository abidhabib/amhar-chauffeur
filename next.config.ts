import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Externalize the pg driver and Prisma adapter so Next.js doesn't try to
  // bundle their Node.js native modules (`util/types`, `net`, `tls`, etc.)
  // into the client/edge bundle.
  serverExternalPackages: [
    "pg",
    "pg-native",
    "@prisma/adapter-pg",
    "@prisma/client",
  ],
  // Empty turbopack config (silences the webpack warning in Next.js 16)
  turbopack: {},
  // Webpack fallback for any non-turbopack builds (production, etc.)
  // Polyfill/stub Node.js built-ins that `pg` requires but aren't available
  // in the browser environment.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side: stub out Node.js built-ins that pg tries to import
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        "util/types": false,
        util: false,
        net: false,
        tls: false,
        dns: false,
        fs: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
        "pg-native": false,
      };
    }
    return config;
  },
};

export default nextConfig;
