'use client';

import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext(undefined);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
      throw new Error('useGlobalLoading must be used within LoadingProvider');
    }
    return context;
  };