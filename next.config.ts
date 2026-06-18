import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

// Skip the Cloudflare dev emulator (workerd/miniflare + vm monkey-patch) when
// SKIP_CF_DEV is set — lets `next dev` boot for UI work. Deploys never set this.
if (!process.env.SKIP_CF_DEV) {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
