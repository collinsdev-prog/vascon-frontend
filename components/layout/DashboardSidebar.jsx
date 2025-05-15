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
};

const DashboardSidebar = ({ userRole, isOpen, onToggle }) => {
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
    <aside className={`dashboard-sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {isOpen && <h2 className="sidebar-logo">CHOWBOX</h2>}
      </div>

      <nav className="sidebar-nav">
        <ul>
          {routes.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={`sidebar-link ${pathname === link.path ? "active" : ""}`}
                title={!isOpen ? link.name : ""} // Only show title when sidebar is closed
              >
                <span className="icon">{iconMap[link.icon]}</span>
                {isOpen && <span className="link-text">{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-button"
          onClick={(e) => { e.preventDefault(); logout(); }}
          title={!isOpen ? "Logout" : ""} 
        >
          <span className="icon">{iconMap["log-out"]}</span>
          {isOpen && <span>Logout</span>}
        </button>
        <button
          className="logout-all-button"
          onClick={handleLogoutAll}
          title={!isOpen ? "Logout All Sessions" : ""}
        >
          <span className="icon">{iconMap["power"]}</span>
          {isOpen && <span>Logout All Sessions</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
