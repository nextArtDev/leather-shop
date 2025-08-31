import type { NextConfig } from 'next'

//gemini
// const securityHeaders = [
//   {
//     key: 'Content-Security-Policy',
//     value: [
//       "default-src 'self';",
//       "script-src 'self' 'unsafe-eval' 'unsafe-inline';",

//       // --- FIX IS HERE ---
//       // We are adding 'data:' to connect-src to allow the cropper's fetch() call.
//       // It's also better to be specific rather than using '*', so we list your trusted domains.
//       "connect-src 'self' mye-commerce.storage.iran.liara.space data:;",
//       // --- END FIX ---

//       "style-src 'self' 'unsafe-inline';",
//       "font-src 'self';",
//       "img-src 'self' data: blob: mye-commerce.storage.iran.liara.space;",
//       "media-src 'self' blob: mye-commerce.storage.iran.liara.space;",
//       "frame-ancestors 'none';",

//       // --- PROACTIVE ADDITION HERE ---
//       // Allow web workers from your own domain and from blobs. This is often
//       // needed by client-side libraries for performance.
//       "worker-src 'self' blob:;",
//       // --- END ADDITION ---
//     ].join(' '),
//   },
//   // All other headers remain the same...
//   {
//     key: 'Permissions-Policy',
//     value: 'camera=(), microphone=(), geolocation=()',
//   },
//   {
//     key: 'Strict-Transport-Security',
//     value: 'max-age=63072000; includeSubDomains; preload',
//   },
//   {
//     key: 'X-Frame-Options',
//     value: 'SAMEORIGIN',
//   },
//   {
//     key: 'X-Content-Type-Options',
//     value: 'nosniff',
//   },
//   {
//     key: 'Referrer-Policy',
//     value: 'origin-when-cross-origin',
//   },
//   {
//     key: 'Cross-Origin-Embedder-Policy',
//     value: 'require-corp',
//   },
//   {
//     key: 'Cross-Origin-Opener-Policy',
//     value: 'same-origin',
//   },
//   {
//     key: 'Cross-Origin-Resource-Policy',
//     value: 'same-origin',
//   },
//   {
//     key: 'Expect-CT',
//     value: 'max-age=0',
//   },
// ]

const isDev = process.env.NODE_ENV === 'development'
// const isProduction = process.env.NODE_ENV === 'production'

// Get allowed domains from environment variables
const getAllowedDomains = () => {
  const envDomains = process.env.ALLOWED_DOMAINS?.split(',') || []

  const baseDomains = [
    'mye-commerce.storage.iran.liara.space',
    'https://*.zarinpal.com',
    'https://*.better-auth.com',
    'https://api.github.com',
    'https://accounts.google.com',
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
    'https://your-production-domain.com', // Replace with actual domain
    // Add other production origins if needed
  ]
}

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self';",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
      `connect-src 'self' ${getAllowedDomains().join(' ')};`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
      "font-src 'self' https://fonts.gstatic.com data:;",
      "img-src 'self' data: blob: mye-commerce.storage.iran.liara.space https://*.zarinpal.com;",
      "media-src 'self' blob: mye-commerce.storage.iran.liara.space;",
      "frame-src 'self' https://*.zarinpal.com;",
      "frame-ancestors 'none';",
      "worker-src 'self' blob:;",
      "object-src 'none';",
    ].join(' '),
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(), geolocation=(), payment=(self)',
  },
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
        hostname: 'mye-commerce.storage.iran.liara.space',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    const corsOrigins = getCorsOrigins()

    return [
      // Strict security for public-facing pages
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
              "img-src 'self' data: blob: mye-commerce.storage.iran.liara.space https://*.zarinpal.com;",
              "media-src 'self' blob: mye-commerce.storage.iran.liara.space;",
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
          ...securityHeaders.slice(2),
        ],
      },
      // More permissive headers for admin dashboard
      {
        source: '/dashboard/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
              `connect-src 'self' mye-commerce.storage.iran.liara.space data: ${getAllowedDomains().join(
                ' '
              )};`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "font-src 'self' https://fonts.gstatic.com data:;",
              "img-src 'self' data: blob: mye-commerce.storage.iran.liara.space https://*.zarinpal.com;",
              "media-src 'self' blob: mye-commerce.storage.iran.liara.space;",
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
          ...securityHeaders.slice(2),
        ],
      },
      // CORS-enabled headers for API routes
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDev ? '*' : corsOrigins.join(','), // Allow all in dev, specific in prod
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
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
      // Specific CORS for auth endpoints
      {
        source: '/api/auth/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDev ? '*' : corsOrigins.join(','),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
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
        ],
      },
    ]
  },
}

export default nextConfig
// const nextConfig: NextConfig = {
//   output: 'standalone',
//   // missingSuspenseWithCSRBailout: false,
//   experimental: {
//     serverActions: {
//       bodySizeLimit: '5mb',
//     },
//   },
//   images: {
//     remotePatterns: [
//       new URL('https://mye-commerce.storage.iran.liara.space/**'),
//     ],
//   },
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: securityHeaders,
//       },
//     ]
//   },
// }

// export default nextConfig
