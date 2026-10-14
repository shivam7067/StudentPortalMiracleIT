import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  Bell, 
  Flame, 
  CheckCircle2, 
  ChevronRight,
  LogOut 
} from 'lucide-react';
import { currentStudent } from '../data/dummyData';

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const activeStudentName = user?.name || currentStudent.name;
  const activeStudentAvatar = user?.avatar || currentStudent.avatar;
  const activeStudentRoll = user?.rollNo || currentStudent.rollNo;
  const activeStudentBatch = user?.batch || currentStudent.batch;

  // Extract clean page title from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1] || 'dashboard';
  const formattedTitle = lastPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area (offset by sidebar width on desktop lg:ml-72) */}
      <div className="lg:ml-72 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
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
              <span className="text-slate-400 hidden sm:inline">Student Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <h1 className="font-bold text-white tracking-tight">{formattedTitle}</h1>
            </div>
          </div>

          {/* Right: Quick Metrics, Notifications & Profile Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Streak Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{currentStudent.stats.streak} Days Streak</span>
            </div>

            {/* Attendance Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user?.attendance !== undefined ? user.attendance : currentStudent.stats.attendance}% Attendance</span>
            </div>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/90 border border-slate-800 relative transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    <span
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-indigo-400 font-semibold cursor-pointer"
                    >
                      Close
                    </span>
                  </div>
                  <div className="space-y-2.5 mt-3 text-xs">
                    <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      <div className="font-semibold text-slate-200">Assignment 1 Due Tomorrow</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">JWT Auth Microservice • 11:59 PM</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      <div className="font-semibold text-slate-200">CloudScale Drive Round 2</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">System Design schedule released</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Student Profile Quick Trigger & Logout */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <Link
                to="/student/profile"
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition group"
              >
                <img
                  src={activeStudentAvatar}
                  alt={activeStudentName}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-400/50"
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-white">
                  {activeStudentName.split(' ')[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Logout Student"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/90 border border-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </header>

        {/* Page Body Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Portal Footer */}
        <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400">
          MiracleIT Student Portal Engine • Roll: {activeStudentRoll} • Batch: {activeStudentBatch}
        </footer>

      </div>
    </div>
  );
}
