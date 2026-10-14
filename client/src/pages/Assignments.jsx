import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { assignmentsData } from '../data/dummyData';
import { 
  BookOpenCheck, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Upload, 
  ExternalLink, 
  GitBranch, 
  Sparkles, 
  X, 
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/assignments');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setAssignments(res.data.data);
      } else {
        setAssignments(assignmentsData);
      }
    } catch (err) {
      console.warn('Could not load assignments from server, using fallback:', err);
      setAssignments(assignmentsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleOpenSubmit = (asg) => {
    setSubmittingAssignment(asg);
    setRepoUrl('');
    setNotes('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submittingAssignment) return;

    setIsSubmitting(true);
    try {
      const targetId = submittingAssignment._id || submittingAssignment.id;
      await api.post(`/assignments/${targetId}/submit`, {
        repoUrl,
        notes,
      });

      // Update assignment status locally
      setAssignments((prev) =>
        prev.map((a) => {
          if ((a._id || a.id) === targetId) {
            return { ...a, status: 'Submitted', deadline: 'Submitted Just Now' };
          }
          return a;
        })
      );

      setSuccessToast(`Assignment "${submittingAssignment.title}" submitted successfully for mentor review!`);
      setSubmittingAssignment(null);
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Assignments & Code Submissions</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Weekly project assignments reviewed by industry mentors with automated test reports.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
          Total Completed: <span className="text-emerald-400 font-bold">18 / 19</span>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Assignments List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-400" />
          <p className="text-sm">Loading course assignments from server...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((asg) => (
            <div
              key={asg._id || asg.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    {asg.subject}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded ${
                      asg.status === 'Graded'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                        : asg.status === 'Submitted'
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {asg.status}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{asg.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{asg.description}</p>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Assigned Date:</span>
                    <span className="text-slate-200">{asg.assignedDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Deadline:</span>
                    <span className="text-amber-400 font-semibold">{asg.deadline}</span>
                  </div>
                  {asg.obtainedMarks !== undefined && (
                    <div className="flex items-center justify-between text-emerald-400 font-bold pt-1 border-t border-slate-800">
                      <span>Grade / Marks:</span>
                      <span>{asg.obtainedMarks} / {asg.maxMarks} (Pass)</span>
                    </div>
                  )}
                </div>

                {asg.mentorFeedback && (
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-xs mb-4">
                    <span className="font-semibold text-indigo-300 block mb-1">Mentor Code Review Note:</span>
                    <p className="text-slate-300 italic text-[11px]">"{asg.mentorFeedback}"</p>
                  </div>
                )}
              </div>

              <div>
                {asg.status === 'Pending Submission' || asg.status === 'In Progress' ? (
                  <button
                    onClick={() => handleOpenSubmit(asg)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit Assignment Solution</span>
                  </button>
                ) : (
                  <div className="text-center py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-850 text-xs text-slate-400">
                    {asg.status === 'Submitted' ? 'Under Review by Teaching Assistant' : 'Graded & Archived'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSubmittingAssignment(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Submit Assignment</h3>
            <p className="text-xs text-indigo-400 mb-4">{submittingAssignment.title}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  GitHub Repository Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/project-repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Submission Notes / Live Demo URL (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain any custom configurations, libraries used, or hosted URL..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isSubmitting ? 'Submitting...' : 'Confirm & Submit for Review'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
