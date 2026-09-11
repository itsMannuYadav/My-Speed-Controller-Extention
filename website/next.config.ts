import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The website imports the time-calculator/constants straight from the
  // workspace package (raw TS, not pre-built) — this tells Next to transpile it.
  transpilePackages: ["@speedpilot/shared"],
};

export default nextConfig;
