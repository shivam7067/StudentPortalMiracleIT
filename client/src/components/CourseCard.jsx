import React from 'react';
import { Clock, BarChart, ArrowRight, Layers, Sparkles } from 'lucide-react';

export default function CourseCard({ course, onSelectCourse }) {
  return (
    <div className="group relative rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/95 transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-black/40 flex flex-col justify-between overflow-hidden">
      
      {/* Top gradient border highlight */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${course.color}`} />

      <div className="p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/70 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            {course.badge}
          </span>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            {course.projectsCount}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-sm text-slate-400 leading-relaxed min-h-[40px]">
          {course.description}
        </p>

        {/* Level and Duration Tags */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <BarChart className="w-3.5 h-3.5 text-indigo-400" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Key tech tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {course.tags.map((tag, i) => (
            <span 
              key={i}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800/70 text-slate-300 border border-slate-700/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0">
        <button
          onClick={() => onSelectCourse(course)}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-indigo-600 hover:text-white border border-slate-700 hover:border-indigo-500 transition-all duration-200 group/btn"
        >
          <span>Explore Course</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
