import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

// Get allowed domains from environment variables
const getAllowedDomains = () => {
  const envDomains = process.env.ALLOWED_DOMAINS?.split(',') || []

  const baseDomains = [
    'https://kharak.storage.c2.liara.space',
    'https://*.zarinpal.com',
    'https://*.better-auth.com',
    'https://api.github.com',
    'https://accounts.google.com',
    'https://kharak.liara.run',
    // SMS service domains for Better-Auth phone plugin
    'https://api.twilio.com',
    'https://*.twilio.com',
    'https://api.kavenegar.com',
    'https://*.kavenegar.com',
    'https://api.smsir.io',
    'https://api.ghasedaksms.com',
  ]

  if (isDev) {
    return [
      ...baseDomains,
      ...envDomains,
      'data:', // Important for development
    ]
  }

  return [...baseDomains, ...envDomains]
}

// Get CORS origins for API routes
const getCorsOrigins = () => {
  if (isDev) {
    return [
      'http://localhost:3000',
      'http://192.168.1.159:3000',
      'http://127.0.0.1:3000',
      // Add other local IPs if needed
    ]
  }

  return [
    'https://kharak.liara.run', // Replace with your actual domain
    // Add other production origins if needed
  ]
}

// Base security headers
const baseSecurityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Expect-CT',
    value: 'max-age=0',
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kharak.storage.c2.liara.space',
        pathname: '/**',
      },
    ],
    // Optimize for your use case
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  async headers() {
    const corsOrigins = getCorsOrigins()

    return [
      // Public pages - Strict security
      {
        source: '/((?!dashboard|api).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline';",
              `connect-src 'self' ${getAllowedDomains().join(' ')};`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "font-src 'self' https://fonts.gstatic.com data:;",
              "img-src 'self' data: blob: https://kharak.storage.c2.liara.space https://*.zarinpal.com;",
              "media-src 'self' blob: https://kharak.storage.c2.liara.space;",
              "frame-src 'self' https://*.zarinpal.com;",
              "frame-ancestors 'none';",
              "worker-src 'self' blob:;",
              "object-src 'none';",
            ].join(' '),
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          ...baseSecurityHeaders,
        ],
      },

      // Dashboard - More permissive for admin functionality
      {
        source: '/dashboard/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
              `connect-src 'self' https://kharak.storage.c2.liara.space data: ${getAllowedDomains().join(
                ' '
              )};`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "font-src 'self' https://fonts.gstatic.com data:;",
              "img-src 'self' data: blob: https://kharak.storage.c2.liara.space https://*.zarinpal.com;",
              "media-src 'self' blob: https://kharak.storage.c2.liara.space;",
              "frame-src 'self' https://*.zarinpal.com;",
              "frame-ancestors 'none';",
              "worker-src 'self' blob:;",
              "object-src 'none';",
            ].join(' '),
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(self), microphone=(), geolocation=(), payment=(self)',
          },
          ...baseSecurityHeaders,
        ],
      },

      // API routes - CORS enabled
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDev ? '*' : corsOrigins.join(','),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Accept, Origin, User-Agent',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // 24 hours
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },

      // Better-Auth specific endpoints - Most permissive for auth flows
      {
        source: '/api/auth/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDev ? '*' : corsOrigins.join(','),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Accept, Origin, User-Agent, Cache-Control, Pragma',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          // Important for Better-Auth phone plugin
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },

      // Phone/SMS specific routes for Better-Auth
      {
        source: '/api/auth/send-sms',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDev ? '*' : corsOrigins.join(','),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
      {
        source: '/api/auth/verify-phone',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDev ? '*' : corsOrigins.join(','),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ]
  },
}

export default nextConfig
