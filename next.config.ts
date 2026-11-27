import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Turbopack rooted in this repository, not the parent Windows user folder.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
