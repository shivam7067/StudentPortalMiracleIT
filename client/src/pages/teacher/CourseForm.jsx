import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  BookOpen,
  Plus,
  Edit,
  ArrowLeft,
  CheckCircle2,
  Save,
  Tag,
  Clock,
  Users,
  Award,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function CourseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    instructor: 'Rahul Sharma',
    level: 'Intermediate',
    duration: '6 Months',
    maxCapacity: 50,
    enrolledStudents: 30,
    projectsCount: '6 Projects',
    status: 'Active',
    tags: 'React, Node.js, Express, MongoDB, Tailwind CSS',
    badge: 'Popular',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchCourse = async () => {
        setIsLoadingCourse(true);
        try {
          const res = await api.get(`/courses/${id}`);
          if (res.data?.success && res.data.data) {
            const existing = res.data.data;
            setFormData({
              title: existing.title || '',
              code: existing.code || '',
              instructor: existing.instructor || 'Rahul Sharma',
              level: existing.level || 'Intermediate',
              duration: existing.duration || '6 Months',
              maxCapacity: existing.maxCapacity || 50,
              enrolledStudents: existing.enrolledStudents || 0,
              projectsCount: existing.projectsCount || '6 Projects',
              status: existing.status || 'Active',
              tags: Array.isArray(existing.tags) ? existing.tags.join(', ') : existing.tags || '',
              badge: existing.badge || 'Popular',
              description: existing.description || '',
            });
          } else {
            setErrors({ general: 'Course not found.' });
          }
        } catch (err) {
          setErrors({ general: err.message || 'Failed to fetch course details.' });
        } finally {
          setIsLoadingCourse(false);
        }
      };
      fetchCourse();
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
    if (!formData.title.trim()) errs.title = 'Course Title is required.';
    if (!formData.code.trim()) errs.code = 'Course Code is required.';
    if (!formData.description.trim()) errs.description = 'Course Description is required.';
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
        maxCapacity: Number(formData.maxCapacity),
        enrolledStudents: Number(formData.enrolledStudents),
      };

      if (isEditing) {
        await api.put(`/courses/${id}`, payload);
        setSuccessMsg('Course track successfully updated!');
      } else {
        await api.post('/courses', payload);
        setSuccessMsg('New course track successfully created!');
      }

      setTimeout(() => {
        navigate('/teacher/courses');
      }, 1000);
    } catch (err) {
      setErrors({ general: err.message || 'Failed to save course. Please check inputs.' });
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
            to="/teacher/courses"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {isEditing ? <Edit className="w-6 h-6 text-indigo-400" /> : <Plus className="w-6 h-6 text-indigo-400" />}
              {isEditing ? 'Edit Course Track' : 'Create New Course Track'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? `Update syllabus and cohort capacity for ${formData.title || 'course'}`
                : 'Publish a new tech track into institutional offerings with localStorage persistence'}
            </p>
          </div>
        </div>

        <Link
          to="/teacher/courses"
          className="text-xs text-slate-400 hover:text-white transition font-medium"
        >
          Cancel
        </Link>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successMsg} Returning to courses...</span>
        </div>
      )}

      {/* Error banner */}
      {errors.general && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="font-semibold">{errors.general}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Course Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., MERN Stack Development & Cloud Architecture"
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Course Code <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., FS-MERN"
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {errors.code && <p className="text-[11px] text-rose-400 mt-1">{errors.code}</p>}
          </div>

          {/* Lead Instructor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Lead Instructor
            </label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="e.g., Rahul Sharma"
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Skill Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Beginner to Pro">Beginner to Pro</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Course Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 6 Months"
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Max Capacity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Batch Seat Capacity
            </label>
            <input
              type="number"
              min="5"
              max="200"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Enrolled Students */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enrolled Students
            </label>
            <input
              type="number"
              min="0"
              name="enrolledStudents"
              value={formData.enrolledStudents}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Badge Label */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Highlight Badge
            </label>
            <input
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="e.g. Most Popular / Interview Focus"
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Projects Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Projects Included
            </label>
            <input
              type="text"
              name="projectsCount"
              value={formData.projectsCount}
              onChange={handleChange}
              placeholder="e.g., 8 Projects"
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Tech Tags */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tech Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Curriculum Summary <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a description of the course outcomes, stack technologies covered, and practical hands-on labs..."
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Link
            to="/teacher/courses"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-850 border border-slate-800 transition"
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
            <span>{isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Course'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
