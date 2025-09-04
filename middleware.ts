import { betterFetch } from '@better-fetch/fetch'
import type { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

type Session = typeof auth.$Infer.Session

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const { data: session, error } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '', // Forward the cookies from the request
      },
      timeout: 5000,
    }
  )

  if (error || !session) {
    console.error('Session fetch error:', error)
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/order/:path*',
    '/shipping-address/:path*',
    '/place-order/:path*',
    '/cart/:path*',
  ],
}
