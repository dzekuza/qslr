import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Public routes
  const publicRoutes = ['/', '/login', '/register', '/register-vendor', '/products']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Protected routes
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Vendor routes
  if (pathname.startsWith('/vendor')) {
    if (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.mp4|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.webp|.*\\.gif|.*\\.ico|.*\\.woff|.*\\.woff2|.*\\.ttf|.*\\.eot).*)']
}
