import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  UserPlus,
  Edit,
  ArrowLeft,
  CheckCircle2,
  Save,
  User,
  BookOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
];

export default function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'student123',
    rollNo: '',
    phone: '',
    course: 'MERN Stack Development',
    batch: 'MIRACLE-2026-MERN-02',
    status: 'Active',
    attendance: 95,
    cgpa: 8.8,
    placementStatus: 'Eligible',
    address: 'Bengaluru, Karnataka',
    avatar: AVATAR_PRESETS[0],
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStudent, setIsLoadingStudent] = useState(isEditing);

  // Fetch available courses for dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setCourses(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load courses list from server:', err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch existing student data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchStudent = async () => {
        setIsLoadingStudent(true);
        try {
          const res = await api.get(`/students/${id}`);
          if (res.data?.success && res.data.data) {
            const existing = res.data.data;
            setFormData({
              name: existing.name || '',
              email: existing.email || '',
              password: existing.password || 'student123',
              rollNo: existing.rollNo || '',
              phone: existing.phone || '',
              course: existing.course || 'MERN Stack Development',
              batch: existing.batch || 'MIRACLE-2026-MERN-02',
              status: existing.status || 'Active',
              attendance: existing.attendance !== undefined ? existing.attendance : 95,
              cgpa: existing.cgpa !== undefined ? existing.cgpa : 8.8,
              placementStatus: existing.placementStatus || 'Eligible',
              address: existing.address || 'Bengaluru, Karnataka',
              avatar: existing.avatar || AVATAR_PRESETS[0],
            });
          } else {
            setErrors({ general: 'Student not found.' });
          }
        } catch (err) {
          setErrors({ general: err.message || 'Failed to fetch student details.' });
        } finally {
          setIsLoadingStudent(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Student Name is required.';
    if (!formData.email.trim()) errs.email = 'Valid Email is required.';
    if (!formData.course) errs.course = 'Please select a Course.';
    if (!formData.batch.trim()) errs.batch = 'Batch name is required.';
    if (formData.attendance < 0 || formData.attendance > 100) {
      errs.attendance = 'Attendance must be between 0 and 100.';
    }
    if (formData.cgpa < 0 || formData.cgpa > 10) {
      errs.cgpa = 'CGPA must be between 0.0 and 10.0.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        ...formData,
        attendance: Number(formData.attendance),
        cgpa: Number(formData.cgpa),
      };

      if (isEditing) {
        await api.put(`/students/${id}`, payload);
        setSuccessMsg('Student profile successfully updated!');
      } else {
        await api.post('/students', payload);
        setSuccessMsg('New student registered successfully!');
      }

      setTimeout(() => {
        navigate('/teacher/students');
      }, 1000);
    } catch (err) {
      setErrors({ general: err.message || 'Operation failed. Please check form data.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/teacher/students"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {isEditing ? <Edit className="w-6 h-6 text-cyan-400" /> : <UserPlus className="w-6 h-6 text-cyan-400" />}
              {isEditing ? 'Edit Student Details' : 'Register New Student'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? `Updating profile and academic metrics for ${formData.name || 'student'}`
                : 'Enrolling student into institutional cohort with localStorage persistence'}
            </p>
          </div>
        </div>

        <Link
          to="/teacher/students"
          className="text-xs text-slate-400 hover:text-white transition font-medium"
        >
          Cancel
        </Link>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successMsg} Redirecting to student roster...</span>
        </div>
      )}

      {/* Error banner */}
      {errors.general && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="font-semibold">{errors.general}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
        
        {/* Section 1: Basic Identity */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2 pb-2 border-b border-slate-800">
            <User className="w-4 h-4" />
            Personal & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Rohan Gupta"
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Student Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., rohan.gupta@institute.com"
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Portal Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="e.g., student123"
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              <p className="text-[10px] text-slate-500 mt-1">Default demo login password</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., +91 98765 43210"
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Roll Number / ID
              </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="Auto-generated if empty (e.g. MIT-0847)"
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location / City
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., Indiranagar, Bengaluru"
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academics & Cohort */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2 pb-2 border-b border-slate-800">
            <BookOpen className="w-4 h-4" />
            Cohort & Academic Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tech Track / Course */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tech Course Track <span className="text-rose-400">*</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
                <option value="MERN Stack Development">MERN Stack Development</option>
                <option value="Java Full Stack">Java Full Stack</option>
                <option value="Python Backend & API Development">Python Backend & API</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="DSA & Problem Solving">DSA & Problem Solving</option>
              </select>
            </div>

            {/* Batch Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cohort Batch <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="e.g., MIRACLE-2026-MERN-02"
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Enrollment Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Attendance Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              {errors.attendance && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.attendance}</p>
              )}
            </div>

            {/* CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cumulative CGPA (0 - 10)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="10"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              {errors.cgpa && <p className="text-[11px] text-rose-400 mt-1">{errors.cgpa}</p>}
            </div>

            {/* Placement Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Placement Drive Status
              </label>
              <select
                name="placementStatus"
                value={formData.placementStatus}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              >
                <option value="Eligible">Eligible to Apply</option>
                <option value="Selected (Partner Drive)">Selected (Partner Drive)</option>
                <option value="Attendance Warning">Attendance Warning</option>
                <option value="In Assessment">In Assessment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Profile Avatar Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Student Avatar Image
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {AVATAR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, avatar: preset }))}
                className={`relative rounded-2xl overflow-hidden p-0.5 transition ${
                  formData.avatar === preset
                    ? 'ring-2 ring-cyan-400 scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={preset}
                  alt={`preset-${idx}`}
                  className="w-12 h-12 object-cover rounded-xl"
                />
              </button>
            ))}
          </div>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Custom Image URL..."
            className="w-full px-4 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Link
            to="/teacher/students"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-600/30 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Register Student'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
