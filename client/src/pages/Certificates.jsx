import React, { useState } from 'react';
import { certificatesData, currentStudent } from '../data/dummyData';
import { 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Share2, 
  Sparkles, 
  Terminal,
  X
} from 'lucide-react';

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (url) => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Verified Academic Credentials</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Industry recognized and cryptographically verifiable certificates earned at MiracleIT.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
          Verified Credentials: <span className="text-indigo-400 font-bold">{certificatesData.length}</span>
        </div>
      </div>

      {/* Certificates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificatesData.map((cert) => (
          <div
            key={cert.id}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Award className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-semibold">{cert.id}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  {cert.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{cert.title}</h3>
              
              <div className="text-xs text-slate-400 space-y-1 mb-4">
                <div>Issued to: <span className="text-slate-200 font-semibold">{cert.issuedTo}</span></div>
                <div>Issue Date: <span className="text-slate-200">{cert.issueDate}</span></div>
                <div>Standing: <span className="text-emerald-400 font-semibold">{cert.grade}</span></div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {cert.skills.map((skill, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCert(cert)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
              >
                <span>View Certificate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCopyLink(cert.verificationUrl)}
                className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
                title="Copy verification link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-10 shadow-2xl text-center overflow-hidden">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Inner Card Styled Like Official Credential */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/30 relative">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Terminal className="w-6 h-6 text-indigo-400" />
                <span className="text-xl font-extrabold text-white tracking-wider">
                  MIRACLE<span className="text-indigo-400">IT</span> INSTITUTE
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-6">
                Certificate of Technical Excellence
              </p>

              <p className="text-xs text-slate-400 italic">This is to certify that</p>
              <h2 className="text-2xl font-bold text-white my-2">{selectedCert.issuedTo}</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully completed all laboratory practicums, proctored examinations, and capstone software requirements for:
              </p>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 mt-2">
                {selectedCert.title}
              </h3>
              <p className="text-xs font-semibold text-emerald-400 mt-1">Grade: {selectedCert.grade}</p>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="text-left font-mono">
                  <div>ID: {selectedCert.id}</div>
                  <div>Issued: {selectedCert.issueDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 font-bold uppercase tracking-wider">★ VERIFIED SEAL ★</div>
                  <div className="text-slate-400 text-[10px]">Academic Board of MiracleIT</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleCopyLink(selectedCert.verificationUrl)}
                className="py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition"
              >
                {copied ? 'Verification Link Copied!' : 'Copy Verification URL'}
              </button>
              <button
                onClick={() => setSelectedCert(null)}
                className="py-2.5 px-5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
