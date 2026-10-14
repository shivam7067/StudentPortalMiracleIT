import React from 'react';
import { journeySteps } from '../data/portalData';
import { GraduationCap, Code, Boxes, Rocket, ArrowRight } from 'lucide-react';

const iconMap = {
  GraduationCap,
  Code,
  Boxes,
  Rocket
};

export default function JourneySection() {
  return (
    <section className="relative py-24 bg-slate-950/80 border-t border-slate-800/80 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-3">
            <span>Miracle IT Pedagogy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Your 4-Step Career{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-blue-400">
              Transformational Journey
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Foundations <span className="text-orange-400 font-bold">→</span> Real Labs & IDE <span className="text-orange-400 font-bold">→</span> Production Projects <span className="text-blue-400 font-bold">→</span> Direct Placement Drives.
          </p>
        </div>

        {/* 4 Connected Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Connector Line on Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-indigo-500/20 via-cyan-500/40 to-indigo-500/20 -translate-y-12 -z-0" />

          {journeySteps.map((step, index) => {
            const Icon = iconMap[step.icon] || GraduationCap;
            return (
              <div
                key={step.step}
                className="relative z-10 group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-black/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                      {step.step}
                    </span>
                  </div>

                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                    {step.subtitle}
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <span>Phase {step.step}</span>
                  {index < journeySteps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
