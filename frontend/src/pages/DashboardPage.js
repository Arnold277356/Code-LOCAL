import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaSignOutAlt, FaPlus, FaMapMarkerAlt, FaGift, FaBell, FaDownload, FaTrophy } from 'react-icons/fa';
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

        // ✅ Only count rewards for "Done" drops
        const confirmedWeight = formattedDrops
          .filter(d => d.status === 'Done')
          .reduce((sum, d) => sum + d.weight, 0);
        const confirmedRewards = formattedDrops
          .filter(d => d.status === 'Done')
          .reduce((sum, d) => sum + d.reward, 0);

        setTotalWeight(confirmedWeight);
        setTotalRewards(confirmedRewards);
      }
    } catch (error) {
      console.error('Error loading drops:', error);
    }
  };

  const handleClaimReward = () => {
    const claimableDone = drops.filter(d => d.status === 'Done');
    if (claimableDone.length === 0) {
      Swal.fire({
        icon: 'info',
        title: t.dashboard.noClaimableTitle || 'No Claimable Rewards',
        text: t.dashboard.noClaimableText || 'You have no completed drop-offs yet. Rewards are only available once your submission is marked as Done.',
        confirmButtonColor: '#10b981'
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: '🎉 ' + (t.dashboard.claimTitle || 'How to Claim Your Reward'),
      html: `
        <div style="text-align:left; font-size:14px; line-height:1.8">
          <p style="margin-bottom:12px"><strong>${t.dashboard.claimRewardAmount || 'Your claimable reward:'}</strong> 
            <span style="color:#10b981; font-size:18px; font-weight:bold"> ₱${totalRewards.toFixed(2)}</span>
          </p>
          <ol style="padding-left:20px">
            <li>${t.dashboard.claimStep1 || 'Go to the Barangay Hall at Burol 1, Dasmariñas Cavite'}</li>
            <li>${t.dashboard.claimStep2 || 'Bring a valid government-issued ID'}</li>
            <li>${t.dashboard.claimStep3 || 'Show your drop-off certificate (download it from your dashboard)'}</li>
            <li>${t.dashboard.claimStep4 || 'Barangay staff will verify your submission and release your voucher'}</li>
            <li>${t.dashboard.claimStep5 || 'Vouchers are valid for 12 months from date of issuance'}</li>
          </ol>
          <p style="margin-top:12px; color:#6b7280; font-size:12px">
            📞 ${t.dashboard.claimContact || 'For inquiries:'} 09916338752
          </p>
        </div>
      `,
      confirmButtonColor: '#10b981',
      confirmButtonText: t.dashboard.claimBtn || 'Got it!'
    });
  };

  const handleDownloadCertificate = (drop) => {
    if (drop.status !== 'Done') {
      Swal.fire({
        icon: 'warning',
        title: t.dashboard.certNotReady || 'Certificate Not Ready',
        text: t.dashboard.certNotReadyText || 'Your certificate will be available once your drop-off is marked as Done.',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Generate a printable certificate in a new window
    const certWindow = window.open('', '_blank');
    certWindow.document.write(`
      <html>
        <head>
          <title>E-Waste Drop-off Certificate</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
            .header { text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 48px; }
            .title { font-size: 24px; font-weight: bold; color: #10b981; margin: 10px 0; }
            .subtitle { color: #6b7280; font-size: 14px; }
            .cert-body { border: 2px solid #d1fae5; border-radius: 12px; padding: 24px; background: #f0fdf4; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
            .label { color: #6b7280; font-size: 14px; }
            .value { font-weight: bold; color: #111; font-size: 14px; }
            .reward-box { background: #10b981; color: white; text-align: center; padding: 16px; border-radius: 8px; margin-top: 20px; }
            .reward-amount { font-size: 32px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
            .status-badge { background: #d1fae5; color: #065f46; padding: 2px 10px; border-radius: 999px; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">♻️</div>
            <div class="title">E-Cycle Hub</div>
            <div class="subtitle">Barangay Burol 1, Dasmariñas City, Cavite</div>
            <div class="subtitle" style="margin-top:8px; font-weight:bold; color:#10b981">E-WASTE DROP-OFF CERTIFICATE</div>
          </div>

          <div class="cert-body">
            <div class="row">
              <span class="label">Resident Name</span>
              <span class="value">${user?.first_name || ''} ${user?.last_name || ''}</span>
            </div>
            <div class="row">
              <span class="label">Username</span>
              <span class="value">${user?.username || ''}</span>
            </div>
            <div class="row">
              <span class="label">E-Waste Type</span>
              <span class="value">${drop.type}</span>
            </div>
            <div class="row">
              <span class="label">Weight</span>
              <span class="value">${drop.weight} kg</span>
            </div>
            <div class="row">
              <span class="label">Drop-off Location</span>
              <span class="value">${drop.location}</span>
            </div>
            <div class="row">
              <span class="label">Date Submitted</span>
              <span class="value">${new Date(drop.date).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' })}</span>
            </div>
            <div class="row">
              <span class="label">Status</span>
              <span class="status-badge">✓ ${drop.status}</span>
            </div>
            <div class="reward-box">
              <div style="font-size:13px; opacity:0.9">Reward Earned</div>
              <div class="reward-amount">₱${drop.reward.toFixed(2)}</div>
              <div style="font-size:11px; opacity:0.8; margin-top:4px">Present this certificate at Barangay Hall to claim</div>
            </div>
          </div>

          <div class="footer">
            <p>Certificate ID: ECH-${drop.id}-${Date.now().toString().slice(-6)}</p>
            <p>This certificate serves as proof of e-waste drop-off. Claim reward at Barangay Hall with valid ID.</p>
            <p>📞 09916338752 | Burol 1, Dasmariñas Cavite</p>
            <p style="margin-top:16px; color:#10b981">© E-Cycle Hub 2024</p>
          </div>

          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    certWindow.document.close();
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

  const pendingDrops = drops.filter(d => d.status === 'Pending' || d.status === 'In Progress');
  const doneDrops = drops.filter(d => d.status === 'Done');

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

        {/* Claim Reward Banner — only shows if has Done drops */}
        {doneDrops.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-white text-3xl" />
              <div>
                <p className="text-white font-bold text-lg">
                  {t.dashboard.rewardReady || 'You have rewards to claim!'}
                </p>
                <p className="text-yellow-100 text-sm">
                  ₱{totalRewards.toFixed(2)} {t.dashboard.earned} • {doneDrops.length} {t.dashboard.ewasteItems}
                </p>
              </div>
            </div>
            <button
              onClick={handleClaimReward}
              className="bg-white text-orange-500 font-bold px-6 py-2 rounded-lg hover:bg-yellow-50 transition-all shadow"
            >
              {t.dashboard.claimNow || 'How to Claim →'}
            </button>
          </div>
        )}

        {/* Stats */}
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
            <p className="text-xs text-gray-500 mt-2">{t.dashboard.recycled} <span className="text-emerald-500 font-semibold">(verified)</span></p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{t.dashboard.totalRewards}</h3>
            <p className="text-3xl font-bold text-emerald-600">₱{totalRewards.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{t.dashboard.earned} <span className="text-emerald-500 font-semibold">(verified only)</span></p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{t.dashboard.envImpact}</h3>
            <p className="text-3xl font-bold text-emerald-600">{(totalWeight * 10).toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-2">{t.dashboard.co2Saved}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Drop History */}
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
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">{t.dashboard.type}</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">{t.dashboard.weight}</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700 hidden sm:table-cell">{t.dashboard.date}</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">{t.dashboard.reward}</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">{t.dashboard.status}</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">{t.dashboard.certificate || 'Cert'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drops.map((drop) => (
                        <tr key={drop.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 font-semibold text-gray-900">{drop.type}</td>
                          <td className="py-3 px-2 text-emerald-600 font-semibold">{drop.weight} kg</td>
                          <td className="py-3 px-2 text-gray-600 hidden sm:table-cell">{new Date(drop.date).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            {drop.status === 'Done'
                              ? <span className="text-emerald-600 font-semibold">₱{drop.reward.toFixed(2)}</span>
                              : <span className="text-gray-400 text-xs">Pending verification</span>
                            }
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[drop.status] || STATUS_STYLES['Pending']}`}>
                              {drop.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <button
                              onClick={() => handleDownloadCertificate(drop)}
                              title={drop.status === 'Done' ? 'Download Certificate' : 'Available when Done'}
                              className={`p-1.5 rounded-lg transition-all ${drop.status === 'Done' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-300 cursor-not-allowed'}`}
                            >
                              <FaDownload />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
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

                {/* Pending drops notice */}
                {pendingDrops.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                    <p className="font-semibold">⏳ {pendingDrops.length} submission{pendingDrops.length > 1 ? 's' : ''} pending verification</p>
                    <p className="mt-1 text-yellow-700">Rewards will appear once admin marks them as Done.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;