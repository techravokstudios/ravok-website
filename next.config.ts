import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  trailingSlash: true,
  async rewrites() {
    // const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "https://ravokbackend-production.up.railway.app";

    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
    ];
  },
  turbopack: {},
};

export default nextConfig;
