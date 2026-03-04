import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaSignOutAlt, FaPlus, FaMapMarkerAlt, FaGift, FaBell } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const STATUS_STYLES = {
  'Pending':     'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Done':        'bg-emerald-100 text-emerald-700',
  'Rejected':    'bg-red-100 text-red-700',
};

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [drops, setDrops] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) { navigate('/login'); return; }
    setUser(loggedInUser);
    loadDrops(loggedInUser.id);
  }, [navigate]);

  const loadDrops = async (userId) => {
    try {
      const response = await fetch(`https://burol-1-web-backend.onrender.com/api/user/${userId}`);
      const data = await response.json();
      if (data.success) {
        const formattedDrops = data.user.registrations.map(drop => ({
          id: drop.id,
          type: drop.e_waste_type,
          weight: parseFloat(drop.weight),
          date: drop.created_at,
          location: drop.address || 'Barangay Hall',
          reward: parseFloat(drop.reward_points),
          status: drop.status || 'Pending',
        }));
        setDrops(formattedDrops);
        setTotalWeight(parseFloat(data.user.totalWeight || 0));
        setTotalRewards(parseFloat(data.user.totalRewards || 0));
      }
    } catch (error) {
      console.error('Error loading drops:', error);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      icon: 'question',
      title: t.dashboard.logoutConfirm,
      text: t.dashboard.logoutText,
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t.dashboard.logoutYes
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <img src="/logo.png" alt="E-Cycle Hub" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">{t.dashboard.title}</h1>
              <p className="text-xs sm:text-sm text-emerald-100">{t.dashboard.welcome} {user.first_name || user.username}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-sm transition-all">
            <FaSignOutAlt /> {t.dashboard.logout}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{t.dashboard.totalDrops}</h3>
            <p className="text-3xl font-bold text-emerald-600">{drops.length}</p>
            <p className="text-xs text-gray-500 mt-2">{t.dashboard.ewasteItems}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{t.dashboard.totalWeight}</h3>
            <p className="text-3xl font-bold text-emerald-600">{totalWeight.toFixed(1)} kg</p>
            <p className="text-xs text-gray-500 mt-2">{t.dashboard.recycled}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{t.dashboard.totalRewards}</h3>
            <p className="text-3xl font-bold text-emerald-600">₱{totalRewards.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{t.dashboard.earned}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{t.dashboard.envImpact}</h3>
            <p className="text-3xl font-bold text-emerald-600">{(totalWeight * 10).toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-2">{t.dashboard.co2Saved}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.dashboard.dropHistory}</h2>
              {drops.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-semibold">{t.dashboard.noDrops}</p>
                  <p className="text-sm mt-1">{t.dashboard.noDropsHint}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t.dashboard.type}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t.dashboard.weight}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 hidden sm:table-cell">{t.dashboard.date}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">{t.dashboard.location}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t.dashboard.reward}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t.dashboard.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drops.map((drop) => (
                        <tr key={drop.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold text-gray-900">{drop.type}</td>
                          <td className="py-3 px-4 text-emerald-600 font-semibold">{drop.weight} kg</td>
                          <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{new Date(drop.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{drop.location}</td>
                          <td className="py-3 px-4 text-emerald-600 font-semibold">₱{drop.reward.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[drop.status] || STATUS_STYLES['Pending']}`}>
                              {drop.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.dashboard.quickActions}</h2>
              <div className="space-y-3">
                {[
                  { icon: <FaPlus />, title: t.dashboard.newDropoff, desc: t.dashboard.newDropoffDesc, path: '/register' },
                  { icon: <FaMapMarkerAlt />, title: t.dashboard.findLocation, desc: t.dashboard.findLocationDesc, path: '/map' },
                  { icon: <FaGift />, title: t.dashboard.viewRewards, desc: t.dashboard.viewRewardsDesc, path: '/incentives' },
                  { icon: <FaBell />, title: t.dashboard.updates, desc: t.dashboard.updatesDesc, path: '/updates' },
                ].map((action, i) => (
                  <button key={i} onClick={() => navigate(action.path)}
                    className="w-full p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg hover:border-emerald-600 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-600 text-lg group-hover:scale-125 transition-transform">{action.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{action.title}</h3>
                        <p className="text-xs text-gray-600">{action.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;