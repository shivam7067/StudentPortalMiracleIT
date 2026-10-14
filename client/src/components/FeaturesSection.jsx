import React from 'react';
import FeatureCard from './FeatureCard';
import { featuresData } from '../data/portalData';
import { Sparkles, LayoutGrid } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-slate-950/70 border-t border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-3">
            <LayoutGrid className="w-3.5 h-3.5 text-orange-400" />
            <span>Central India's Most Advanced Learning Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            15 Integrated Modules to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-blue-400">
              Master Tech
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            From automated coding compilers and proctored examinations to 1-on-1 doubt clearing and placement tracking, everything is built into Miracle IT's unified ecosystem.
          </p>
        </div>

        {/* 15 Features Grid (Responsive: 1 col on mobile, 2 on tablet, 3 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
