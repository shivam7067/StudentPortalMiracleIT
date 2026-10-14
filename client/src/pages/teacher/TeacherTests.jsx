import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  FileCheck,
  Plus,
  Calendar,
  Clock,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const fallbackTests = [
  {
    id: 'test-1',
    title: 'Node.js Event Loop & Streams Assessment',
    course: 'MERN Stack Development',
    date: '2026-10-12',
    time: '11:00 AM - 12:30 PM',
    duration: '90 Mins',
    totalMarks: 100,
    status: 'Completed',
    topScorer: 'Pending Test'
  },
  {
    id: 'test-2',
    title: 'Advanced React 19 Compiler & Server Actions',
    course: 'MERN Stack Development',
    date: '2026-10-25',
    time: '02:00 PM - 03:30 PM',
    duration: '90 Mins',
    totalMarks: 100,
    status: 'Scheduled',
    topScorer: 'Pending Test'
  }
];

export default function TeacherTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('MERN Stack Development');
  const [newDate, setNewDate] = useState('2026-10-25');
  const [toastMsg, setToastMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTests = async () => {
    try {
      const res = await api.get('/tests');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setTests(res.data.data);
      } else {
        setTests(fallbackTests);
      }
    } catch (err) {
      console.warn('Could not load tests from server:', err);
      setTests(fallbackTests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/tests', {
        title: newTitle.trim(),
        course: newCourse,
        date: newDate,
        time: '10:00 AM - 11:30 AM',
        duration: '90 Mins',
        totalMarks: 100,
        status: 'Scheduled',
      });

      if (res.data?.success && res.data.data) {
        setTests([res.data.data, ...tests]);
      } else {
        fetchTests();
      }

      setShowAddModal(false);
      setNewTitle('');
      setToastMsg(`Test '${newTitle}' scheduled successfully!`);
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert(`Error scheduling test: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileCheck className="w-7 h-7 text-purple-400" />
            Tests & Assessments Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Schedule proctored coding assessments, set test windows, and review student grades.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Test</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading assessments from server...</p>
        </div>
      ) : (
        /* Tests Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tests.map((test) => (
            <div
              key={test.id || test._id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      test.status === 'Completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}
                  >
                    {test.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{test.duration}</span>
                </div>

                <h3 className="text-base font-bold text-white mt-3 line-clamp-2">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{test.courseName || test.course?.title || test.course}</p>
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Date
                  </span>
                  <span className="font-semibold">{test.date}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Window
                  </span>
                  <span>{test.time}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Top Scorer
                  </span>
                  <span className="font-semibold text-cyan-300">{test.topScorer || 'Pending Test'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleCreateTest}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-white">Schedule Examination</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assessment Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Express & Microservices Midterm"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Track
              </label>
              <select
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="MERN Stack Development">MERN Stack Development</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Java Full Stack">Java Full Stack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Test Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Test'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
