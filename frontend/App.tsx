import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RaiseHelpPage from './pages/RaiseHelpPage';
import { AppProvider, useApp } from './context/AppContext';

const ProtectedRoute: React.FC<{ children: React.ReactElement, allowedRole: 'student' | 'admin' }> = ({ children, allowedRole }) => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isOfficer = user.role === 'response_officer' || user.role === 'supervisor';
  const effectiveRole = isOfficer ? 'admin' : 'student';

  if (effectiveRole !== allowedRole) {
    return <Navigate to={effectiveRole === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/student" 
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/raise-help" 
        element={
          <ProtectedRoute allowedRole="student">
            <RaiseHelpPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;