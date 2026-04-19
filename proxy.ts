import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'roca-digital-secret-change-in-production-32chars'
);

const PUBLIC = ['/login'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('rd_session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('rd_session');
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|manifest.json|icon).*)'],
};
