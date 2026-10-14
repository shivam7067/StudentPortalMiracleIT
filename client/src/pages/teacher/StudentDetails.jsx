import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  BookOpenCheck,
  TrendingUp,
  Briefcase,
  Shield,
  Loader2
} from 'lucide-react';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/students/${id}`);
        if (res.data?.success && res.data.data) {
          setStudent(res.data.data);
        } else {
          setStudent(null);
        }
      } catch (err) {
        console.error('Error fetching student details:', err);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading student profile from server...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Student Record Not Found</h2>
        <p className="text-xs text-slate-400">The requested student ID does not exist on the server.</p>
        <Link
          to="/teacher/students"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-400 hover:text-white bg-slate-900 border border-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const targetId = student._id || student.id;
      await api.delete(`/students/${targetId}`);
      navigate('/teacher/students');
    } catch (err) {
      alert(`Error deleting student: ${err.message}`);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/teacher/students"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Roster</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/teacher/students/edit/${student.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-cyan-400 hover:text-white bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/60 transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-24 h-24 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-xl shrink-0"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {student.name}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                  student.status === 'Active'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {student.status} Student
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {student.placementStatus || 'Eligible'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="font-mono text-cyan-400 font-bold">
                Roll: {student.rollNo || student.id}
              </span>
              <span>•</span>
              <span className="font-semibold text-white">{student.course}</span>
              <span>•</span>
              <span className="text-slate-400 font-mono">{student.batch}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {student.email}
              </span>
              {student.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {student.phone}
                </span>
              )}
              {student.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {student.address}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Academic Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Attendance Rate</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{student.attendance}%</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${student.attendance}%` }}
            />
          </div>
        </div>

        {/* CGPA */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Overall CGPA</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{student.cgpa || '8.8'} / 10</div>
          <div className="text-[10px] text-cyan-400 font-semibold">Top Academic Quartile</div>
        </div>

        {/* Assignments */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Assignments</span>
            <BookOpenCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {student.assignmentsSubmitted || 18} / {student.assignmentsTotal || 19}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">95% Completion Rate</div>
        </div>

        {/* Assessments */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tests Completed</span>
            <FileCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {student.testsGiven || 6} Assessments
          </div>
          <div className="text-[10px] text-purple-400 font-semibold">Avg Score: {student.avgScore || 92}%</div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Enrolled Track Specs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Curriculum & Track Enrollment
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Primary Track</span>
              <span className="font-semibold text-white">{student.course}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Assigned Cohort</span>
              <span className="font-mono text-cyan-300 font-semibold">{student.batch}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Registration Date</span>
              <span className="text-slate-200">{student.enrollmentDate || 'Jan 15, 2026'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Placement Eligibility</span>
              <span className="text-emerald-400 font-bold">{student.placementStatus || 'Eligible'}</span>
            </div>
          </div>
        </div>

        {/* Faculty Notes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Instructor Internal Notes
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Consistently active in lab challenges and coding tests. Demonstrates high grasp of asynchronous JavaScript, React 19 hooks, and data models. Recommended for Tier-1 corporate hiring partner drives.
          </p>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
            <span>Last portal check-in:</span>
            <span className="font-semibold text-white">Today at 11:42 AM</span>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Remove {student.name}?</h3>
              <p className="text-xs text-slate-300">
                This action will delete the student profile and reset local records for this ID.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
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
