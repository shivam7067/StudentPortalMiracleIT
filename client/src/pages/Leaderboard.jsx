import React, { useState } from 'react';
import { leaderboardData } from '../data/dummyData';
import { 
  Trophy, 
  Flame, 
  Code2, 
  Award, 
  Crown, 
  Sparkles,
  Medal
} from 'lucide-react';

export default function Leaderboard() {
  const [filter, setFilter] = useState('batch');

  const topThree = leaderboardData.slice(0, 3);
  // Re-order for podium display: [2nd (Silver), 1st (Gold), 3rd (Bronze)]
  const podium = [topThree[1], topThree[0], topThree[2]];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Batch & Institute Leaderboard</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Weekly coding streaks, assessment scores, and speed challenge rankings.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('batch')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'batch'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Batch (MERN-02)
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Batches
          </button>
        </div>
      </div>

      {/* Top 3 Podium Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 pb-2 items-end max-w-4xl mx-auto">
        
        {/* Silver - Rank 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 text-center relative shadow-xl order-2 sm:order-1">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-300 text-slate-950 text-[10px] font-extrabold uppercase">
            #2 Silver
          </div>
          <img
            src={podium[0].avatar}
            alt={podium[0].name}
            className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-slate-400 mb-2 mt-2"
          />
          <h3 className="text-sm font-bold text-white">{podium[0].name}</h3>
          <p className="text-xs text-indigo-400 font-mono font-bold mt-0.5">{podium[0].points} pts</p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-medium mt-1">
            <Flame className="w-3 h-3 fill-amber-400" />
            <span>{podium[0].streak} Days</span>
          </div>
        </div>

        {/* Gold - Rank 1 (Taller) */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-amber-400/80 text-center relative shadow-2xl order-1 sm:order-2 sm:-translate-y-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-black uppercase flex items-center gap-1 shadow-lg">
            <Crown className="w-3.5 h-3.5" />
            <span>#1 Champion</span>
          </div>
          <img
            src={podium[1].avatar}
            alt={podium[1].name}
            className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-amber-400 mb-3 mt-2 shadow-xl"
          />
          <h3 className="text-base font-extrabold text-white">{podium[1].name}</h3>
          <p className="text-sm text-amber-300 font-mono font-bold mt-0.5">{podium[1].points} pts</p>
          <div className="flex items-center justify-center gap-1 text-xs text-amber-400 font-semibold mt-1">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{podium[1].streak} Days Streak</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-2">{podium[1].problems} Problems Solved</span>
        </div>

        {/* Bronze - Rank 3 (Current Student Priya) */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-800/80 text-center relative shadow-xl order-3 sm:order-3">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-extrabold uppercase">
            #3 Bronze (You)
          </div>
          <img
            src={podium[2].avatar}
            alt={podium[2].name}
            className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-amber-700 mb-2 mt-2"
          />
          <h3 className="text-sm font-bold text-white">{podium[2].name}</h3>
          <p className="text-xs text-indigo-400 font-mono font-bold mt-0.5">{podium[2].points} pts</p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-medium mt-1">
            <Flame className="w-3 h-3 fill-amber-400" />
            <span>{podium[2].streak} Days</span>
          </div>
        </div>

      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Problems</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {leaderboardData.map((user) => (
                <tr
                  key={user.rank}
                  className={`transition-colors ${
                    user.isCurrentUser
                      ? 'bg-indigo-950/40 border-l-4 border-l-indigo-500 font-semibold'
                      : 'hover:bg-slate-850/50'
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold">
                    {user.rank === 1 ? '🥇 #1' : user.rank === 2 ? '🥈 #2' : user.rank === 3 ? '🥉 #3' : `#${user.rank}`}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="text-white font-medium flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.isCurrentUser && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500 text-white font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">{user.batch}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">{user.problems} solved</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{user.streak} Days</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-400">
                    {user.points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
