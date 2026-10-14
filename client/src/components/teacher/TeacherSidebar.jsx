import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserPlus,
  Megaphone,
  BookOpenCheck,
  CalendarCheck,
  FileCheck,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  Terminal,
  ArrowLeft,
  X,
  UserCheck
} from 'lucide-react';
import BrandLogo from '../BrandLogo';

const teacherNavItems = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/teacher/students', label: 'Students', icon: Users, badge: 'Manage' },
  { to: '/teacher/courses', label: 'Courses', icon: BookOpen },
  { to: '/teacher/enrollment', label: 'Course Enrollment', icon: UserCheck, badge: 'Enroll' },
  { to: '/teacher/students/add', label: 'Add Student', icon: UserPlus },
  { to: '/teacher/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/teacher/assignments', label: 'Assignments', icon: BookOpenCheck },
  { to: '/teacher/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/teacher/tests', label: 'Tests & Exams', icon: FileCheck },
  { to: '/teacher/placement', label: 'Placement', icon: Briefcase },
  { to: '/teacher/reports', label: 'Reports', icon: BarChart3 },
  { to: '/teacher/settings', label: 'Settings', icon: Settings },
];

export default function TeacherSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950/95 border-r border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <BrandLogo size="sm" variant="pill" showSubtitle={false} to="/teacher/dashboard" />

          {/* Mobile close button */}

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Teacher Profile Snapshot */}
        <div className="p-4 mx-3 mt-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
            {user?.name ? user.name.charAt(0) : 'T'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{user?.name || 'Faculty Member'}</div>
            <div className="text-[10px] text-cyan-400 font-medium truncate">{user?.subject || 'Instructor'}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">Faculty Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-sm">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Teacher Menu
          </div>
          {teacherNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/teacher/dashboard'}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions: Logout & Back to Home */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/80 border border-rose-800/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Faculty</span>
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Public Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
