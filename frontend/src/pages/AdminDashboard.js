import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Done: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

function AdminDashboard() {
  const [allDrops, setAllDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetch('https://burol-1-web-backend.onrender.com/api/admin/registrations', {
      headers: { 'x-admin-token': token }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/');
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) setAllDrops(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Admin fetch error:", err);
        setLoading(false);
      });
  }, [navigate, token]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`https://burol-1-web-backend.onrender.com/api/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAllDrops(prev =>
          prev.map(drop => drop.id === id ? { ...drop, status: newStatus } : drop)
        );
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Marked as ${newStatus}`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not update status.' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Server error.' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const totalWeight = allDrops.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaUserShield className="text-emerald-600" /> Barangay Burol 1 Admin
            </h1>
            <p className="text-gray-500">Master E-Waste Management Oversight</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Collected</p>
              <p className="text-2xl font-bold text-emerald-600">{totalWeight.toFixed(2)} kg</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold transition-all border border-red-200"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['Pending', 'In Progress', 'Done', 'Rejected'].map(status => (
            <div key={status} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-gray-500 text-sm">{status}</p>
              <p className="text-2xl font-bold text-gray-800">
                {allDrops.filter(d => (d.status || 'Pending') === status).length}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          {allDrops.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No registrations found.</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Full Name</th>
                  <th className="p-4 font-semibold text-gray-700">Contact</th>
                  <th className="p-4 font-semibold text-gray-700">E-Waste Type</th>
                  <th className="p-4 font-semibold text-gray-700">Weight</th>
                  <th className="p-4 font-semibold text-gray-700">Points</th>
                  <th className="p-4 font-semibold text-gray-700">Date</th>
                  <th className="p-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {allDrops.map((drop) => {
                  const currentStatus = drop.status || 'Pending';
                  return (
                    <tr key={drop.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{drop.first_name} {drop.last_name}</td>
                      <td className="p-4 text-gray-600">{drop.contact || '—'}</td>
                      <td className="p-4">{drop.e_waste_type}</td>
                      <td className="p-4 text-emerald-600 font-bold">{drop.weight} kg</td>
                      <td className="p-4">₱{parseFloat(drop.reward_points).toFixed(2)}</td>
                      <td className="p-4 text-gray-500">{new Date(drop.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(drop.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 ${STATUS_COLORS[currentStatus]}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;