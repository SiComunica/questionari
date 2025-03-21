import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.log('Middleware - Path richiesto:', path)
  
  // Se siamo già sulla home page, non fare nulla
  if (path === '/') {
    return NextResponse.next()
  }

  // Se l'utente sta cercando di accedere a /login, reindirizza alla home
  if (path === '/login') {
    console.log('Reindirizzamento da /login a /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Per tutte le altre rotte protette, verifica l'autenticazione
  const userType = request.cookies.get('userType')?.value
  console.log('Middleware - UserType:', userType)

  if (!userType) {
    console.log('Nessun userType trovato, reindirizzamento a /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Verifica i permessi in base al percorso
  if (path.startsWith('/admin') && userType !== 'admin') {
    console.log('Accesso admin non autorizzato')
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path.startsWith('/operatore') && userType !== 'operatore') {
    console.log('Accesso operatore non autorizzato')
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path.startsWith('/anonimo') && userType !== 'anonimo') {
    console.log('Accesso anonimo non autorizzato')
    return NextResponse.redirect(new URL('/', request.url))
  }

  console.log('Accesso autorizzato')
  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/operatore/:path*', '/anonimo/:path*']
} 