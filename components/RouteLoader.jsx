'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalLoading } from '@/context/LoadingContext';

export default function RouteLoader() {
  const router = useRouter();
  const { setLoading } = useGlobalLoading();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events?.on('routeChangeStart', handleStart);
    router.events?.on('routeChangeComplete', handleStop);
    router.events?.on('routeChangeError', handleStop);

    return () => {
      router.events?.off('routeChangeStart', handleStart);
      router.events?.off('routeChangeComplete', handleStop);
      router.events?.off('routeChangeError', handleStop);
    };
  }, [router]);

  return null;
}
