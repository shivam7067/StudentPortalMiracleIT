import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Users,
  Search,
  Sparkles,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceMap, setAttendanceMap] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          api.get('/students'),
          api.get('/courses'),
        ]);

        const loadedStudents = studentsRes.data?.data || [];
        setStudents(loadedStudents);
        setCourses(coursesRes.data?.data || []);

        // Initialize all as Present by default
        const initial = {};
        loadedStudents.forEach((s) => {
          initial[s.id || s._id] = 'Present';
        });
        setAttendanceMap(initial);
      } catch (err) {
        console.error('Failed to load attendance roster:', err);
        setErrorMsg(err.message || 'Failed to load roster from server');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id || s._id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setErrorMsg('');
    try {
      const records = filteredStudents.map((s) => ({
        studentId: String(s._id || s.id),
        studentName: s.name,
        studentRoll: s.rollNo || s.id,
        status: attendanceMap[s.id || s._id] || 'Present',
      }));

      await api.post('/attendance', {
        date: sessionDate,
        course: selectedCourse,
        records,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save attendance records.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents =
    selectedCourse === 'All'
      ? students
      : students.filter((s) => s.course === selectedCourse);

  const presentCount = Object.values(attendanceMap).filter(
    (v) => v === 'Present'
  ).length;
  const absentCount = Object.values(attendanceMap).filter(
    (v) => v === 'Absent'
  ).length;
  const lateCount = Object.values(attendanceMap).filter(
    (v) => v === 'Late'
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-7 h-7 text-emerald-400" />
            Attendance Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Conduct daily roll calls, record lecture participation, and update cohort attendance records.
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition self-start sm:self-auto disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Saving Session...' : 'Save Attendance Session'}</span>
        </button>
      </div>

      {/* Success notification */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Attendance records for {sessionDate} successfully synchronized and logged!</span>
        </div>
      )}

      {/* Error notification */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Date Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Lecture Date
          </label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Course Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Cohort Track
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="All">All Tech Cohorts</option>
            {courses.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Batch Actions */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Bulk Marking
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900 transition"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800/60 hover:bg-rose-900 transition"
            >
              All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-xs text-slate-400">Marked Present</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{presentCount}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-xs text-slate-400">Marked Absent</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{absentCount}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-xs text-slate-400">Marked Late</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{lateCount}</div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Student</th>
                <th className="py-3.5 px-4 font-semibold">Track & Batch</th>
                <th className="py-3.5 px-4 font-semibold">Overall Rate</th>
                <th className="py-3.5 px-5 font-semibold text-right">Status for {sessionDate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredStudents.map((s) => {
                const currentStatus = attendanceMap[s.id] || 'Present';
                return (
                  <tr key={s.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{s.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{s.rollNo}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      <div>{s.course}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.batch}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white">{s.attendance}%</span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'Present')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'Late')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'Late'
                              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'Absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
