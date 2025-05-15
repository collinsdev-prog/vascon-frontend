'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardRouteGroupLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }
      
      // Redirect to appropriate dashboard based on role
      if (user) {
        // If user is on the generic dashboard page, redirect to specific dashboard
        if (window.location.pathname === '/dashboard') {
          if (user.role === 'seller') {
            router.push('/dashboard/seller');
          } else if (user.role === 'buyer') {
            router.push('/dashboard/buyer');
          }
        }
        
        // Restrict access to role-specific routes
        if (
          (user.role === 'seller' && window.location.pathname.startsWith('/dashboard/buyer')) ||
          (user.role === 'buyer' && window.location.pathname.startsWith('/dashboard/seller'))
        ) {
          router.push(`/dashboard/${user.role}`);
        }
      }
    }
  }, [user, loading, isAuthenticated, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}