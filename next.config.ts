import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

/** Keep Next.js rooted in this project (avoids C:\Users\Admin\package-lock.json hijacking .next paths) */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
