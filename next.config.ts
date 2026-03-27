import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  serverExternalPackages: ["@vercel/og"],
};
export default nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
