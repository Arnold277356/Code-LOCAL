import React, { useState } from 'react';
import './IncentivesPage.css';

function IncentivesPage() {
  const [weight, setWeight] = useState('');
  const [reward, setReward] = useState(null);

  // This handles the ₱5 per kilo logic locally (No internet/API needed)
  const handleCalculate = () => {
    const numWeight = parseFloat(weight);
    
    if (!weight || numWeight <= 0) {
      alert('Please enter a valid weight in kilograms');
      return;
    }

    // RECOMMENDATION: Make the incentives worth at least ₱5 per kilo
    const ratePerKilo = 5; 
    const calculatedReward = numWeight * ratePerKilo;

    // We set the reward state immediately for the UI to show
    setReward({
      weight: numWeight,
      total: calculatedReward,
      rate: ratePerKilo
    });
  };

  return (
    <div className="page-container">
      <section className="incentives-page">
        <div className="container">
          <h1 className="page-title">Incentives & Rewards ♻️</h1>
          <p className="page-subtitle">
            Earn rewards for every kilogram of e-waste you responsibly recycle in Barangay Burol 1
          </p>

          <div className="incentives-content">
            <div className="incentive-card featured">
              <div className="incentive-icon">🎁</div>
              <h3>Reward Program</h3>
              {/* UPDATED TO ₱5 */}
              <div className="reward-amount">₱5</div>
              <p className="reward-unit">per kilogram of e-waste</p>
              <p className="reward-description">
                For every 1 kilogram of e-waste you drop off, you earn ₱5 or an equivalent voucher that can be used for community services.
              </p>
            </div>

            <div className="incentive-card">
              <div className="incentive-icon">📊</div>
              <h3>How to Claim</h3>
              <ol className="claim-steps">
                <li>Register your e-waste drop-off through our form</li>
                <li>Provide accurate weight information</li>
                <li>Receive your reward certificate</li>
                {/* UPDATED TO ₱5 */}
                <li>Claim your ₱5 voucher per kilogram at the Barangay Hall</li>
                <li>Use your voucher for community programs or services</li>
              </ol>
            </div>

            <div className="incentive-card">
              <div className="incentive-icon">⚖️</div>
              <h3>Terms & Conditions</h3>
              <ul className="terms-list">
                <li>Rewards are valid for 12 months from issuance</li>
                <li>Minimum weight for reward claim: 0.5 kg</li>
                <li>Accepted: Phones, Laptops, Chargers, and Batteries</li>
                <li>One registration per drop-off session</li>
                <li>Vouchers are non-transferable and non-refundable</li>
                <li>Barangay reserves the right to verify e-waste condition</li>
              </ul>
            </div>
          </div>

          <div className="calculator-section">
            <h3>Calculate Your Reward 💰</h3>
            <div className="calculator">
              <div className="calculator-input">
                <label htmlFor="weight-input">Enter weight (kg):</label>
                <input
                  type="number"
                  id="weight-input"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                />
                <button className="btn btn-primary" onClick={handleCalculate}>
                  Calculate
                </button>
              </div>

              {reward && (
                <div className="calculator-result">
                  <div className="result-item">
                    <span className="result-label">Weight:</span>
                    <span className="result-value">{reward.weight} kg</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Rate:</span>
                    {/* UPDATED TO ₱5 */}
                    <span className="result-value">₱5/kg</span>
                  </div>
                  <div className="result-item total">
                    <span className="result-label">Total Reward:</span>
                    <span className="result-value">₱{reward.total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="incentives-note">
            <p>
              <strong>💡 Tip:</strong> Collect e-waste from your family and friends in Burol 1 to maximize your rewards! Every kilogram counts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default IncentivesPage;
