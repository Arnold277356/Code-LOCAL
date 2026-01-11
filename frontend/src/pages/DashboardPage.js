import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaSignOutAlt, FaPlus, FaMapMarkerAlt, FaGift, FaBell } from 'react-icons/fa';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [drops, setDrops] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    loadDrops();
  }, [navigate]);

  const loadDrops = async (userId) => {
    try {
      // 1. Use your existing endpoint: /api/user/:userId/registrations
      const response = await fetch(`https://burol-1-web-backend.onrender.com/api/user/${userId}/registrations`);
      const data = await response.json();

      if (data.success) {
        // 2. Map the data from your database to your table
        const formattedDrops = data.registrations.map(drop => ({
          id: drop.id,
          type: drop.e_waste_type,
          weight: parseFloat(drop.weight),
          date: drop.created_at,
          location: 'Barangay Hall', // You can update this if you add location to DB later
          reward: parseFloat(drop.reward_points),
          status: 'Completed'
        }));

        setDrops(formattedDrops);

        // 3. Use the summary numbers already calculated by your backend!
        setTotalWeight(parseFloat(data.summary.total_weight_kg));
        setTotalRewards(parseFloat(data.summary.total_rewards_php));
      }
    } catch (error) {
      console.error('Error loading drops from Burol 1 Backend:', error);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      icon: 'question',
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully',
          confirmButtonColor: '#10b981'
        }).then(() => {
          navigate('/login');
        });
      }
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <img src="/logo.png" alt="E-Cycle Hub" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Dashboard</h1>
              <p className="text-xs sm:text-sm text-emerald-100">Welcome, {user.first_name || user.username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-sm transition-all duration-300"
          >
            <FaSignOutAlt className="text-base" /> Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Drops</h3>
            <p className="text-3xl font-bold text-emerald-600">{drops.length}</p>
            <p className="text-xs text-gray-500 mt-2">e-waste items</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Weight</h3>
            <p className="text-3xl font-bold text-emerald-600">{totalWeight.toFixed(1)} kg</p>
            <p className="text-xs text-gray-500 mt-2">recycled</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Rewards</h3>
            <p className="text-3xl font-bold text-emerald-600">₱{totalRewards.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">earned</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Environmental Impact</h3>
            <p className="text-3xl font-bold text-emerald-600">{(totalWeight * 10).toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-2">kg CO₂ saved</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Drop History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Drop History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Weight</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 hidden sm:table-cell">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Reward</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drops.map((drop) => (
                      <tr key={drop.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-gray-900">{drop.type}</td>
                        <td className="py-3 px-4 text-emerald-600 font-semibold">{drop.weight} kg</td>
                        <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{new Date(drop.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{drop.location}</td>
                        <td className="py-3 px-4 text-emerald-600 font-semibold">₱{drop.reward.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                            {drop.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg hover:border-emerald-600 hover:shadow-medium transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <FaPlus className="text-emerald-600 text-lg group-hover:scale-125 transition-transform" />
                    <div>
                      <h3 className="font-bold text-gray-900">New Drop-off</h3>
                      <p className="text-xs text-gray-600">Register e-waste</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/map')}
                  className="w-full p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg hover:border-emerald-600 hover:shadow-medium transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-emerald-600 text-lg group-hover:scale-125 transition-transform" />
                    <div>
                      <h3 className="font-bold text-gray-900">Find Location</h3>
                      <p className="text-xs text-gray-600">Nearest drop-off</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/incentives')}
                  className="w-full p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg hover:border-emerald-600 hover:shadow-medium transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <FaGift className="text-emerald-600 text-lg group-hover:scale-125 transition-transform" />
                    <div>
                      <h3 className="font-bold text-gray-900">View Rewards</h3>
                      <p className="text-xs text-gray-600">Reward details</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/updates')}
                  className="w-full p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg hover:border-emerald-600 hover:shadow-medium transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <FaBell className="text-emerald-600 text-lg group-hover:scale-125 transition-transform" />
                    <div>
                      <h3 className="font-bold text-gray-900">Updates</h3>
                      <p className="text-xs text-gray-600">Latest news</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
