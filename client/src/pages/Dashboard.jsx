import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  currentStudent, 
  dashboardOverview, 
  assignmentsData, 
  examsData 
} from '../data/dummyData';
import { 
  CheckCircle2, 
  Clock, 
  Code2, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Briefcase, 
  FileCode2, 
  Video, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [liveAssignments, setLiveAssignments] = useState([]);
  const [liveAnnouncements, setLiveAnnouncements] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [asgRes, annRes, attRes] = await Promise.allSettled([
          api.get('/assignments'),
          api.get('/announcements'),
          api.get('/attendance/my-summary'),
        ]);

        if (asgRes.status === 'fulfilled' && asgRes.value.data?.success) {
          setLiveAssignments(asgRes.value.data.data || []);
        }
        if (annRes.status === 'fulfilled' && annRes.value.data?.success) {
          setLiveAnnouncements(annRes.value.data.data || []);
        }
        if (attRes.status === 'fulfilled' && attRes.value.data?.success) {
          setAttendanceSummary(attRes.value.data.data || null);
        }
      } catch (err) {
        console.warn('Dashboard live data fetch:', err);
      }
    };

    fetchStudentData();
  }, []);

  // Compute true calculated metrics without fake defaults (Requirement 9)
  const realAttendance =
    attendanceSummary?.overallPercentage !== undefined
      ? attendanceSummary.overallPercentage
      : user?.attendance !== undefined
      ? user.attendance
      : 0;

  const realAssignmentsSubmitted =
    user?.assignmentsSubmitted !== undefined
      ? user.assignmentsSubmitted
      : liveAssignments.filter((a) => a.mySubmission).length;

  const realAssignmentsTotal =
    user?.assignmentsTotal !== undefined
      ? user.assignmentsTotal
      : liveAssignments.length || 0;

  const realAvgScore = user?.avgScore !== undefined ? user.avgScore : 0;

  // Merge active authenticated student with details
  const activeStudent = {
    ...currentStudent,
    name: user?.name || currentStudent.name,
    course: user?.course || currentStudent.course,
    batch: user?.batch || currentStudent.batch,
    rollNo: user?.rollNo || currentStudent.rollNo,
    email: user?.email || currentStudent.email,
    attendance: realAttendance,
    placementStatus: user?.placementStatus || 'Eligible',
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/60 text-xs font-semibold text-indigo-300 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Academic Sprint Active • Week 12</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {activeStudent.name} 👋
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
              You are enrolled in <span className="text-indigo-400 font-semibold">{activeStudent.course}</span> ({activeStudent.batch}). You have {realAssignmentsTotal - realAssignmentsSubmitted} assignments pending and {liveAnnouncements.length || 3} institutional alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/coding-practice"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
            >
              <Code2 className="w-4 h-4" />
              <span>Open Coding IDE</span>
            </Link>
            <Link
              to="/student/timetable"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Today's Schedule</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Attendance */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Session Attendance</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-2">
            {realAttendance}%
          </div>
          <div className="text-xs text-emerald-400 font-medium mt-1">
            Status: {activeStudent.placementStatus}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(100, realAttendance)}%` }} />
          </div>
        </div>

        {/* DSA Problems */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">DSA Solved</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Code2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-2">
            {currentStudent.stats.dsaSolved} / 350
          </div>
          <div className="text-xs text-indigo-300 font-medium mt-1">
            52% of curriculum targets cleared
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '52%' }} />
          </div>
        </div>

        {/* Assignments */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Assignments</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <FileCode2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-2">
            {realAssignmentsSubmitted} / {realAssignmentsTotal}
          </div>
          <div className="text-xs text-cyan-300 font-medium mt-1">
            Avg Score: {realAvgScore}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${Math.min(100, (realAssignmentsSubmitted / (realAssignmentsTotal || 1)) * 100)}%` }} />
          </div>
        </div>

        {/* Batch Ranking */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Batch Leaderboard</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Trophy className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-2">
            #{currentStudent.stats.rank}{' '}
            <span className="text-sm font-normal text-slate-400">({currentStudent.stats.totalPoints} pts)</span>
          </div>
          <div className="text-xs text-amber-400 font-medium mt-1">
            Top 2% of MiracleIT MERN-02
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Today's Classes & Recent Submissions */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Today's Classes */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Today's Live Classes & Sessions</h3>
              </div>
              <Link to="/student/timetable" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                Full Timetable →
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              {dashboardOverview.weeklySchedule.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.class}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Mentor: {item.mentor} • <span className="text-slate-300 font-mono">{item.time}</span>
                      </p>
                    </div>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition self-start sm:self-auto"
                  >
                    <span>Join Class</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions & Activity Log */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Recent Submissions & Activity</h3>
              </div>
              <span className="text-xs text-slate-400">Last 7 Days</span>
            </div>

            <div className="divide-y divide-slate-800 mt-2">
              {dashboardOverview.recentActivities.map((act) => (
                <div key={act.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-slate-200">{act.text}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{act.time}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800 shrink-0">
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Quick Deadlines & Drive Highlights */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Urgent Deadlines Widget */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">Upcoming Deadlines</h3>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                  <span>Assignment 1</span>
                  <span>Due Tomorrow</span>
                </div>
                <p className="text-xs text-slate-200 font-bold mt-1">
                  Authentication Microservice with JWT & Refresh Tokens
                </p>
                <Link
                  to="/student/assignments"
                  className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                >
                  <span>Submit Solution</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/40">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                  <span>Mid-Term Exam</span>
                  <span>Oct 12</span>
                </div>
                <p className="text-xs text-slate-200 font-bold mt-1">
                  MERN Stack Sprint 3 Mid-Term Assessment
                </p>
                <Link
                  to="/student/exams"
                  className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                >
                  <span>View Syllabus & Instructions</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Active Placement Drive Highlight */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Placement Shortlist</h3>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Round 2
              </span>
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-bold text-white">CloudScale Technologies</h4>
              <p className="text-xs text-slate-400 mt-0.5">Role: Full Stack Engineer (MERN)</p>
              <div className="text-xs text-emerald-400 font-mono mt-1 font-semibold">CTC: 8.5 - 12 LPA</div>

              <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                System Design Round scheduled for <span className="font-semibold text-white">Oct 18, 2026</span>.
              </div>

              <Link
                to="/student/placement"
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition"
              >
                <span>Open Placement Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
