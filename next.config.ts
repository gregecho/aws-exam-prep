import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  env: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
  // Or use serverRuntimeConfig for server-only variables
  serverRuntimeConfig: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
};

export default nextConfig;
