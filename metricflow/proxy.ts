import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(req: NextRequest) {
  const hasSession = req.cookies.has('sb-metricflow-auth');
  const path = req.nextUrl.pathname;

  // RÈGLE 1 : Inconnu qui essaie de rentrer dans le SaaS = Dehors (Login)
  if (!hasSession && (path.startsWith('/dashboard') || path.startsWith('/client'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // RÈGLE 2 : Déjà connecté qui essaie de se RE-connecter = Au travail (Dashboard)
  if (hasSession && path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}