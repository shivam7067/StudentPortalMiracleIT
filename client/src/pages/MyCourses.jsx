import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  Clock,
  User,
  CheckCircle2,
  Calendar,
  Layers,
  Code2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Loader2,
  RefreshCw,
  FolderGit2,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function MyCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch enrolled courses from backend using authenticated token
  const fetchMyCourses = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);
    setErrorMsg('');

    try {
      // Backend validates token and gets user ID from session
      const res = await api.get('/enrollment/my-courses');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setEnrollments(res.data.data);
      } else {
        setEnrollments([]);
      }
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
      setErrorMsg(
        err.message || 'Unable to load your enrolled courses. Please try again.'
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-xs font-semibold text-indigo-300 mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Academic Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>My Enrolled Courses</span>
            {!loading && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700 font-mono">
                {enrollments.length} Active
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official curriculum tracks, live sandbox labs, and project capstones assigned to your profile.
          </p>
        </div>

        {/* Refresh Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchMyCourses(true)}
            disabled={loading || isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition shadow-sm"
            title="Refresh enrolled courses"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-indigo-400 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 2. Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-300 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{errorMsg}</span>
          </div>
          <button
            onClick={() => fetchMyCourses()}
            className="text-xs font-bold underline hover:text-white shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Main Content: Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-4"
            >
              <div className="h-6 w-24 bg-slate-800 rounded-lg" />
              <div className="h-7 w-3/4 bg-slate-800 rounded-lg" />
              <div className="h-16 w-full bg-slate-800/60 rounded-xl" />
              <div className="h-8 w-full bg-slate-800/40 rounded-xl" />
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        /* 4. Empty State: Requirement 5 */
        <div className="p-12 sm:p-16 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto shadow-2xl space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 mx-auto shadow-inner">
            <BookOpen className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              You are not enrolled in any courses yet.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Your academic enrollments are assigned directly by your faculty instructor. Once a teacher adds you to a course cohort, your curriculum, coding labs, and materials will appear here.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/student/doubts"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Faculty Advisor</span>
            </Link>

            <Link
              to="/student/coding-practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 transition border border-slate-700"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Open Coding Sandbox</span>
            </Link>
          </div>
        </div>
      ) : (
        /* 5. Enrolled Courses Grid: Requirement 4 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((item) => {
            const course = item.course || {};
            const enrollmentDate = item.enrolledAt
              ? new Date(item.enrolledAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Active Cohort';

            return (
              <div
                key={item._id || course._id || course.code}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-slate-900/85 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-black/40 backdrop-blur-xl overflow-hidden"
              >
                {/* Top Subtle Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Badges & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-300 border border-slate-800 uppercase">
                      {course.code || 'COURSE'}
                    </span>

                    {/* Enrollment Status */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{item.status === 'active' ? 'Enrolled' : item.status}</span>
                    </span>
                  </div>

                  {/* Course Title */}
                  <h2 className="text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                    {course.title || 'Untitled Curriculum'}
                  </h2>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-300">
                    <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>
                      Instructor:{' '}
                      <strong className="text-slate-100">
                        {course.instructor || 'Rahul Sharma'}
                      </strong>
                    </span>
                  </div>

                  {/* Course Description */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {course.description ||
                      'Comprehensive practical software engineering curriculum covering industry development practices, testing, and capstone deployment.'}
                  </p>

                  {/* Tags */}
                  {Array.isArray(course.tags) && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {course.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-400 border border-slate-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Key Metadata Badges: Duration, Level & Projects */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{course.duration || '6 Months'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300 justify-end">
                      <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{course.level || 'Intermediate'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Enrolled: {enrollmentDate}</span>
                  </div>

                  <Link
                    to="/student/coding-practice"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition group-hover:translate-x-0.5"
                  >
                    <span>Open IDE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
