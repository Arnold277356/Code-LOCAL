import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaSignOutAlt, FaSearch, FaTrash, FaBullhorn, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Done: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const BACKEND = 'https://burol-1-web-backend.onrender.com';

function AdminDashboard() {
  const [allDrops, setAllDrops] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('donations'); // 'donations' or 'announcements'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'announcement' });
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchDonations();
    fetchAnnouncements();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/registrations`, {
        headers: { 'x-admin-token': token }
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/');
        return;
      }
      const data = await res.json();
      if (data) setAllDrops(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/announcements`);
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error('Announcements fetch error:', err);
    }
  };

  // ── STATUS UPDATE ──────────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAllDrops(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
        Swal.fire({ icon: 'success', title: 'Updated', text: `Marked as ${newStatus}`, timer: 1200, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not update status.' });
    }
  };

  // ── DELETE DONATION ────────────────────────────────────────
  const handleDeleteDonation = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this record?',
      text: 'This cannot be undone.',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND}/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) {
        setAllDrops(prev => prev.filter(d => d.id !== id));
        Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not delete record.' });
    }
  };

  // ── POST ANNOUNCEMENT ──────────────────────────────────────
  const handlePostAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please fill in both title and content.' });
      return;
    }

    setPosting(true);
    try {
      const res = await fetch(`${BACKEND}/api/admin/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify(newAnnouncement)
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(prev => [data.announcement, ...prev]);
        setNewAnnouncement({ title: '', content: '', type: 'announcement' });
        Swal.fire({ icon: 'success', title: 'Posted!', timer: 1200, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not post announcement.' });
    } finally {
      setPosting(false);
    }
  };

  // ── DELETE ANNOUNCEMENT ────────────────────────────────────
  const handleDeleteAnnouncement = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this announcement?',
      text: 'This cannot be undone.',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND}/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not delete announcement.' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  // ── FILTER DONATIONS ───────────────────────────────────────
  const filteredDrops = allDrops.filter(drop => {
    const fullName = `${drop.first_name} ${drop.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) ||
      drop.e_waste_type?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (drop.status || 'Pending') === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

        {/* Header */}
        <header className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
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
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold transition-all border border-red-200">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'donations' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            📦 Donations
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'announcements' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            📢 Announcements
          </button>
        </div>

        {/* ── DONATIONS TAB ── */}
        {activeTab === 'donations' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {['Pending', 'In Progress', 'Done', 'Rejected'].map(status => (
                <div
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? 'All' : status)}
                  className={`bg-white rounded-xl shadow-sm p-4 text-center cursor-pointer transition-all hover:shadow-md ${statusFilter === status ? 'ring-2 ring-emerald-500' : ''}`}
                >
                  <p className="text-gray-500 text-sm">{status}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {allDrops.filter(d => (d.status || 'Pending') === status).length}
                  </p>
                </div>
              ))}
            </div>

            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or e-waste type..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold text-gray-600"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Donations Table */}
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
              {filteredDrops.length === 0 ? (
                <p className="text-center text-gray-400 py-12">No records found.</p>
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
                      <th className="p-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrops.map((drop) => {
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
                          <td className="p-4">
                            <button
                              onClick={() => handleDeleteDonation(drop.id)}
                              className="text-red-400 hover:text-red-600 transition-colors p-1"
                              title="Delete record"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── ANNOUNCEMENTS TAB ── */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            {/* Post New Announcement */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FaBullhorn className="text-emerald-600" /> Post New Announcement
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Title *"
                  value={newAnnouncement.title}
                  onChange={e => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <textarea
                  placeholder="Content *"
                  value={newAnnouncement.content}
                  onChange={e => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
                <div className="flex gap-3 items-center">
                  <select
                    value={newAnnouncement.type}
                    onChange={e => setNewAnnouncement(prev => ({ ...prev, type: e.target.value }))}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-600"
                  >
                    <option value="announcement">📢 Announcement</option>
                    <option value="collection">📅 Collection</option>
                    <option value="notice">⚠️ Notice</option>
                  </select>
                  <button
                    onClick={handlePostAnnouncement}
                    disabled={posting}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    <FaPlus /> {posting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Announcements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Existing Announcements ({announcements.length})</h2>
              {announcements.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No announcements yet.</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map(a => (
                    <div key={a.id} className="flex justify-between items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-emerald-600 uppercase">{a.type}</span>
                          <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="font-semibold text-gray-800">{a.title}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 flex-shrink-0"
                        title="Delete announcement"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;