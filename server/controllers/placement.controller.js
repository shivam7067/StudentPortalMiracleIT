const PlacementDrive = require('../models/placementDrive.model');
const PlacementApplication = require('../models/placementApplication.model');
const Student = require('../models/student.model');

// Initial baseline recruitment drives
const defaultDrives = [
  {
    company: 'CloudScale Technologies',
    role: 'Full Stack Engineer (MERN)',
    ctc: '8.5 - 12 LPA',
    location: 'Bengaluru / Hybrid',
    workMode: 'Hybrid',
    jobType: 'Full-Time',
    eligibility: 'Attendance >= 80% & CGPA >= 7.5',
    minAttendance: 80,
    minCgpa: 7.5,
    allowedCourses: ['MERN Stack Development', 'Java Full Stack Engineering'],
    deadline: 'Oct 25, 2026',
    driveDate: 'Nov 02, 2026',
    vacancies: 6,
    status: 'Active',
    rounds: ['Resume Screen', 'DSA Coding Assessment', 'System Design Round', 'HR Culture Fit'],
    description: 'CloudScale is hiring Full Stack Engineers to build high-scale multi-tenant microservices and cloud management consoles using React 19, TypeScript, Node.js, and MongoDB.',
    requirements: ['Solid understanding of React state patterns and server APIs', 'Knowledge of REST, JWT authentication, and MongoDB schema design', 'Proficiency in asynchronous JavaScript and Git workflows'],
    websiteUrl: 'https://cloudscale.example.com',
  },
  {
    company: 'FinNexus Systems',
    role: 'Backend Node.js Engineer',
    ctc: '9 - 14 LPA',
    location: 'Hyderabad / On-site',
    workMode: 'On-site',
    jobType: 'Full-Time',
    eligibility: 'Attendance >= 80% & CGPA >= 7.0',
    minAttendance: 80,
    minCgpa: 7.0,
    allowedCourses: ['MERN Stack Development', 'Data Structures & Algorithms'],
    deadline: 'Oct 30, 2026',
    driveDate: 'Nov 08, 2026',
    vacancies: 4,
    status: 'Active',
    rounds: ['Online Assessment', 'Technical Interview', 'Director Round'],
    description: 'FinNexus is seeking passionate backend engineers to develop secure, low-latency financial settlement services and ledger systems.',
    requirements: ['High proficiency in Node.js event loops, streams, and cluster modules', 'Database indexing and query optimization experience in MongoDB / PostgreSQL', 'Strong API security foundations'],
    websiteUrl: 'https://finnexus.example.com',
  },
  {
    company: 'ApexData AI',
    role: 'Frontend Engineer (React 19)',
    ctc: '10 - 15 LPA',
    location: 'Pune / Remote',
    workMode: 'Remote',
    jobType: 'Full-Time',
    eligibility: 'Attendance >= 75% & Capstone Project Completed',
    minAttendance: 75,
    minCgpa: 7.0,
    allowedCourses: ['MERN Stack Development'],
    deadline: 'Nov 05, 2026',
    driveDate: 'Nov 14, 2026',
    vacancies: 8,
    status: 'Active',
    rounds: ['Machine Coding Round', 'React Internals Deep Dive', 'Founder Round'],
    description: 'Build enterprise AI-driven analytics dashboards with modern React 19 concurrent features, Vite, and tailwind design systems.',
    requirements: ['Expertise with React hooks, context, state machines', 'Eye for clean UI/UX and micro-interactions', 'Experience with WebSocket real-time charts'],
    websiteUrl: 'https://apexdata.example.com',
  },
  {
    company: 'HyperLogic Software',
    role: 'Software Development Engineer - 1',
    ctc: '8 - 11 LPA',
    location: 'Gurugram / Hybrid',
    workMode: 'Hybrid',
    jobType: 'Full-Time',
    eligibility: 'Attendance >= 80% & CGPA >= 7.0',
    minAttendance: 80,
    minCgpa: 7.0,
    allowedCourses: ['MERN Stack Development', 'Java Full Stack Engineering', 'Data Structures & Algorithms'],
    deadline: 'Nov 12, 2026',
    driveDate: 'Nov 20, 2026',
    vacancies: 10,
    status: 'Upcoming',
    rounds: ['Aptitude + DSA Screen', 'System Architecture', 'HR Round'],
    description: 'HyperLogic is looking for versatile SDE-1 candidates proficient in algorithm design, scalable architecture, and end-to-end full stack development.',
    requirements: ['Strong Data Structures and Algorithms foundation (400+ problems solved)', 'Proficiency in JavaScript or Java', 'Clean OOP and design patterns'],
    websiteUrl: 'https://hyperlogic.example.com',
  },
];

