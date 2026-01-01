
import React, { useState, createContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Layout from './components/Layout';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Simple Placeholder for other routes
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <Layout title={title}>
    <div className="bg-white p-12 rounded-xl shadow-sm border border-dashed border-gray-300 text-center">
      <h2 className="text-2xl font-bold text-gray-400">{title} Module Coming Soon</h2>
      <p className="text-gray-500 mt-2">This feature is currently under development.</p>
    </div>
  </Layout>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={
              user ? (
                user.role === UserRole.ADMIN ? <AdminDashboard /> :
                user.role === UserRole.TEACHER ? <TeacherDashboard /> :
                <StudentDashboard />
              ) : <Navigate to="/login" />
            } />

            {/* Functional Sidebar Routes */}
            <Route path="/classes" element={user ? <PlaceholderPage title="Classes Management" /> : <Navigate to="/login" />} />
            <Route path="/reports" element={user ? <PlaceholderPage title="Attendance Reports" /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <PlaceholderPage title="Account Settings" /> : <Navigate to="/login" />} />

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
