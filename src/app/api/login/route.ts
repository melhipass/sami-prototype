import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'sami_auth';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validUser = process.env.temp_user;
  const validPass = process.env.temp_pass;

  if (!validUser || !validPass) {
    return NextResponse.json(
      { error: 'Login no configurado en el servidor.' },
      { status: 500 },
    );
  }

  if (username !== validUser || password !== validPass) {
    return NextResponse.json(
      { error: 'Usuario o contraseña incorrectos.' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return response;
}
