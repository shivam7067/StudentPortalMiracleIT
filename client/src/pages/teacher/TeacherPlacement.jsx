import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Briefcase,
  Building2,
  MapPin,
  Users,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Award,
  Loader2,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Clock,
  Check,
  AlertCircle,
  Eye,
  Filter,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Sparkles,
  DollarSign
} from 'lucide-react';

export default function TeacherPlacement() {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active view: 'drives' | 'applications'
  const [activeTab, setActiveTab] = useState('drives');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMsg, setToastMsg] = useState('');

  // Drive Create / Edit Modal State
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [driveForm, setDriveForm] = useState({
    company: '',
    role: '',
    ctc: '10 - 14 LPA',
    location: 'Bengaluru / Hybrid',
    workMode: 'Hybrid',
    jobType: 'Full-Time',
    eligibility: 'Attendance >= 80% & CGPA >= 7.0',
    minAttendance: 80,
    minCgpa: 7.0,
    vacancies: 5,
    deadline: 'Oct 30, 2026',
    driveDate: 'Nov 10, 2026',
    status: 'Active',
    roundsInput: 'Resume Screen, DSA Coding Assessment, System Architecture, HR Culture Fit',
    description: '',
    requirementsInput: 'Strong JavaScript / TypeScript foundations, React & Node.js practical experience, REST APIs and MongoDB',
    websiteUrl: '',
  });
  const [isSavingDrive, setIsSavingDrive] = useState(false);

  // Delete Drive Modal State
  const [deleteDriveModal, setDeleteDriveModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drive Applicants Modal (View all applicants of a specific drive)
  const [selectedDriveForApplicants, setSelectedDriveForApplicants] = useState(null);

  // Update Application Status Modal
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Shortlisted');
  const [newInterviewDate, setNewInterviewDate] = useState('Oct 28, 2026 at 2:00 PM');
  const [newNotes, setNewNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [placementsRes, studentsRes] = await Promise.allSettled([
        api.get('/placements'),
        api.get('/students'),
      ]);

      if (placementsRes.status === 'fulfilled' && placementsRes.value.data?.success) {
        setDrives(placementsRes.value.data.data || []);
        setApplications(placementsRes.value.data.applications || []);
      }

      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.success) {
        setStudents(studentsRes.value.data.data || []);
      }
    } catch (err) {
      console.error('Error loading placement data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Live Metrics
  const totalDrivesCount = drives.length;
  const activeDrivesCount = drives.filter((d) => d.status === 'Active').length;
  const totalApplicationsCount = applications.length;
  const selectedCount = applications.filter((a) => a.status === 'Selected').length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const eligibleCount = students.filter(
    (s) => (Number(s.attendance) || 0) >= 80 && (Number(s.cgpa) || 0) >= 7.0
  ).length;

  // Filter Drives
  const filteredDrives = drives.filter((d) => {
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      d.company.toLowerCase().includes(q) ||
      d.role.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q) ||
      (d.ctc && d.ctc.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // Filter Applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const studentName = app.student?.name || '';
    const studentRoll = app.student?.rollNo || '';
    const company = app.company || '';
    const role = app.role || '';

    const matchesSearch =
      !q ||
      studentName.toLowerCase().includes(q) ||
      studentRoll.toLowerCase().includes(q) ||
      company.toLowerCase().includes(q) ||
      role.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // Open Create Drive Modal
  const handleOpenCreateDrive = () => {
    setEditingDrive(null);
    setDriveForm({
      company: '',
      role: '',
      ctc: '10 - 14 LPA',
      location: 'Bengaluru / Hybrid',
      workMode: 'Hybrid',
      jobType: 'Full-Time',
      eligibility: 'Attendance >= 80% & CGPA >= 7.0',
      minAttendance: 80,
      minCgpa: 7.0,
      vacancies: 5,
      deadline: 'Oct 30, 2026',
      driveDate: 'Nov 10, 2026',
      status: 'Active',
      roundsInput: 'Resume Screen, DSA Coding Assessment, System Architecture, HR Culture Fit',
      description: '',
      requirementsInput: 'Strong JavaScript / TypeScript, React 19, Node.js microservices, MongoDB query tuning',
      websiteUrl: '',
    });
    setShowDriveModal(true);
  };

  // Open Edit Drive Modal
  const handleOpenEditDrive = (drive) => {
    setEditingDrive(drive);
    setDriveForm({
      company: drive.company || '',
      role: drive.role || '',
      ctc: drive.ctc || '10 - 14 LPA',
      location: drive.location || 'Bengaluru / Hybrid',
      workMode: drive.workMode || 'Hybrid',
      jobType: drive.jobType || 'Full-Time',
      eligibility: drive.eligibility || 'Attendance >= 80% & CGPA >= 7.0',
      minAttendance: drive.minAttendance !== undefined ? drive.minAttendance : 80,
      minCgpa: drive.minCgpa !== undefined ? drive.minCgpa : 7.0,
      vacancies: drive.vacancies || 5,
      deadline: drive.deadline || '',
      driveDate: drive.driveDate || '',
      status: drive.status || 'Active',
      roundsInput: Array.isArray(drive.rounds) ? drive.rounds.join(', ') : '',
      description: drive.description || '',
      requirementsInput: Array.isArray(drive.requirements) ? drive.requirements.join(', ') : '',
      websiteUrl: drive.websiteUrl || '',
    });
    setShowDriveModal(true);
  };

  // Save Drive (Create or Update)
  const handleSaveDrive = async (e) => {
    e.preventDefault();
    if (!driveForm.company.trim() || !driveForm.role.trim()) {
      alert('Please enter both Company Name and Job Role.');
      return;
    }

    setIsSavingDrive(true);
    try {
      const parsedRounds = driveForm.roundsInput
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const parsedReqs = driveForm.requirementsInput
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const payload = {
        company: driveForm.company.trim(),
        role: driveForm.role.trim(),
        ctc: driveForm.ctc.trim(),
        location: driveForm.location.trim(),
        workMode: driveForm.workMode,
        jobType: driveForm.jobType,
        eligibility: driveForm.eligibility,
        minAttendance: Number(driveForm.minAttendance) || 80,
        minCgpa: Number(driveForm.minCgpa) || 7.0,
        vacancies: Number(driveForm.vacancies) || 5,
        deadline: driveForm.deadline.trim(),
        driveDate: driveForm.driveDate.trim(),
        status: driveForm.status,
        rounds: parsedRounds.length > 0 ? parsedRounds : ['Resume Screen', 'Technical Interview'],
        requirements: parsedReqs,
        description: driveForm.description.trim(),
        websiteUrl: driveForm.websiteUrl.trim(),
      };

      if (editingDrive) {
        const id = editingDrive._id || editingDrive.id;
        const res = await api.put(`/placements/drives/${id}`, payload);
        if (res.data?.success) {
          showToast(`Drive for "${payload.company}" updated successfully!`);
          setShowDriveModal(false);
          await loadData();
        }
      } else {
        const res = await api.post('/placements/drives', payload);
        if (res.data?.success) {
          showToast(`New recruitment drive for "${payload.company}" published!`);
          setShowDriveModal(false);
          await loadData();
        }
      }
    } catch (err) {
      alert(`Error saving drive: ${err.message}`);
    } finally {
      setIsSavingDrive(false);
    }
  };

  // Delete Drive
  const handleDeleteDrive = async () => {
    if (!deleteDriveModal) return;
    setIsDeleting(true);
    try {
      const id = deleteDriveModal._id || deleteDriveModal.id;
      const res = await api.delete(`/placements/drives/${id}`);
      if (res.data?.success) {
        showToast(`Drive for "${deleteDriveModal.company}" deleted successfully!`);
        setDeleteDriveModal(null);
        await loadData();
      }
    } catch (err) {
      alert(`Error deleting drive: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Update Application Status Modal
  const handleOpenStatusModal = (app) => {
    setStatusModalApp(app);
    setNewStatus(app.status || 'Shortlisted');
    setNewInterviewDate(app.interviewDate || 'Oct 28, 2026 at 2:00 PM');
    setNewNotes(app.notes || '');
  };

  // Save Application Status
  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!statusModalApp) return;

    setIsUpdatingStatus(true);
    try {
      const res = await api.put(`/placements/applications/${statusModalApp._id}`, {
        status: newStatus,
        interviewDate: newInterviewDate,
        notes: newNotes,
      });

      if (res.data?.success) {
        showToast(`Status updated to "${newStatus}" for ${statusModalApp.student?.name || 'Candidate'}`);
        setStatusModalApp(null);
        await loadData();

        // Also update inside selectedDriveForApplicants if open
        if (selectedDriveForApplicants) {
          setSelectedDriveForApplicants((prev) => ({
            ...prev,
            applications: (prev.applications || []).map((a) =>
              a._id === statusModalApp._id
                ? { ...a, status: newStatus, interviewDate: newInterviewDate, notes: newNotes }
                : a
            ),
          }));
        }
      }
    } catch (err) {
      alert(`Error updating candidate status: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Open Drive Applicants Drawer
  const handleOpenDriveApplicants = (drive) => {
    const driveApps = applications.filter(
      (a) =>
        (a.drive && (a.drive._id === drive._id || a.drive === drive._id)) ||
        (a.company === drive.company && a.role === drive.role)
    );

    setSelectedDriveForApplicants({
      ...drive,
      applications: driveApps,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Placement Drives & Campus Recruitment
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Publish recruitment drives, evaluate student eligibility, track interview rounds, and manage hiring offers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateDrive}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-lg shadow-rose-600/25 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Placement Drive</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMsg}</span>
          </div>
          <button
            onClick={() => setToastMsg('')}
            className="text-emerald-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Analytics Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Drives
            </div>
            <div className="text-2xl font-black text-white mt-1">{totalDrivesCount}</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">{activeDrivesCount} Active Now</div>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Applications
            </div>
            <div className="text-2xl font-black text-cyan-400 mt-1">{totalApplicationsCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{shortlistedCount} Shortlisted</div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Offers Extended
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{selectedCount}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Final Selections</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Eligible Pool
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">{eligibleCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Att &ge; 80% & CGPA &ge; 7</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Mode Navigation & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
          <button
            onClick={() => {
              setActiveTab('drives');
              setStatusFilter('All');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'drives'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Recruitment Drives</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'drives' ? 'bg-rose-950 text-rose-200' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {drives.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('applications');
              setStatusFilter('All');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'applications'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Applications</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'applications'
                  ? 'bg-rose-950 text-rose-200'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {applications.length}
            </span>
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                activeTab === 'drives' ? 'Search company, role, location...' : 'Search candidate name, roll, company...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {(activeTab === 'drives'
              ? ['All', 'Active', 'Upcoming', 'Closed']
              : ['All', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected']
            ).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === st
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading placement records & partner drives...</p>
        </div>
      ) : activeTab === 'drives' ? (
        /* ================= DRIVES VIEW ================= */
        <div className="space-y-4">
          {filteredDrives.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No recruitment drives found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {drives.length === 0
                  ? 'No placement drives currently active. Create a new drive to begin inviting student applications.'
                  : 'No drives match your search criteria. Try adjusting filters.'}
              </p>
              <button
                onClick={handleOpenCreateDrive}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Placement Drive</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDrives.map((drive) => {
                const driveApplicantsCount = drive.applicantCount || 0;
                const driveSelectedCount = drive.selectedCount || 0;

                return (
                  <div
                    key={drive.id || drive._id}
                    className="bg-slate-900/85 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl hover:border-slate-700/80 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-black text-base shadow-inner shrink-0">
                            {drive.company.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                                {drive.ctc}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  drive.status === 'Active'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : drive.status === 'Upcoming'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {drive.status}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                              {drive.company}
                            </h3>
                            <p className="text-xs text-slate-300 font-semibold">{drive.role}</p>
                          </div>
                        </div>

                        {/* Drive Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditDrive(drive)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Edit Drive"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteDriveModal(drive)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                            title="Delete Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Description if present */}
                      {drive.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{drive.description}</p>
                      )}

                      {/* Meta Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            Location & Mode
                          </div>
                          <div className="font-bold text-slate-200 mt-0.5 truncate">
                            {drive.location} ({drive.workMode || 'Hybrid'})
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Application Deadline
                          </div>
                          <div className="font-bold text-rose-300 mt-0.5 truncate">
                            {drive.deadline || 'Ongoing'}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 col-span-2">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                            <Award className="w-3 h-3 text-slate-400" />
                            Eligibility Criteria
                          </div>
                          <div className="font-semibold text-cyan-300 mt-0.5">
                            {drive.eligibility || `Attendance >= ${drive.minAttendance || 80}% & CGPA >= ${drive.minCgpa || 7.0}`}
                          </div>
                        </div>
                      </div>

                      {/* Hiring Pipeline Rounds */}
                      {drive.rounds && drive.rounds.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Hiring Stages:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {drive.rounds.map((rnd, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-medium"
                              >
                                {rnd}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{driveApplicantsCount}</span>
                        <span className="text-slate-400">Applicants</span>
                        {driveSelectedCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {driveSelectedCount} Selected
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenDriveApplicants(drive)}
                        className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-slate-950 hover:bg-slate-800 text-rose-300 hover:text-white border border-slate-800 transition inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage Applicants ({driveApplicantsCount})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ================= CANDIDATE APPLICATIONS VIEW ================= */
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No candidate applications</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No students currently match your active filters. As students apply to recruitment drives, their profiles will appear here for shortlisting and interview scheduling.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredApplications.map((app) => (
                <div
                  key={app._id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl hover:border-slate-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  {/* Left: Student & Drive Details */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                        {app.student?.name ? app.student.name.charAt(0) : 'S'}
                      </div>
                      <div>
                        <span className="font-bold text-white text-base mr-2">
                          {app.student?.name || 'Candidate'}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
                          {app.student?.rollNo || 'N/A'}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Selected'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : app.status === 'Shortlisted'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : app.status === 'Interview Scheduled'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : app.status === 'Rejected'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span className="text-rose-400">{app.company}</span>
                      <span className="text-slate-500">•</span>
                      <span>{app.role}</span>
                    </div>

                    {/* Academic Snapshot */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="font-medium text-slate-300">
                        Attendance: <span className="text-emerald-400 font-bold">{app.student?.attendance || 90}%</span>
                      </span>
                      <span>•</span>
                      <span className="font-medium text-slate-300">
                        CGPA: <span className="text-cyan-400 font-bold">{app.student?.cgpa || 8.8}</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">
                        Package: <span className="text-white font-mono">{app.ctc}</span>
                      </span>
                    </div>

                    {/* Interview date if scheduled */}
                    {app.interviewDate && app.interviewDate !== 'TBA' && (
                      <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-900/50 w-fit">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Scheduled: {app.interviewDate}</span>
                      </div>
                    )}

                    {/* Mentor / Faculty Notes */}
                    {app.notes && (
                      <p className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-slate-400">Faculty Notes: </span>
                        <span>{app.notes}</span>
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <button
                      onClick={() => handleOpenStatusModal(app)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-md shadow-rose-600/30 transition flex items-center gap-2 active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT DRIVE ================= */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-rose-400" />
                <span>{editingDrive ? 'Edit Placement Drive' : 'Publish New Campus Placement Drive'}</span>
              </h3>
              <button
                onClick={() => setShowDriveModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDrive} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CloudScale Technologies"
                    value={driveForm.company}
                    onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Engineer (MERN)"
                    value={driveForm.role}
                    onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CTC Package *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 - 15 LPA"
                    value={driveForm.ctc}
                    onChange={(e) => setDriveForm({ ...driveForm, ctc: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Work Mode
                  </label>
                  <select
                    value={driveForm.workMode}
                    onChange={(e) => setDriveForm({ ...driveForm, workMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Drive Status
                  </label>
                  <select
                    value={driveForm.status}
                    onChange={(e) => setDriveForm({ ...driveForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Job Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru / Hyderabad"
                    value={driveForm.location}
                    onChange={(e) => setDriveForm({ ...driveForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Open Vacancies
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    value={driveForm.vacancies}
                    onChange={(e) => setDriveForm({ ...driveForm, vacancies: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Oct 30, 2026"
                    value={driveForm.deadline}
                    onChange={(e) => setDriveForm({ ...driveForm, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hiring Drive Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 10, 2026"
                    value={driveForm.driveDate}
                    onChange={(e) => setDriveForm({ ...driveForm, driveDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Min Attendance (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={driveForm.minAttendance}
                    onChange={(e) => setDriveForm({ ...driveForm, minAttendance: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Min CGPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={driveForm.minCgpa}
                    onChange={(e) => setDriveForm({ ...driveForm, minCgpa: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Interview Pipeline Stages (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Resume Screen, DSA Coding Assessment, System Design, HR"
                  value={driveForm.roundsInput}
                  onChange={(e) => setDriveForm({ ...driveForm, roundsInput: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Role Description & Technical Responsibilities
                </label>
                <textarea
                  rows="3"
                  placeholder="Job specifications, day-to-day responsibilities, expectations..."
                  value={driveForm.description}
                  onChange={(e) => setDriveForm({ ...driveForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDrive}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition flex items-center gap-2"
                >
                  {isSavingDrive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingDrive ? 'Update Drive' : 'Publish Drive'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DRIVE APPLICANTS DRAWER ================= */}
      {selectedDriveForApplicants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                  Candidate Pipeline
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedDriveForApplicants.company} • {selectedDriveForApplicants.role}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedDriveForApplicants.applications?.length || 0} student(s) applied
                </p>
              </div>
              <button
                onClick={() => setSelectedDriveForApplicants(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(!selectedDriveForApplicants.applications || selectedDriveForApplicants.applications.length === 0) ? (
              <div className="py-12 text-center space-y-2">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No applicants yet</p>
                <p className="text-xs text-slate-500">
                  Eligible students can apply from their student placement portal.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDriveForApplicants.applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {app.student?.name || 'Student Candidate'}
                        </span>
                        <span className="font-mono text-xs text-cyan-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                          {app.student?.rollNo || 'N/A'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'Selected'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : app.status === 'Shortlisted'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : app.status === 'Interview Scheduled'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : app.status === 'Rejected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>Attendance: {app.student?.attendance || 90}%</span>
                        <span>•</span>
                        <span>CGPA: {app.student?.cgpa || 8.8}</span>
                        {app.interviewDate && (
                          <>
                            <span>•</span>
                            <span className="text-amber-300 font-medium">Interview: {app.interviewDate}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenStatusModal(app)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5 self-start sm:self-center"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: UPDATE CANDIDATE STATUS ================= */}
      {statusModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Update Candidate Hiring Status
                </h3>
                <p className="text-xs text-rose-400 mt-0.5">
                  {statusModalApp.student?.name} • {statusModalApp.company}
                </p>
              </div>
              <button
                onClick={() => setStatusModalApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Candidate Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold"
                >
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected (Offer Extended)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Interview Date / Round Schedule
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oct 28, 2026 at 2:00 PM via Google Meet"
                  value={newInterviewDate}
                  onChange={(e) => setNewInterviewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Faculty / Recruiter Notes & Next Steps
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Cleared technical screening with top marks. Recommend for System Design round."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStatusModalApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition flex items-center gap-1.5"
                >
                  {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deleteDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">Delete Placement Drive?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete the hiring drive for{' '}
                <span className="text-slate-200 font-bold">"{deleteDriveModal.company}"</span>? All
                candidate applications for this drive will be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteDriveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteDrive}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
