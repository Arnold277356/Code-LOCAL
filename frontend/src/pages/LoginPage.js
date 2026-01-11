import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaLock, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
export default LoginPage;

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://burol-1-web-backend.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = awaitresponse.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        Swal.fire({
          icon: 'success',
          title: '✓ Login Successful!',
          html: `<p>Welcome back!</p>`,
          confirmButtonColor: '#10b981',
          didOpen: () => {
            setTimeout(() => navigate('/dashboard'), 1500);
          }
        });
      } else {
        // 3. Handle wrong password/email from database
        throw new Error(data.message || 'Invalid credentials');
      }

      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'An error occurred. Please try again.',
        confirmButtonColor: '#10b981'
      });
      setLoading(false);
    }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in">
            {/* Logo Circle */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg bg-white border-4 border-emerald-600">
                <img src="/logo.png" alt="E-Cycle Hub" className="w-20 h-20 object-contain" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600 text-sm">Sign in to track your e-waste drops and earn rewards</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-green-700"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Register here
                </a>
              </p>
            </div>

            {/* Features List */}
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Features</p>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Track e-waste drops</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Monitor rewards earned</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>View collection history</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Info Cards - Mobile */}
          <div className="lg:hidden mt-6 space-y-3">
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-emerald-600">
              <p className="text-sm font-semibold text-gray-900 mb-1">📊 Track Impact</p>
              <p className="text-xs text-gray-600">Monitor your e-waste drops and rewards</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-600">
              <p className="text-sm font-semibold text-gray-900 mb-1">💰 Earn Rewards</p>
              <p className="text-xs text-gray-600">Get ₱15 per kilogram of e-waste</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-teal-600">
              <p className="text-sm font-semibold text-gray-900 mb-1">🌍 Help Environment</p>
              <p className="text-xs text-gray-600">Be part of the solution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}}
