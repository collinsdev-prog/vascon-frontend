'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/Navbar.css';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-header">
          <Link href="/" className="navbar-logo">
            ChowBox
          </Link>
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link 
              href="/auth/login" 
              className={`navbar-link ${isActive('/auth/login') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              href="/auth/register" 
              className={`navbar-link ${isActive('/auth/register') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
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