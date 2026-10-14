import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/courses');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCourses(res.data.data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      setErrorMsg(err.message || 'Failed to fetch courses from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      (c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.instructor && c.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.tags && c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesLevel =
      levelFilter === 'All'
        ? true
        : c.level && c.level.toLowerCase().includes(levelFilter.toLowerCase());

    return matchesSearch && matchesLevel;
  });

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      const targetId = courseToDelete._id || courseToDelete.id || courseToDelete.code;
      await api.delete(`/courses/${targetId}`);
      setCourses((prev) => prev.filter((c) => (c._id || c.id || c.code) !== targetId));
      setFeedbackMsg(`Course '${courseToDelete.title}' was successfully removed.`);
      setCourseToDelete(null);
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(`Error deleting course: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-400" />
            Course & Curriculum Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Design learning tracks, update syllabus specifications, monitor batch capacity, and manage course offerings.
          </p>
        </div>

        <Link
          to="/teacher/courses/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-600/30 transition self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </Link>
      </div>

      {/* Success Notification */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses by title, course code, instructor, tech tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="All">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div>
            Showing <span className="font-bold text-white">{filteredCourses.length}</span> of{' '}
            <span className="font-bold text-white">{courses.length}</span> published course tracks
          </div>
          {(searchTerm || levelFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('All');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-cyan-400" />
          <p className="text-sm">Loading course catalog from server...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-900/60 rounded-3xl border border-slate-800">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No courses found</h3>
          <p className="text-xs max-w-sm mx-auto">
            No courses match the criteria. Create a new curriculum track to populate the catalog.
          </p>
          <Link
            to="/teacher/courses/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Course Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id || course.id || course.code}
              className="bg-slate-900/80 hover:bg-slate-850/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all duration-200 shadow-xl flex flex-col justify-between group"
            >
            <div>
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-800/50">
                  {course.code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  {course.level}
                </span>
              </div>

              {/* Title & Instructor */}
              <h3 className="text-lg font-bold text-white mt-3 group-hover:text-cyan-300 transition line-clamp-1">
                {course.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Lead: <span className="text-slate-200 font-semibold">{course.instructor || 'Rahul Sharma'}</span>
              </p>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                {course.description}
              </p>

              {/* Tech Tags */}
              {course.tags && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {course.tags.slice(0, 4).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Capacity & Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{course.enrolledStudents || 0} / {course.maxCapacity || 50} Enrolled</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{course.duration || '6 Months'}</span>
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((course.enrolledStudents || 0) / (course.maxCapacity || 50)) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  to={`/teacher/courses/edit/${course.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-400 hover:text-white hover:bg-cyan-950/60 border border-cyan-800/60 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Track</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setCourseToDelete(course)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/60 border border-rose-800/60 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Delete Course Track?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to remove <strong className="text-white">{courseToDelete.title}</strong> ({courseToDelete.code})?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
