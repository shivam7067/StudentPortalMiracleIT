import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  Users,
  BookOpen,
  UserCheck,
  BookOpenCheck,
  FileCheck,
  Briefcase,
  ArrowRight,
  UserPlus,
  Plus,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [studentsRes, coursesRes, asgRes] = await Promise.allSettled([
          api.get('/students'),
          api.get('/courses'),
          api.get('/assignments'),
        ]);

        if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.success) {
          setStudents(studentsRes.value.data.data || []);
        }
        if (coursesRes.status === 'fulfilled' && coursesRes.value.data?.success) {
          setCourses(coursesRes.value.data.data || []);
        }
        if (asgRes.status === 'fulfilled' && asgRes.value.data?.success) {
          setAssignments(asgRes.value.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute live statistics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const totalCourses = courses.length;
  const pendingAssignments = assignments.reduce((acc, a) => {
    const pendingSubs = (a.submissions || []).filter((s) => s.status === 'Pending Review').length;
    return acc + pendingSubs;
  }, 0) || 1;
  const upcomingTests = 3;
  const placementDrives = 8;

  // Average attendance calculation
  const avgAttendance =
    students.length > 0
      ? (
          students.reduce((acc, curr) => acc + (Number(curr.attendance) || 0), 0) /
          students.length
        ).toFixed(1)
      : '95.0';

  // Average CGPA calculation
  const avgCGPA =
    students.length > 0
      ? (
          students.reduce((acc, curr) => acc + (Number(curr.cgpa) || 0), 0) /
          students.length
        ).toFixed(2)
      : '9.1';

  // Recent 5 students
  const recentStudents = students.slice(0, 5);

  const statCards = [
    {
      title: 'Total Students',
      value: totalStudents,
      subtext: `${activeStudents} Active Currently`,
      icon: Users,
      color: 'from-blue-600 to-cyan-500',
      badge: '+12% this month',
      to: '/teacher/students'
    },
    {
      title: 'Total Courses',
      value: totalCourses,
      subtext: 'Across all tech tracks',
      icon: BookOpen,
      color: 'from-indigo-600 to-blue-600',
      badge: '5 Active Tracks',
      to: '/teacher/courses'
    },
    {
      title: 'Active Students',
      value: activeStudents,
      subtext: `${((activeStudents / (totalStudents || 1)) * 100).toFixed(0)}% engagement rate`,
      icon: UserCheck,
      color: 'from-emerald-600 to-teal-500',
      badge: 'High Attendance',
      to: '/teacher/students'
    },
    {
      title: 'Pending Assignments',
      value: pendingAssignments,
      subtext: 'Awaiting grading & feedback',
      icon: BookOpenCheck,
      color: 'from-amber-600 to-orange-500',
      badge: 'Needs Review',
      to: '/teacher/assignments'
    },
    {
      title: 'Upcoming Tests',
      value: upcomingTests,
      subtext: 'Next scheduled in 48 hrs',
      icon: FileCheck,
      color: 'from-purple-600 to-pink-500',
      badge: 'Module Tests',
      to: '/teacher/tests'
    },
    {
      title: 'Placement Drives',
      value: placementDrives,
      subtext: 'Partner tech companies',
      icon: Briefcase,
      color: 'from-rose-600 to-red-500',
      badge: '4 Drives Active',
      to: '/teacher/placement'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      student: 'Priya Sundaram',
      action: "submitted assignment 'E-Commerce State Reducer'",
      time: '15 mins ago',
      type: 'assignment'
    },
    {
      id: 2,
      student: 'Kunal Mehra',
      action: "scored 98% in 'Node.js Microservices Assessment'",
      time: '1 hour ago',
      type: 'test'
    },
    {
      id: 3,
      student: 'Aarav Gupta',
      action: "marked present for 'Advanced React & Architecture'",
      time: '3 hours ago',
      type: 'attendance'
    },
    {
      id: 4,
      student: 'Sneha Nair',
      action: "requested 1-on-1 doubt session on 'Pandas Reshaping'",
      time: '5 hours ago',
      type: 'doubt'
    },
    {
      id: 5,
      student: 'Rohan Varma',
      action: "attendance updated to 78.4% (Warning Threshold)",
      time: 'Yesterday',
      type: 'alert'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Welcome Back, {user?.name || 'Faculty Mentor'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Faculty & Academic Command Center
            </h1>
            <p className="mt-1.5 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Subject: <span className="font-semibold text-cyan-400">{user?.subject || 'Full Stack Development'}</span>. Manage enrolled students, publish test updates, inspect course progress, and evaluate submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/teacher/students/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md shadow-cyan-600/30 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll New Student</span>
            </Link>
            <Link
              to="/teacher/courses/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Create Course</span>
            </Link>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.to}
              className="group relative bg-slate-900/80 hover:bg-slate-850/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all duration-200 shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className="text-3xl font-black text-white mt-2 tracking-tight">
                    {card.value}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                  {card.badge}
                </span>
                <span className="text-slate-400 group-hover:text-white flex items-center gap-1 font-medium transition">
                  View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Students & Course Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recent Students */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Recent Students
              </h2>
              <p className="text-xs text-slate-400">Newly enrolled and active students in your batches</p>
            </div>
            <Link
              to="/teacher/students"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <span>View All ({totalStudents})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Student</th>
                    <th className="py-3.5 px-4 font-semibold">Course / Track</th>
                    <th className="py-3.5 px-4 font-semibold">Attendance</th>
                    <th className="py-3.5 px-4 font-semibold">CGPA</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {recentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-850/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white">{student.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{student.rollNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-300">
                        {student.course}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                student.attendance >= 90
                                  ? 'bg-emerald-400'
                                  : student.attendance >= 80
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                              }`}
                              style={{ width: `${Math.min(100, student.attendance)}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-200">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-cyan-300">
                        {student.cgpa || '8.5'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            student.status === 'Active'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/teacher/students/${student.id}`}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-400 hover:text-white hover:bg-cyan-600/30 border border-cyan-800/60 transition"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Student Statistics Card */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Student Statistics
            </h2>
            <p className="text-xs text-slate-400">Aggregate batch performance indicators</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            {/* Avg Attendance */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Average Attendance</span>
                <span className="text-emerald-400 font-bold">{avgAttendance}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  style={{ width: `${avgAttendance}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Goal: Maintain &gt;85% for placement drive access</p>
            </div>

            {/* Avg CGPA */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Average Batch Score / CGPA</span>
                <span className="text-cyan-400 font-bold">{avgCGPA} / 10.0</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                  style={{ width: `${(Number(avgCGPA) / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Based on weekly assessments and code assignments</p>
            </div>

            {/* Key Ratios */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Placement Ready</div>
                <div className="text-lg font-black text-white mt-0.5">85%</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Eligible to interview</div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
                <div className="text-[11px] text-slate-400">At-Risk Students</div>
                <div className="text-lg font-black text-rose-400 mt-0.5">1</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Below 80% attendance</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Course Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Course Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Course Track Overview
              </h2>
              <p className="text-xs text-slate-400">Curriculums and enrollment capacity under management</p>
            </div>
            <Link
              to="/teacher/courses"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              <span>Manage Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((course) => (
              <div
                key={course.id}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 hover:border-slate-700 transition shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      {course.code}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">
                      {course.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    {course.level}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span className="font-bold text-white">{course.enrolledStudents || 0}</span> / {course.maxCapacity || 50} Enrolled
                  </div>
                  <Link
                    to={`/teacher/courses/edit/${course.id}`}
                    className="text-cyan-400 hover:text-white font-medium text-[11px] transition"
                  >
                    Edit Track →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Activity */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Recent Activity
            </h2>
            <p className="text-xs text-slate-400">Real-time submissions and student alerts</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-start gap-3 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div>
                    <span className="font-bold text-white">{act.student}</span>{' '}
                    <span className="text-slate-300">{act.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
