import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'roca-digital-secret-change-in-production-32chars'
);

const COOKIE = 'rd_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

export async function createSession(userId: string, nome: string) {
  const token = await new SignJWT({ userId, nome })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string; nome: string };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
