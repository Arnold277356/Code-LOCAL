import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUserShield, FaLock, FaUser } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://burol-1-web-backend.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin-panel');
      } else {
        Swal.fire({ icon: 'error', title: 'Access Denied', text: data.error || 'Invalid admin credentials.' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not connect to server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <FaUserShield className="text-emerald-600 text-5xl mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">{t.adminLogin.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{t.adminLogin.subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="username" value={credentials.username} onChange={handleChange}
              placeholder={t.adminLogin.usernamePlaceholder}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400" required />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" name="password" value={credentials.password} onChange={handleChange}
              placeholder={t.adminLogin.passwordPlaceholder}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition-all shadow-md mt-2">
            {loading ? t.adminLogin.verifying : t.adminLogin.loginBtn}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;