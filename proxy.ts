import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import { checkSession } from '@/lib/api/serverApi';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute = pathname.startsWith('/notes') || pathname.startsWith('/profile');

  let isAuthenticated = !!accessToken;
  let refreshedCookies: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      
      if (sessionResponse.status === 200) {
        isAuthenticated = true;
        
        const rawHeaders = sessionResponse.headers['set-cookie'];
        if (rawHeaders) {
          refreshedCookies = Array.isArray(rawHeaders) ? rawHeaders : [rawHeaders];
        }
      }
    } catch (error) {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL('/sign-in', request.url));
  } else if (isAuthRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL('/', request.url));
  } else {
    response = NextResponse.next();
  }

  if (refreshedCookies.length > 0) {
    refreshedCookies.forEach((cookieString) => {
      const [fullCookie] = cookieString.split(';');
      const [name, value] = fullCookie.split('=');
      
      response.cookies.set(name.trim(), value.trim(), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up'
  ],
};