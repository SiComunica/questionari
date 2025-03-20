import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Verifica il ruolo dall'URL
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isOperatoreRoute = request.nextUrl.pathname.startsWith('/operatore');
  const isAnonimoRoute = request.nextUrl.pathname.startsWith('/anonimo');

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const userRole = session.user.user_metadata.role;

  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (isOperatoreRoute && userRole !== 'operatore') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (isAnonimoRoute && userRole !== 'anonimo') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/operatore/:path*', '/anonimo/:path*']
}; 