import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    // Silently redirect to home — don't reveal the admin login page exists
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;