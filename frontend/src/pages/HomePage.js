import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Pages.css';

function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="page-container">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{t.home.heroTitle}</h1>
            <p className="hero-tagline">{t.home.heroTagline}</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">{t.home.registerBtn}</Link>
              <Link to="/education" className="btn btn-outline">{t.home.learnMoreBtn}</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-icon">♻️</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">{t.home.whyTitle}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>{t.home.feature1Title}</h3>
              <p>{t.home.feature1Desc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>{t.home.feature2Title}</h3>
              <p>{t.home.feature2Desc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">♻️</div>
              <h3>{t.home.feature3Title}</h3>
              <p>{t.home.feature3Desc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>{t.home.feature4Title}</h3>
              <p>{t.home.feature4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-links">
        <div className="container">
          <h2 className="section-title">{t.home.quickAccessTitle}</h2>
          <div className="links-grid">
            <Link to="/education" className="link-card">
              <div className="link-icon">📚</div>
              <h3>{t.home.link1Title}</h3>
              <p>{t.home.link1Desc}</p>
            </Link>
            <Link to="/map" className="link-card">
              <div className="link-icon">📍</div>
              <h3>{t.home.link2Title}</h3>
              <p>{t.home.link2Desc}</p>
            </Link>
            <Link to="/register" className="link-card">
              <div className="link-icon">📝</div>
              <h3>{t.home.link3Title}</h3>
              <p>{t.home.link3Desc}</p>
            </Link>
            <Link to="/incentives" className="link-card">
              <div className="link-icon">🎁</div>
              <h3>{t.home.link4Title}</h3>
              <p>{t.home.link4Desc}</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;