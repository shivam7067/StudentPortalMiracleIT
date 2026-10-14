import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Briefcase,
  Building,
  MapPin,
  Users,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Award,
  Loader2
} from 'lucide-react';
import { placementDrives as fallbackDrives } from '../../data/dummyData';

export default function TeacherPlacement() {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacementData = async () => {
      try {
        const [placementsRes, studentsRes] = await Promise.allSettled([
          api.get('/placements'),
          api.get('/students'),
        ]);

        if (placementsRes.status === 'fulfilled' && placementsRes.value.data?.success) {
          setDrives(placementsRes.value.data.data || fallbackDrives);
          setApplications(placementsRes.value.data.applications || []);
        } else {
          setDrives(fallbackDrives);
        }

        if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.success) {
          setStudents(studentsRes.value.data.data || []);
        }
      } catch (err) {
        console.warn('Error loading placement data:', err);
        setDrives(fallbackDrives);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacementData();
  }, []);

  // Compute live metrics from actual student records and placement applications
  const eligibleCount = students.filter((s) => (Number(s.attendance) || 0) >= 80).length;
  const selectedCount =
    applications.filter((a) => a.status === 'Selected').length ||
    students.filter((s) => s.placementStatus && s.placementStatus.includes('Selected')).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Briefcase className="w-7 h-7 text-rose-400" />
          Campus Hiring & Placement Drives
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor campus recruitment drives, verify student eligibility criteria, and track selection offers.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="text-xs text-slate-400">Active Hiring Drives</div>
          <div className="text-3xl font-black text-white mt-1">{drives.length}</div>
          <p className="text-[11px] text-cyan-400 mt-1">Partner Tier-1 tech firms</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="text-xs text-slate-400">Eligible Candidates</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">{eligibleCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Calculated Attendance &ge; 80%</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="text-xs text-slate-400">Offers Extended</div>
          <div className="text-3xl font-black text-amber-400 mt-1">{selectedCount}</div>
          <p className="text-[11px] text-amber-400 mt-1">Students placed this cycle</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading placement data from server...</p>
        </div>
      ) : (
        /* Drives List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {drives.map((drive) => (
            <div
              key={drive.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    {drive.ctc}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{drive.company}</h3>
                  <p className="text-xs text-slate-300 font-medium">{drive.role}</p>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Active Drive
                </span>
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </span>
                  <span>{drive.location}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> Eligibility
                  </span>
                  <span className="font-semibold text-cyan-300">{drive.eligibility}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Deadline
                  </span>
                  <span>{drive.deadline}</span>
                </div>
              </div>

              {drive.rounds && (
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-1">Hiring Pipeline:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {drive.rounds.map((rnd, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        {rnd}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
