
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, UserRole } from '../types';
import API from '../services/api';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ teachers: 0, students: 0, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: 'password123', role: UserRole.STUDENT });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(res.data);
      const t = res.data.filter((u: any) => u.role === UserRole.TEACHER).length;
      const s = res.data.filter((u: any) => u.role === UserRole.STUDENT).length;
      setStats({ teachers: t, students: s, total: res.data.length });
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddUser = async () => {
    try {
      await API.post('/admin/users', newUser);
      setShowModal(false);
      fetchData();
    } catch (err) { alert('Failed to create user'); }
  };

  return (
    <Layout title="Admin Management">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Teachers</p>
          <p className="text-4xl font-black text-blue-600">{stats.teachers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Students</p>
          <p className="text-4xl font-black text-indigo-600">{stats.students}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Active</p>
          <p className="text-4xl font-black text-green-600">{stats.total}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-black">Database Records</h2>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-blue-100">+ New User</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black tracking-widest uppercase">
              <tr><th className="px-6 py-4">Identity</th><th className="px-6 py-4">Contact</th><th className="px-6 py-4">Access Level</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={3} className="p-10 text-center font-bold text-gray-400">Loading...</td></tr> : 
                users.map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 font-bold">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4 uppercase text-[10px] font-black">{u.role}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-black mb-6">New User</h3>
            <input className="w-full border-2 rounded-xl p-3 mb-4" placeholder="Name" onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input className="w-full border-2 rounded-xl p-3 mb-4" placeholder="Email" onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <select className="w-full border-2 rounded-xl p-3 mb-4 bg-white" onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
              <option value={UserRole.STUDENT}>Student</option>
              <option value={UserRole.TEACHER}>Teacher</option>
            </select>
            <div className="flex justify-end gap-3"><button onClick={() => setShowModal(false)} className="px-4 py-2 font-bold text-gray-400">Cancel</button><button onClick={handleAddUser} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Save</button></div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