// Helper to ensure database is seeded with initial drives
const ensureDrivesSeeded = async () => {
  try {
    const count = await PlacementDrive.countDocuments();
    if (count === 0) {
      await PlacementDrive.insertMany(defaultDrives);
      console.log('Seeded initial PlacementDrive records.');
    }
  } catch (err) {
    console.warn('Auto-seed check error for PlacementDrive:', err.message);
  }
};

// ==================== GET ALL PLACEMENT DRIVES ====================
const getAllPlacementDrives = async (req, res) => {
  try {
    await ensureDrivesSeeded();

    const studentId = req.user?.role === 'student' ? req.user.id : null;

    // Fetch all drives
    const drives = await PlacementDrive.find().sort({ createdAt: -1 });

    // Fetch applications
    const applications = await PlacementApplication.find()
      .populate('student', 'name rollNo email phone avatar attendance cgpa')
      .populate('drive', 'company role ctc location')
      .sort({ createdAt: -1 });

    // Filter student's applications
    let myApplications = [];
    if (studentId) {
      myApplications = applications.filter(
        (app) => app.student && String(app.student._id) === String(studentId)
      );
    }

    // Format drives with applicant statistics & current student application status
    const formattedDrives = drives.map((d) => {
      const obj = d.toObject();
      const driveApps = applications.filter(
        (a) => (a.drive && String(a.drive._id) === String(d._id)) || (a.company === d.company && a.role === d.role)
      );

      const applicantCount = driveApps.length;
      const selectedCount = driveApps.filter((a) => a.status === 'Selected').length;
      const shortlistedCount = driveApps.filter((a) => a.status === 'Shortlisted').length;

      // Student-specific state
      let myApp = null;
      if (studentId) {
        myApp = myApplications.find(
          (a) => (a.drive && String(a.drive._id) === String(d._id)) || (a.company === d.company && a.role === d.role)
        );
      }

      return {
        ...obj,
        id: obj._id.toString(),
        applicantCount,
        selectedCount,
        shortlistedCount,
        status: d.status || 'Active',
        myApplicationStatus: myApp ? myApp.status : 'Eligible to Apply',
        applicationId: myApp ? myApp._id : null,
        interviewDate: myApp ? myApp.interviewDate : 'TBA',
      };
    });

    res.status(200).json({
      success: true,
      data: formattedDrives,
      applications: req.user?.role === 'teacher' ? applications : myApplications,
      totalDrives: formattedDrives.length,
      activeDrives: formattedDrives.filter((d) => d.status === 'Active').length,
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

// ==================== GET SINGLE DRIVE DETAILS WITH APPLICANTS ====================
const getPlacementDriveById = async (req, res) => {
  try {
    const { id } = req.params;
    const drive = await PlacementDrive.findById(id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    const applications = await PlacementApplication.find({
      $or: [{ drive: drive._id }, { company: drive.company, role: drive.role }],
    })
      .populate('student', 'name rollNo email phone avatar attendance cgpa')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...drive.toObject(),
        id: drive._id.toString(),
        applications,
      },
    });
  } catch (error) {
    console.error('Error fetching drive details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch drive details' });
  }
};

// ==================== CREATE PLACEMENT DRIVE (TEACHER) ====================
const createPlacementDrive = async (req, res) => {
  try {
    const {
      company,
      companyLogo,
      role,
      ctc,
      location,
      workMode,
      jobType,
      eligibility,
      minAttendance,
      minCgpa,
      allowedCourses,
      deadline,
      driveDate,
      vacancies,
      status,
      rounds,
      description,
      requirements,
      websiteUrl,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company name and job role are required to create a placement drive.',
      });
    }

    const newDrive = new PlacementDrive({
      company: company.trim(),
      companyLogo: companyLogo || '',
      role: role.trim(),
      ctc: ctc ? ctc.trim() : '8.5 - 12 LPA',
      location: location || 'Bengaluru / Hybrid',
      workMode: workMode || 'Hybrid',
      jobType: jobType || 'Full-Time',
      eligibility: eligibility || 'Attendance >= 80% & CGPA >= 7.0',
      minAttendance: Number(minAttendance) || 80,
      minCgpa: Number(minCgpa) || 7.0,
      allowedCourses: Array.isArray(allowedCourses) && allowedCourses.length > 0 ? allowedCourses : ['MERN Stack Development'],
      deadline: deadline || 'Next Week',
      driveDate: driveDate || 'TBA',
      vacancies: Number(vacancies) || 5,
      status: status || 'Active',
      rounds: Array.isArray(rounds) && rounds.length > 0 ? rounds : ['Resume Screen', 'Technical Interview', 'HR Discussion'],
      description: description || '',
      requirements: Array.isArray(requirements) ? requirements : [],
      websiteUrl: websiteUrl || '',
      postedBy: req.user?.id || null,
    });

    await newDrive.save();

    res.status(201).json({
      success: true,
      message: `Placement drive for ${company} (${role}) published successfully!`,
      data: {
        ...newDrive.toObject(),
        id: newDrive._id.toString(),
        applicantCount: 0,
        selectedCount: 0,
      },
    });
  } catch (error) {
    console.error('Error creating placement drive:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create placement drive',
      error: error.message,
    });
  }
};

