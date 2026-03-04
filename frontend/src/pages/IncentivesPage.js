import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './IncentivesPage.css';

function IncentivesPage() {
  const [weight, setWeight] = useState('');
  const [reward, setReward] = useState(null);
  const { t } = useLanguage();

  const handleCalculate = () => {
    const numWeight = parseFloat(weight);
    if (!weight || numWeight <= 0) {
      alert(t.incentives.invalidWeight);
      return;
    }
    const ratePerKilo = 5;
    setReward({ weight: numWeight, total: numWeight * ratePerKilo, rate: ratePerKilo });
  };

  return (
    <div className="page-container">
      <section className="incentives-page">
        <div className="container">
          <h1 className="page-title">{t.incentives.title}</h1>
          <p className="page-subtitle">{t.incentives.subtitle}</p>

          <div className="incentives-content">
            <div className="incentive-card featured">
              <div className="incentive-icon">🎁</div>
              <h3>{t.incentives.rewardTitle}</h3>
              <div className="reward-amount">₱5</div>
              <p className="reward-unit">{t.incentives.rewardUnit}</p>
              <p className="reward-description">{t.incentives.rewardDesc}</p>
            </div>

            <div className="incentive-card">
              <div className="incentive-icon">📊</div>
              <h3>{t.incentives.howToTitle}</h3>
              <ol className="claim-steps">
                <li>{t.incentives.step1}</li>
                <li>{t.incentives.step2}</li>
                <li>{t.incentives.step3}</li>
                <li>{t.incentives.step4}</li>
                <li>{t.incentives.step5}</li>
              </ol>
            </div>

            <div className="incentive-card">
              <div className="incentive-icon">⚖️</div>
              <h3>{t.incentives.termsTitle}</h3>
              <ul className="terms-list">
                <li>{t.incentives.term1}</li>
                <li>{t.incentives.term2}</li>
                <li>{t.incentives.term3}</li>
                <li>{t.incentives.term4}</li>
                <li>{t.incentives.term5}</li>
                <li>{t.incentives.term6}</li>
              </ul>
            </div>
          </div>

          <div className="calculator-section">
            <h3>{t.incentives.calcTitle}</h3>
            <div className="calculator">
              <div className="calculator-input">
                <label htmlFor="weight-input">{t.incentives.calcLabel}</label>
                <input
                  type="number" id="weight-input" value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0" step="0.1" min="0"
                />
                <button className="btn btn-primary" onClick={handleCalculate}>{t.incentives.calcBtn}</button>
              </div>

              {reward && (
                <div className="calculator-result">
                  <div className="result-item">
                    <span className="result-label">{t.incentives.calcWeight}</span>
                    <span className="result-value">{reward.weight} kg</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">{t.incentives.calcRate}</span>
                    <span className="result-value">₱5/kg</span>
                  </div>
                  <div className="result-item total">
                    <span className="result-label">{t.incentives.calcTotal}</span>
                    <span className="result-value">₱{reward.total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="incentives-note">
            <p><strong>{t.incentives.tip}</strong> {t.incentives.tipText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default IncentivesPage;