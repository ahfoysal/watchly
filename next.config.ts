import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained server build for the Docker image.
  output: "standalone",
  // Node-native packages that should run outside the bundler.
  serverExternalPackages: ["@consumet/extensions", "ioredis", "@prisma/client"],
  images: {
    // Posters/covers come from many third-party CDNs (AniList, TVDB, etc.).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
