import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "digenty-bucket.lon1.digitaloceanspaces.com",
      },
    ],
  },
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
