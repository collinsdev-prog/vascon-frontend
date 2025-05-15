import React from 'react';
import '@/styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ChowBox</h3>
          <p>Your digital vending machine solution</p>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@chowbox.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
        <div className="footer-section">
          <h3>Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ChowBox. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;