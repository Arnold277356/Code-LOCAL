import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaArchive, FaTrash, FaUndo, FaSearch, FaBell, FaUsers, FaBoxOpen, FaHistory } from 'react-icons/fa';

const BACKEND = 'https://burol-1-web-backend.onrender.com';

const STATUS_COLORS = {
  'Pending':     'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Done':        'bg-emerald-100 text-emerald-700',
  'Rejected':    'bg-red-100 text-red-700',
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('registrations');
  const [registrations, setRegistrations] = useState([]);
  const [archivedRegistrations, setArchivedRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState('announcement');

  const adminToken = localStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json', 'x-admin-token': adminToken };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [regRes, archRes, userRes, annRes] = await Promise.all([
        fetch(`${BACKEND}/api/admin/registrations`, { headers }),
        fetch(`${BACKEND}/api/admin/registrations/archived`, { headers }),
        fetch(`${BACKEND}/api/admin/users`, { headers }),
        fetch(`${BACKEND}/api/announcements`),
      ]);
      const [regs, archived, usrs, anns] = await Promise.all([
        regRes.json(), archRes.json(), userRes.json(), annRes.json()
      ]);
      setRegistrations(Array.isArray(regs) ? regs : []);
      setArchivedRegistrations(Array.isArray(archived) ? archived : []);
      setUsers(Array.isArray(usrs) ? usrs : []);
      setAnnouncements(Array.isArray(anns) ? anns : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const result = await Swal.fire({
      title: `Set to "${status}"?`,
      text: 'User will be notified via email and SMS.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${BACKEND}/api/admin/registrations/${id}/status`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Updated!', text: `Status: ${status}. Notifications sent.`, confirmButtonColor: '#10b981', timer: 2000, showConfirmButton: false });
        fetchAll();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update status.' });
    }
  };

  const archiveRecord = async (id) => {
    const result = await Swal.fire({
      title: 'Archive this record?',
      text: 'It moves to Archive tab and can be restored anytime.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Archive',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${BACKEND}/api/admin/registrations/${id}`, {
        method: 'DELETE', headers,
        body: JSON.stringify({ reason: 'Archived by admin' }),
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Archived!', timer: 1200, showConfirmButton: false });
        fetchAll();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to archive.' });
    }
  };

  const restoreRecord = async (id) => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/registrations/${id}/restore`, {
        method: 'PATCH', headers,
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Restored!', timer: 1200, showConfirmButton: false });
        fetchAll();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to restore.' });
    }
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this user?', text: 'Cannot be undone.',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    try {
      await fetch(`${BACKEND}/api/admin/users/${id}`, { method: 'DELETE', headers });
      fetchAll();
    } catch (err) {}
  };

  const postAnnouncement = async () => {
    if (!annTitle.trim() || !annContent.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required', text: 'Fill in title and content.', confirmButtonColor: '#10b981' });
      return;
    }
    try {
      const res = await fetch(`${BACKEND}/api/admin/announcements`, {
        method: 'POST', headers,
        body: JSON.stringify({ title: annTitle, content: annContent, type: annType }),
      });
      if (res.ok) {
        setAnnTitle(''); setAnnContent(''); setAnnType('announcement');
        Swal.fire({ icon: 'success', title: 'Posted!', timer: 1200, showConfirmButton: false });
        fetchAll();
      }
    } catch (err) {}
  };

  const deleteAnnouncement = async (id) => {
    const result = await Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
    if (!result.isConfirmed) return;
    try {
      await fetch(`${BACKEND}/api/admin/announcements/${id}`, { method: 'DELETE', headers });
      fetchAll();
    } catch (err) {}
  };

  const filteredRegs = registrations.filter(r => {
    const matchSearch = !searchTerm || `${r.username} ${r.email} ${r.e_waste_type} ${r.first_name} ${r.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = registrations.filter(r => r.status === 'Pending').length;

  const tabs = [
    { id: 'registrations', label: 'Registrations', icon: <FaBoxOpen />, count: registrations.length, alert: pendingCount },
    { id: 'archive', label: 'Archive', icon: <FaArchive />, count: archivedRegistrations.length },
    { id: 'users', label: 'Users', icon: <FaUsers />, count: users.length },
    { id: 'announcements', label: 'Announcements', icon: <FaBell />, count: announcements.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-700 text-white py-5 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">♻️ E-Cycle Hub Admin</h1>
            <p className="text-emerald-200 text-sm">Barangay Burol 1 — Management Panel</p>
          </div>
          <button onClick={() => { localStorage.removeItem('adminToken'); window.location.href = '/admin-login'; }}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            Logout
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-6">
        <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto">
          {[
            { label: 'Total Submissions', value: registrations.length, color: 'text-blue-600' },
            { label: 'Pending', value: pendingCount, color: 'text-yellow-600' },
            { label: 'Done', value: registrations.filter(r => r.status === 'Done').length, color: 'text-emerald-600' },
            { label: 'Archived', value: archivedRegistrations.length, color: 'text-gray-500' },
            { label: 'Total Users', value: users.length, color: 'text-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="flex-shrink-0 text-center px-4 border-r border-gray-100 last:border-0">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
              {tab.icon}
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {tab.count}
              </span>
              {tab.alert > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {tab.alert}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── REGISTRATIONS TAB ── */}
        {activeTab === 'registrations' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, type..."
                  className="w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:border-emerald-500" />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border rounded-lg focus:outline-none bg-white">
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : filteredRegs.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FaBoxOpen className="mx-auto text-4xl mb-3 opacity-30" />
                <p>No registrations found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Weight</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700 hidden sm:table-cell">Location</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700 hidden md:table-cell">Date</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Archive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegs.map(reg => (
                      <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="font-semibold text-gray-900">{reg.first_name || reg.username}</div>
                          <div className="text-xs text-gray-500">{reg.email}</div>
                          {reg.phone_number && <div className="text-xs text-blue-500">📱 {reg.phone_number}</div>}
                        </td>
                        <td className="py-3 px-2 text-gray-700">{reg.e_waste_type}</td>
                        <td className="py-3 px-2 font-semibold text-emerald-600">{reg.weight} kg</td>
                        <td className="py-3 px-2 text-gray-500 hidden sm:table-cell text-xs">{reg.address}</td>
                        <td className="py-3 px-2 text-gray-400 hidden md:table-cell text-xs">{new Date(reg.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-2">
                          <select
                            value={reg.status}
                            onChange={e => updateStatus(reg.id, e.target.value)}
                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer ${STATUS_COLORS[reg.status] || STATUS_COLORS['Pending']}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <button onClick={() => archiveRecord(reg.id)} title="Archive"
                            className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all">
                            <FaArchive size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ARCHIVE TAB ── */}
        {activeTab === 'archive' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <FaHistory className="text-amber-500 text-xl" />
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Archived Records</h2>
                <p className="text-xs text-gray-500">Records are preserved here. Restore anytime — nothing is permanently deleted.</p>
              </div>
            </div>
            {archivedRegistrations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FaArchive className="mx-auto text-4xl mb-3 opacity-30" />
                <p>No archived records yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Weight</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Archived On</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Restore</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedRegistrations.map(reg => (
                      <tr key={reg.id} className="border-b border-gray-100 hover:bg-amber-50 opacity-75">
                        <td className="py-3 px-2">
                          <div className="font-semibold text-gray-700">{reg.first_name || reg.username}</div>
                          <div className="text-xs text-gray-400">{reg.email}</div>
                        </td>
                        <td className="py-3 px-2 text-gray-600">{reg.e_waste_type}</td>
                        <td className="py-3 px-2 text-gray-600">{reg.weight} kg</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[reg.status] || ''}`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-xs text-gray-400">
                          {reg.archived_at ? new Date(reg.archived_at).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-2">
                          <button onClick={() => restoreRecord(reg.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-all">
                            <FaUndo size={11} /> Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Registered Users ({users.length})</h2>
            {users.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Username</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Phone</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Joined</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 font-semibold text-gray-900">{user.first_name} {user.last_name}</td>
                        <td className="py-3 px-2 text-gray-600">@{user.username}</td>
                        <td className="py-3 px-2 text-gray-600 text-xs">{user.email}</td>
                        <td className="py-3 px-2 text-gray-500 text-xs">{user.phone_number || <span className="text-gray-300">—</span>}</td>
                        <td className="py-3 px-2 text-gray-400 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-2">
                          <button onClick={() => deleteUser(user.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                            <FaTrash size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ANNOUNCEMENTS TAB ── */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Post New Announcement</h2>
              <div className="space-y-3">
                <input value={annTitle} onChange={e => setAnnTitle(e.target.value)}
                  placeholder="Announcement Title *"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-emerald-500" />
                <textarea value={annContent} onChange={e => setAnnContent(e.target.value)}
                  placeholder="Content *" rows={4}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-emerald-500 resize-none" />
                <div className="flex gap-3">
                  <select value={annType} onChange={e => setAnnType(e.target.value)}
                    className="flex-1 p-3 border rounded-lg bg-white">
                    <option value="announcement">📢 Announcement</option>
                    <option value="collection">📅 Collection</option>
                    <option value="notice">⚠️ Notice</option>
                  </select>
                  <button onClick={postAnnouncement}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <FaBell size={14} /> Post
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Existing Announcements ({announcements.length})</h2>
              {announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No announcements yet.</div>
              ) : (
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div key={ann.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase text-gray-500">{ann.type}</span>
                          <span className="text-xs text-gray-400">{new Date(ann.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="font-bold text-gray-900">{ann.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{ann.content}</p>
                      </div>
                      <button onClick={() => deleteAnnouncement(ann.id)}
                        className="p-2 text-red-400 hover:text-red-600 rounded-lg ml-3">
                        <FaTrash size={13} />
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