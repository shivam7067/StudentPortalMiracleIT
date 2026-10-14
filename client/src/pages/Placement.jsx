import React, { useState, useEffect } from 'react';
import api from '../utils/api';
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
  Loader2,
  Award,
  ExternalLink,
  X,
  Check
} from 'lucide-react';

export default function Placement() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [selectedDriveDetails, setSelectedDriveDetails] = useState(null);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/placements');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setDrives(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load live placement drives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleApply = async (drive) => {
    const targetId = drive._id || drive.id;
    setApplyingId(targetId);
    try {
      const res = await api.post('/placements/apply', {
        driveId: targetId,
        company: drive.company,
        role: drive.role,
        ctc: drive.ctc,
        location: drive.location,
        eligibility: drive.eligibility,
        deadline: drive.deadline,
        rounds: drive.rounds,
      });

      if (res.data?.success) {
        setDrives((prev) =>
          prev.map((d) => {
            if ((d._id || d.id) === targetId) {
              return { ...d, myApplicationStatus: 'Applied', status: 'Applied' };
            }
            return d;
          })
        );

        setToast(`Application submitted to ${drive.company}! Your profile and test scores have been forwarded.`);
        setTimeout(() => setToast(''), 4500);
      }
    } catch (err) {
      alert(`Error applying: ${err.message}`);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
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

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile ATS Verified: 92/100</span>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast('')} className="p-1 text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading placement drives from campus recruiting server...</p>
        </div>
      ) : drives.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No active drives right now</h3>
          <p className="text-xs text-slate-400 mt-1">
            New recruitment drives from hiring partners will appear here. Keep your attendance above 80% to remain eligible.
          </p>
        </div>
      ) : (
        /* Drives List */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {drives.map((drive) => {
            const currentStatus = drive.myApplicationStatus || drive.status || 'Eligible to Apply';
            const isApplied = currentStatus !== 'Eligible to Apply';

            return (
              <div
                key={drive.id || drive._id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{drive.role}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300 font-semibold">{drive.company}</span>
                        {drive.workMode && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                            {drive.workMode}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-400 font-mono block">{drive.ctc}</span>
                      <span className="text-[10px] text-slate-400">Fixed + Variable</span>
                    </div>
                  </div>

                  {drive.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {drive.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{drive.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">Deadline: {drive.deadline}</span>
                    </div>
                    <div className="col-span-2 text-slate-400 pt-1 border-t border-slate-800">
                      Eligibility: <span className="text-cyan-300 font-semibold">{drive.eligibility}</span>
                    </div>
                  </div>

                  {/* Rounds Progress Stepper */}
                  <div className="mb-4 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Hiring Pipeline:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(drive.rounds || []).map((round, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {round}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        currentStatus === 'Selected'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : currentStatus === 'Shortlisted'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : currentStatus === 'Interview Scheduled'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : currentStatus === 'Applied'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          : 'bg-slate-950 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {currentStatus}
                    </span>

                    {drive.interviewDate && drive.interviewDate !== 'TBA' && (
                      <span className="text-[11px] text-amber-300 font-mono hidden sm:inline">
                        Interview: {drive.interviewDate}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDriveDetails(drive)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition"
                    >
                      Details
                    </button>

                    {!isApplied ? (
                      <button
                        disabled={applyingId === (drive._id || drive.id)}
                        onClick={() => handleApply(drive)}
                        className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20 disabled:opacity-50 active:scale-95"
                      >
                        {applyingId === (drive._id || drive.id) ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                        <span>{applyingId === (drive._id || drive.id) ? 'Applying...' : 'Apply Now'}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Submitted</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drive Details Modal */}
      {selectedDriveDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  {selectedDriveDetails.ctc}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedDriveDetails.role}
                </h3>
                <p className="text-xs text-slate-300 font-semibold">{selectedDriveDetails.company}</p>
              </div>
              <button
                onClick={() => setSelectedDriveDetails(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 font-semibold block">Location:</span>
                  <span className="text-slate-200 font-medium">{selectedDriveDetails.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Work Mode:</span>
                  <span className="text-slate-200 font-medium">{selectedDriveDetails.workMode || 'Hybrid'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Application Deadline:</span>
                  <span className="text-rose-300 font-medium">{selectedDriveDetails.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Hiring Drive Date:</span>
                  <span className="text-slate-200 font-medium">{selectedDriveDetails.driveDate || 'TBA'}</span>
                </div>
              </div>

              {selectedDriveDetails.description && (
                <div>
                  <span className="text-slate-300 font-bold block mb-1">About the Role:</span>
                  <p className="text-slate-400 leading-relaxed">{selectedDriveDetails.description}</p>
                </div>
              )}

              {selectedDriveDetails.requirements && selectedDriveDetails.requirements.length > 0 && (
                <div>
                  <span className="text-slate-300 font-bold block mb-1">Requirements & Qualifications:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {selectedDriveDetails.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span className="text-slate-300 font-bold block mb-1">Interview Rounds:</span>
                <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {(selectedDriveDetails.rounds || []).map((round, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Round {i + 1}: {round}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedDriveDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              {selectedDriveDetails.myApplicationStatus === 'Eligible to Apply' || !selectedDriveDetails.myApplicationStatus ? (
                <button
                  type="button"
                  onClick={() => {
                    handleApply(selectedDriveDetails);
                    setSelectedDriveDetails(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition"
                >
                  Apply to {selectedDriveDetails.company}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
