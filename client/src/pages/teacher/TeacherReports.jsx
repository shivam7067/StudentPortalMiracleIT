import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Download,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { getStoredStudents, getStoredCourses } from '../../utils/storage';

export default function TeacherReports() {
  const students = getStoredStudents();
  const courses = getStoredCourses();

  const avgAttendance = (
    students.reduce((acc, curr) => acc + (Number(curr.attendance) || 0), 0) /
    (students.length || 1)
  ).toFixed(1);

  const avgCGPA = (
    students.reduce((acc, curr) => acc + (Number(curr.cgpa) || 0), 0) /
    (students.length || 1)
  ).toFixed(2);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Cohort Analytics & Academic Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated metrics on syllabus milestones, attendance compliance, and student outcome indices.
          </p>
        </div>

        <button
          onClick={() => alert('Report generated and ready for print/export.')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="text-xs text-slate-400">Total Enrolled</div>
          <div className="text-2xl font-black text-white mt-1">{students.length}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Across all tracks</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="text-xs text-slate-400">Batch Attendance</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{avgAttendance}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">+2.4% vs last month</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="text-xs text-slate-400">Average CGPA</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">{avgCGPA} / 10</div>
          <div className="text-[10px] text-slate-400 mt-0.5">High academic index</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="text-xs text-slate-400">Active Tech Tracks</div>
          <div className="text-2xl font-black text-purple-400 mt-1">{courses.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Under faculty review</div>
        </div>
      </div>

      {/* Course Breakdown Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Course Cohort Enrollment Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Course Title</th>
                <th className="py-3 px-4 font-semibold">Track Code</th>
                <th className="py-3 px-4 font-semibold">Lead Instructor</th>
                <th className="py-3 px-4 font-semibold">Enrollment</th>
                <th className="py-3 px-4 font-semibold">Capacity Utilized</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {courses.map((course) => {
                const util = (
                  ((course.enrolledStudents || 0) / (course.maxCapacity || 50)) *
                  100
                ).toFixed(0);
                return (
                  <tr key={course.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 px-4 font-bold text-white">{course.title}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{course.code}</td>
                    <td className="py-3 px-4 text-slate-300">{course.instructor}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {course.enrolledStudents || 0} Students
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-400 h-full rounded-full"
                            style={{ width: `${util}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-300">{util}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
