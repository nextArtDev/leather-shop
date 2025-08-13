import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      new URL('https://mye-commerce.storage.iran.liara.space/**'),
    ],
  },
}

export default nextConfig
