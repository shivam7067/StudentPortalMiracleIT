import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Terminal, 
  Laptop, 
  UserCheck, 
  GraduationCap, 
  Award, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function AboutSection({ onOpenPortalModal }) {
  const points = [
    { title: "Track learning progress", desc: "Real-time roadmap analytics, module milestones, and visual completion bars." },
    { title: "Practice coding", desc: "Integrated browser IDE with multi-language runtime and test case runner." },
    { title: "Attend tests and exams", desc: "Automated MCQ assessments, algorithmic coding tests, and proctored grading." },
    { title: "Submit assignments", desc: "Weekly Git-based or code file submissions with detailed mentor annotations." },
    { title: "Track attendance", desc: "Transparent session attendance logs and minimum eligibility meters for placements." },
    { title: "Build projects", desc: "End-to-end full stack capstone projects built with agile methodologies." },
    { title: "Connect with mentors", desc: "1-on-1 scheduled doubt solving, resume auditing, and code reviews." },
    { title: "Discover placement opportunities", desc: "Direct company referral drives, interview scheduling, and offer letter tracking." }
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Central India's Premier IT Finishing School</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Why Ambitious Engineers Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-blue-400">
              Miracle IT
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Miracle IT Career Academy bridges the gap between college academics and high-paying tech careers with production-grade coding labs, AI tools, 1-on-1 industry mentors, and guaranteed placement drives.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Points list */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((point, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {point.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onOpenPortalModal}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 group"
              >
                <span>Discover all portal capabilities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Dashboard-Style Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
              
              {/* Card Header: Student Profile Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                      alt="Student Avatar" 
                      className="w-full h-full rounded-[10px] object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">Priya Sundaram</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/70">
                        Active Scholar
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Batch: MIRACLE-2026-MERN • Roll: MIT-0842
                    </p>
                  </div>
                </div>

                <div className="text-right self-end sm:self-auto">
                  <span className="text-[11px] text-slate-400 block">Overall Performance</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">Grade A+ (94%)</span>
                </div>
              </div>

              {/* Progress Gauges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-b border-slate-800">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
                  <span className="text-[11px] text-slate-400 block">DSA Solved</span>
                  <span className="text-lg font-bold text-white mt-1 block">284 / 350</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '81%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
                  <span className="text-[11px] text-slate-400 block">Assignments</span>
                  <span className="text-lg font-bold text-white mt-1 block">18 / 19</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
                  <span className="text-[11px] text-slate-400 block">Attendance</span>
                  <span className="text-lg font-bold text-white mt-1 block">96%</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
                  <span className="text-[11px] text-slate-400 block">Mock Rounds</span>
                  <span className="text-lg font-bold text-white mt-1 block">5 Cleared</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>

              {/* Live Modules & Schedule snippet */}
              <div className="pt-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Upcoming Schedule & Tasks</span>
                  <span className="text-indigo-400">View Weekly Calendar</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      <div>
                        <div className="text-xs font-bold text-slate-200">System Design: Microservices & Event Bus</div>
                        <div className="text-[10px] text-slate-400">Live Lab with Mentor Arpan • 04:30 PM Today</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                      Join Room
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-slate-200">Full Stack Project Milestone 3</div>
                        <div className="text-[10px] text-slate-400">Automated PR checks passed • Reviewed by Mentor</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                      Graded 100/100
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
