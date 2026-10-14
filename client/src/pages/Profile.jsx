import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { currentStudent } from '../data/dummyData';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Globe, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  Sparkles, 
  GitBranch,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [bio, setBio] = useState(user?.bio || currentStudent.bio);
  const [phone, setPhone] = useState(user?.phone || currentStudent.phone);
  const [github, setGithub] = useState(user?.github || currentStudent.github);
  const [linkedin, setLinkedin] = useState(user?.linkedin || currentStudent.linkedin);
  const [address, setAddress] = useState(user?.address || currentStudent.address);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/students/profile/me');
        if (res.data?.success && res.data.data) {
          const data = res.data.data;
          setProfileData(data);
          if (data.bio) setBio(data.bio);
          if (data.phone) setPhone(data.phone);
          if (data.github) setGithub(data.github);
          if (data.linkedin) setLinkedin(data.linkedin);
          if (data.address) setAddress(data.address);
        }
      } catch (err) {
        console.warn('Could not fetch student profile from server:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    try {
      await api.put('/students/profile/me', {
        bio,
        phone,
        github,
        linkedin,
        address,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const activeStudent = {
    ...currentStudent,
    ...(profileData || user || {}),
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Student Identity Card */}
      <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <img
              src={activeStudent.avatar || currentStudent.avatar}
              alt={activeStudent.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-lg"
            />
            <span className="absolute -bottom-1.5 -right-1.5 p-1 rounded-lg bg-emerald-500 text-white shadow">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeStudent.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                Verified Scholar
              </span>
            </div>

            <p className="text-sm text-indigo-400 font-mono mt-1">
              Roll: {activeStudent.rollNo || currentStudent.rollNo} • Batch: {activeStudent.batch || currentStudent.batch}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {bio || activeStudent.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeStudent.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{address || activeStudent.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enrolled: {activeStudent.enrollmentDate || currentStudent.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Skills Proficiency & Profile Details Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Skills Radar & Academic Record */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Skill Radar Meters */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Verified Skill Matrix</h3>
              </div>
              <span className="text-xs text-slate-400">Evaluated</span>
            </div>

            <div className="mt-4 space-y-3.5">
              {currentStudent.skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-200">{skill.name}</span>
                    <span className="text-indigo-400 font-mono">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Stats Box */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              Institute Standing
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Track:</span>
              <span className="text-white font-mono font-bold">{activeStudent.course}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Attendance:</span>
              <span className="text-emerald-400 font-mono font-bold">{activeStudent.attendance}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Cumulative GPA:</span>
              <span className="text-emerald-400 font-mono font-bold">{activeStudent.cgpa || 9.2} / 10.0</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status:</span>
              <span className="text-cyan-400 font-mono font-bold">{activeStudent.status}</span>
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Edit Profile Form */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-white pb-4 border-b border-slate-800">
              Personal & Professional Profile Settings
            </h3>

            {isSaved && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name (Locked by Institute)
                </label>
                <input
                  type="text"
                  disabled
                  value={activeStudent.name}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-sm cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={activeStudent.email}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
