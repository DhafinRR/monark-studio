import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  webpack: (config) => {
    // Explicitly set @ alias to bypass tsconfig.json resolution issues
    config.resolve.alias['@'] = path.join(process.cwd(), 'src')
    return config
  },
}

export default nextConfig