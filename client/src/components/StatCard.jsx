import React from 'react';
import { Users, UserCheck, BookOpen, Briefcase } from 'lucide-react';

const iconMap = {
  students: Users,
  mentors: UserCheck,
  courses: BookOpen,
  placements: Briefcase,
};

export default function StatCard({ item }) {
  const IconComponent = iconMap[item.id] || Users;

  return (
    <div className="relative group p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/40 backdrop-blur-sm overflow-hidden">
      {/* Top subtle highlight line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
      
      {/* Background ambient radial glow on hover */}
      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300 shadow-sm">
          <IconComponent className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-mono tracking-wider font-semibold text-slate-400 uppercase bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
          Verified
        </span>
      </div>

      <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
        <span>{item.value}</span>
      </div>

      <div className="text-base font-semibold text-slate-200 mt-1">
        {item.label}
      </div>

      <p className="text-xs text-slate-400 mt-1">
        {item.subtext}
      </p>
    </div>
  );
}
