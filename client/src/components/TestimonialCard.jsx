import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="relative group p-6 sm:p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-black/40 flex flex-col justify-between">
      
      {/* Decorative quote icon */}
      <div className="absolute top-6 right-6 text-slate-800 group-hover:text-indigo-900/40 transition-colors pointer-events-none">
        <Quote className="w-10 h-10 rotate-180" />
      </div>

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Content */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic relative z-10">
          "{testimonial.content}"
        </p>
      </div>

      {/* Student Profile Info */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center gap-3.5">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/40"
        />
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-white">{testimonial.name}</h4>
            <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-xs text-indigo-300 font-medium">{testimonial.role}</p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{testimonial.placedAt}</p>
        </div>
      </div>

    </div>
  );
}
