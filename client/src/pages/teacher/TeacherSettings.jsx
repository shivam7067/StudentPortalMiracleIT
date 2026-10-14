import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  User,
  Mail,
  Phone,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Terminal
} from 'lucide-react';

export default function TeacherSettings() {
  const { user } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [subject, setSubject] = useState(user?.subject || 'Full Stack Development');
  const [toastMsg, setToastMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setToastMsg('Faculty preferences updated successfully!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-cyan-400" />
          Faculty Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your instructor details, assigned subjects, and session credentials.
        </p>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl">
            {user?.name ? user.name.charAt(0) : 'T'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name || 'Faculty Member'}</h2>
            <div className="text-xs text-cyan-400 font-mono mt-0.5">Faculty ID: {user?.id || 'T001'}</div>
            <div className="text-xs text-slate-400 mt-0.5">Experience: {user?.experience || '5 Years'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Faculty Email
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'rahul@institute.com'}
              className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-400 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500 mt-1">Institutional email is managed by administrator</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Assigned Specialization / Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Frontend Prototype • Values update in active session
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>
    </div>
  );
}
