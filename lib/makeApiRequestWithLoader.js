'use client';

import { useCallback } from 'react';
import { useGlobalLoading } from '@/context/LoadingContext';
import { makeApiRequest } from '@/lib/apiClient';

export const useApiWithLoader = () => {
  const { setLoading } = useGlobalLoading();

  const request = useCallback(async (...args) => {
    setLoading(true);
    try {
      return await makeApiRequest(...args);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return request; // now it's a stable function reference
};
