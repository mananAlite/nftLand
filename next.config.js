/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'gateway.pinata.cloud', 'ipfs.io']
  }
};

module.exports = nextConfig;
