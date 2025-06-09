import type { NextConfig } from "next";
const { withNetlify } = require('@netlify/next');

// Basic Next.js configuration.
const nextConfig: NextConfig = {};

export default nextConfig;

module.exports = withNetlify({
  reactStrictMode: true,
});