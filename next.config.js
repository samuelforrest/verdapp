// next.config.js
const { withNetlify } = require('@netlify/next');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // add any other config here
};

module.exports = withNetlify(nextConfig);