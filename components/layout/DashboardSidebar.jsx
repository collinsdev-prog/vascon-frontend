'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { sidebarRoutes } from "../constants/sidebarRoutes";
import {
  FiGrid, FiBox, FiPlusCircle, FiUser,
  FiHome, FiShoppingCart, FiDollarSign,
  FiClock, FiLogOut, FiPower, FiShoppingBag,
  FiX, FiArrowLeft
} from "react-icons/fi";

const iconMap = {
  grid: <FiGrid />,
  box: <FiBox />,
  "plus-circle": <FiPlusCircle />,
  user: <FiUser />,
  home: <FiHome />,
  "shopping-cart": <FiShoppingCart />,
  "dollar-sign": <FiDollarSign />,
  clock: <FiClock />,
  "shopping-bag": <FiShoppingBag />,
  "log-out": <FiLogOut />,
  power: <FiPower />,
  x: <FiX />,
  "arrow-left": <FiArrowLeft />
};

const DashboardSidebar = ({ userRole, isOpen, onToggle, isMobile }) => {
  const pathname = usePathname();
  const { logout, logoutAll } = useAuth();
  const routes = sidebarRoutes[userRole] || [];

  // Handle logout all sessions
  const handleLogoutAll = async () => {
    const result = await logoutAll();
    if (result.success) {
      // Redirect to login page or home
      window.location.href = "/auth/login"; 
    }
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "open" : "closed"} ${isMobile ? "mobile" : ""}`}>
      <div className="sidebar-header">
        {(isOpen || isMobile) && <h2 className="sidebar-logo">CHOWBOX</h2>}
        {isMobile && (
          <button className="sidebar-close" onClick={onToggle} aria-label="Close sidebar">
            <span className="icon">{iconMap["x"]}</span>
          </button>
        )}
        {!isMobile && (
          <button 
            className="sidebar-toggle" 
            onClick={onToggle} 
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <span className="icon">{iconMap["arrow-left"]}</span>
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul>
          {routes.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={`sidebar-link ${pathname === link.path ? "active" : ""}`}
                title={!isOpen && !isMobile ? link.name : ""} // Only show title when sidebar is closed and not on mobile
                onClick={isMobile ? onToggle : undefined} // Close sidebar on mobile when clicking a link
              >
                <span className="icon">{iconMap[link.icon]}</span>
                {(isOpen || isMobile) && <span className="link-text">{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-button"
          onClick={(e) => { e.preventDefault(); logout(); }}
          title={!isOpen && !isMobile ? "Logout" : ""} 
        >
          <span className="icon">{iconMap["log-out"]}</span>
          {(isOpen || isMobile) && <span>Logout</span>}
        </button>
        <button
          className="logout-all-button"
          onClick={handleLogoutAll}
          title={!isOpen && !isMobile ? "Logout All Sessions" : ""}
        >
          <span className="icon">{iconMap["power"]}</span>
          {(isOpen || isMobile) && <span>Logout All Sessions</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;