'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/auth/auth';

const ProtectedRoute = (WrappedComponent: React.ComponentType<any>) => {
  const ComponentWithAuth = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated()) {
        router.replace('/auth/sign-in');
      }
    }, [router]);

    return isAuthenticated() ? <WrappedComponent {...props} /> : null;
  };

  return ComponentWithAuth;
};

export default ProtectedRoute;