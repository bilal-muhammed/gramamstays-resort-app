/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pg', '@prisma/adapter-pg', 'bcryptjs', 'jsonwebtoken'],
}

export default nextConfig
