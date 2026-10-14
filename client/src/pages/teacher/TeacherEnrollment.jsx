import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Users,
  BookOpen,
  UserPlus,
  UserMinus,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  X,
  Loader2,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function TeacherEnrollment() {
  // Data states
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  // UI / Loading states
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  // Messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudentToEnroll, setSelectedStudentToEnroll] = useState(null);
  const [studentToRemove, setStudentToRemove] = useState(null); // { student, course }

  // 1. Fetch available courses on mount
  useEffect(() => {
    fetchCourses();
    fetchAllStudents();
  }, []);

  // 2. Fetch enrolled students whenever selected course changes
  useEffect(() => {
    if (selectedCourseId) {
      fetchEnrolledStudents(selectedCourseId);
    } else {
      setEnrolledStudents([]);
    }
  }, [selectedCourseId]);

  // Fetch all courses
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await api.get('/courses');
      const courseList = res.data?.data || [];
      setCourses(courseList);

      // Auto-select first course if none selected
      if (courseList.length > 0 && !selectedCourseId) {
        const firstId = courseList[0]._id || courseList[0].code;
        setSelectedCourseId(firstId);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setErrorMsg(err.message || 'Failed to load courses. Please refresh.');
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch all students in institute for the enrollment picker
  const fetchAllStudents = async () => {
    try {
      const res = await api.get('/students');
      setAllStudents(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching all students:', err);
    }
  };

  // Fetch enrolled students for a specific course
  const fetchEnrolledStudents = async (courseId) => {
    setLoadingEnrollments(true);
    setErrorMsg('');
    try {
      const res = await api.get(`/enrollment/${courseId}/students`);
      const enrollments = res.data?.data || [];
      setEnrolledStudents(enrollments);

      // Optionally update local course enrolled count if returned
      if (res.data?.course) {
        setCourses((prev) =>
          prev.map((c) =>
            (c._id === courseId || c.code === courseId)
              ? { ...c, enrolledStudents: enrollments.length }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Error fetching course enrollments:', err);
      setErrorMsg(err.message || 'Failed to fetch enrolled students for this course.');
    } finally {
      setLoadingEnrollments(false);
    }
  };

  // Currently active course object
  const activeCourse = courses.find(
    (c) => c._id === selectedCourseId || c.code === selectedCourseId
  );

  const maxCapacity = activeCourse?.maxCapacity || 50;
  const currentCount = enrolledStudents.length;
  const isFull = currentCount >= maxCapacity;
  const seatsLeft = Math.max(0, maxCapacity - currentCount);
  const percentageFull = Math.min(100, Math.round((currentCount / maxCapacity) * 100));

  // Handle Enrollment Action
  const handleEnrollStudent = async () => {
    if (!selectedCourseId || !selectedStudentToEnroll) {
      setErrorMsg('Please select a student to enroll.');
      return;
    }

    if (isFull) {
      setErrorMsg(`Course capacity is full (${currentCount}/${maxCapacity} seats filled).`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const studentId = selectedStudentToEnroll._id || selectedStudentToEnroll.rollNo;
      const res = await api.post(`/enrollment/${selectedCourseId}/students/${studentId}`);

      setSuccessMsg(
        res.data?.message ||
          `Student "${selectedStudentToEnroll.name}" successfully enrolled in "${activeCourse?.title}"!`
      );

      // Refresh enrollments and list
      await fetchEnrolledStudents(selectedCourseId);
      await fetchCourses();

      // Close modal and reset picker
      setIsEnrollModalOpen(false);
      setSelectedStudentToEnroll(null);
      setModalSearchTerm('');

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Failed to enroll student:', err);
      setErrorMsg(err.message || 'Failed to enroll student in course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Removal Action (Triggered after confirmation modal)
  const handleConfirmRemoval = async () => {
    if (!studentToRemove || !selectedCourseId) return;

    const studentId = studentToRemove.student?._id || studentToRemove.student?.rollNo;
    const studentName = studentToRemove.student?.name || 'Student';

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.delete(`/enrollment/${selectedCourseId}/students/${studentId}`);

      setSuccessMsg(
        res.data?.message ||
          `Student "${studentName}" removed from "${activeCourse?.title}". Their student profile remains active.`
      );

      // Refresh enrollments and list
      await fetchEnrolledStudents(selectedCourseId);
      await fetchCourses();

      setStudentToRemove(null);

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Failed to remove student from course:', err);
      setErrorMsg(err.message || 'Failed to remove student from course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter currently enrolled students by search term
  const filteredEnrolled = enrolledStudents.filter((item) => {
    const student = item.student || {};
    const term = searchTerm.toLowerCase();
    return (
      (student.name && student.name.toLowerCase().includes(term)) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(term)) ||
      (student.email && student.email.toLowerCase().includes(term)) ||
      (student.batch && student.batch.toLowerCase().includes(term))
    );
  });

  // Set of already enrolled student IDs for quick duplicate detection
  const enrolledStudentIdSet = new Set(
    enrolledStudents.map((item) => {
      const s = item.student;
      return s ? (s._id || s.rollNo || s.id) : null;
    }).filter(Boolean)
  );

  // Filter available students in the Enroll Modal
  const modalFilteredStudents = allStudents.filter((s) => {
    const term = modalSearchTerm.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(term)) ||
      (s.email && s.email.toLowerCase().includes(term)) ||
      (s.batch && s.batch.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Enroll CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-xs font-semibold text-cyan-400 mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Cohort Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Course Enrollment Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Assign students to curriculum tracks, inspect active cohort rosters, and manage capacity quotas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setErrorMsg('');
              setIsEnrollModalOpen(true);
            }}
            disabled={!activeCourse || isFull}
            title={isFull ? 'Course has reached maximum capacity' : 'Enroll a student'}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg ${
              isFull
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/25 hover:shadow-cyan-600/40 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* 2. Success & Error Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg('')}
            className="text-emerald-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-300 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg('')}
            className="text-rose-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Course Selector & Capacity Overview Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Dropdown Selector */}
          <div className="space-y-2 lg:max-w-md w-full">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Select Academic Course:</span>
            </label>

            {loadingCourses ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Loading available courses...</span>
              </div>
            ) : (
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              >
                {courses.map((course) => {
                  const idVal = course._id || course.code;
                  return (
                    <option key={idVal} value={idVal}>
                      {course.code} — {course.title} ({course.level || 'General'})
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Active Course Metrics / Capacity Indicator */}
          {activeCourse && (
            <div className="flex-1 lg:max-w-xl p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Instructor:
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {activeCourse.instructor || 'Rahul Sharma'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Duration:
                  </span>
                  <span className="text-xs font-medium text-slate-300">
                    {activeCourse.duration || '6 Months'}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isFull
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : seatsLeft <= 5
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {isFull
                      ? 'Course Full'
                      : seatsLeft <= 5
                      ? `Filling Fast (${seatsLeft} seats left)`
                      : 'Seats Available'}
                  </span>
                </div>
              </div>

              {/* Progress Bar & Numeric Ratio */}
              <div className="w-full sm:w-56 space-y-1.5 text-right">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Seat Capacity</span>
                  <span
                    className={`font-mono ${
                      isFull
                        ? 'text-rose-400 font-bold'
                        : percentageFull > 75
                        ? 'text-amber-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {currentCount} / {maxCapacity} ({percentageFull}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isFull
                        ? 'bg-rose-500'
                        : percentageFull > 75
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                    }`}
                    style={{ width: `${percentageFull}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  {seatsLeft} out of {maxCapacity} seats remaining
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Enrolled Students Section */}
      <div className="rounded-3xl bg-slate-900/85 border border-slate-800 overflow-hidden shadow-xl backdrop-blur-xl">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Enrolled Students</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {currentCount} Total
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Active students roster for {activeCourse?.title || 'Selected Course'}
              </p>
            </div>
          </div>

          {/* Quick Search in Roster */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name, roll, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loadingEnrollments ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm text-slate-400 font-medium">
              Loading enrolled students for this course...
            </p>
          </div>
        ) : filteredEnrolled.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {searchTerm ? 'No matching enrolled students' : 'No Students Enrolled Yet'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {searchTerm
                  ? `No students matching "${searchTerm}" found in this course cohort.`
                  : `There are currently no students enrolled in "${activeCourse?.title || 'this course'}". Click "Enroll Student" to add members.`}
              </p>
            </div>
            {!searchTerm && !isFull && (
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition shadow-lg shadow-cyan-600/30"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Enroll First Student</span>
              </button>
            )}
          </div>
        ) : (
          /* Enrolled Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Student</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Batch</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Enrolled On</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {filteredEnrolled.map((enrollment) => {
                  const student = enrollment.student || {};
                  const enrolledDate = enrollment.enrolledAt
                    ? new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Active Cohort';

                  return (
                    <tr
                      key={enrollment._id || student._id || student.rollNo}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Student info */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/10 shrink-0">
                              {student.name ? student.name.charAt(0) : 'S'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {student.name || 'Student Name'}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {student.email || 'No email registered'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                          {student.rollNo || 'N/A'}
                        </span>
                      </td>

                      {/* Batch */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-slate-300 font-medium">
                        {student.batch || 'General Batch'}
                      </td>

                      {/* Enrolled On */}
                      <td className="py-3.5 px-4 hidden lg:table-cell text-slate-400 text-xs">
                        {enrolledDate}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => setStudentToRemove(enrollment)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/80 border border-rose-800/50 hover:border-rose-600 transition-all shadow-sm"
                          title="Remove student from this course"
                        >
                          <UserMinus className="w-3.5 h-3.5 text-rose-400" />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 5. ENROLL STUDENT MODAL DIALOG                            */}
      {/* ========================================================= */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-2">
                  <UserPlus className="w-3 h-3" />
                  <span>Student Enrollment</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Enroll Student in {activeCourse?.code}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target Course:{' '}
                  <span className="font-semibold text-slate-200">{activeCourse?.title}</span> (
                  {currentCount}/{maxCapacity} seats filled)
                </p>
              </div>

              <button
                onClick={() => {
                  setIsEnrollModalOpen(false);
                  setSelectedStudentToEnroll(null);
                  setModalSearchTerm('');
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Search & Student Roster */}
            <div className="py-4 space-y-4 flex-1 overflow-y-auto">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students by name, roll number, or batch..."
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Duplicate Prevention Note */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Select a student to enroll in this course:</span>
                <span className="text-amber-400">
                  Students already in this course are disabled
                </span>
              </div>

              {/* Student Picker List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {modalFilteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No students found matching "{modalSearchTerm}".
                  </div>
                ) : (
                  modalFilteredStudents.map((student) => {
                    const studentId = student._id || student.rollNo || student.id;
                    const isAlreadyEnrolled = enrolledStudentIdSet.has(studentId);
                    const isSelected =
                      selectedStudentToEnroll &&
                      (selectedStudentToEnroll._id === student._id ||
                        selectedStudentToEnroll.rollNo === student.rollNo);

                    return (
                      <div
                        key={studentId}
                        onClick={() => {
                          if (!isAlreadyEnrolled) {
                            setSelectedStudentToEnroll(student);
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isAlreadyEnrolled
                            ? 'bg-slate-950/40 border-slate-850 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-cyan-950/50 border-cyan-500/80 shadow-md shadow-cyan-900/30 cursor-pointer'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected
                                ? 'bg-cyan-500 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {student.name ? student.name.charAt(0) : 'S'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-white truncate">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span className="font-mono text-cyan-400">
                                {student.rollNo}
                              </span>
                              <span>•</span>
                              <span>{student.batch || 'Batch'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status / Selection Pill */}
                        <div>
                          {isAlreadyEnrolled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-900 text-amber-400 border border-amber-900/50">
                              Already Enrolled
                            </span>
                          ) : isSelected ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500 text-white shadow-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              Selected
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-300 bg-slate-850 hover:bg-cyan-600 hover:text-white transition"
                            >
                              Choose
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400 truncate">
                {selectedStudentToEnroll ? (
                  <span>
                    Selected:{' '}
                    <strong className="text-white">
                      {selectedStudentToEnroll.name}
                    </strong>{' '}
                    ({selectedStudentToEnroll.rollNo})
                  </span>
                ) : (
                  <span>Please choose a student from the list</span>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsEnrollModalOpen(false);
                    setSelectedStudentToEnroll(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEnrollStudent}
                  disabled={!selectedStudentToEnroll || isSubmitting}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                    !selectedStudentToEnroll || isSubmitting
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-cyan-600/30'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enrolling...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Confirm Enrollment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. REMOVAL CONFIRMATION DIALOG (MODAL)                    */}
      {/* ========================================================= */}
      {studentToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/40 p-6 sm:p-7 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Warning */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Confirm Course Removal
                </h3>
                <p className="text-xs text-rose-400 font-medium">
                  Action requires confirmation
                </p>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed py-2">
              <p>
                Are you sure you want to remove{' '}
                <strong className="text-white">
                  {studentToRemove.student?.name || 'this student'}
                </strong>{' '}
                (Roll No:{' '}
                <span className="font-mono text-cyan-400">
                  {studentToRemove.student?.rollNo || 'N/A'}
                </span>
                ) from <strong className="text-white">{activeCourse?.title}</strong>?
              </p>

              {/* Crucial Safeguard Explanation Banner */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Account Safety Assurance</span>
                </div>
                <p>
                  Removing this student will <strong>only remove their enrollment in this specific course</strong>. Their student account, login credentials, attendance history, and records in other courses will <strong>NOT</strong> be deleted.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStudentToRemove(null)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoval}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 transition shadow-lg shadow-rose-600/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <UserMinus className="w-4 h-4" />
                    <span>Confirm & Remove</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
