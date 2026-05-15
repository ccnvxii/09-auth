import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute = pathname.startsWith('/notes') || pathname.startsWith('/profile');

  const response = NextResponse.next();
  let isAuthenticated = !!accessToken;

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      
      if (sessionResponse.status === 200) {
        isAuthenticated = true;
        
        const setCookieHeader = sessionResponse.headers['set-cookie'];
        if (setCookieHeader) {
          response.headers.set('set-cookie', setCookieHeader.join(', '));
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
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