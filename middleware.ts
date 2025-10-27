import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { UserRole } from '@prisma/client'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const session = req.nextauth.token

    // Public routes
    const publicRoutes = ['/', '/login', '/register', '/register-vendor', '/products']
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))

    if (isPublicRoute) {
      return NextResponse.next()
    }

    // API routes
    if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/public')) {
      return NextResponse.next()
    }

    // Protected routes
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Admin routes
    if (pathname.startsWith('/admin')) {
      if (session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Vendor routes
    if (pathname.startsWith('/vendor')) {
      if (session.role !== 'VENDOR' && session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes
        const publicRoutes = ['/', '/login', '/register', '/register-vendor', '/products']
        const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
        
        if (isPublicRoute || pathname.startsWith('/api/auth') || pathname.startsWith('/api/public')) {
          return true
        }
        
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.mp4|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.webp|.*\\.gif|.*\\.ico|.*\\.woff|.*\\.woff2|.*\\.ttf|.*\\.eot).*)']
}
