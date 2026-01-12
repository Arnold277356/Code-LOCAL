import React, { useState, useEffect } from 'react'; // Added useEffect
import Swal from 'sweetalert2';
import { FaUser, FaRecycle } from 'react-icons/fa'; // Added FaRecycle
import './RegisterPage.css';

function RegisterPage() {
  // Check if user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!loggedInUser;

  const [formData, setFormData] = useState({
    first_name: isLoggedIn ? loggedInUser.first_name : '', // Pre-fill if logged in
    middle_name: '',
    last_name: isLoggedIn ? loggedInUser.last_name : '',   // Pre-fill if logged in
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

  const eWasteTypes = [
    'Desktop Computer', 'Laptop', 'Smartphone', 'Tablet', 'Monitor',
    'Keyboard/Mouse', 'Cables & Chargers', 'CPU/Processor', 'Motherboard',
    'RAM', 'Hard Drive', 'Power Supply', 'Printer', 'Scanner', 'Television', 'Other'
  ];

  const securityQuestions = [
    "What is your mother's name?", "What is your pet's name?", "What is your favorite color?",
    "What is your favorite food?", "What city were you born in?", "What is your favorite movie?",
    "What is your favorite book?", "What is your favorite sports team?"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation Logic
    if (isLoggedIn) {
        // If logged in, only E-waste fields and consent are required
        if (!formData.e_waste_type || !formData.weight || !formData.address || !formData.consent) {
            Swal.fire({ icon: 'warning', title: 'Required Fields', text: 'Please fill in E-waste type, weight, address, and check the consent box.' });
            return;
        }
    } else {
        // If NOT logged in, Account fields are required
        if (!formData.username || !formData.email || !formData.password || !formData.security_answer) {
            Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please complete all account fields.' });
            return;
        }
    }

    setLoading(true);

    try {
      // Determine the endpoint: 
      // If logged in, use a specific e-waste-only route. Otherwise, use existing registration route.
      const endpoint = isLoggedIn ? '/api/e-waste-only' : '/api/registrations';
      
      const payload = isLoggedIn 
        ? { ...formData, userId: loggedInUser.id } // Attach ID if logged in
        : formData;

      const response = await fetch(`https://burol-1-web-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Swal.fire({ 
            icon: 'success', 
            title: 'Success!', 
            text: isLoggedIn ? 'E-waste reported successfully!' : 'Account created successfully.' 
        }).then(() => {
            window.location.href = isLoggedIn ? '/dashboard' : '/login';
        });
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
      <div className="bg-emerald-600 text-white py-8 text-center shadow-md">
        <h1 className="text-3xl font-bold">
            {isLoggedIn ? 'Report E-Waste' : 'Register - E-Cycle Hub'}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          
          {/* SECTION 1: E-WASTE (ALWAYS VISIBLE) */}
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <FaRecycle className="text-blue-600" /> 1. E-Waste Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Drop-off Address *" className="p-2.5 border rounded-lg bg-white" required />
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg) *" className="p-2.5 border rounded-lg bg-white" required />
              <select name="e_waste_type" value={formData.e_waste_type} onChange={handleChange} className="p-2.5 border rounded-lg bg-white md:col-span-2" required>
                <option value="">Select E-Waste Type *</option>
                {eWasteTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* SECTION 2: ACCOUNT (HIDDEN IF LOGGED IN) */}
          {!isLoggedIn && (
            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                <h2 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                <FaUser className="text-purple-600" /> 2. Account Credentials (Required)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name *" className="p-2.5 border rounded-lg bg-white" required />
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name *" className="p-2.5 border rounded-lg bg-white" required />
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username *" className="p-2.5 border rounded-lg bg-white" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="p-2.5 border rounded-lg bg-white" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password *" className="p-2.5 border rounded-lg bg-white" required />
                <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Confirm Password *" className="p-2.5 border rounded-lg bg-white" required />
                <select name="security_question" value={formData.security_question} onChange={handleChange} className="p-2.5 border rounded-lg bg-white">
                    {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input type="text" name="security_answer" value={formData.security_answer} onChange={handleChange} placeholder="Security Answer *" className="p-2.5 border rounded-lg bg-white" required />
                </div>
            </div>
          )}

          <div className="flex items-center gap-2 px-2">
            <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="w-5 h-5" required />
            <span className="text-sm text-gray-600">I agree to the e-waste processing terms.</span>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md">
            {loading ? 'Processing...' : (isLoggedIn ? 'Submit E-Waste Record' : 'Complete Registration')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;