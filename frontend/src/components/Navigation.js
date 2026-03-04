import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import './Navigation.css';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
  }, [location]);

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
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>{t.nav.home}</Link>
          <Link to="/education" className={`nav-link ${isActive('/education') ? 'active' : ''}`} onClick={closeMenu}>{t.nav.ewasteInfo}</Link>
          <Link to="/map" className={`nav-link ${isActive('/map') ? 'active' : ''}`} onClick={closeMenu}>{t.nav.dropoffMap}</Link>
          <Link to="/updates" className={`nav-link ${isActive('/updates') ? 'active' : ''}`} onClick={closeMenu}>{t.nav.updates}</Link>
          <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`} onClick={closeMenu}>{t.nav.register}</Link>
          <Link to="/incentives" className={`nav-link ${isActive('/incentives') ? 'active' : ''}`} onClick={closeMenu}>{t.nav.incentives}</Link>
          <Link to="/faq" className={`nav-link ${isActive('/faq') ? 'active' : ''}`} onClick={closeMenu}>{t.nav.faq || 'FAQ'}</Link>

          {user ? (
            <Link to="/dashboard" className={`nav-link login-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMenu}>
              <FaUserCircle className="inline-block mr-2 mb-1" />
              {t.nav.myAccount}
            </Link>
          ) : (
            <Link to="/login" className={`nav-link login-link ${isActive('/login') ? 'active' : ''}`} onClick={closeMenu}>
              {t.nav.login}
            </Link>
          )}

          <button
            onClick={toggleLanguage}
            className="nav-link login-link"
            style={{ background: 'none', border: '1px solid currentColor', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
          >
            {language === 'en' ? '🇵🇭 FIL' : '🇺🇸 EN'}
          </button>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;