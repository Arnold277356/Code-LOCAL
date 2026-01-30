import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EducationPage from './pages/EducationPage';
import MapPage from './pages/MapPage';
import UpdatesPage from './pages/UpdatesPage';
import RegisterPage from './pages/RegisterPage';
import IncentivesPage from './pages/IncentivesPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [announcements, setAnnouncements] = useState([]);
  const [dropOffs, setDropOffs] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
    fetchDropOffs();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchDropOffs = async () => {
    try {
      const response = await fetch('/api/drop-offs');
      const data = await response.json();
      setDropOffs(data);
    } catch (error) {
      console.error('Error fetching drop-offs:', error);
    }
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent announcements={announcements} dropOffs={dropOffs} />
    </Router>
  );
}

function AppContent({ announcements, dropOffs }) {
  return (
    <div className="App">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/map" element={<MapPage dropOffs={dropOffs} />} />
          <Route path="/updates" element={<UpdatesPage announcements={announcements} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/incentives" element={<IncentivesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin-panel" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
