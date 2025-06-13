import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [new URL('https://avatars.githubusercontent.com/u/129685107?v=4')],
  },
};

export default nextConfig;
