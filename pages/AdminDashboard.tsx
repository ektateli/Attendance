
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, UserRole } from '../types';
import API from '../frontend/src/services/api';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>({ teachers: 0, students: 0, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: 'password123', role: UserRole.STUDENT });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/stats')
      ]);
      setUsers(usersRes.data);
      
      const teacherCount = usersRes.data.filter((u: User) => u.role === UserRole.TEACHER).length;
      const studentCount = usersRes.data.filter((u: User) => u.role === UserRole.STUDENT).length;
      setStats({ teachers: teacherCount, students: studentCount, total: usersRes.data.length });
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async () => {
    try {
      await API.post('/admin/users', newUser);
      setShowModal(false);
      fetchData();
      setNewUser({ name: '', email: '', password: 'password123', role: UserRole.STUDENT });
    } catch (err) {
      alert('Error creating user');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this user from the database permanently?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        fetchData();
      } catch (err) {
        alert('Error deleting user');
      }
    }
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
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-800">Database Records</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-100"
          >
            + Create User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black tracking-widest uppercase">
              <tr>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Access Level</th>
                <th className="px-6 py-4 text-right">Database Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center font-bold text-gray-400">Syncing with MySQL...</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{u.name}</div>
                    <div className="text-[10px] text-gray-400">UID: #{u.id}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                      u.role === UserRole.TEACHER ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(u.id)}
                      className="text-red-500 hover:text-red-700 font-black text-xs uppercase hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6">New User Registration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-1">Name</label>
                <input 
                  type="text" className="w-full border-2 rounded-xl p-3 outline-none"
                  value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-1">Email</label>
                <input 
                  type="email" className="w-full border-2 rounded-xl p-3 outline-none"
                  value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-1">Role</label>
                <select 
                  className="w-full border-2 rounded-xl p-3 bg-white"
                  value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.STUDENT}>Student</option>
                  <option value={UserRole.TEACHER}>Teacher</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 font-bold text-gray-400">Cancel</button>
              <button onClick={handleAddUser} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Add to Database</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
