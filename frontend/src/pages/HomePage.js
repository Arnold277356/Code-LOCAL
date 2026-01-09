import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

function HomePage() {
  return (
    <div className="page-container">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">E-Cycle Hub</h1>
            <p className="hero-tagline">
              Responsibly recycle your e-waste and earn rewards while protecting our environment
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Register Drop-off
              </Link>
              <Link to="/education" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-icon">♻️</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why E-Cycle Hub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Protect Environment</h3>
              <p>Prevent toxic e-waste from contaminating our soil and water</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Earn Rewards</h3>
              <p>Get ₱15 per kilogram of e-waste you responsibly recycle</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">♻️</div>
              <h3>Circular Economy</h3>
              <p>Help recover valuable materials for reuse and manufacturing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Community Impact</h3>
              <p>Join thousands making a difference in our barangay</p>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-links">
        <div className="container">
          <h2 className="section-title">Quick Access</h2>
          <div className="links-grid">
            <Link to="/education" className="link-card">
              <div className="link-icon">📚</div>
              <h3>Learn About E-Waste</h3>
              <p>Understand why e-waste matters</p>
            </Link>
            <Link to="/map" className="link-card">
              <div className="link-icon">📍</div>
              <h3>Find Drop-off Points</h3>
              <p>Locate nearest collection center</p>
            </Link>
            <Link to="/register" className="link-card">
              <div className="link-icon">📝</div>
              <h3>Register E-Waste</h3>
              <p>Start your recycling journey</p>
            </Link>
            <Link to="/incentives" className="link-card">
              <div className="link-icon">🎁</div>
              <h3>View Rewards</h3>
              <p>See how much you can earn</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
