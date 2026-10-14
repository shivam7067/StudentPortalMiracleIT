import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Megaphone,
  Plus,
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Send,
  Trash2,
  Loader2
} from 'lucide-react';

export default function TeacherAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcements');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/announcements', {
        title: title.trim(),
        category,
        content: content.trim(),
        urgent,
      });

      if (res.data?.success) {
        await loadAnnouncements();
        setShowModal(false);
        setTitle('');
        setContent('');
        setUrgent(false);
        setToastMsg(`Announcement broadcasted to batches!`);
        setTimeout(() => setToastMsg(''), 4000);
      }
    } catch (err) {
      alert(`Error broadcasting announcement: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((a) => (a._id || a.id) !== id));
      setToastMsg('Announcement deleted successfully.');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert(`Error deleting announcement: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-cyan-400" />
            Institutional Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Broadcast urgent batch alerts, hackathon registrations, guest lectures, and exam updates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-cyan-400" />
          <p className="text-sm">Loading announcements from server...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-900/60 rounded-3xl border border-slate-800">
          <Megaphone className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No announcements published yet</h3>
          <p className="text-xs">Broadcast urgent cohort updates and notices to students.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann._id || ann.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {ann.category}
                  </span>
                  {ann.urgent && (
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Urgent
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.date}
                  </span>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann._id || ann.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            <h3 className="text-base font-bold text-white tracking-tight">
              {ann.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ann.content}
            </p>
          </div>
        ))}
      </div>
      )}

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleCreateAnnouncement}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              Broadcast Notice
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Notice Headline
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Special Masterclass on Microservices & Kafka"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="General">General</option>
                  <option value="Masterclass">Masterclass</option>
                  <option value="Exams">Exams</option>
                  <option value="Placement">Placement</option>
                  <option value="Hackathon">Hackathon</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-rose-500"
                  />
                  <span className="text-xs font-semibold text-rose-300">Mark as Urgent</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Notice Content
              </label>
              <textarea
                rows="4"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full details, timings, prerequisites, or join URLs..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md transition"
              >
                Broadcast
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
