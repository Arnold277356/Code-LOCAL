import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaUser, FaRecycle, FaPlus, FaTrash } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import './RegisterPage.css';

const BACKEND = 'https://burol-1-web-backend.onrender.com';

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

const emptyItem = () => ({ id: Date.now(), e_waste_type: '', weight: '' });

function RegisterPage() {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!loggedInUser;
  const { t, language } = useLanguage();

  const [dropOffLocations, setDropOffLocations] = useState([]);
  const [ewasteItems, setEwasteItems] = useState([emptyItem()]);
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [formData, setFormData] = useState({
    first_name: '', middle_name: '', last_name: '', suffix: '',
    consent: false, privacy_consent: false,
    username: '', email: '', password: '', confirm_password: '',
    security_question: "What is your mother's name?", security_answer: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND}/api/drop-offs`)
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) setDropOffLocations(data);
        else setDropOffLocations([
          { id: 1, name: 'Burol 1 Barangay Hall', address: 'Burol 1, Dasmariñas Cavite, Zone A' },
          { id: 2, name: 'Burol 1 Community Center', address: 'Burol 1, Dasmariñas Cavite, Zone B' },
          { id: 3, name: 'Burol 1 Market Area', address: 'Burol 1, Dasmariñas Cavite, Zone C' },
        ]);
      })
      .catch(() => setDropOffLocations([
        { id: 1, name: 'Burol 1 Barangay Hall', address: 'Burol 1, Dasmariñas Cavite, Zone A' },
        { id: 2, name: 'Burol 1 Community Center', address: 'Burol 1, Dasmariñas Cavite, Zone B' },
        { id: 3, name: 'Burol 1 Market Area', address: 'Burol 1, Dasmariñas Cavite, Zone C' },
      ]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleItemChange = (id, field, value) => {
    setEwasteItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => setEwasteItems(prev => [...prev, emptyItem()]);

  const removeItem = (id) => {
    if (ewasteItems.length === 1) return; // keep at least one
    setEwasteItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent) {
      Swal.fire({ icon: 'warning', title: 'Consent Required', text: 'Please agree to the e-waste processing terms.', confirmButtonColor: '#10b981' });
      return;
    }
    if (!isLoggedIn && !formData.privacy_consent) {
      Swal.fire({ icon: 'warning', title: 'Privacy Consent Required', text: 'Please accept the Data Privacy Policy.', confirmButtonColor: '#10b981' });
      return;
    }

    // ── LOGGED IN: submit e-waste items ──
    if (isLoggedIn) {
      if (!dropoffAddress) {
        Swal.fire({ icon: 'warning', title: 'Required', text: 'Please select a drop-off location.', confirmButtonColor: '#10b981' });
        return;
      }
      const incomplete = ewasteItems.some(i => !i.e_waste_type || !i.weight || parseFloat(i.weight) <= 0);
      if (incomplete) {
        Swal.fire({ icon: 'warning', title: 'Incomplete Items', text: 'Please fill in type and weight for all e-waste items.', confirmButtonColor: '#10b981' });
        return;
      }

      setLoading(true);
      try {
        // Submit each item separately
        const promises = ewasteItems.map(item =>
          fetch(`${BACKEND}/api/e-waste-only`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: loggedInUser.id,
              dropoff_address: dropoffAddress,
              e_waste_type: item.e_waste_type,
              weight: parseFloat(item.weight),
              consent: formData.consent,
            })
          })
        );
        const results = await Promise.all(promises);
        const allOk = results.every(r => r.ok);

        if (allOk) {
          const totalWeight = ewasteItems.reduce((sum, i) => sum + parseFloat(i.weight), 0);
          const totalReward = totalWeight * 5;
          Swal.fire({
            icon: 'success',
            title: language === 'en' ? '✅ E-Waste Submitted!' : '✅ Naisumite ang E-Waste!',
            html: `
              <p>${language === 'en' ? 'Items submitted:' : 'Mga item na isinumite:'} <strong>${ewasteItems.length}</strong></p>
              <p>${language === 'en' ? 'Total weight:' : 'Kabuuang timbang:'} <strong>${totalWeight.toFixed(2)} kg</strong></p>
              <p>${language === 'en' ? 'Estimated reward:' : 'Tinatayang gantimpala:'} <strong style="color:#10b981">₱${totalReward.toFixed(2)}</strong></p>
            `,
            confirmButtonColor: '#10b981'
          }).then(() => { window.location.href = '/dashboard'; });
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: 'Some items could not be submitted. Please try again.', confirmButtonColor: '#10b981' });
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Server error. Please try again.', confirmButtonColor: '#10b981' });
      } finally {
        setLoading(false);
      }

    // ── NOT LOGGED IN: account creation only ──
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name || !formData.security_answer) {
        Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please complete all required fields.', confirmButtonColor: '#10b981' });
        return;
      }
      if (formData.password !== formData.confirm_password) {
        Swal.fire({ icon: 'warning', title: 'Password Mismatch', text: 'Passwords do not match.', confirmButtonColor: '#10b981' });
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
            phone_number: formData.phone_number || "",
          })
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: language === 'en' ? 'Account Created!' : 'Nagawa ang Account!', text: language === 'en' ? 'You can now log in and report your e-waste.' : 'Maaari ka na ngayong mag-login at mag-ulat ng iyong e-waste.', confirmButtonColor: '#10b981' })
            .then(() => { window.location.href = '/login'; });
        } else {
          const error = await res.json();
          Swal.fire({ icon: 'error', title: 'Failed', text: error.error || 'Something went wrong.', confirmButtonColor: '#10b981' });
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Server error. Please try again.', confirmButtonColor: '#10b981' });
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

          {/* ── LOGGED IN: E-Waste submission ── */}
          {isLoggedIn && (
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <FaRecycle className="text-blue-600" /> {t.register.ewasteSection}
              </h2>

              {/* Drop-off location — single for all items */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-blue-800 mb-2">
                  {t.register.selectDropoff} *
                </label>
                <select
                  value={dropoffAddress}
                  onChange={e => setDropoffAddress(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-white"
                  required
                >
                  <option value="">{t.register.selectDropoff}</option>
                  {dropOffLocations.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name} — {loc.address}</option>
                  ))}
                </select>
              </div>

              {/* E-waste items */}
              <div className="space-y-3">
                {ewasteItems.map((item, index) => (
                  <div key={item.id} className="bg-white rounded-lg border border-blue-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-blue-800">
                        {language === 'en' ? `Item ${index + 1}` : `Item ${index + 1}`}
                      </span>
                      {ewasteItems.length > 1 && (
                        <button type="button" onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1">
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={item.e_waste_type}
                        onChange={e => handleItemChange(item.id, 'e_waste_type', e.target.value)}
                        className="p-2.5 border rounded-lg bg-gray-50"
                        required
                      >
                        <option value="">{t.register.selectEwaste} *</option>
                        {eWasteTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                      <input
                        type="number" step="0.1" min="0.1"
                        value={item.weight}
                        onChange={e => handleItemChange(item.id, 'weight', e.target.value)}
                        placeholder={`${t.register.weight} *`}
                        className="p-2.5 border rounded-lg bg-gray-50"
                        required
                      />
                    </div>
                    {item.weight && item.e_waste_type && (
                      <p className="text-xs text-emerald-600 mt-2 font-semibold">
                        {language === 'en' ? 'Estimated reward:' : 'Tinatayang gantimpala:'} ₱{(parseFloat(item.weight) * 5).toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Add item button */}
              <button type="button" onClick={addItem}
                className="mt-4 flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold text-sm border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-lg px-4 py-2 w-full justify-center transition-all">
                <FaPlus size={12} />
                {language === 'en' ? '+ Add Another E-Waste Item' : '+ Magdagdag ng Isa Pang Item'}
              </button>

              {/* Total summary */}
              {ewasteItems.some(i => i.weight) && (
                <div className="mt-4 bg-emerald-50 rounded-lg p-3 border border-emerald-200 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>{language === 'en' ? 'Total items:' : 'Kabuuang items:'}</span>
                    <strong>{ewasteItems.filter(i => i.weight && i.e_waste_type).length}</strong>
                  </div>
                  <div className="flex justify-between text-gray-700 mt-1">
                    <span>{language === 'en' ? 'Total weight:' : 'Kabuuang timbang:'}</span>
                    <strong>{ewasteItems.reduce((s, i) => s + (parseFloat(i.weight) || 0), 0).toFixed(2)} kg</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold mt-1">
                    <span>{language === 'en' ? 'Estimated reward:' : 'Tinatayang gantimpala:'}</span>
                    <strong>₱{(ewasteItems.reduce((s, i) => s + (parseFloat(i.weight) || 0), 0) * 5).toFixed(2)}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── NOT LOGGED IN: Account creation ── */}
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
                <input type="tel" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} placeholder="📱 Phone Number for SMS alerts (e.g. 09xxxxxxxxx)" className="p-2.5 border rounded-lg bg-white md:col-span-2" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={t.register.password} className="p-2.5 border rounded-lg bg-white" required />
                <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder={t.register.confirmPassword} className="p-2.5 border rounded-lg bg-white" required />
                <select name="security_question" value={formData.security_question} onChange={handleChange} className="p-2.5 border rounded-lg bg-white">
                  {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input type="text" name="security_answer" value={formData.security_answer} onChange={handleChange} placeholder={t.register.securityAnswer} className="p-2.5 border rounded-lg bg-white" required />
              </div>
            </div>
          )}

          {/* Consent checkboxes */}
          <div className="space-y-3 px-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="w-5 h-5 mt-0.5 accent-emerald-600" />
              <span className="text-sm text-gray-600">{t.register.consent}</span>
            </label>
            {!isLoggedIn && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="privacy_consent" checked={formData.privacy_consent} onChange={handleChange} className="w-5 h-5 mt-0.5 accent-emerald-600" />
                <span className="text-sm text-gray-600">
                  {language === 'en' ? (
                    <>I have read and understood the{' '}
                      <a href="/privacy-policy" target="_blank" className="text-emerald-600 font-semibold hover:underline">E-Cycle Hub Privacy Policy</a>
                      . I consent to the collection and processing of my personal information in accordance with Republic Act No. 10173 or the Data Privacy Act of 2012.
                    </>
                  ) : (
                    <>Nabasa at naunawaan ko ang{' '}
                      <a href="/privacy-policy" target="_blank" className="text-emerald-600 font-semibold hover:underline">Privacy Policy ng E-Cycle Hub</a>
                      . Pumapayag ako sa pagkolekta at pagproseso ng aking personal na impormasyon alinsunod sa Republika Batas Blg. 10173 o ang Data Privacy Act ng 2012.
                    </>
                  )}
                </span>
              </label>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md disabled:opacity-50">
            {loading ? t.register.processing : (isLoggedIn ? t.register.submitEwaste : t.register.completeReg)}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;