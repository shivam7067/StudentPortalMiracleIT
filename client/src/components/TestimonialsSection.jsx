import React from 'react';
import TestimonialCard from './TestimonialCard';
import { testimonialsData } from '../data/portalData';
import { MessageSquareHeart } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-slate-950/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-xs font-semibold text-indigo-300 mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5 text-indigo-400" />
            <span>Alumni Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Student{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Success Stories
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Hear from MiracleIT alumni who upgraded their technical craft and landed high-growth software engineering careers.
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400">
            * Representative alumni testimonials from recent MiracleIT graduating batches.
          </p>
        </div>

      </div>
    </section>
  );
}
