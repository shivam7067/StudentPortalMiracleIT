import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  MessageSquareHeart, 
  Star, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Loader2,
  Clock
} from 'lucide-react';

export default function Feedback() {
  const [rating, setRating] = useState(5);
  const [module, setModule] = useState('React 19 & Full Stack Architecture (Mentor Arpan)');
  const [comments, setComments] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myFeedbackList, setMyFeedbackList] = useState([]);

  const fetchMyFeedback = async () => {
    try {
      const res = await api.get('/feedback/my-feedback');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setMyFeedbackList(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load feedback history:', err);
    }
  };

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/feedback', {
        moduleOrMentor: module,
        rating,
        comments,
        isAnonymous,
      });

      setSubmitted(true);
      setComments('');
      fetchMyFeedback();
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (err) {
      alert(`Error submitting feedback: ${err.message}`);
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
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Curriculum & Mentor Feedback</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Your constructive reviews directly shape teaching pacing, lab exercises, and mentor support.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Anonymous by Choice</span>
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Thank you! Your feedback has been logged securely and forwarded to the MiracleIT Academic Dean.</span>
        </div>
      )}

      {/* Main Feedback Form */}
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Module or Mentor
            </label>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option>React 19 & Full Stack Architecture (Mentor Arpan)</option>
              <option>Data Structures & Algorithm Drills (Mentor Neha)</option>
              <option>MongoDB & Backend Microservices (Mentor Vikram)</option>
              <option>System Design & AWS DevOps (Mentor Karthik)</option>
              <option>Placement Cell & Mock Interviews</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Overall Experience Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-xs font-bold text-amber-400">
                {rating === 5 ? 'Exceptional (5/5)' : `${rating}/5`}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Detailed Comments & Suggestions
            </label>
            <textarea
              rows={4}
              required
              placeholder="What went exceptionally well? What topics need more lab time or code examples?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="anonCheck"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="anonCheck" className="text-xs text-slate-300 select-none cursor-pointer">
              Submit anonymously (do not attach my name or roll number)
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Recent Feedback Submissions */}
      {myFeedbackList.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>My Submitted Feedback History</span>
          </h3>
          <div className="space-y-2">
            {myFeedbackList.map((fb) => (
              <div key={fb._id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{fb.moduleOrMentor}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{fb.rating}/5</span>
                  </div>
                </div>
                <p className="text-slate-300">{fb.comments}</p>
                <div className="text-[10px] text-slate-500 pt-1">
                  Status: <span className="text-emerald-400 font-semibold">{fb.status}</span> • {new Date(fb.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
