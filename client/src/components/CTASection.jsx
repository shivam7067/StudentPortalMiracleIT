import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, GraduationCap } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function CTASection({ onOpenPortalModal }) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background ambient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-orange-950/10 to-slate-950 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 border border-orange-500/30 p-8 sm:p-14 text-center shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Subtle grid pattern inside card */}
          <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

          {/* Logo in CTA Card */}
          <div className="mb-6 flex justify-center">
            <BrandLogo size="md" variant="pill" showSubtitle={true} to="" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Admissions & Scholarship Test Open for 2026</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to Build Your Tech Career with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-blue-400">
              Miracle IT
            </span>
            ?
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Gain production-grade software engineering craft, get mentored by tech leaders, build live capstones, and get placed at top software companies.
          </p>

          {/* Primary CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenPortalModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-orange-500 via-amber-600 to-blue-600 hover:from-orange-600 hover:to-blue-700 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border border-orange-400/30 group"
            >
              <GraduationCap className="w-5 h-5 text-orange-200" />
              <span>Launch Student Portal</span>
              <ArrowRight className="w-5 h-5 text-orange-200 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#courses"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
            >
              Explore Course Catalog
            </a>
          </div>

          {/* Micro assurances */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Central India's #1 Rated Academy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Placement Assurance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Dedicated 1-on-1 Mentorship</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
