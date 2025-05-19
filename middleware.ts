import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se non c'è sessione, reindirizza al login
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

// Proteggi tutte le rotte che iniziano con /dashboard
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/questionari-strutture/:path*',
    '/questionari-operatori/:path*'
  ],
} 