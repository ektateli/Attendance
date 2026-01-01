
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import API from '../frontend/src/services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await API.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      auth?.login(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login Error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Make sure your Node.js app is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials or database connection error.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-600 tracking-tighter">Attendance<span className="text-gray-900">Pro</span></h1>
          <p className="text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Real-Time Database Access</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm animate-pulse">
            <p className="font-bold">Login Failed</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3.5 rounded-xl border-2 focus:border-blue-500 outline-none transition"
              placeholder="admin@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3.5 rounded-xl border-2 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-xl shadow-blue-100"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-400">New user?</span> <Link to="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
