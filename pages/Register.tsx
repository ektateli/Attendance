
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import API from '../services/api';

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
      alert('Success!');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-100 p-4 min-h-screen">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-black text-blue-600 text-center mb-6">Create Account</h1>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full p-3 rounded-xl border-2" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full p-3 rounded-xl border-2" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-3 rounded-xl border-2" onChange={e => setFormData({...formData, password: e.target.value})} />
          <select className="w-full p-3 rounded-xl border-2 bg-white font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
            <option value={UserRole.STUDENT}>Student</option>
            <option value={UserRole.TEACHER}>Teacher</option>
          </select>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl">
            {loading ? 'Syncing...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm"><Link to="/login" className="text-blue-600 font-bold">Back to Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
