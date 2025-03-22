import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ottieni il path corrente
  const path = request.nextUrl.pathname

  // Se siamo già nella home, non fare nulla
  if (path === '/') {
    return NextResponse.next()
  }

  // Controlla le rotte protette
  if (path.startsWith('/admin') || path === '/operatore' || path === '/anonimo') {
    // Reindirizza alla home se non c'è userType
    const userType = request.cookies.get('userType')
    if (!userType) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Verifica che il tipo utente corrisponda al path
    if (path.startsWith('/admin') && userType.value !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (path === '/operatore' && userType.value !== 'operatore') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (path === '/anonimo' && userType.value !== 'anonimo') {
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