"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { formatCentsToDollars } from "@/utils/currency"; // 💵 Import the formatter

const DashboardHeader = ({
  user,
  onToggleSidebar,
  isSidebarOpen,
  isMobile,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    function handleScroll() {
      if (window.innerWidth <= 768) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    window.location.href = "/api/auth/logout/all";
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <FiMenu size={24} />
        </button>
        <h2 className="header-title header-responsive-title">
          {user?.role === "seller" ? "Seller Dashboard" : "Buyer Dashboard"}
        </h2>
      </div>

      <div className="header-right">
        {user?.role === "buyer" && (
          <div className="balance-display">
            <span className="balance-label">Balance:</span>
            <span className="balance-amount">
              {formatCentsToDollars(user?.deposit || 0)}
            </span>
          </div>
        )}

        <div className="user-menu" ref={dropdownRef}>
          <button className="user-menu-button" onClick={toggleDropdown}>
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="username">{user?.username}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <FiChevronDown
              className={`chevron-icon ${isDropdownOpen ? "rotate" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="user-dropdown">
              {isMobile && (
                <div className="mobile-user-info">
                  <div className="mobile-username">{user?.username}</div>
                  <div className="mobile-role">{user?.role}</div>
                  {user?.role === "buyer" && (
                    <div className="mobile-balance">
                      Balance: {formatCentsToDollars(user?.deposit || 0)}
                    </div>
                  )}
                  <hr className="dropdown-divider" />
                </div>
              )}

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
