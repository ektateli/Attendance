
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<any>({ records: [], summary: [] });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get('/student/attendance');
        setData(res.data);
      } catch (err) { console.error(err); }
    };
    fetchAttendance();
  }, []);

  const COLORS = ['#10B981', '#EF4444'];
  const present = data.summary.find((s: any) => s.status === 'present')?.count || 0;
  const absent = data.summary.find((s: any) => s.status === 'absent')?.count || 0;
  const total = present + absent;
  const rate = total === 0 ? 0 : Math.round((present / total) * 100);

  return (
    <Layout title="Personal Portal">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-xl font-black mb-6">Stats</h3>
          <div className="h-48 w-full"><ResponsiveContainer><PieChart><Pie data={[{name: 'Present', value: present || 1}, {name: 'Absent', value: absent}]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"><Cell fill={COLORS[0]} /><Cell fill={COLORS[1]} /></Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          <p className="text-5xl font-black mt-4">{rate}%</p>
          <p className="text-xs text-gray-400 uppercase font-black tracking-widest mt-2">Attendance Rate</p>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b"><h3 className="text-xl font-black">Attendance Logs</h3></div>
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Class</th><th className="px-6 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.records.map((rec: any, i: number) => (
                <tr key={i}><td className="px-6 py-4 font-bold">{new Date(rec.date).toLocaleDateString()}</td><td className="px-6 py-4">{rec.class_name}</td><td className="px-6 py-4 uppercase text-[10px] font-black">{rec.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
