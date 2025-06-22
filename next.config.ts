import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'oaidalleapiprodscus.blob.core.windows.net',
    ],
  },
  devIndicators: false,
};

export default nextConfig;