import React from 'react';
import { placementJobs } from '../data/portalData';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Banknote, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Users, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function PlacementSection({ onOpenPortalModal }) {
  const placementPillars = [
    {
      title: "Placement Preparation",
      desc: "ATS-compliant resume reviews, portfolio deployments, and GitHub profiling.",
      icon: FileText
    },
    {
      title: "Job Opportunities",
      desc: "Exclusive on-campus and remote hiring openings curated for MiracleIT batches.",
      icon: Briefcase
    },
    {
      title: "Interview Preparation",
      desc: "Rigorous technical mock rounds, behavioral questions, and live DSA screens.",
      icon: Users
    },
    {
      title: "Company Drives",
      desc: "Dedicated recruitment drives organized directly with partner HR leadership.",
      icon: Building2
    },
    {
      title: "Application Tracking",
      desc: "Real-time portal dashboard tracking interview invites, rounds, and offer letters.",
      icon: TrendingUp
    }
  ];

  return (
    <section id="placements" className="relative py-24 bg-slate-950">
      {/* Background radial accent */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Central India's No.1 Placement Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Build Skills. Land Dream{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-blue-400">
              Tech Placements.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Miracle IT Career Academy holds the highest student placement percentage across Central India with top recruiters, dedicated drive coordination, and 1-on-1 interview drills.
          </p>
        </div>

        {/* 5 Placement Pillars Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-14">
          {placementPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-950/70 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{pillar.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Visual Job Drives Grid (Fictional opportunities) */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white">Live Institute Hiring Drives</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Sample representation of verified drives accessible through MiracleIT Portal</p>
            </div>

            <button
              onClick={onOpenPortalModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/30 transition-all self-start sm:self-auto group"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {placementJobs.map((job) => (
              <div 
                key={job.id}
                className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 inline-block mb-1.5">
                      {job.type}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {job.role}
                    </h4>
                    <div className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Package</span>
                    <span className="text-sm font-bold text-white font-mono">{job.ctc}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {job.tags.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              * Note: Company listings shown are representative of corporate drive structures available inside the authenticated portal.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
