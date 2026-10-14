import React, { useState } from 'react';
import { timetableSchedule } from '../data/dummyData';
import { 
  Clock, 
  Calendar, 
  Video, 
  MapPin, 
  User, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function Timetable() {
  const [selectedDay, setSelectedDay] = useState('All');
  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredSchedule = timetableSchedule.filter(item => {
    if (selectedDay === 'All') return true;
    return item.day === selectedDay;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Academic Timetable & Lab Slots</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Weekly live lecture schedules, mentor hours, and collaborative coding labs.
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchedule.map((slot, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                  {slot.day} • {slot.time}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    slot.type === 'Lecture'
                      ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                      : slot.type === 'Hands-on Lab'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  }`}
                >
                  {slot.type}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{slot.subject}</h3>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{slot.mentor}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{slot.room}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Class Room Access:</span>
              <a
                href="https://meet.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Virtual Room</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
