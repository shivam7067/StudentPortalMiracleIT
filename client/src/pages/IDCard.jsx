import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { currentStudent as fallbackStudent } from '../data/dummyData';
import { 
  Contact, 
  Terminal, 
  QrCode, 
  Download, 
  Printer, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function IDCard() {
  const { user } = useAuth();
  const currentStudent = {
    ...fallbackStudent,
    ...(user || {}),
    name: user?.name || fallbackStudent.name,
    rollNo: user?.rollNo || fallbackStudent.rollNo,
    course: user?.course || fallbackStudent.course,
    batch: user?.batch || fallbackStudent.batch,
    email: user?.email || fallbackStudent.email,
    avatar: user?.avatar || fallbackStudent.avatar,
    phone: user?.phone || fallbackStudent.phone,
    joinDate: user?.joinDate || fallbackStudent.joinDate,
    validTill: user?.validTill || fallbackStudent.validTill,
    bloodGroup: user?.bloodGroup || fallbackStudent.bloodGroup
  };
  const [downloadToast, setDownloadToast] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Contact className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Digital Student Identity Card</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official QR-enabled digital identity card for MiracleIT campus access, lab check-ins, and hackathons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Digital Pass</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {downloadToast && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in max-w-md mx-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Digital ID Card generated and saved to your downloads!</span>
        </div>
      )}

      {/* Main Digital ID Card Display */}
      <div className="max-w-md mx-auto pt-4">
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 border-2 border-indigo-500/40 p-6 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Hologram Gradient Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500" />
          
          {/* Institute Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <BrandLogo size="sm" variant="pill" showSubtitle={true} to="" />


            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[10px] font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified Scholar</span>
            </div>
          </div>

          {/* Student Profile Body */}
          <div className="my-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-24 h-28 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400">
                ACTIVE
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <h4 className="text-lg font-bold text-white">{currentStudent.name}</h4>
              <p className="text-xs font-semibold text-indigo-400 font-mono">
                ID: {currentStudent.rollNo}
              </p>
              <p className="text-xs text-slate-300 font-medium">{currentStudent.course}</p>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Batch: {currentStudent.batch}
              </div>
            </div>
          </div>

          {/* Card Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 mb-5">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Issue Date</span>
              <span className="text-white font-mono font-medium">{currentStudent.joinDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Valid Until</span>
              <span className="text-white font-mono font-medium">{currentStudent.validTill}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Blood Group</span>
              <span className="text-rose-400 font-mono font-bold">{currentStudent.bloodGroup}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Contact No</span>
              <span className="text-slate-300 font-mono">{currentStudent.phone}</span>
            </div>
          </div>

          {/* QR Code & Barcode Section */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="text-left font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Digital Auth Pass</div>
              <div className="text-xs text-indigo-300 font-bold tracking-wider mt-0.5">
                MIT-HASH-2026-X89
              </div>
            </div>

            {/* Simulated QR Code Box */}
            <div className="p-1.5 rounded-xl bg-white text-slate-950 shadow-md">
              <QrCode className="w-10 h-10" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[9px] text-slate-400 tracking-wider">
              MiracleIT Student Portal • Secure NFC & QR Access
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
