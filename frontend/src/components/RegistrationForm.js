import React, { useState } from 'react';
import './RegistrationForm.css';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    age: '',
    contact: '',
    e_waste_type: '',
    weight: '',
    consent: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const eWasteTypes = [
    'Desktop Computer',
    'Laptop',
    'Smartphone',
    'Tablet',
    'Monitor',
    'Keyboard/Mouse',
    'Cables & Chargers',
    'CPU/Processor',
    'Motherboard',
    'RAM',
    'Hard Drive',
    'Power Supply',
    'Printer',
    'Scanner',
    'Television',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }
    if (!formData.e_waste_type) {
      setError('Please select e-waste type');
      return;
    }
    if (!formData.weight || formData.weight <= 0) {
      setError('Please enter a valid weight');
      return;
    }
    if (!formData.consent) {
      setError('You must agree to the consent checkbox');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          full_name: '',
          address: '',
          age: '',
          contact: '',
          e_waste_type: '',
          weight: '',
          consent: false
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError('Failed to submit registration. Please try again.');
      }
    } catch (err) {
      setError('Error submitting form. Please check your connection and try again.');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="registration">
      <div className="container-md">
        <h2 className="section-title">Register Your E-Waste Drop-off</h2>
        <p className="section-subtitle">
          Fill out the form below to register your e-waste drop-off
        </p>

        {submitted && (
          <div className="alert alert-success">
            ✓ Thank you for helping reduce e-waste in our community! Your drop-off record has been received.
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            ✗ {error}
          </div>
        )}

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name *</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number</label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="09XXXXXXXXX"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="e_waste_type">Type of E-Waste *</label>
            <select
              id="e_waste_type"
              name="e_waste_type"
              value={formData.e_waste_type}
              onChange={handleChange}
              required
            >
              <option value="">-- Select e-waste type --</option>
              {eWasteTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="weight">Approximate Weight (kg) *</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter weight in kilograms"
              step="0.1"
              min="0"
              required
            />
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              required
            />
            <label htmlFor="consent">
              I consent to the collection and processing of my e-waste and agree to the terms and conditions *
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>

        <div className="form-note">
          <p>
            <strong>📝 Note:</strong> Your information will be kept confidential and used only for e-waste collection purposes. We appreciate your contribution to environmental sustainability!
          </p>
        </div>
      </div>
    </section>
  );
}

export default RegistrationForm;
