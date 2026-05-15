'use client';
import { useEffect, useState } from 'react';
import { checkSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRefreshing, setIsRefreshing] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const refresh = async () => {
      try {
        const user = await checkSession();
        if (user) setUser(user);
        else clearIsAuthenticated();
      } catch {
        clearIsAuthenticated();
      } finally {
        setIsRefreshing(false);
      }
    };
    refresh();
  }, [setUser, clearIsAuthenticated]);

  if (isRefreshing) return <p>Loading session...</p>; // Твій лоадер тут

  return <>{children}</>;
}
