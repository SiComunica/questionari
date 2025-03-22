import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const userType = request.cookies.get('userType')
  
  console.log('Middleware - Path:', path)
  console.log('Middleware - UserType:', userType?.value)

  // Permetti sempre l'accesso alla home
  if (path === '/') {
    return NextResponse.next()
  }

  // Se non c'è userType, reindirizza alla home
  if (!userType) {
    console.log('Middleware - No userType, redirecting to home')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Verifica accesso alle rotte protette
  if (path.startsWith('/admin')) {
    if (userType.value !== 'admin') {
      console.log('Middleware - Invalid admin access')
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else if (path === '/operatore') {
    if (userType.value !== 'operatore') {
      console.log('Middleware - Invalid operator access')
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else if (path === '/anonimo') {
    if (userType.value !== 'anonimo') {
      console.log('Middleware - Invalid anonymous access')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/operatore',
    '/anonimo'
  ]
} 