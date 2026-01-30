import React, { useState, useEffect } from 'react';
import { FaTrash, FaCheckCircle, FaUserShield } from 'react-icons/fa';

function AdminDashboard() {
  const [allDrops, setAllDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://burol-1-web-backend.onrender.com')
      .then(res => res.json())
      .then(data => {
        setAllDrops(data);
        setLoading(false);
      })
      .catch(err => console.error("Admin fetch error:", err));
  }, []);

  const totalWeight = allDrops.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);

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
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Collected</p>
            <p className="text-2xl font-bold text-emerald-600">{totalWeight.toFixed(2)} kg</p>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Resident Name</th>
                <th className="p-4 font-semibold text-gray-700">E-Waste Type</th>
                <th className="p-4 font-semibold text-gray-700">Weight</th>
                <th className="p-4 font-semibold text-gray-700">Points</th>
                <th className="p-4 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {allDrops.map((drop) => (
                <tr key={drop.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{drop.first_name} {drop.last_name}</td>
                  <td className="p-4">{drop.e_waste_type}</td>
                  <td className="p-4 text-emerald-600 font-bold">{drop.weight} kg</td>
                  <td className="p-4">₱{parseFloat(drop.reward_points).toFixed(2)}</td>
                  <td className="p-4 text-gray-500">{new Date(drop.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;