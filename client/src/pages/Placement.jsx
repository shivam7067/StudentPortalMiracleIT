import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { placementDrives as fallbackDrives } from '../data/dummyData';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  TrendingUp,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function Placement() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [applyingId, setApplyingId] = useState(null);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/placements');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setDrives(res.data.data);
      } else {
        setDrives(fallbackDrives);
      }
    } catch (err) {
      console.warn('Could not load live placement drives, using fallback:', err);
      setDrives(fallbackDrives);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleApply = async (drive) => {
    setApplyingId(drive.id);
    try {
      await api.post('/placements/apply', {
        company: drive.company,
        role: drive.role,
        ctc: drive.ctc,
        location: drive.location,
        eligibility: drive.eligibility,
        deadline: drive.deadline,
        rounds: drive.rounds,
      });

      setDrives(prev => prev.map(d => {
        if (d.id === drive.id) {
          return { ...d, status: 'Applied' };
        }
        return d;
      }));

      setToast(`Application submitted to ${drive.company}! Your profile and test scores have been forwarded.`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(`Error applying: ${err.message}`);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Placement Drives & Application Tracker</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Apply to partner recruitment drives, track interview rounds, and prepare for technical screenings.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile ATS Score: 92/100</span>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading placement drives from server...</p>
        </div>
      ) : (
        /* Drives List */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {drives.map((drive) => (
            <div
              key={drive.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{drive.role}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{drive.company}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400 font-mono block">{drive.ctc}</span>
                    <span className="text-[10px] text-slate-400">Fixed + Variable</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-850 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{drive.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Deadline: {drive.deadline}</span>
                  </div>
                  <div className="col-span-2 text-slate-400 pt-1 border-t border-slate-850">
                    Eligibility: <span className="text-slate-200">{drive.eligibility}</span>
                  </div>
                </div>

                {/* Rounds Progress Stepper */}
                <div className="mb-4 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Interview Pipeline:
                  </span>
                  <div className="space-y-1">
                    {(drive.rounds || []).map((round, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{round}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    drive.status?.includes('Shortlisted') || drive.status?.includes('Selected')
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : drive.status === 'Applied'
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}
                >
                  {drive.status}
                </span>

                {drive.status === 'Eligible to Apply' ? (
                  <button
                    disabled={applyingId === drive.id}
                    onClick={() => handleApply(drive)}
                    className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-sm disabled:opacity-50"
                  >
                    <span>{applyingId === drive.id ? 'Applying...' : 'Apply Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-mono">
                    {drive.interviewDate && drive.interviewDate !== 'TBA' ? `Next Round: ${drive.interviewDate}` : 'Under Review'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
