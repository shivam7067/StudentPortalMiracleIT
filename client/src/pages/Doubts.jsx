import React, { useState } from 'react';
import { doubtsThreads } from '../data/dummyData';
import { 
  HelpCircle, 
  MessageSquare, 
  UserCheck, 
  Send, 
  CheckCircle2, 
  Clock, 
  Plus,
  X
} from 'lucide-react';

export default function Doubts() {
  const [threads, setThreads] = useState(doubtsThreads);
  const [isAsking, setIsAsking] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newSubject, setNewSubject] = useState('React');

  const handleAskDoubt = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newThread = {
      id: `dbt-${Date.now()}`,
      question: newQuestion,
      subject: newSubject,
      askedBy: "Priya Sundaram",
      date: "Just now",
      status: "Open",
      replies: []
    };

    setThreads([newThread, ...threads]);
    setNewQuestion('');
    setIsAsking(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Doubt Clearance & Query Forum</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Get your technical doubts, compiler errors, and architectural questions answered by teaching assistants and mentors.
          </p>
        </div>

        <button
          onClick={() => setIsAsking(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ask New Doubt</span>
        </button>
      </div>

      {/* Ask Doubt Modal */}
      {isAsking && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-base font-bold text-white">Post Technical Doubt to Mentors</h3>
            <button
              onClick={() => setIsAsking(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAskDoubt} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Technology</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200"
              >
                <option>React Internals</option>
                <option>Node.js Runtime</option>
                <option>MongoDB & SQL</option>
                <option>Data Structures & Algorithms</option>
                <option>System Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Question / Code Issue</label>
              <textarea
                rows={3}
                required
                placeholder="Describe what error you are seeing or concept you need help with..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
              >
                Submit Doubt
              </button>
              <button
                type="button"
                onClick={() => setIsAsking(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Threads List */}
      <div className="space-y-4">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-indigo-400 px-2.5 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                {thread.subject}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{thread.date}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    thread.status === 'Answered'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {thread.status}
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-4">{thread.question}</h3>

            {/* Replies */}
            {thread.replies.length > 0 ? (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                {thread.replies.map((reply, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                        {reply.author}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded">
                        Mentor Solution
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed mt-2">{reply.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pt-2 text-xs text-slate-400 italic">
                A teaching assistant has been assigned and will reply shortly.
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
