/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 13+
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Temporarily disable optimization for Supabase URLs until properly configured
    unoptimized: !!(process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL),
  },
  // Disable static optimization for dynamic routes to prevent caching issues
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
