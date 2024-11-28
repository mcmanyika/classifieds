/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true, domains: ['maps.googleapis.com', 'lh3.googleusercontent.com'] },
  webpack: (config) => {
    config.cache = false
    return config
  },
};

module.exports = nextConfig;
