import React, { useState } from 'react';
import { goalsData } from '../data/dummyData';
import { 
  Target, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  TrendingUp,
  X
} from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState(goalsData);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(100);
  const [category, setCategory] = useState('Algorithms');

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal = {
      id: Date.now(),
      title,
      current: 0,
      target: Number(target),
      category,
      deadline: 'Nov 15, 2026',
      completed: false
    };

    setGoals([...goals, newGoal]);
    setTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Milestones & Learning Goals</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track daily practice metrics, capstone deliverables, and placement preparation targets.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Add Goal Modal */}
      {isAdding && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl animate-in fade-in max-w-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-base font-bold text-white">Create Target Milestone</h3>
            <button onClick={() => setIsAdding(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Solve 50 System Design Questions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Number</label>
                <input
                  type="number"
                  required
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                >
                  <option>Algorithms</option>
                  <option>Engineering</option>
                  <option>Placements</option>
                  <option>Discipline</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
              >
                Save Milestone
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((g) => {
          const percent = Math.min(100, Math.round((g.current / g.target) * 100));
          return (
            <div
              key={g.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-indigo-400 px-2.5 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                    {g.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Target: {g.deadline}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-3">{g.title}</h3>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">
                      Progress: {g.current} / {g.target}
                    </span>
                    <span className="font-bold text-indigo-400 font-mono">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 100
                          ? 'bg-emerald-400'
                          : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                {percent >= 100 ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Goal Achieved!</span>
                  </span>
                ) : (
                  <span className="text-slate-400">
                    {g.target - g.current} units remaining to complete
                  </span>
                )}
                <span className="text-indigo-400 font-semibold cursor-pointer hover:underline">
                  Update Progress
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
