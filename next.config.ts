import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: { root: process.cwd() },
  redirects() {
    return [1, 2, 3, 4, 5].map((id) => ({
      source: `/cardario${id}`,
      destination: `/cardapio${id}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
