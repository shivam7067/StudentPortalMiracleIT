import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Mail,
  Phone,
  GraduationCap,
  Loader2
} from 'lucide-react';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/students');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setStudents(res.data.data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      setErrorMsg(err.message || 'Failed to fetch students from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.id && String(s.id).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.course && s.course.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' ? true : s.status === statusFilter;

    const matchesCourse =
      courseFilter === 'All' ? true : s.course === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Extract unique courses for filter dropdown
  const uniqueCourses = Array.from(new Set(students.map((s) => s.course).filter(Boolean)));

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      const targetId = studentToDelete._id || studentToDelete.id;
      await api.delete(`/students/${targetId}`);
      setStudents((prev) => prev.filter((s) => (s._id || s.id) !== targetId && s.id !== studentToDelete.id));
      setFeedbackMsg(`Student '${studentToDelete.name}' was successfully removed.`);
      setStudentToDelete(null);
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(`Error deleting student: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-cyan-400" />
            Student Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage enrolled students, monitor academic milestones, edit credentials, or register new students.
          </p>
        </div>

        <Link
          to="/teacher/students/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-600/30 transition self-start sm:self-auto shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </Link>
      </div>

      {/* Success notification banner */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Error notification banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={loadData}
            className="text-xs font-semibold text-rose-200 underline hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, roll no, email, track..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            >
              <option value="All">All Tech Tracks</option>
              {uniqueCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div>
            Showing <span className="font-bold text-white">{filteredStudents.length}</span> of{' '}
            <span className="font-bold text-white">{students.length}</span> registered students
          </div>
          {(searchTerm || statusFilter !== 'All' || courseFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setCourseFilter('All');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-cyan-400" />
            <p className="text-sm">Loading student records from server...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Users className="w-12 h-12 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No students found</h3>
            <p className="text-xs max-w-sm mx-auto">
              No student profiles match your search criteria. Try modifying your filter or register a new student.
            </p>
            <Link
              to="/teacher/students/add"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student Now</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-5 font-semibold">Student</th>
                  <th className="py-4 px-4 font-semibold">Track & Batch</th>
                  <th className="py-4 px-4 font-semibold">Attendance</th>
                  <th className="py-4 px-4 font-semibold">CGPA</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredStudents.map((student) => (
                  <tr key={student.id || student._id} className="hover:bg-slate-850/60 transition group">
                    {/* Student Info */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-cyan-300 transition">
                            {student.name}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                            <span>{student.rollNo || student.id}</span>
                            <span>•</span>
                            <span className="text-slate-400 font-sans">{student.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{student.course}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{student.batch}</div>
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.attendance >= 90
                                ? 'bg-emerald-400'
                                : student.attendance >= 80
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                            style={{ width: `${Math.min(100, student.attendance || 0)}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-200">
                          {student.attendance || 0}%
                        </span>
                      </div>
                    </td>

                    {/* CGPA */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/60">
                        {student.cgpa || 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          student.status === 'Active'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            student.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                        {student.status || 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/teacher/students/${student.id || student._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/teacher/students/edit/${student.id || student._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition"
                          title="Edit Details"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setStudentToDelete(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Delete Student Profile?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove <span className="font-semibold text-white">{studentToDelete.name}</span> ({studentToDelete.rollNo || studentToDelete.id})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
