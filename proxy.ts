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

  if (!accessToken && refreshToken && isPrivateRoute) {
    try {
      const sessionResponse = await checkSession();
      
      if (sessionResponse.status === 200) {
        isAuthenticated = true;
        
        const rawHeaders = sessionResponse.headers['set-cookie'];
        if (rawHeaders) {
          refreshedCookies = Array.isArray(rawHeaders) ? rawHeaders : [rawHeaders];
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

  const response = NextResponse.next();

  if (refreshedCookies.length > 0) {
    refreshedCookies.forEach((cookieString) => {
      response.headers.append('Set-Cookie', cookieString);
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