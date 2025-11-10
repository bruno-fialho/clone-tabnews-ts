/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude node-pg-migrate from webpack bundling on the server
      config.externals = config.externals || [];
      config.externals.push('node-pg-migrate');
    }
    return config;
  },
};

module.exports = nextConfig;
