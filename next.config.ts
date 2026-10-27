import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  serverExternalPackages: ["jspdf", "html2canvas"],
  // Lets the dev server be opened as http://127.0.0.1:8000 as well as localhost: a different host has its own
  // cookie jar, so a second person can be signed in side by side. Without it, live reload is blocked on that host.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.digitaloceanspaces.com",
      },
    ],
  },
};

export default withSerwist(nextConfig);
