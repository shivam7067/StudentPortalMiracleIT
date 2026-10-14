import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { attendanceRecords } from '../data/dummyData';
import { 
  CalendarCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Info,
  Loader2
} from 'lucide-react';

export default function Attendance() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/attendance/my-summary');
        if (res.data?.success && res.data.data) {
          setSummary(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load attendance summary from server, using default:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const overall = summary ? summary.overallPercentage : attendanceRecords.overallPercentage;
  const total = summary ? summary.totalSessions : attendanceRecords.totalSessions;
  const present = summary ? summary.presentSessions : attendanceRecords.presentSessions;
  const absent = summary ? summary.absentSessions : attendanceRecords.absentSessions;
  const logs = summary && summary.monthlyLog && summary.monthlyLog.length > 0 ? summary.monthlyLog : attendanceRecords.monthlyLog;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Lecture & Lab Attendance Tracker</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time session records, subject-wise lecture participation, and placement eligibility criteria.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Placement Eligible (Min 85%)</span>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Overall Attendance</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
            {overall}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(100, overall)}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Sessions Held</span>
          <div className="text-3xl font-extrabold text-white mt-1 font-mono">
            {total}
          </div>
          <span className="text-[11px] text-slate-400">Classrooms + Coding Labs</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Attended Sessions</span>
          <div className="text-3xl font-extrabold text-indigo-400 mt-1 font-mono">
            {present}
          </div>
          <span className="text-[11px] text-indigo-300">Verified attendance logs</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Leave / Absent</span>
          <div className="text-3xl font-extrabold text-rose-400 mt-1 font-mono">
            {absent}
          </div>
          <span className="text-[11px] text-slate-400">Approved medical / leaves</span>
        </div>
      </div>

      {/* Grid: Subject Breakdown & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Subject-Wise Progress */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Subject-Wise Lecture Participation
          </h3>

          <div className="space-y-4">
            {attendanceRecords.subjects.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{sub.name}</span>
                  <span className="text-slate-400 font-mono">
                    {sub.attended} / {sub.total} ({sub.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Session Logs */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Recent Verified Attendance Logs</h3>
            <span className="text-xs text-slate-400">Daily Sync</span>
          </div>

          <div className="divide-y divide-slate-800">
            {logs.map((log, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{log.subject}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{log.date}</span>
                    <span>•</span>
                    <span>{log.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      log.status === 'Present'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
