import React from 'react';
import { FaFacebook, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>E-Cycle Hub</h3>
              <p>{t.footer.tagline}</p>
            </div>

            <div className="footer-section">
              <h4>{t.footer.contactTitle}</h4>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <p className="contact-label">{t.footer.location}</p>
                  <p className="contact-value">{t.footer.locationValue}</p>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <p className="contact-label">{t.footer.phone}</p>
                  <p className="contact-value">09916338752</p>
                </div>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <p className="contact-label">{t.footer.barangayHall}</p>
                  <p className="contact-value">{t.footer.barangayHallValue}</p>
                </div>
              </div>
            </div>

            <div className="footer-section">
              <h4>{t.footer.followUs}</h4>
              <div className="social-links">
                <a href="https://www.facebook.com/renilo.teves" className="social-link" title="Facebook" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
              </div>
              <p className="social-text">{t.footer.socialText}</p>
            </div>

            <div className="footer-section">
              <h4>{t.footer.partners}</h4>
              <ul className="partners-list">
                <li>{t.footer.partner1}</li>
                <li>{t.footer.partner2}</li>
                <li>{t.footer.partner3}</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-disclaimer">
              <p><strong>{t.footer.disclaimer}</strong> {t.footer.disclaimerText}</p>
            </div>
            <div className="footer-credits">
              <p>{t.footer.poweredBy} <strong>E-Cycle Hub</strong></p>
            </div>
          </div>

          <div className="footer-copyright">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;