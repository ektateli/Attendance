
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import API from '../frontend/src/services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.STUDENT
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/auth/register', formData);
      alert('Registration Successful! Redirecting to login...');
      navigate('/login');
    } catch (err: any) {
      console.error('Registration Error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Connection Failed: Backend server is not running on http://localhost:5000');
      } else if (err.response) {
        // The server responded with a status code outside the 2xx range
        const message = err.response.data?.message || err.response.data?.error || 'Server error';
        setError(`Database Error: ${message}`);
      } else {
        setError('An unexpected error occurred. Check browser console.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-black text-blue-600 text-center mb-2">Create Account</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Real-time MySQL Enrollment</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
            <p className="font-bold">Registration Failed</p>
            <p>{error}</p>
            <ul className="mt-2 list-disc list-inside text-xs opacity-80">
              <li>Ensure Node.js server is running</li>
              <li>Ensure MySQL database is created</li>
              <li>Check if email is already registered</li>
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-blue-500 outline-none transition"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-blue-500 outline-none transition"
              placeholder="name@school.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-blue-500 outline-none transition"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1">Account Role</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border-2 bg-white focus:border-blue-500 outline-none transition font-bold"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
            >
              <option value={UserRole.STUDENT}>Student</option>
              <option value={UserRole.TEACHER}>Teacher</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100 mt-4"
          >
            {loading ? 'Connecting to Database...' : 'Register User'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
