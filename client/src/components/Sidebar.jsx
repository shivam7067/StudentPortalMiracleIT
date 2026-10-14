import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Code2,
  FileCheck,
  BookOpenCheck,
  CalendarCheck,
  Clock,
  Award,
  Briefcase,
  Megaphone,
  HelpCircle,
  Users2,
  MessageSquareHeart,
  Trophy,
  Target,
  FolderGit2,
  Contact,
  Terminal,
  ArrowLeft,
  X,
  LogOut,
  BookOpen
} from 'lucide-react';
import { currentStudent } from '../data/dummyData';
import BrandLogo from './BrandLogo';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/student/profile', label: 'Profile', icon: User },
      { to: '/student/id-card', label: 'Digital ID Card', icon: Contact }
    ]
  },
  {
    title: 'Academics & Coding',
    items: [
      { to: '/student/courses', label: 'My Courses', icon: BookOpen, badge: 'Enrolled' },
      { to: '/student/coding-practice', label: 'Coding Practice', icon: Code2, badge: 'Live IDE' },
      { to: '/student/exams', label: 'Tests & Exams', icon: FileCheck },
      { to: '/student/assignments', label: 'Assignments', icon: BookOpenCheck, badge: '1 Due' },
      { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
      { to: '/student/timetable', label: 'Timetable', icon: Clock },
      { to: '/student/projects', label: 'Projects', icon: FolderGit2 },
      { to: '/student/certificates', label: 'Certificates', icon: Award }
    ]
  },
  {
    title: 'Career & Community',
    items: [
      { to: '/student/placement', label: 'Placement Portal', icon: Briefcase, badge: 'Drives' },
      { to: '/student/mentor', label: 'Mentor Section', icon: Users2 },
      { to: '/student/doubts', label: 'Doubt & Query', icon: HelpCircle },
      { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/student/leaderboard', label: 'Leaderboard', icon: Trophy, badge: '#3' },
      { to: '/student/goals', label: 'Goals & Progress', icon: Target },
      { to: '/student/feedback', label: 'Feedback', icon: MessageSquareHeart }
    ]
  }
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const activeStudentName = user?.name || currentStudent.name;
  const activeStudentBatch = user?.batch || currentStudent.batch;
  const activeStudentAvatar = user?.avatar || currentStudent.avatar;

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
          <BrandLogo size="sm" variant="pill" showSubtitle={false} to="/student/dashboard" />

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

        {/* Current Student Profile Snapshot */}
        <div className="p-4 mx-3 mt-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
          <img
            src={activeStudentAvatar}
            alt={activeStudentName}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/40 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{activeStudentName}</div>
            <div className="text-[10px] text-slate-400 truncate">{activeStudentBatch}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">Student Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Groups (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-sm">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => onClose && onClose()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Actions: Logout & Back to Website */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/80 border border-rose-800/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Student</span>
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
