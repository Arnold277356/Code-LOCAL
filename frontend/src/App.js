import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { LanguageProvider } from './context/LanguageContext';
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
import FAQPage from './pages/FAQPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  const [dropOffs, setDropOffs] = useState([]);

  useEffect(() => {
    fetchDropOffs();
  }, []);

  const fetchDropOffs = async () => {
    try {
      const response = await fetch('https://burol-1-web-backend.onrender.com/api/drop-offs');
      const data = await response.json();
      setDropOffs(data);
    } catch (error) {
      console.error('Error fetching drop-offs:', error);
    }
  };

  return (
    <LanguageProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/map" element={<MapPage dropOffs={dropOffs} />} />
              <Route path="/updates" element={<UpdatesPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/incentives" element={<IncentivesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route
                path="/admin-panel"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;