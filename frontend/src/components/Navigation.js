import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import './Navigation.css';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // Added state to track logged-in user
  const location = useLocation();

  // Check for logged-in user whenever the location changes
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      setUser(null);
    }
  }, [location]); // Re-run check when user navigates

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="E-Cycle Hub Logo" className="logo-image" />
          <span className="logo-text">E-Cycle Hub</span>
        </Link>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>Home</Link>
          <Link to="/education" className={`nav-link ${isActive('/education') ? 'active' : ''}`} onClick={closeMenu}>E-Waste Info</Link>
          <Link to="/map" className={`nav-link ${isActive('/map') ? 'active' : ''}`} onClick={closeMenu}>Drop-off Map</Link>
          <Link to="/updates" className={`nav-link ${isActive('/updates') ? 'active' : ''}`} onClick={closeMenu}>Updates</Link>
          <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`} onClick={closeMenu}>Register</Link>
          <Link to="/incentives" className={`nav-link ${isActive('/incentives') ? 'active' : ''}`} onClick={closeMenu}>Incentives</Link>

          {/* DYNAMIC TAB: Shows Login if guest, shows My Account if logged in */}
          {user ? (
            <Link 
              to="/dashboard" 
              className={`nav-link login-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <FaUserCircle className="inline-block mr-2 mb-1" />
              My Account
            </Link>
            
          ) : (
            <Link 
              to="/login" 
              className={`nav-link login-link ${isActive('/login') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;