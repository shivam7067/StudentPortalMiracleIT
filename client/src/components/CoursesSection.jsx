import React, { useState } from 'react';
import CourseCard from './CourseCard';
import { coursesData } from '../data/portalData';
import { GraduationCap, CheckCircle2, X } from 'lucide-react';

export default function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <section id="courses" className="relative py-24 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-orange-400" />
            <span>Central India's Top Industry Curriculums</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Learn Skills That{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-blue-400">
              Get You Hired
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Practical software engineering and AI tracks built in consultation with top engineering directors from leading tech firms.
          </p>
        </div>

        {/* 6 Courses Grid (Responsive: 1 col on mobile, 2 on tablet, 3 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesData.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelectCourse={(c) => setSelectedCourse(c)}
            />
          ))}
        </div>

        {/* Course Quick Preview Modal (Interactive UI state) */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl text-left">
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 mb-3">
                {selectedCourse.level} • {selectedCourse.duration}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{selectedCourse.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{selectedCourse.description}</p>

              <div className="space-y-3 mb-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">What You'll Master:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCourse.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Includes {selectedCourse.projectsCount} and verified graduation certificate.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition text-center"
                >
                  Download Syllabus
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="py-3 px-4 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
