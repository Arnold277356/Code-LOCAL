import React, { useState } from 'react';
import './Incentives.css';

function Incentives() {
  const [weight, setWeight] = useState('');
  const [reward, setReward] = useState(null);

  const handleCalculate = async () => {
    if (!weight || weight <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    try {
      const response = await fetch('/api/calculate-rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ weight: parseFloat(weight) })
      });

      const data = await response.json();
      setReward(data);
    } catch (error) {
      console.error('Error calculating reward:', error);
      alert('Error calculating reward. Please try again.');
    }
  };

  return (
    <section id="incentives" className="incentives">
      <div className="container">
        <h2 className="section-title">Incentives & Rewards</h2>
        <p className="section-subtitle">
          Earn rewards for every kilogram of e-waste you responsibly recycle
        </p>

        <div className="incentives-content">
          <div className="incentive-card featured">
            <div className="incentive-icon">🎁</div>
            <h3>Reward Program</h3>
            <div className="reward-amount">₱15</div>
            <p className="reward-unit">per kilogram of e-waste</p>
            <p className="reward-description">
              For every 1 kilogram of e-waste you drop off, you earn ₱15 or an equivalent voucher that can be used for future transactions.
            </p>
          </div>

          <div className="incentive-card">
            <div className="incentive-icon">📊</div>
            <h3>How to Claim</h3>
            <ol className="claim-steps">
              <li>Register your e-waste drop-off through our form</li>
              <li>Provide accurate weight information</li>
              <li>Receive your reward certificate</li>
              <li>Claim your ₱15 voucher per kilogram at the Barangay Hall</li>
              <li>Use your voucher for community programs or services</li>
            </ol>
          </div>

          <div className="incentive-card">
            <div className="incentive-icon">⚖️</div>
            <h3>Terms & Conditions</h3>
            <ul className="terms-list">
              <li>Rewards are valid for 12 months from issuance</li>
              <li>Minimum weight for reward claim: 0.5 kg</li>
              <li>E-waste must be functional or repairable</li>
              <li>One registration per drop-off session</li>
              <li>Vouchers are non-transferable and non-refundable</li>
              <li>Barangay reserves the right to verify e-waste condition</li>
            </ul>
          </div>
        </div>

        <div className="calculator-section">
          <h3>Calculate Your Reward</h3>
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
                  <span className="result-value">₱{reward.rewardPerKg}/kg</span>
                </div>
                <div className="result-item total">
                  <span className="result-label">Total Reward:</span>
                  <span className="result-value">₱{reward.totalReward.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="incentives-note">
          <p>
            <strong>💡 Tip:</strong> Collect e-waste from your family and friends to maximize your rewards! Every kilogram counts towards a cleaner environment and a better community.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Incentives;
