import React from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Terminal, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  Users,
  Building2,
  Star
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Hero({ onOpenPortalModal }) {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
      {/* Ambient brand radial glow effects - Miracle Orange & Royal Blue */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] lg:w-[850px] lg:h-[500px] bg-orange-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-24 right-10 w-[400px] h-[400px] bg-blue-600/18 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-[350px] h-[350px] bg-amber-500/10 blur-[110px] rounded-full pointer-events-none -z-10" />
      
      {/* Background grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Pill Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/30 text-xs font-semibold text-slate-200 mb-6 backdrop-blur-md shadow-lg shadow-orange-500/5">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </span>
              <span className="text-orange-400 font-bold">Central India's No.1 IT Training Academy</span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-emerald-400 hidden sm:inline flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                2026 Batch Open
              </span>
            </div>

            {/* Main Heading with Brand Dual Gradients */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Launch Your Tech Career at{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-blue-400">
                Miracle IT
              </span>{' '}
              Career Academy
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Empowering engineers and tech aspirants across Central India with real-world industry curriculum, hands-on full-stack development, proctored examinations, live doubt-clearing, and 100% placement support.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenPortalModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 via-amber-600 to-blue-600 hover:from-orange-600 hover:to-blue-700 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border border-orange-400/40 group"
              >
                <span>Access Student Portal</span>
                <ArrowRight className="w-4 h-4 text-orange-200 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <a
                href="#courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-orange-500/40 hover:text-white transition-all duration-200 shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-orange-400" />
                <span>Explore Certified Courses</span>
              </a>
            </div>

            {/* Key Trust Highlights under CTA */}
            <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">#1</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">Rank in Central India</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">100%</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">Placement Assistance</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-blue-400">500+</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">Hiring Tech Companies</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visual Student Dashboard & Code Environment */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Glow Behind Card */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-100 transition duration-1000 -z-10" />

              {/* Main Dashboard Preview Card */}
              <div className="rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl">
                
                {/* IDE Window Top Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 text-xs font-mono text-slate-300 flex items-center gap-1.5 font-semibold">
                      <Terminal className="w-3.5 h-3.5 text-orange-400" />
                      MiracleIT-Cloud-IDE / FullStackLab.ts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Sandbox
                    </span>
                  </div>
                </div>

                {/* Simulated Code Body with Syntax Coloring */}
                <div className="p-4 sm:p-5 font-mono text-xs leading-relaxed bg-slate-950/70 text-slate-300 border-b border-slate-800/70 overflow-x-auto">
                  <div className="text-orange-400/80 select-none">// Miracle IT Career Academy: Industry MERN & AI Architecture</div>
                  <div className="mt-1">
                    <span className="text-blue-400">export async function</span>{' '}
                    <span className="text-amber-300 font-semibold">deployFullStackApp</span>(studentId: <span className="text-emerald-400">string</span>) {'{'}
                  </div>
                  <div className="pl-4 text-slate-400">
                    <span className="text-purple-400">const</span> pipeline = <span className="text-blue-400">await</span> CloudEngine.<span className="text-cyan-400">init</span>({'{'}
                  </div>
                  <div className="pl-8 text-slate-400">
                    academy: <span className="text-amber-200">"Miracle IT Career Academy"</span>,
                  </div>
                  <div className="pl-8 text-slate-400">
                    curriculum: <span className="text-emerald-300">"Central India Industry Standards"</span>,
                  </div>
                  <div className="pl-8 text-slate-400">
                    skills: [<span className="text-amber-200">"React"</span>, <span className="text-amber-200">"Node.js"</span>, <span className="text-amber-200">"AWS"</span>, <span className="text-amber-200">"Docker"</span>]
                  </div>
                  <div className="pl-4 text-slate-400">{'}'});</div>
                  <div className="pl-4">
                    <span className="text-purple-400">return</span> pipeline.<span className="text-emerald-400">certifyPlacementReady</span>();
                  </div>
                  <div>{'}'}</div>

                  {/* Test Execution Output */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-sans font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>All 18 Production Test Suites Passed</span>
                    </div>
                    <div className="text-slate-400 font-sans text-[11px]">
                      Score: <span className="text-orange-400 font-mono font-bold">100/100</span>
                    </div>
                  </div>
                </div>

                {/* Integrated Student Dashboard Quick Metrics */}
                <div className="p-4 bg-slate-900/95 grid grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Attendance</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-lg font-black text-white mt-1">98.4%</div>
                    <div className="text-[10px] text-emerald-400 font-medium">Eligible for Drives</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-orange-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Coding Streak</span>
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div className="text-lg font-black text-orange-400 mt-1">45 Days</div>
                    <div className="text-[10px] text-orange-300 font-medium">🔥 Top Performer</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Placement Rank</span>
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="text-lg font-black text-blue-400 mt-1">#01</div>
                    <div className="text-[10px] text-blue-300 font-medium">Pre-placed at ₹12 LPA</div>
                  </div>
                </div>

              </div>

              {/* Floating Badge 1 - Top Left */}
              <div className="absolute -top-4 -left-4 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/95 border border-orange-500/40 shadow-xl shadow-orange-950/40 backdrop-blur-md">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs">
                  ★
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Miracle Certified</div>
                  <div className="text-[10px] text-slate-300">Central India Top Academy</div>
                </div>
              </div>

              {/* Floating Badge 2 - Bottom Right */}
              <div className="absolute -bottom-4 -right-4 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/95 border border-blue-500/40 shadow-xl shadow-blue-950/40 backdrop-blur-md">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Campus Hiring Drive</div>
                  <div className="text-[10px] text-blue-300 font-medium">32 Offers in Tech giants</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
