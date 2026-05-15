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
  const isApiRoute = pathname.startsWith('/api');

  let isAuthenticated = !!accessToken;
  let refreshedCookies: string[] = [];

  if (refreshToken && (isPrivateRoute || isApiRoute) && !accessToken) {
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

  const requestHeaders = new Headers(request.headers);

  if (refreshedCookies.length > 0) {
    const currentCookies = request.headers.get('cookie') || '';
    
    const newCookiesMap = new Map();
    refreshedCookies.forEach(c => {
      const [pair] = c.split(';');
      const [name, value] = pair.split('=');
      newCookiesMap.set(name.trim(), value.trim());
    });

    let updatedCookieString = currentCookies;
    newCookiesMap.forEach((value, name) => {
      if (updatedCookieString.includes(`${name}=`)) {
        updatedCookieString = updatedCookieString.replace(
          new RegExp(`${name}=[^;]+`),
          `${name}=${value}`
        );
      } else {
        updatedCookieString += `; ${name}=${value}`;
      }
    });

    requestHeaders.set('cookie', updatedCookieString);
  }

  if (isPrivateRoute && !isAuthenticated && !refreshToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

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
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up', '/api/:path*'],
};