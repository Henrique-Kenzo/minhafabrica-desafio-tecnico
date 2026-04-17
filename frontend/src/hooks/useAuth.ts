'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { UserProfile } from '@/types';
export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; Max-Age=0; path=/;';
    router.push('/login');
  };

  return { user, logout };
}
