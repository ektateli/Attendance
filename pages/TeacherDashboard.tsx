
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../frontend/src/services/api';

interface Class {
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  status: 'present' | 'absent';
}

const TeacherDashboard: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get('/teacher/classes');
        setClasses(res.data);
        if (res.data.length > 0) {
          handleClassChange(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (c: Class) => {
    setSelectedClass(c);
    try {
      const res = await API.get(`/teacher/classes/${c.id}/students`);
      // Initialize with default 'present' status
      setStudents(res.data.map((s: any) => ({ ...s, status: 'present' })));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = (id: number) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
    ));
  };

  const handleSave = async () => {
    if (!selectedClass) return;
    setIsSaving(true);
    try {
      const attendanceData = students.map(s => ({ studentId: s.id, status: s.status }));
      await API.post('/teacher/attendance', {
        classId: selectedClass.id,
        attendanceData,
        date: new Date().toISOString().split('T')[0]
      });
      alert('Attendance synced with real-time database successfully!');
    } catch (err) {
      alert('Database update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title="Attendance Panel">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black mb-4 border-b pb-2">Your Classes</h3>
            <div className="space-y-2">
              {loading ? <p className="text-sm text-gray-400">Loading database...</p> : 
                classes.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => handleClassChange(c)}
                    className={`w-full text-left p-4 rounded-xl font-bold transition-all border ${
                      selectedClass?.id === c.id 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))
              }
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black">{selectedClass?.name || 'Select a Class'}</h2>
                <p className="text-xs text-gray-400 uppercase font-black tracking-widest mt-1">
                  Today: {new Date().toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving || !selectedClass}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-black hover:bg-green-700 transition disabled:opacity-50 shadow-lg shadow-green-100"
              >
                {isSaving ? 'Syncing...' : 'Submit to Database'}
              </button>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Student</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Database Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-blue-50/20">
                    <td className="px-6 py-4 font-bold text-gray-800">{s.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                        s.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleStatus(s.id)}
                        className="text-blue-600 hover:text-blue-800 font-black text-xs uppercase"
                      >
                        Toggle
                      </button>
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
