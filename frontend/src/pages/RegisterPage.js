import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaLock, FaUser, FaEnvelope } from 'react-icons/fa';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    address: '',
    age: '',
    contact: '',
    e_waste_type: '',
    weight: '',
    consent: false,
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    security_question: "What is your mother's name?",
    security_answer: ''
  });

  const [loading, setLoading] = useState(false);

  const securityQuestions = [
    "What is your mother's name?", "What is your pet's name?", "What is your favorite color?",
    "What is your favorite food?", "What city were you born in?", "What is your favorite movie?",
    "What is your favorite book?", "What is your favorite sports team?"
  ];

  const eWasteTypes = [
    'Desktop Computer', 'Laptop', 'Smartphone', 'Tablet', 'Monitor',
    'Keyboard/Mouse', 'Cables & Chargers', 'CPU/Processor', 'Motherboard',
    'RAM', 'Hard Drive', 'Power Supply', 'Printer', 'Scanner', 'Television', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is providing e-waste info
    const hasEWasteInfo = formData.e_waste_type || formData.weight;

    // 1. Core Account Validation (ALWAYS REQUIRED)
    if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name || !formData.security_answer) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Missing Account Info', 
        text: 'Please fill in Name, Username, Email, Password, and Security Answer.', 
        confirmButtonColor: '#10b981' 
      });
      return;
    }

    // 2. Conditional E-Waste Validation (ONLY if they started filling it out)
    if (hasEWasteInfo) {
      if (!formData.consent) {
        Swal.fire({ icon: 'warning', title: 'Consent Required', text: 'Please check the consent box for e-waste.', confirmButtonColor: '#10b981' });
        return;
      }
    }

    if (formData.password !== formData.confirm_password) {
      Swal.fire({ icon: 'warning', title: 'Mismatch', text: 'Passwords do not match!', confirmButtonColor: '#10b981' });
      return;
    }

    setLoading(true);

    try {
      // Choose endpoint based on whether e-waste info is present
      const endpoint = hasEWasteInfo ? '/api/registrations' : '/api/auth/register-only';
      
      const response = await fetch(`https://burol-1-web-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: hasEWasteInfo ? 'Your account and e-waste have been registered.' : 'Your account has been created successfully.',
          confirmButtonColor: '#10b981'
        }).then(() => window.location.href = '/login');
      } else {
        const error = await response.json();
        Swal.fire({ icon: 'error', title: 'Failed', text: error.error });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8 sm:py-12 text-center">
        <h1 className="text-3xl font-bold">Register - Barangay Burol 1</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md">
          
          {/* E-WASTE SECTION (OPTIONAL) */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg font-bold mb-4">E-Waste Details (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name *" className="p-2 border rounded" required />
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name *" className="p-2 border rounded" required />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="p-2 border rounded" />
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" className="p-2 border rounded" />
              <select name="e_waste_type" value={formData.e_waste_type} onChange={handleChange} className="p-2 border rounded">
                <option value="">Select E-Waste Type</option>
                {eWasteTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* ACCOUNT SECTION (REQUIRED) */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-lg font-bold mb-4">Account Credentials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username *" className="p-2 border rounded" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="p-2 border rounded" required />
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password *" className="p-2 border rounded" required />
              <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Confirm Password *" className="p-2 border rounded" required />
              <select name="security_question" value={formData.security_question} onChange={handleChange} className="p-2 border rounded">
                {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
              <input type="text" name="security_answer" value={formData.security_answer} onChange={handleChange} placeholder="Security Answer *" className="p-2 border rounded" required />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} />
            <span className="text-sm">I agree to terms (only if registering e-waste)</span>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold">
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;