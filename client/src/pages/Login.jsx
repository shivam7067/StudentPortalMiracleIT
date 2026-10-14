import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Terminal,
  GraduationCap,
  Briefcase,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role, loading } = useAuth();

  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'teacher'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'teacher') {
        navigate('/teacher/dashboard', { replace: true });
      } else if (role === 'student') {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  // Clear errors when toggling role
  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    setErrorMessage('');
    setIdentifier('');
    setPassword('');
  };

  // Quick fill helper for demo ease
  const handleQuickFill = (roleChoice, credId, credPass) => {
    setSelectedRole(roleChoice);
    setIdentifier(credId);
    setPassword(credPass);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validation
    if (!identifier.trim()) {
      setErrorMessage(
        selectedRole === 'teacher'
          ? 'Please enter your Teacher Email address.'
          : 'Please enter your Student ID or Email.'
      );
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const result = await login({
      identifier: identifier.trim(),
      password,
      role: selectedRole,
    });

    if (result.success) {
      // Determine destination
      const fromPath = location.state?.from?.pathname;
      if (fromPath && !fromPath.includes('/login')) {
        navigate(fromPath, { replace: true });
      } else {
        if (result.user.role === 'teacher') {
          navigate('/teacher/dashboard', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      }
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Top Bar / Back to Home */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition shadow-sm backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Institute Logo & Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-5">
            <BrandLogo size="lg" variant="pill" showSubtitle={true} to="/" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Access Portal
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
            Miracle IT Career Academy • Central India's No.1 IT Training Academy
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-8 bg-slate-900/85 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedRole === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedRole === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Teacher</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {selectedRole === 'teacher' ? 'Teacher Email' : 'Student ID or Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  {selectedRole === 'teacher' ? (
                    <Mail className="w-4 h-4 text-slate-400" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <input
                  type={selectedRole === 'teacher' ? 'email' : 'text'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    selectedRole === 'teacher'
                      ? 'e.g. rahul@institute.com'
                      : 'e.g. student@email.com or ST001'
                  }
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] shadow-lg shadow-indigo-600/30 transition disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Login as {selectedRole === 'teacher' ? 'Teacher' : 'Student'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                One-Click Demo Credentials
              </span>
              <span className="text-[10px] text-slate-500">Demo Mode</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {/* Demo Student */}
              <button
                type="button"
                onClick={() => handleQuickFill('student', 'student@email.com', 'student123')}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-left transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    Student
                  </span>
                  <span className="text-slate-300 font-mono text-[11px]">student@email.com</span>
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-indigo-300 font-mono">
                  student123
                </span>
              </button>

              {/* Demo Teacher 1 */}
              <button
                type="button"
                onClick={() => handleQuickFill('teacher', 'rahul@institute.com', 'teacher123')}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-left transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    Teacher
                  </span>
                  <span className="text-slate-300 font-mono text-[11px]">rahul@institute.com</span>
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-cyan-300 font-mono">
                  teacher123
                </span>
              </button>

              {/* Demo Teacher 2 */}
              <button
                type="button"
                onClick={() => handleQuickFill('teacher', 'priya@institute.com', 'teacher456')}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-left transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
                    Teacher
                  </span>
                  <span className="text-slate-300 font-mono text-[11px]">priya@institute.com</span>
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-purple-300 font-mono">
                  teacher456
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Demo security notice */}
        <p className="mt-6 text-center text-xs text-slate-500 max-w-sm mx-auto">
          Frontend Demo Environment • Credentials validate against simulated local repository data.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" />
                Password Reset Assistance
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In this frontend demo prototype, credentials can be filled via the <strong>One-Click Demo Credentials</strong> buttons on the login card:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="font-semibold text-indigo-400">Student:</span> student@email.com / password: <code className="text-slate-200">student123</code>
              </div>
              <div>
                <span className="font-semibold text-cyan-400">Teacher 1:</span> rahul@institute.com / password: <code className="text-slate-200">teacher123</code>
              </div>
              <div>
                <span className="font-semibold text-purple-400">Teacher 2:</span> priya@institute.com / password: <code className="text-slate-200">teacher456</code>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              In production, password reset sends an encrypted verification link to your registered university email address.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
              >
                Got It, Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
