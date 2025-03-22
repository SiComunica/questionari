import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userType = request.cookies.get('userType')?.value
  const path = request.nextUrl.pathname

  // Permetti sempre l'accesso alla home
  if (path === '/') {
    return NextResponse.next()
  }

  // Se non c'è userType, reindirizza alla home
  if (!userType) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Verifica le rotte protette
  if (path.startsWith('/admin') && userType !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path === '/operatore' && userType !== 'operatore') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path === '/anonimo' && userType !== 'anonimo') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 