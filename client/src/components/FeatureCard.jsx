import React from 'react';
import {
  Code2,
  FileCheck,
  BookOpenCheck,
  CalendarCheck,
  Clock,
  Award,
  Briefcase,
  Megaphone,
  HelpCircle,
  Users2,
  MessageSquareHeart,
  Trophy,
  Target,
  FolderGit2,
  Contact,
  ArrowUpRight
} from 'lucide-react';

const iconMap = {
  Code2,
  FileCheck,
  BookOpenCheck,
  CalendarCheck,
  Clock,
  Award,
  Briefcase,
  Megaphone,
  HelpCircle,
  Users2,
  MessageSquareHeart,
  Trophy,
  Target,
  FolderGit2,
  Contact
};

export default function FeatureCard({ feature, index }) {
  const IconComponent = iconMap[feature.iconName] || Code2;

  return (
    <div className="group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-black/30 flex flex-col justify-between overflow-hidden">
      
      {/* Subtle top ambient indicator */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500 transition-all duration-500" />
      
      {/* Background glow on hover */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/0 group-hover:bg-indigo-500/10 rounded-full blur-xl transition-all duration-300 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-200 shadow-inner">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/60">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="inline-block text-[11px] font-semibold text-indigo-400 mb-1.5">
          {feature.tag}
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
          {feature.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
          {feature.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition-colors">
        <span>Module Details</span>
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>

    </div>
  );
}
