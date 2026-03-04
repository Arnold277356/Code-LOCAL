import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaUser, FaRecycle } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import './RegisterPage.css';

const BACKEND = 'https://burol-1-web-backend.onrender.com';

function RegisterPage() {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!loggedInUser;
  const { t } = useLanguage();

  const [dropOffLocations, setDropOffLocations] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    dropoff_address: '',
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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/drop-offs`);
        const data = await res.json();
        if (data && data.length > 0) {
          setDropOffLocations(data);
        } else {
          setDropOffLocations([
            { id: 1, name: 'Burol 1 Barangay Hall', address: 'Burol 1, Dasmariñas Cavite, Zone A' },
            { id: 2, name: 'Burol 1 Community Center', address: 'Burol 1, Dasmariñas Cavite, Zone B' },
            { id: 3, name: 'Burol 1 Market Area', address: 'Burol 1, Dasmariñas Cavite, Zone C' },
          ]);
        }
      } catch (err) {
        setDropOffLocations([
          { id: 1, name: 'Burol 1 Barangay Hall', address: 'Burol 1, Dasmariñas Cavite, Zone A' },
          { id: 2, name: 'Burol 1 Community Center', address: 'Burol 1, Dasmariñas Cavite, Zone B' },
          { id: 3, name: 'Burol 1 Market Area', address: 'Burol 1, Dasmariñas Cavite, Zone C' },
        ]);
      }
    };
    fetchLocations();
  }, []);

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

    if (!formData.consent) {
      Swal.fire({ icon: 'warning', title: 'Consent Required', text: 'Please agree to the terms.' });
      return;
    }

    // ── LOGGED IN: E-waste submission only ──
    if (isLoggedIn) {
      if (!formData.dropoff_address || !formData.weight || !formData.e_waste_type) {
        Swal.fire({ icon: 'warning', title: 'Required Fields', text: 'Please fill in all e-waste fields.' });
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${BACKEND}/api/e-waste-only`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: loggedInUser.id,
            dropoff_address: formData.dropoff_address,
            e_waste_type: formData.e_waste_type,
            weight: parseFloat(formData.weight),
            consent: formData.consent,
          })
        });

        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Success!', text: 'E-waste reported successfully!' })
            .then(() => { window.location.href = '/dashboard'; });
        } else {
          const error = await res.json();
          Swal.fire({ icon: 'error', title: 'Failed', text: error.error || 'Something went wrong.' });
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Server error. Please try again.' });
      } finally {
        setLoading(false);
      }

    // ── NOT LOGGED IN: Account creation only ──
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name || !formData.security_answer) {
        Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please complete all required fields.' });
        return;
      }
      if (formData.password !== formData.confirm_password) {
        Swal.fire({ icon: 'warning', title: 'Password Mismatch', text: 'Passwords do not match.' });
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${BACKEND}/api/auth/register-only`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formData.first_name,
            middle_name: formData.middle_name,
            last_name: formData.last_name,
            suffix: formData.suffix,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirm_password,
            security_question: formData.security_question,
            security_answer: formData.security_answer,
          })
        });

        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Account Created!', text: 'You can now log in and report your e-waste.' })
            .then(() => { window.location.href = '/login'; });
        } else {
          const error = await res.json();
          Swal.fire({ icon: 'error', title: 'Failed', text: error.error || 'Something went wrong.' });
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Server error. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-600 text-white py-8 text-center shadow-md">
        <h1 className="text-3xl font-bold">
          {isLoggedIn ? t.register.titleLoggedIn : t.register.titleNew}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">

          {/* ── LOGGED IN: Show only E-Waste tab ── */}
          {isLoggedIn && (
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <FaRecycle className="text-blue-600" /> {t.register.ewasteSection}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="dropoff_address"
                  value={formData.dropoff_address}
                  onChange={handleChange}
                  className="p-2.5 border rounded-lg bg-white md:col-span-2"
                  required
                >
                  <option value="">{t.register.selectDropoff} *</option>
                  {dropOffLocations.map(loc => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} — {loc.address}
                    </option>
                  ))}
                </select>

                <input
                  type="number" name="weight" value={formData.weight} onChange={handleChange}
                  placeholder={`${t.register.weight} *`}
                  className="p-2.5 border rounded-lg bg-white"
                  required
                />

                <select
                  name="e_waste_type" value={formData.e_waste_type} onChange={handleChange}
                  className="p-2.5 border rounded-lg bg-white"
                  required
                >
                  <option value="">{t.register.selectEwaste} *</option>
                  {eWasteTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── NOT LOGGED IN: Show only Account tab ── */}
          {!isLoggedIn && (
            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
              <h2 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                <FaUser className="text-purple-600" /> {t.register.accountSection}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder={t.register.firstName} className="p-2.5 border rounded-lg bg-white" required />
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder={t.register.lastName} className="p-2.5 border rounded-lg bg-white" required />
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder={t.register.username} className="p-2.5 border rounded-lg bg-white" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t.register.email} className="p-2.5 border rounded-lg bg-white" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={t.register.password} className="p-2.5 border rounded-lg bg-white" required />
                <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder={t.register.confirmPassword} className="p-2.5 border rounded-lg bg-white" required />
                <select name="security_question" value={formData.security_question} onChange={handleChange} className="p-2.5 border rounded-lg bg-white">
                  {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input type="text" name="security_answer" value={formData.security_answer} onChange={handleChange} placeholder={t.register.securityAnswer} className="p-2.5 border rounded-lg bg-white" required />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 px-2">
            <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="w-5 h-5" />
            <span className="text-sm text-gray-600">{t.register.consent}</span>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md">
            {loading ? t.register.processing : (isLoggedIn ? t.register.submitEwaste : t.register.completeReg)}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;