// ==================== UPDATE PLACEMENT DRIVE (TEACHER) ====================
const updatePlacementDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const drive = await PlacementDrive.findById(id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    const updatableFields = [
      'company',
      'companyLogo',
      'role',
      'ctc',
      'location',
      'workMode',
      'jobType',
      'eligibility',
      'minAttendance',
      'minCgpa',
      'allowedCourses',
      'deadline',
      'driveDate',
      'vacancies',
      'status',
      'rounds',
      'description',
      'requirements',
      'websiteUrl',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        drive[field] = req.body[field];
      }
    });

    await drive.save();

    res.status(200).json({
      success: true,
      message: `Placement drive for ${drive.company} updated successfully`,
      data: {
        ...drive.toObject(),
        id: drive._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating placement drive:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update placement drive',
      error: error.message,
    });
  }
};

// ==================== DELETE PLACEMENT DRIVE (TEACHER) ====================
const deletePlacementDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const drive = await PlacementDrive.findById(id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    // Cascade delete associated applications
    await PlacementApplication.deleteMany({
      $or: [{ drive: drive._id }, { company: drive.company, role: drive.role }],
    });

    await PlacementDrive.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Placement drive for ${drive.company} and associated records deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting placement drive:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete placement drive',
      error: error.message,
    });
  }
};

// ==================== APPLY FOR PLACEMENT (STUDENT) ====================
const applyForPlacement = async (req, res) => {
  try {
    const { driveId, company, role, ctc, location, eligibility, deadline, rounds, notes } = req.body;
    const studentId = req.user.id;

    let targetDrive = null;
    if (driveId && String(driveId).match(/^[0-9a-fA-F]{24}$/)) {
      targetDrive = await PlacementDrive.findById(driveId);
    }

    const companyName = (targetDrive ? targetDrive.company : company || '').trim();
    const roleName = (targetDrive ? targetDrive.role : role || '').trim();

    if (!companyName || !roleName) {
      return res.status(400).json({
        success: false,
        message: 'Company name and job role are required to apply',
      });
    }

    // Check if student profile exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Check existing application
    let application = await PlacementApplication.findOne({
      student: studentId,
      $or: [
        { drive: targetDrive ? targetDrive._id : null },
        { company: companyName, role: roleName },
      ],
    });

    if (application) {
      return res.status(200).json({
        success: true,
        message: `You have already applied to ${companyName} for ${roleName}. Current status: ${application.status}`,
        data: application,
      });
    }

    application = await PlacementApplication.create({
      student: studentId,
      drive: targetDrive ? targetDrive._id : null,
      company: companyName,
      role: roleName,
      ctc: targetDrive ? targetDrive.ctc : ctc || '8.5 - 12 LPA',
      location: targetDrive ? targetDrive.location : location || 'Bengaluru / Hybrid',
      eligibility: targetDrive ? targetDrive.eligibility : eligibility || 'Attendance >= 80%',
      deadline: targetDrive ? targetDrive.deadline : deadline || 'Next Week',
      rounds: targetDrive ? targetDrive.rounds : Array.isArray(rounds) ? rounds : ['Resume Screen', 'Technical Interview', 'HR Round'],
      status: 'Applied',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: `Successfully applied to ${companyName} for ${roleName}! Your student profile has been submitted.`,
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

    const application = await PlacementApplication.findById(id).populate(
      'student',
      'name email rollNo phone avatar attendance cgpa'
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }

    if (status) application.status = status;
    if (interviewDate !== undefined) application.interviewDate = interviewDate;
    if (notes !== undefined) application.notes = notes;

    await application.save();

    res.status(200).json({
      success: true,
      message: `Application for ${application.student?.name || 'student'} updated to '${application.status}'`,
      data: application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, message: 'Failed to update application' });
  }
};

// ==================== GET ALL APPLICATIONS (TEACHER) ====================
const getAllApplications = async (req, res) => {
  try {
    const applications = await PlacementApplication.find()
      .populate('student', 'name rollNo email phone avatar attendance cgpa')
      .populate('drive', 'company role ctc location status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch candidate applications' });
  }
};

// ==================== GET STUDENT'S OWN APPLICATIONS (STUDENT) ====================
const getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const applications = await PlacementApplication.find({ student: studentId })
      .populate('drive', 'company role ctc location rounds deadline status')
      .sort({ createdAt: -1 });

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
  getPlacementDriveById,
  createPlacementDrive,
  updatePlacementDrive,
  deletePlacementDrive,
  applyForPlacement,
  updateApplicationStatus,
  getAllApplications,
  getMyApplications,
};
