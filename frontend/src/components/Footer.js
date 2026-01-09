import React from 'react';
import { FaFacebook, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>E-Cycle Hub</h3>
              <p>
                Promoting responsible e-waste recycling and environmental sustainability in our community.
              </p>
            </div>

            <div className="footer-section">
              <h4>Contact Information</h4>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <p className="contact-label">Location</p>
                  <p className="contact-value">Burol 1 Dasmarinas Cavite</p>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <p className="contact-label">Phone</p>
                  <p className="contact-value">(02) XXXX-XXXX</p>
                </div>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <p className="contact-label">Barangay Hall</p>
                  <p className="contact-value">Burol 1 Dasmarinas Cavite</p>
                </div>
              </div>
            </div>

<div className="footer-section">
  <h4>Follow Us</h4>
  <div className="social-links">
    <a 
      href="https://www.facebook.com/renilo.teves" 
      className="social-link" 
      title="Facebook"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <FaFacebook />
    </a>
  </div>
  <p className="social-text">
    Visit our Barangay Facebook page for updates and announcements
  </p>
</div>

            <div className="footer-section">
              <h4>Partners</h4>
              <ul className="partners-list">
                <li>Barangay Government</li>
                <li>Environmental Office</li>
                <li>Community Organizations</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-disclaimer">
              <p>
                <strong>Disclaimer:</strong> This website provides information about e-waste recycling and collection services. 
                For official announcements and updates, please refer to the Barangay Hall or official social media channels.
              </p>
            </div>

            <div className="footer-credits">
              <p>
                Powered by: <strong>E-Cycle Hub</strong>
              </p>
            </div>
          </div>

          <div className="footer-copyright">
            <p>&copy; 2024 E-Cycle Hub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
