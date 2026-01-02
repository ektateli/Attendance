
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../services/api';

const TeacherDashboard: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get('/teacher/classes');
        setClasses(res.data);
        if (res.data.length > 0) handleClassChange(res.data[0]);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (c: any) => {
    setSelectedClass(c);
    try {
      const res = await API.get(`/teacher/classes/${c.id}/students`);
      setStudents(res.data.map((s: any) => ({ ...s, status: 'present' })));
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    try {
      await API.post('/teacher/attendance', {
        classId: selectedClass.id,
        attendanceData: students.map(s => ({ studentId: s.id, status: s.status })),
        date: new Date().toISOString().split('T')[0]
      });
      alert('Attendance synced!');
    } catch (err) { alert('Sync failed'); }
  };

  return (
    <Layout title="Attendance Panel">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black mb-4">Classes</h3>
            <div className="space-y-2">
              {classes.map(c => (
                <button key={c.id} onClick={() => handleClassChange(c)} className={`w-full text-left p-4 rounded-xl font-bold border ${selectedClass?.id === c.id ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}>{c.name}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-black">{selectedClass?.name || 'Select Class'}</h2>
              <button onClick={handleSave} className="bg-green-600 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-green-100">Sync to DB</button>
            </div>
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-blue-50/20">
                    <td className="px-6 py-4 font-bold">{s.name}</td>
                    <td className="px-6 py-4 uppercase text-[10px] font-black">{s.status}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setStudents(prev => prev.map(st => st.id === s.id ? { ...st, status: st.status === 'present' ? 'absent' : 'present' } : st))} className="text-blue-600 font-black text-xs">TOGGLE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
