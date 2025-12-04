'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-black/60 dark:text-white/60">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
