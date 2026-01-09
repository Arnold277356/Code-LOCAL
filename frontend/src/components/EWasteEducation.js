import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './EWasteEducation.css';

function EWasteEducation() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'Why is e-waste harmful?',
      answer: 'E-waste contains toxic materials like lead, mercury, and cadmium that can contaminate soil and water. When improperly disposed, these toxins harm ecosystems and human health. Improper burning releases harmful gases, and landfills leak chemicals into groundwater. Responsible recycling prevents environmental damage and recovers valuable materials.'
    },
    {
      id: 2,
      question: 'What happens when e-waste is recycled properly?',
      answer: 'Proper recycling recovers valuable materials like gold, copper, and rare earth elements for reuse. Toxic components are safely handled and disposed of. This reduces mining needs, saves energy, and prevents environmental pollution. Recycled materials are used to manufacture new electronics, creating a circular economy and reducing waste in landfills.'
    },
    {
      id: 3,
      question: 'Did you know?',
      answer: 'One million smartphones contain 35 times more copper than one ton of copper ore. Recycling one million laptops saves the energy equivalent of powering 3,500 homes for a year. E-waste is the fastest-growing waste stream globally, with over 50 million tons generated annually.'
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <section id="education" className="education">
      <div className="container">
        <h2 className="section-title">What is E-Waste?</h2>
        <p className="section-subtitle">
          Learn about electronic waste and why responsible recycling matters
        </p>

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
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="education-stats">
            <div className="stat-card">
              <div className="stat-icon">📱</div>
              <div className="stat-content">
                <h3>50+ Million Tons</h3>
                <p>E-waste generated globally per year</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>₱57 Billion</h3>
                <p>Value of materials in global e-waste</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <h3>3,500 Homes</h3>
                <p>Energy saved by recycling 1M laptops yearly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EWasteEducation;
