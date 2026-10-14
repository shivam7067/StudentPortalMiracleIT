import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  BookOpenCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Plus,
  Eye,
  Check,
  Sparkles,
  FileText,
  Loader2,
  Trash2,
  Edit3,
  ExternalLink,
  User,
  Calendar,
  Award,
  X,
  Filter,
  ArrowRight
} from 'lucide-react';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'submissions' or 'assignments'
  const [activeTab, setActiveTab] = useState('submissions');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [gradingModal, setGradingModal] = useState(null);
  const [scoreInput, setScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isGrading, setIsGrading] = useState(false);

  // Assignment Create/Edit Modal
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [asgFormData, setAsgFormData] = useState({
    title: '',
    courseName: 'MERN Stack Development',
    courseId: '',
    subject: 'Full Stack Development',
    deadline: 'Next Week',
    maxMarks: 50,
    description: '',
  });
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);

  // Delete Confirmation Modal
  const [deleteModalAssignment, setDeleteModalAssignment] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Load Assignments and Courses
  const loadData = async () => {
    setLoading(true);
    try {
      const [asgRes, coursesRes] = await Promise.allSettled([
        api.get('/assignments'),
        api.get('/courses'),
      ]);

      let loadedAssignments = [];
      if (asgRes.status === 'fulfilled' && asgRes.value.data?.success && Array.isArray(asgRes.value.data.data)) {
        loadedAssignments = asgRes.value.data.data;
        setAssignments(loadedAssignments);

        // Flatten student submissions safely (ensuring course is always a string!)
        const allSubs = [];
        loadedAssignments.forEach((asg) => {
          const courseLabel =
            (typeof asg.course === 'object' && asg.course?.title) ||
            asg.courseName ||
            asg.subject ||
            'MERN Stack Development';

          if (Array.isArray(asg.submissions)) {
            asg.submissions.forEach((sub) => {
              allSubs.push({
                ...sub,
                assignmentId: asg._id || asg.id,
                assignmentTitle: asg.title,
                course: courseLabel,
                maxMarks: asg.maxMarks || 50,
                githubUrl: sub.repoUrl || 'https://github.com',
                id: sub._id || sub.id,
              });
            });
          }
        });
        setSubmissions(allSubs);
      } else {
        setAssignments([]);
        setSubmissions([]);
      }

      if (coursesRes.status === 'fulfilled' && coursesRes.value.data?.success && Array.isArray(coursesRes.value.data.data)) {
        setCourses(coursesRes.value.data.data);
      }
    } catch (err) {
      console.error('Error fetching assignments data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
    const matchesCourse = courseFilter === 'All' || sub.course === courseFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (sub.studentName && sub.studentName.toLowerCase().includes(query)) ||
      (sub.studentRoll && sub.studentRoll.toLowerCase().includes(query)) ||
      (sub.assignmentTitle && sub.assignmentTitle.toLowerCase().includes(query));

    return matchesStatus && matchesCourse && matchesSearch;
  });

  // Filter Assignments
  const filteredAssignments = assignments.filter((asg) => {
    const courseLabel =
      (typeof asg.course === 'object' && asg.course?.title) ||
      asg.courseName ||
      asg.subject ||
      '';
    const matchesCourse = courseFilter === 'All' || courseLabel === courseFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (asg.title && asg.title.toLowerCase().includes(query)) ||
      (asg.subject && asg.subject.toLowerCase().includes(query)) ||
      (asg.description && asg.description.toLowerCase().includes(query));

    return matchesCourse && matchesSearch;
  });

  // Statistics
  const totalSubmissions = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'Pending Review').length;
  const gradedCount = submissions.filter((s) => s.status === 'Graded').length;

  // Open Grading Modal
  const handleOpenGrading = (sub) => {
    setGradingModal(sub);
    const existingScoreNum = sub.score ? String(sub.score).match(/\d+/)?.[0] : '';
    setScoreInput(existingScoreNum || String(Math.floor((sub.maxMarks || 50) * 0.9)));
    setFeedbackInput(sub.feedback || 'Well-structured implementation. Clean architecture and logic.');
  };

  // Submit Grade
  const handleSaveGrade = async () => {
    if (!gradingModal) return;
    setIsGrading(true);
    try {
      const maxM = gradingModal.maxMarks || 50;
      const formattedScore = `${scoreInput} / ${maxM}`;

      await api.put(`/assignments/${gradingModal.assignmentId}/grade`, {
        submissionId: gradingModal._id || gradingModal.id,
        score: formattedScore,
        feedback: feedbackInput,
      });

      const updatedSubId = gradingModal._id || gradingModal.id;
      setSubmissions((prev) =>
        prev.map((s) =>
          (s._id || s.id) === updatedSubId
            ? {
                ...s,
                status: 'Graded',
                score: formattedScore,
                feedback: feedbackInput,
              }
            : s
        )
      );

      // Also update inside assignments state
      setAssignments((prev) =>
        prev.map((a) => {
          if ((a._id || a.id) === gradingModal.assignmentId) {
            return {
              ...a,
              submissions: (a.submissions || []).map((sub) =>
                (sub._id || sub.id) === updatedSubId
                  ? { ...sub, status: 'Graded', score: formattedScore, feedback: feedbackInput }
                  : sub
              ),
            };
          }
          return a;
        })
      );

      showToast(`Submission for ${gradingModal.studentName} graded successfully!`);
      setGradingModal(null);
    } catch (err) {
      alert(`Error grading submission: ${err.message}`);
    } finally {
      setIsGrading(false);
    }
  };

  // Open Create Assignment Modal
  const handleOpenCreateAssignment = () => {
    setEditingAssignment(null);
    setAsgFormData({
      title: '',
      courseName: courses[0]?.title || 'MERN Stack Development',
      courseId: courses[0]?._id || '',
      subject: 'Full Stack Development',
      deadline: 'Tomorrow at 11:59 PM',
      maxMarks: 50,
      description: '',
    });
    setShowAssignmentModal(true);
  };

  // Open Edit Assignment Modal
  const handleOpenEditAssignment = (asg) => {
    setEditingAssignment(asg);
    const courseTitle =
      (typeof asg.course === 'object' && asg.course?.title) ||
      asg.courseName ||
      courses[0]?.title ||
      'MERN Stack Development';
    const courseId =
      (typeof asg.course === 'object' && asg.course?._id) || asg.course || '';

    setAsgFormData({
      title: asg.title || '',
      courseName: courseTitle,
      courseId: courseId,
      subject: asg.subject || 'Full Stack Development',
      deadline: asg.deadline || 'Next Week',
      maxMarks: asg.maxMarks || 50,
      description: asg.description || '',
    });
    setShowAssignmentModal(true);
  };

  // Save Assignment (Create or Edit)
  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!asgFormData.title.trim()) {
      alert('Please provide an assignment title.');
      return;
    }

    setIsSavingAssignment(true);
    try {
      if (editingAssignment) {
        const asgId = editingAssignment._id || editingAssignment.id;
        const res = await api.put(`/assignments/${asgId}`, {
          title: asgFormData.title.trim(),
          courseName: asgFormData.courseName,
          courseId: asgFormData.courseId,
          subject: asgFormData.subject,
          deadline: asgFormData.deadline,
          maxMarks: Number(asgFormData.maxMarks) || 50,
          description: asgFormData.description,
        });

        if (res.data?.success) {
          showToast(`Assignment "${asgFormData.title}" updated successfully!`);
          await loadData();
          setShowAssignmentModal(false);
        }
      } else {
        const res = await api.post('/assignments', {
          title: asgFormData.title.trim(),
          courseName: asgFormData.courseName,
          courseId: asgFormData.courseId,
          subject: asgFormData.subject,
          deadline: asgFormData.deadline,
          maxMarks: Number(asgFormData.maxMarks) || 50,
          description: asgFormData.description,
        });

        if (res.data?.success) {
          showToast(`Assignment "${asgFormData.title}" created successfully!`);
          await loadData();
          setShowAssignmentModal(false);
        }
      }
    } catch (err) {
      alert(`Error saving assignment: ${err.message}`);
    } finally {
      setIsSavingAssignment(false);
    }
  };

  // Delete Assignment
  const handleDeleteAssignment = async () => {
    if (!deleteModalAssignment) return;
    setIsDeleting(true);
    try {
      const asgId = deleteModalAssignment._id || deleteModalAssignment.id;
      await api.delete(`/assignments/${asgId}`);
      showToast(`Assignment "${deleteModalAssignment.title}" deleted successfully!`);
      setDeleteModalAssignment(null);
      await loadData();
    } catch (err) {
      alert(`Error deleting assignment: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Assignments & Code Evaluations
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage coursework, create assignments, review pull requests, and award grades with code feedback.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateAssignment}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-600/25 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMsg}</span>
          </div>
          <button
            onClick={() => setToastMsg('')}
            className="text-emerald-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Analytics Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Tasks
            </div>
            <div className="text-2xl font-black text-white mt-1">{assignments.length}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <BookOpenCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Submissions
            </div>
            <div className="text-2xl font-black text-white mt-1">{totalSubmissions}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-800/40 bg-gradient-to-br from-amber-950/20 to-transparent flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Pending Review
            </div>
            <div className="text-2xl font-black text-amber-300 mt-1">{pendingCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Graded
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{gradedCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Mode Navigation & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Primary View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'submissions'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Student Submissions</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'submissions'
                  ? 'bg-slate-950 text-amber-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {submissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'assignments'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>Manage Course Tasks</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'assignments'
                  ? 'bg-slate-950 text-amber-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {assignments.length}
            </span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                activeTab === 'submissions'
                  ? 'Search student, roll, or task...'
                  : 'Search assignment title...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>

          {/* Course Filter Dropdown */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Tech Tracks</option>
            {courses.map((c) => (
              <option key={c._id || c.code} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Submissions Status Filter Tabs (Only shown on submissions tab) */}
          {activeTab === 'submissions' && (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              {['All', 'Pending Review', 'Graded'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    statusFilter === status
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading assignments & submissions records...</p>
        </div>
      ) : activeTab === 'submissions' ? (
        /* ================= SUBMISSIONS VIEW ================= */
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
              <BookOpenCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No submissions found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {submissions.length === 0
                  ? 'No students have submitted code assignments yet. As students commit solutions, they will appear here for grading.'
                  : 'No submissions match your active filter criteria. Try clearing search or selecting "All".'}
              </p>
              {(searchQuery || statusFilter !== 'All' || courseFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setCourseFilter('All');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id || sub._id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl hover:border-slate-700/80 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  {/* Left: Student & Assignment Details */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                        {sub.studentName ? sub.studentName.charAt(0) : 'S'}
                      </div>
                      <span className="font-bold text-white text-base truncate">
                        {sub.studentName}
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
                        {sub.studentRoll || 'N/A'}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'Graded'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                      {sub.score && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                          <Award className="w-3 h-3 text-indigo-400" />
                          <span>Score: {sub.score}</span>
                        </span>
                      )}
                    </div>

                    {/* Assignment title & course badge */}
                    <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>{sub.assignmentTitle}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-amber-300/90 font-medium">
                        {sub.course}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Submitted: {sub.submittedAt || 'Recently'}
                      </span>
                    </div>

                    {/* Student notes if any */}
                    {sub.notes && (
                      <div className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 mt-2">
                        <span className="font-bold text-slate-400">Student Note: </span>
                        <span>"{sub.notes}"</span>
                      </div>
                    )}

                    {/* Mentor feedback if already graded */}
                    {sub.feedback && (
                      <div className="text-xs text-emerald-200/90 bg-emerald-950/30 p-3 rounded-2xl border border-emerald-900/50 mt-2">
                        <span className="font-bold text-emerald-400">Mentor Code Review: </span>
                        <span>{sub.feedback}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition flex items-center gap-2 group"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                      <span>Review Code</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>

                    <button
                      onClick={() => handleOpenGrading(sub)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-600/30 transition flex items-center gap-2 active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{sub.status === 'Graded' ? 'Update Grade' : 'Grade Submission'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ================= MANAGE ASSIGNMENTS VIEW ================= */
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
              <BookOpenCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No assignments found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No course tasks currently created. Start by creating the first assignment for students.
              </p>
              <button
                onClick={handleOpenCreateAssignment}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Assignment</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssignments.map((asg) => {
                const asgCourseTitle =
                  (typeof asg.course === 'object' && asg.course?.title) ||
                  asg.courseName ||
                  asg.subject ||
                  'MERN Stack';
                const submissionCount = (asg.submissions || []).length;
                const pendingSubCount = (asg.submissions || []).filter(
                  (s) => s.status === 'Pending Review'
                ).length;

                return (
                  <div
                    key={asg._id || asg.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-950/70 border border-amber-800 text-amber-300">
                          {asgCourseTitle}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditAssignment(asg)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Edit Assignment"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteModalAssignment(asg)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition"
                            title="Delete Assignment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white line-clamp-1">{asg.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {asg.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">
                            Due Deadline
                          </div>
                          <div className="font-bold text-slate-200 mt-0.5 truncate">
                            {asg.deadline || 'Flexible'}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">
                            Max Score
                          </div>
                          <div className="font-bold text-amber-400 mt-0.5">
                            {asg.maxMarks || 50} Marks
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{submissionCount}</span>
                        <span className="text-slate-400">Submissions</span>
                        {pendingSubCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            {pendingSubCount} awaiting review
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSearchQuery(asg.title);
                          setActiveTab('submissions');
                        }}
                        className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1"
                      >
                        <span>View Subs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: GRADE SUBMISSION ================= */}
      {gradingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Grade Submission: {gradingModal.studentName}
                </h3>
                <p className="text-xs text-cyan-400 mt-0.5 font-mono">
                  Roll: {gradingModal.studentRoll} • {gradingModal.course}
                </p>
              </div>
              <button
                onClick={() => setGradingModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Assignment & Student Notes Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Assignment:</span>
                <span className="text-slate-200 font-bold">{gradingModal.assignmentTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Code Repository:</span>
                <a
                  href={gradingModal.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {gradingModal.notes && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-0.5">Student Notes:</span>
                  <span className="text-slate-300 italic">"{gradingModal.notes}"</span>
                </div>
              )}
            </div>

            {/* Score Input & Quick Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Awarded Score (Out of {gradingModal.maxMarks || 50})
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  {[1.0, 0.9, 0.8, 0.7].map((factor) => {
                    const presetVal = Math.round((gradingModal.maxMarks || 50) * factor);
                    return (
                      <button
                        key={factor}
                        type="button"
                        onClick={() => setScoreInput(String(presetVal))}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        {presetVal}
                      </button>
                    );
                  })}
                </div>
              </div>
              <input
                type="number"
                min="0"
                max={gradingModal.maxMarks || 50}
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. 48"
              />
            </div>

            {/* Mentor Code Review Feedback */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Mentor Code Review & Architectural Feedback
              </label>
              <textarea
                rows="4"
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="Detail recommendations regarding code cleanliness, security guards, performance..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setGradingModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGrading}
                onClick={handleSaveGrade}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-600/30 transition flex items-center gap-2"
              >
                {isGrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save & Award Grade</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT ASSIGNMENT ================= */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-amber-400" />
                <span>{editingAssignment ? 'Edit Assignment' : 'Create New Course Assignment'}</span>
              </h3>
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Caching with Redis & Node.js"
                  value={asgFormData.title}
                  onChange={(e) => setAsgFormData({ ...asgFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Course
                  </label>
                  <select
                    value={asgFormData.courseName}
                    onChange={(e) => {
                      const selected = courses.find((c) => c.title === e.target.value);
                      setAsgFormData({
                        ...asgFormData,
                        courseName: e.target.value,
                        courseId: selected ? selected._id : '',
                      });
                    }}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {courses.map((c) => (
                      <option key={c._id || c.code} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                    <option value="MERN Stack Development">MERN Stack Development</option>
                    <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                    <option value="Java Full Stack Engineering">Java Full Stack Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject / Module
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Backend Architecture"
                    value={asgFormData.subject}
                    onChange={(e) => setAsgFormData({ ...asgFormData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Due Deadline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next Sunday, 11:59 PM"
                    value={asgFormData.deadline}
                    onChange={(e) => setAsgFormData({ ...asgFormData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={asgFormData.maxMarks}
                    onChange={(e) => setAsgFormData({ ...asgFormData, maxMarks: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Brief & Technical Specifications
                </label>
                <textarea
                  rows="4"
                  placeholder="Provide problem statement, requirements, required test cases, expected API endpoints..."
                  value={asgFormData.description}
                  onChange={(e) => setAsgFormData({ ...asgFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAssignment}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/30 transition flex items-center gap-2"
                >
                  {isSavingAssignment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{editingAssignment ? 'Update Assignment' : 'Publish Assignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deleteModalAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">Delete Assignment?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete{' '}
                <span className="text-slate-200 font-bold">
                  "{deleteModalAssignment.title}"
                </span>
                ? All associated student submissions and grades will also be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalAssignment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAssignment}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
