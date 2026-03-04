import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import './EducationPage.css';

function EducationPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const { t } = useLanguage();

  const faqs = [
    { id: 1, question: t.education.faq1Q, answer: t.education.faq1A },
    { id: 2, question: t.education.faq2Q, answer: t.education.faq2A },
    { id: 3, question: t.education.faq3Q, answer: t.education.faq3A },
  ];

  const toggleFaq = (id) => setExpandedFaq(expandedFaq === id ? null : id);

  return (
    <div className="page-container">
      <section className="education-page">
        <div className="container">
          <h1 className="page-title">{t.education.title}</h1>
          <p className="page-subtitle">{t.education.subtitle}</p>

          <div className="education-content">
            <div className="faq-container">
              {faqs.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    className={`faq-question ${expandedFaq === faq.id ? 'active' : ''}`}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span>{faq.question}</span>
                    <FaChevronDown className="faq-icon" />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="faq-answer"><p>{faq.answer}</p></div>
                  )}
                </div>
              ))}
            </div>

            <div className="education-stats">
              <div className="stat-card">
                <div className="stat-icon">📱</div>
                <div className="stat-content">
                  <h3>{t.education.stat1Title}</h3>
                  <p>{t.education.stat1Desc}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>{t.education.stat2Title}</h3>
                  <p>{t.education.stat2Desc}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h3>{t.education.stat3Title}</h3>
                  <p>{t.education.stat3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EducationPage;