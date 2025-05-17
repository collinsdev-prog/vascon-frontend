'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardHeader from '../../components/layout/DashboardHeader';
import '@/styles/DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for device width on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkMobile();

    // Set up event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check for saved sidebar state on mount (but respect mobile detection)
  useEffect(() => {
    if (!isMobile) {
      const savedState = localStorage.getItem('sidebarOpen');
      if (savedState !== null) {
        setSidebarOpen(savedState === 'true');
      }
    }
  }, [isMobile]);

  // Save sidebar state when it changes (for non-mobile only)
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebarOpen', isSidebarOpen);
    }
  }, [isSidebarOpen, isMobile]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Handle sidebar close when clicking outside on mobile
  const handleContentClick = () => {
    if (isMobile && isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar 
        userRole={user?.role} 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
        isMobile={isMobile}
      />
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      <div 
        className={`dashboard-content ${isSidebarOpen && !isMobile ? 'with-sidebar' : ''}`}
        onClick={handleContentClick}
      >
        <DashboardHeader 
          user={user} 
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;