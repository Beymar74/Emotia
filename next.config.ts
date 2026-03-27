import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@vercel/og"],
  },
  serverExternalPackages: ["@vercel/og"],
};
export default nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
