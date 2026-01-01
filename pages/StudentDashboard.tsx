
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../frontend/src/services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<any>({ records: [], summary: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get('/student/attendance');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const COLORS = ['#10B981', '#EF4444'];
  
  const presentCount = data.summary.find((s: any) => s.status === 'present')?.count || 0;
  const absentCount = data.summary.find((s: any) => s.status === 'absent')?.count || 0;
  const total = presentCount + absentCount;
  const percentage = total === 0 ? 0 : Math.round((presentCount / total) * 100);

  const chartData = [
    { name: 'Present', value: presentCount || 1 }, // Default 1 for visual if empty
    { name: 'Absent', value: absentCount }
  ];

  return (
    <Layout title="Personal Attendance">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-xl font-black mb-6">Database Summary</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-5xl font-black text-gray-800">{percentage}%</p>
            <p className="text-xs text-gray-400 uppercase font-black tracking-widest mt-2">Attendance Rate</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50">
            <h3 className="text-xl font-black">Attendance Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Database Date</th>
                  <th className="px-6 py-4">Course Name</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? <tr><td colSpan={3} className="px-6 py-8 text-center">Reading from MySQL...</td></tr> : 
                  data.records.length === 0 ? <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No records found.</td></tr> :
                  data.records.map((rec: any, i: number) => (
                  <tr key={i} className="hover:bg-blue-50/20">
                    <td className="px-6 py-4 text-gray-800 font-bold">{rec.date}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{rec.class_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        rec.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {rec.status}
                      </span>
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

export default StudentDashboard;
