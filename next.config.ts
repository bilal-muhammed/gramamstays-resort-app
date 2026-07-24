import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  optimizeFonts: true,
  productionBrowserSourceMaps: false,
}

export default nextConfig
