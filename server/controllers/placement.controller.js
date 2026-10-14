const PlacementApplication = require('../models/placementApplication.model');
const Student = require('../models/student.model');

// Sample default institutional recruitment drives
const defaultDrives = [
  {
    driveId: 'drive-1',
    company: 'CloudScale Technologies',
    role: 'Full Stack Engineer (MERN)',
    ctc: '8.5 - 12 LPA',
    location: 'Bengaluru / Hybrid',
    eligibility: 'Attendance > 80%',
    deadline: 'Oct 25, 2026',
    rounds: ['Resume Screen', 'DSA Coding Assessment', 'System Design Round', 'HR Culture Fit'],
  },
  {
    driveId: 'drive-2',
    company: 'FinNexus Systems',
    role: 'Backend Node.js Engineer',
    ctc: '9 - 14 LPA',
    location: 'Hyderabad / On-site',
    eligibility: 'Attendance > 80%',
    deadline: 'Oct 30, 2026',
    rounds: ['Online Assessment', 'Technical Interview', 'Director Round'],
  },
  {
    driveId: 'drive-3',
    company: 'ApexData AI',
    role: 'Frontend Engineer (React 19)',
    ctc: '10 - 15 LPA',
    location: 'Pune / Remote',
    eligibility: 'Completed Capstone Project',
    deadline: 'Nov 05, 2026',
    rounds: ['Machine Coding Round', 'React Internals Deep Dive', 'Founder Round'],
  },
  {
    driveId: 'drive-4',
    company: 'HyperLogic Software',
    role: 'Software Development Engineer - 1',
    ctc: '8 - 11 LPA',
    location: 'Gurugram / Hybrid',
    eligibility: 'Attendance > 80%',
    deadline: 'Nov 12, 2026',
    rounds: ['Aptitude + DSA Screen', 'System Architecture', 'HR Round'],
  },
];

// ==================== GET ALL PLACEMENT DRIVES & APPLICATIONS ====================
const getAllPlacementDrives = async (req, res) => {
  try {
    const studentId = req.user?.role === 'student' ? req.user.id : null;

    // Fetch existing applications
    const applications = await PlacementApplication.find()
      .populate('student', 'name rollNo email phone avatar')
      .sort({ createdAt: -1 });

    let myApplications = [];
    if (studentId) {
      myApplications = applications.filter(
        (app) => app.student && String(app.student._id) === String(studentId)
      );
    }

    // Merge default partner drives with application state
    const drives = defaultDrives.map((d) => {
      const myApp = myApplications.find((a) => a.company === d.company);
      return {
        id: d.driveId,
        company: d.company,
        role: d.role,
        ctc: d.ctc,
        location: d.location,
        eligibility: d.eligibility,
        deadline: d.deadline,
        rounds: d.rounds,
        status: myApp ? myApp.status : 'Eligible to Apply',
        applicationId: myApp ? myApp._id : null,
        interviewDate: myApp ? myApp.interviewDate : 'TBA',
      };
    });

    res.status(200).json({
      success: true,
      data: drives,
      applications: req.user?.role === 'teacher' ? applications : myApplications,
    });
  } catch (error) {
    console.error('Error fetching placement drives:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch placement drives',
      error: error.message,
    });
  }
};

// ==================== APPLY FOR PLACEMENT (STUDENT) ====================
const applyForPlacement = async (req, res) => {
  try {
    const { company, role, ctc, location, eligibility, deadline, rounds, notes } = req.body;
    const studentId = req.user.id;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company name and job role are required to apply',
      });
    }

    let application = await PlacementApplication.findOne({
      student: studentId,
      company: company.trim(),
    });

    if (application) {
      return res.status(200).json({
        success: true,
        message: `You have already applied to ${company}. Current status: ${application.status}`,
        data: application,
      });
    }

    application = await PlacementApplication.create({
      student: studentId,
      company: company.trim(),
      role: role.trim(),
      ctc: ctc || '8.5 - 12 LPA',
      location: location || 'Bengaluru / Hybrid',
      eligibility: eligibility || 'Attendance > 80%',
      deadline: deadline || 'Next Week',
      rounds: Array.isArray(rounds) ? rounds : ['Resume Screen', 'Technical Interview', 'HR Round'],
      status: 'Applied',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: `Successfully applied to ${company}! Your student profile has been submitted.`,
      data: application,
    });
  } catch (error) {
    console.error('Error applying for placement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit placement application',
      error: error.message,
    });
  }
};

// ==================== UPDATE APPLICATION STATUS (TEACHER) ====================
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, interviewDate, notes } = req.body;

    const application = await PlacementApplication.findById(id).populate('student', 'name email rollNo');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }

    if (status) application.status = status;
    if (interviewDate) application.interviewDate = interviewDate;
    if (notes) application.notes = notes;

    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to '${application.status}'`,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update application' });
  }
};

// ==================== GET STUDENT'S OWN APPLICATIONS ====================
const getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const applications = await PlacementApplication.find({ student: studentId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your applications' });
  }
};

module.exports = {
  getAllPlacementDrives,
  applyForPlacement,
  updateApplicationStatus,
  getMyApplications,
};
