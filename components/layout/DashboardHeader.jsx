"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiMenu } from "react-icons/fi";

const DashboardHeader = ({ user, onToggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/dashboard/profile");
    setIsDropdownOpen(false);
  };

  const handleLogoutAllSessions = () => {
    // API call to logout all sessions
    window.location.href = "/api/auth/logout/all";
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <FiMenu size={24} />
        </button>
        <h2 className="header-title">
          {user?.role === "seller" ? "Seller Dashboard" : "Buyer Dashboard"}
        </h2>
      </div>

      <div className="header-right">
        {user?.role === "buyer" && (
          <div className="balance-display">
            <span className="balance-label">Balance:</span>
            <span className="balance-amount">{user?.deposit || 0} cents</span>
          </div>
        )}

        <div className="user-menu">
          <button className="user-menu-button" onClick={toggleDropdown}>
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="username">{user?.username}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <span className="icon-chevron-down"></span>
          </button>

          {isDropdownOpen && (
            <div className="user-dropdown">
              <button className="dropdown-item" onClick={handleProfile}>
                <span className="icon-user"></span>
                <span>Profile</span>
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                <span className="icon-log-out"></span>
                <span>Logout</span>
              </button>
              <button
                className="dropdown-item"
                onClick={handleLogoutAllSessions}
              >
                <span className="icon-power"></span>
                <span>Logout All Sessions</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
