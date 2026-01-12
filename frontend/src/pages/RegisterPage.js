import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaUser } from 'react-icons/fa';
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
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine if they are actually filling out E-Waste info
    const isRegisteringEWaste = formData.e_waste_type || formData.weight || formData.address;

    // 1. Check for Account essentials (Username, Email, Passwords, Names)
    if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name || !formData.security_answer) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Missing Info', 
        text: 'Please fill in your Name and Account details.', 
        confirmButtonColor: '#10b981' 
      });
      return;
    }

    // 2. Only require consent if they provided E-waste info
    if (isRegisteringEWaste && !formData.consent) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Consent Required', 
        text: 'Please check the consent box for e-waste processing.', 
        confirmButtonColor: '#10b981' 
      });
      return;
    }

    if (formData.password !== formData.confirm_password) {
      Swal.fire({ icon: 'warning', title: 'Mismatch', text: 'Passwords do not match!' });
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
        Swal.fire({ icon: 'success', title: 'Registration Successful!' })
          .then(() => window.location.href = '/login');
      } else {
        const error = await response.json();
        Swal.fire({ icon: 'error', title: 'Registration Failed', text: error.error });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Server Error', text: 'Could not connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8 text-center">
        <h1 className="text-3xl font-bold">Register - E-Cycle Hub</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* TOP PART: E-WASTE (OPTIONAL) */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">E-Waste Information (Optional)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name *" className="p-2.5 border-2 rounded-lg" required />
                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Middle Name" className="p-2.5 border-2 rounded-lg" />
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name *" className="p-2.5 border-2 rounded-lg" required />
                <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} placeholder="Suffix" className="p-2.5 border-2 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="p-2.5 border-2 rounded-lg" />
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" className="p-2.5 border-2 rounded-lg" />
                <select name="e_waste_type" value={formData.e_waste_type} onChange={handleChange} className="p-2.5 border-2 rounded-lg">
                  <option value="">Select E-Waste Type</option>
                  {eWasteTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            {/* BOTTOM PART: ACCOUNT (REQUIRED) */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-purple-600" /> Create Your Account
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username *" className="p-2.5 border-2 rounded-lg" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="p-2.5 border-2 rounded-lg" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password *" className="p-2.5 border-2 rounded-lg" required />
                <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Confirm Password *" className="p-2.5 border-2 rounded-lg" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select name="security_question" value={formData.security_question} onChange={handleChange} className="p-2.5 border-2 rounded-lg" required>
                  {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input type="text" name="security_answer" value={formData.security_answer} onChange={handleChange} placeholder="Security Answer *" className="p-2.5 border-2 rounded-lg" required />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200 flex items-center gap-3">
              <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="w-5 h-5" />
              <span className="text-sm text-gray-700">I consent to e-waste terms (Only if dropping off e-waste)</span>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl text-lg hover:bg-emerald-700 transition-all">
              {loading ? 'Processing...' : 'Submit Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;