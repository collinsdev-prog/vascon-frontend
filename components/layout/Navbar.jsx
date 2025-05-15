'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/Navbar.css';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          ChowBox
        </Link>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link 
              href="/auth/login" 
              className={`navbar-link ${isActive('/auth/login') ? 'active' : ''}`}
            >
              Login
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              href="/auth/register" 
              className={`navbar-link ${isActive('/auth/register') ? 'active' : ''}`}
            >
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
