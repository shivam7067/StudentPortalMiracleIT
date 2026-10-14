import React, { useState } from 'react';
import { projectsData } from '../data/dummyData';
import { 
  FolderGit2, 
  GitBranch, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers,
  Plus
} from 'lucide-react';

export default function Projects() {
  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Capstone Projects & Code Portfolio</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production-grade full stack capstone projects built during the MiracleIT training cycle.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
          Portfolio Score: <span className="text-emerald-400 font-bold">95 / 100</span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projectsData.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  Grade: {proj.score}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    proj.status === 'Completed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : proj.status === 'Under Mentor Review'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                  }`}
                >
                  {proj.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{proj.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">{proj.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {proj.feedback && (
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs mb-4">
                  <span className="text-[11px] font-bold text-indigo-300 block mb-1">Mentor Evaluation:</span>
                  <p className="text-slate-300 italic text-[11px]">"{proj.feedback}"</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <a
                href={proj.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
              </a>

              {proj.liveUrl !== '#' ? (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-slate-400 py-2 px-3">Local Sandbox</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
