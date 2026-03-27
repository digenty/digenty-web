import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/staff",
        permanent: false,
      },
      {
        source: "/auth",
        destination: "/auth/staff",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
