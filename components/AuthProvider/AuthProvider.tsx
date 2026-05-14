'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const sessionUser = await checkSession();
        if (sessionUser) {
          setUser(sessionUser);
          if (pathname === '/sign-in' || pathname === '/sign-up') {
            router.replace('/profile');
          }
        } else {
          clearIsAuthenticated();
          if (
            pathname.startsWith('/profile') ||
            pathname.startsWith('/notes')
          ) {
            router.replace('/sign-in');
          }
        }
      } catch {
        clearIsAuthenticated();
        if (pathname.startsWith('/profile') || pathname.startsWith('/notes')) {
          router.replace('/sign-in');
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}
      >
        <p>Loading session, please wait...</p>
      </div>
    );
  }

  return <>{children}</>;
}
