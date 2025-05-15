// components/layout/PublicLayout.js
'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="layout public-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;