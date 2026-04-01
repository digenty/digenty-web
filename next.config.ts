import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/staff",
        permanent: false, // use true only if it will NEVER change
      },
    ];
  },
};

export default nextConfig;
