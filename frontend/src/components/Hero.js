import React from 'react';
import './Hero.css';

function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">E-Cycle Hub</h1>
          <p className="hero-tagline">
            Responsibly recycle your e-waste and earn rewards while protecting our environment
          </p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('register')}
            >
              Register Drop-off
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => scrollToSection('education')}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-icon">♻️</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
