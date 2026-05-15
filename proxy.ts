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
        
        const setCookieHeaders = sessionResponse.headers['set-cookie'];
        
        if (setCookieHeaders) {
          setCookieHeaders.forEach((cookieString) => {
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
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};