import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { FaCamera, FaUpload, FaVideo, FaLock, FaUser, FaEnvelope } from 'react-icons/fa';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    // E-waste fields
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
    // User credentials
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    security_question: 'What is your mother\'s name?',
    security_answer: ''
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const securityQuestions = [
    'What is your mother\'s name?',
    'What is your pet\'s name?',
    'What is your favorite color?',
    'What is your favorite food?',
    'What city were you born in?',
    'What is your favorite movie?',
    'What is your favorite book?',
    'What is your favorite sports team?'
  ];

  const eWasteTypes = [
    'Desktop Computer', 'Laptop', 'Smartphone', 'Tablet', 'Monitor',
    'Keyboard/Mouse', 'Cables & Chargers', 'CPU/Processor', 'Motherboard',
    'RAM', 'Hard Drive', 'Power Supply', 'Printer', 'Scanner', 'Television', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    // E-waste field validation
    if (['first_name', 'last_name'].includes(name)) {
      finalValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    if (name === 'middle_name') {
      finalValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    if (name === 'suffix') {
      finalValue = value.replace(/[^a-zA-Z\s.]/g, '');
    }
    if (name === 'address') {
      finalValue = value.replace(/[^a-zA-Z\s,\-]/g, '');
    }
    if (name === 'age') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 2);
    }
    if (name === 'contact') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 11);
    }
    if (name === 'username') {
      finalValue = value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const resizeImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 200, 200);
        canvas.toBlob(callback, 'image/jpeg', 0.9);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };


const handleSubmit = async (e) => {
    e.preventDefault();

    const isRegisteringEWaste = formData.e_waste_type && formData.weight;

    if (isRegisteringEWaste) {
      if (formData.weight <= 0) {
        Swal.fire({ icon: 'warning', title: 'Invalid Weight', text: 'Weight must be greater than 0', confirmButtonColor: '#10b981' });
        return;
      }
      if (!formData.consent) {
        Swal.fire({ icon: 'warning', title: 'Consent Required', text: 'Please agree to the terms for e-waste collection', confirmButtonColor: '#10b981' });
        return;
      }
    }

    if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please fill in your Name and Account details.', confirmButtonColor: '#10b981' });
      return;
    }

    if (formData.age && (formData.age < 18 || formData.age > 99)) {
      Swal.fire({ icon: 'warning', title: 'Invalid Age', text: 'Age must be 18-99', confirmButtonColor: '#10b981' });
      return;
    }

    if (formData.contact && formData.contact.length !== 11) {
      Swal.fire({ icon: 'warning', title: 'Invalid Contact', text: 'Contact must be 11 digits', confirmButtonColor: '#10b981' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({ icon: 'warning', title: 'Invalid Email', text: 'Please enter a valid email', confirmButtonColor: '#10b981' });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 6 characters', confirmButtonColor: '#10b981' });
      return;
    }

    if (formData.password !== formData.confirm_password) {
      Swal.fire({ icon: 'warning', title: 'Passwords Do Not Match', text: 'Please confirm your password', confirmButtonColor: '#10b981' });
      return;
    }

    if (!formData.security_answer.trim() || formData.security_answer.trim().length < 2) {
      Swal.fire({ icon: 'warning', title: 'Invalid Security Answer', text: 'Please answer the security question', confirmButtonColor: '#10b981' });
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegisteringEWaste 
        ? '/api/registrations' 
        : '/api/auth/register-only';

      const response = await fetch(`https://burol-1-web-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        const reward = isRegisteringEWaste ? (formData.weight * 15) : 0;
        
        Swal.fire({
          icon: 'success',
          title: '✓ Registration Successful!',
          html: `
            <div style="text-align: center;">
              <p style="font-size: 16px; margin: 10px 0;"><strong>Welcome, ${formData.first_name}!</strong></p>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 8px 0;"><strong>Username:</strong> ${formData.username}</p>
                ${isRegisteringEWaste ? `
                  <p style="margin: 8px 0;"><strong>E-Waste:</strong> ${formData.e_waste_type}</p>
                  <p style="margin: 8px 0;"><strong>Weight:</strong> ${formData.weight} kg</p>
                  <p style="margin: 8px 0; font-size: 18px; color: #10b981;"><strong>Reward: ₱${reward.toFixed(2)}</strong></p>
                ` : '<p style="margin: 8px 0; color: #059669;">Account created successfully!</p>'}
              </div>
              <p style="font-size: 14px; color: #666;">You can now login with your username and password!</p>
            </div>
          `,
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Go to Login'
        }).then(() => {
          window.location.href = '/login';
        });
      } else {
        const error = await response.json();
        Swal.fire({ icon: 'error', title: 'Registration Failed', text: error.error, confirmButtonColor: '#10b981' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Registration failed. Please try again.', confirmButtonColor: '#10b981' });
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

            {/* ========== E-WASTE INFORMATION ========== */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">E-Waste Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Juan" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                  <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Dela" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Cruz" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Suffix</label>
                  <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} placeholder="Jr., Sr., III" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Waterfall Balingasag Mis Or" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"  />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Age (18-99) *</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="21" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact (11 digits) *</label>
                  <input type="tel" name="contact" value={formData.contact} onChange={handleChange} placeholder="09856122843" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg) *</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="100" step="0.1" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-Waste Type *</label>
                <select name="e_waste_type" value={formData.e_waste_type} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all">
                  <option value="">Select E-Waste Type</option>
                  {eWasteTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            {/* ========== USER CREDENTIALS ========== */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-purple-600" /> Create Your Account
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Username * (3-20 characters)</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="john_doe" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-purple-600" /> Email *
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaLock className="text-purple-600" /> Password * (min 6 characters)
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaLock className="text-purple-600" /> Confirm Password *
                  </label>
                  <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Security Question *</label>
                  <select name="security_question" value={formData.security_question} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all" required>
                    {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Security Answer *</label>
                  <input type="text" name="security_answer" value={formData.security_answer} onChange={handleChange} placeholder="Your answer" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all" required />
                </div>
              </div>
            </div>

            {/* ========== CONSENT ========== */}
            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="w-5 h-5 mt-1 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500" />
                <span className="text-sm text-gray-700">
                  I consent to the collection and processing of my e-waste and agree to the terms and conditions *
                </span>
              </label>
            </div>

            {/* ========== SUBMIT BUTTON ========== */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Registering...' : 'Submit Registration'}
            </button>

            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> Your information will be kept confidential and used only for e-waste collection purposes. We appreciate your contribution to environmental sustainability!
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
