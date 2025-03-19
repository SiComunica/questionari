import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Verifica il ruolo dall'URL
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isOperatoreRoute = req.nextUrl.pathname.startsWith('/operatore');
  const isAnonimoRoute = req.nextUrl.pathname.startsWith('/anonimo');

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const userRole = session.user.user_metadata.role;

  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (isOperatoreRoute && userRole !== 'operatore') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (isAnonimoRoute && userRole !== 'anonimo') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/operatore/:path*', '/anonimo/:path*']
}; 