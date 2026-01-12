import React, { useState, useRef } from 'react';
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

    const isRegisteringEWaste = formData.e_waste_type && formData.weight;

    // 1. Validate Account (Bottom Section) - Always Required
    if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please fill in the Name and Account details.', confirmButtonColor: '#10b981' });
      return;
    }

    // 2. Validate E-Waste (Top Section) - Only if they are actually providing info
    if (isRegisteringEWaste) {
      if (formData.weight <= 0) {
        Swal.fire({ icon: 'warning', title: 'Invalid Weight', text: 'Weight must be greater than 0' });
        return;
      }
      if (!formData.consent) {
        Swal.fire({ icon: 'warning', title: 'Consent Required', text: 'Please agree to the terms for e-waste collection' });
        return;
      }
    }

    if (formData.password !== formData.confirm_password) {
      Swal.fire({ icon: 'warning', title: 'Passwords Do Not Match', text: 'Check your password confirmation.' });
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegisteringEWaste ? '/api/registrations' : '/api/auth/register-only';
      const response = await fetch(`https://burol-1-web-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Registration Successful!' }).then(() => {
          window.location.href = '/login';
        });
      } else {
        const error = await response.json();
        Swal.fire({ icon: 'error', title: 'Failed', text: error.error });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Server error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Register Your E-Waste Drop-off</h1>
          <p className="text-emerald-100 text-lg">Create your account and register e-waste</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ========== TOP PART: E-WASTE (OPTIONAL) ========== */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">E-Waste Information (Optional)</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Juan" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg"  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                  <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Dela" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Cruz" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg"  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Suffix</label>
                  <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} placeholder="Jr." className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Barangay Burol 1" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" />
                <input type="tel" name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" />
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" />
              </div>

              <select name="e_waste_type" value={formData.e_waste_type} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg">
                <option value="">Select E-Waste Type</option>
                {eWasteTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {/* ========== BOTTOM PART: ACCOUNT (REQUIRED) ========== */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-purple-600" /> Create Your Account
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username *" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password *" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" required />
                <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Confirm Password *" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select name="security_question" value={formData.security_question} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" required>
                  {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input type="text" name="security_answer" value={formData.security_answer} onChange={handleChange} placeholder="Security Answer *" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg" required />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
              <label className="flex items-start gap-3">
                <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="w-5 h-5 mt-1" />
                <span className="text-sm text-gray-700">I consent to e-waste terms (only required if dropping off e-waste)</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg text-lg">
              {loading ? 'Registering...' : 'Submit Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;