import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLanguage } from '../context/LanguageContext';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://burol-1-web-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        Swal.fire({
          icon: 'success',
          title: '✓ Login Successful!',
          html: `<p>Welcome back!</p>`,
          confirmButtonColor: '#10b981',
          didOpen: () => { setTimeout(() => navigate('/dashboard'), 1500); }
        });
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'An error occurred. Please try again.',
        confirmButtonColor: '#10b981'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg bg-white border-4 border-emerald-600">
                <img src="/logo.png" alt="E-Cycle Hub" className="w-20 h-20 object-contain" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t.login.welcomeBack}</h1>
              <p className="text-gray-600 text-sm">{t.login.subtitle}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.login.usernameLabel}</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.login.usernamePlaceholder}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.login.passwordLabel}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? t.login.signingIn : t.login.signInBtn}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t.login.noAccount}{' '}
                <a href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
                  {t.login.registerHere}
                </a>
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{t.login.featuresTitle}</p>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className="flex items-center gap-2"><span className="text-emerald-600">✓</span><span>{t.login.feature1}</span></li>
                <li className="flex items-center gap-2"><span className="text-emerald-600">✓</span><span>{t.login.feature2}</span></li>
                <li className="flex items-center gap-2"><span className="text-emerald-600">✓</span><span>{t.login.feature3}</span></li>
              </ul>
            </div>
          </div>

          <div className="lg:hidden mt-6 space-y-3">
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-emerald-600">
              <p className="text-sm font-semibold text-gray-900 mb-1">{t.login.trackImpact}</p>
              <p className="text-xs text-gray-600">{t.login.trackImpactDesc}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-600">
              <p className="text-sm font-semibold text-gray-900 mb-1">{t.login.earnRewards}</p>
              <p className="text-xs text-gray-600">{t.login.earnRewardsDesc}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-teal-600">
              <p className="text-sm font-semibold text-gray-900 mb-1">{t.login.helpEnv}</p>
              <p className="text-xs text-gray-600">{t.login.helpEnvDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;