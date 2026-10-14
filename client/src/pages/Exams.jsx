import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { examsData as fallbackExams } from '../data/dummyData';
import { 
  FileCheck, 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  X,
  Loader2
} from 'lucide-react';

export default function Exams() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/tests');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setExams(res.data.data);
        } else {
          setExams(fallbackExams);
        }
      } catch (err) {
        console.warn('Could not load live tests, using fallback:', err);
        setExams(fallbackExams);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const upcomingExams = exams.filter(e => e.status === 'Upcoming' || e.status === 'Scheduled');
  const completedExams = exams.filter(e => e.status === 'Completed');

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Tests & Proctored Examinations</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access weekly module assessments, diagnostic tests, and proctored coding exams.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming ({upcomingExams.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'completed'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({completedExams.length})
          </button>
        </div>
      </div>

      {/* Proctoring Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-300">
            All major examinations use the <span className="font-semibold text-white">MiracleIT Secure Proctor Engine</span>. Ensure webcam and microphone permissions are pre-tested before the test window opens.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading exams from server...</p>
        </div>
      ) : (
        /* Exams Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === 'upcoming' ? upcomingExams : completedExams).map((exam) => (
            <div
              key={exam.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    {exam.subject}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      exam.status === 'Upcoming' || exam.status === 'Scheduled'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{exam.title}</h3>
                <p className="text-xs text-slate-400 mb-4">{exam.type}</p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{exam.duration}</span>
                  </div>
                  {exam.scoredMarks !== undefined ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold col-span-2 mt-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Score: {exam.scoredMarks} / {exam.totalMarks} {exam.percentile ? `(${exam.percentile})` : ''}</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 col-span-2 mt-1">
                      Total Marks: <span className="text-white font-mono">{exam.totalMarks}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {exam.status === 'Upcoming' || exam.status === 'Scheduled' ? (
                  <button
                    onClick={() => setSelectedExam(exam)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
                  >
                    <span>Read Exam Instructions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedExam(exam)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
                  >
                    <span>View Grade Report & Answers</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions / Details Modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedExam(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">{selectedExam.title}</h3>
            <p className="text-xs text-indigo-400 mb-4">{selectedExam.subject} • {selectedExam.duration}</p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 mb-6">
              <div className="font-bold text-slate-200">Exam Instructions:</div>
              <p>{selectedExam.instructions || 'Standard institute proctoring rules applied. All answers saved automatically.'}</p>
              <div className="pt-2 border-t border-slate-800 text-slate-400">
                Total Marks: {selectedExam.totalMarks}
              </div>
              {selectedExam.scoredMarks !== undefined && (
                <div className="pt-2 text-emerald-400 font-bold">
                  Your Scored Marks: {selectedExam.scoredMarks} / {selectedExam.totalMarks}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedExam(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
