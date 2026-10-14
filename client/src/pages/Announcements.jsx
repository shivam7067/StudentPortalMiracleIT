import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { announcementsData } from '../data/dummyData';
import { 
  Megaphone, 
  Bell, 
  Calendar, 
  Sparkles, 
  AlertCircle,
  Tag,
  Loader2
} from 'lucide-react';

export default function Announcements() {
  const [filter, setFilter] = useState('All');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'Hackathon', 'Masterclass', 'Exams', 'Placement'];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAnnouncements(res.data.data);
        } else {
          setAnnouncements(announcementsData);
        }
      } catch (err) {
        console.warn('Failed to load announcements from server, using fallback:', err);
        setAnnouncements(announcementsData);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((ann) => {
    if (filter === 'All') return true;
    return ann.category === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Institute Notices & Announcements</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time batch broadcasts, guest lecture invites, hackathons, and exam notices.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filter === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-400" />
          <p className="text-sm">Loading announcements from server...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-2 bg-slate-900/60 rounded-3xl border border-slate-800">
          <Megaphone className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No notices in this category</h3>
          <p className="text-xs">Select "All" to view all institutional broadcasts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => (
            <div
              key={ann._id || ann.id}
              className={`p-6 rounded-2xl bg-slate-900/80 border transition-all shadow-xl space-y-3 ${
                ann.urgent ? 'border-amber-500/40 bg-gradient-to-r from-slate-900 via-amber-950/10 to-slate-900' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                    {ann.category}
                  </span>
                  {ann.urgent && (
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/80 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Priority Notice
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{ann.date}</span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {ann.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
