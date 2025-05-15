'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useGlobalLoading } from '@/context/LoadingContext';
import '@/styles/GlobalLoader.css';

export default function GlobalLoader() {
  const pathname = usePathname();
  const { loading } = useGlobalLoading();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowLoader(true);
    } else {
      const timer = setTimeout(() => setShowLoader(false), 300); // Smooth fade-out
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!showLoader) return null;

  return (
    <div className="loaderWrapper">
      <div className="spinner" />
    </div>
  );
}
