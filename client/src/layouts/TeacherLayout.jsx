import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import TeacherSidebar from '../components/teacher/TeacherSidebar';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Bell,
  ChevronRight,
  UserPlus,
  Plus,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function TeacherLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Extract clean title
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1] || 'dashboard';
  const formattedTitle = lastPart
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-white">
      {/* Teacher Sidebar */}
      <TeacherSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area (offset by sidebar width on lg:ml-72) */}
      <div className="lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden border border-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-cyan-400 font-semibold hidden sm:inline">Faculty Console</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
              <h1 className="font-bold text-white tracking-tight">{formattedTitle}</h1>
            </div>
          </div>

          {/* Right: Actions, Badges & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Quick Add Student Button */}
            <Link
              to="/teacher/students/add"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-sm shadow-cyan-600/30 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </Link>

            {/* Quick Add Course Button */}
            <Link
              to="/teacher/courses/add"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>New Course</span>
            </Link>

            {/* Role Verified Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instructor ID: {user?.id || 'T001'}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/90 border border-slate-800 relative transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Faculty Alerts
                    </span>
                    <span
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-cyan-400 font-semibold cursor-pointer"
                    >
                      Close
                    </span>
                  </div>
                  <div className="space-y-2.5 mt-3 text-xs">
                    <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      <div className="font-semibold text-slate-200">5 New Assignment Submissions</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        MERN Stack Batch 2 • Awaiting review
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      <div className="font-semibold text-slate-200">Weekly Attendance Due</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Verify student attendance logs before 6 PM
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Teacher Profile / Logout trigger */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <Link
                to="/teacher/settings"
                className="flex items-center gap-2 p-1 pr-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  {user?.name ? user.name.charAt(0) : 'T'}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-white">
                  {user?.name ? user.name.split(' ')[0] : 'Teacher'}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/90 border border-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
          MiracleIT Faculty & Academic Management System • Logged in as {user?.name || 'Faculty Member'} ({user?.email})
        </footer>
      </div>
    </div>
  );
}
