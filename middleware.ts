import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Se siamo già sulla home page, non fare nulla
  if (path === '/') {
    return NextResponse.next()
  }

  // Se l'utente sta cercando di accedere a /login, reindirizza alla home
  if (path === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Per tutte le altre rotte protette, verifica l'autenticazione
  const userType = request.cookies.get('userType')?.value

  if (!userType) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Verifica i permessi in base al percorso
  if (path.startsWith('/admin') && userType !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path.startsWith('/operatore') && userType !== 'operatore') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path.startsWith('/anonimo') && userType !== 'anonimo') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/operatore/:path*', '/anonimo/:path*']
} 