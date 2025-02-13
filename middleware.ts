import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh', 'my']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const pathname = request.nextUrl.pathname

  // Check if the pathname starts with our supported locales
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const preferredLocale = request.cookies.get('preferred-language')?.value || defaultLocale

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(
        `/${preferredLocale}${pathname === '/' ? '' : pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 