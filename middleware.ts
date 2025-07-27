import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = [
    "/vendor/dashboard",
    "/vendor/orders",
    "/vendor/analytics",
    "/vendor/wallet",
    "/vendor/reports",
    "/supplier/dashboard",
    "/supplier/inventory",
    "/supplier/orders",
    "/supplier/analytics",
    "/supplier/transactions",
  ]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // In a real app, you'd check for JWT token in cookies
    // For now, we'll let the client-side handle auth redirects
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
