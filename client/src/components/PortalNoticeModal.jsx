import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function PortalNoticeModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-orange-500/30 p-6 sm:p-8 shadow-2xl text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Badge */}
        <div className="mb-4">
          <BrandLogo size="md" variant="pill" showSubtitle={true} to="" />
        </div>

        <h3 className="text-2xl font-bold text-white tracking-tight mt-2">
          Miracle IT Student & Faculty Portal
        </h3>

        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          Access the unified institutional portal of <span className="text-orange-400 font-semibold">Miracle IT Career Academy</span> — Central India's No.1 IT Training Academy.
        </p>

        {/* Portal Module Roadmap Preview */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Integrated Features:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Browser Coding IDE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Proctored Online Exams</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>1-on-1 Daily Mentorship</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Top Placement Drives</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="flex-1 py-3 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 via-amber-600 to-blue-600 hover:from-orange-600 hover:to-blue-700 shadow-lg shadow-orange-500/25 transition text-center flex items-center justify-center gap-2"
          >
            <span>Sign In to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition text-center"
          >
            Explore Website
          </button>
        </div>

      </div>
    </div>
  );
}
