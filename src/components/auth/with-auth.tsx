'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { redirectTo?: string } = {}
) {
  return function WithAuthWrapper(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const redirectTo = options.redirectTo || '/login';

    useEffect(() => {
      if (!loading && !user) {
        router.push(redirectTo);
      }
    }, [user, loading, router, redirectTo]);

    if (loading || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    return <WrappedComponent {...(props as P)} />;
  };
}

export function withGuest<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { redirectTo?: string } = {}
) {
  return function WithGuestWrapper(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const redirectTo = options.redirectTo || '/dashboard';

    useEffect(() => {
      if (!loading && user) {
        router.push(redirectTo);
      }
    }, [user, loading, router, redirectTo]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    return <WrappedComponent {...(props as P)} />;
  };
}
