import React, { useState } from 'react';
import { mentorsData } from '../data/dummyData';
import { 
  Users2, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Video,
  Award
} from 'lucide-react';

export default function Mentor() {
  const [bookedSlot, setBookedSlot] = useState(null);

  const handleBook = (mentorName, slot) => {
    setBookedSlot({ mentorName, slot });
    setTimeout(() => setBookedSlot(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">1-on-1 Mentorship & Code Reviews</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Book private office hours, architectural pairing sessions, and career guidance with senior tech leaders.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
          Monthly Quota: <span className="text-emerald-400 font-bold">3 of 4 Sessions Left</span>
        </div>
      </div>

      {bookedSlot && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Successfully booked session with <span className="font-bold text-white">{bookedSlot.mentorName}</span> for <span className="font-bold text-white">{bookedSlot.slot}</span>. Calendar invite dispatched to your student email!
          </span>
        </div>
      )}

      {/* Mentors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mentorsData.map((m) => (
          <div
            key={m.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{m.name}</h3>
                  <p className="text-xs text-indigo-400 font-medium">{m.role}</p>
                  <p className="text-[11px] text-slate-400">{m.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 pb-3 border-b border-slate-800 mb-3">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {m.rating}
                </span>
                <span>•</span>
                <span className="text-slate-400">{m.sessionsTaken} Sessions Done</span>
              </div>

              <div className="text-xs text-slate-300 mb-4">
                <span className="font-semibold text-slate-400 block mb-1">Focus Areas:</span>
                <p>{m.speciality}</p>
              </div>

              {/* Slots */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Available Slots:
                </span>
                {m.availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBook(m.name, slot)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-850 hover:border-indigo-500/50 hover:bg-slate-950 text-xs text-slate-300 transition"
                  >
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {slot}
                    </span>
                    <span className="text-indigo-400 font-semibold text-[11px]">Book Slot</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conducted via Google Meet with Screen Sharing</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
