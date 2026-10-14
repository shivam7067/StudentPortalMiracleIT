const mongoose = require('mongoose');

// Schema for Campus Recruitment & Placement Drives
const placementDriveSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    ctc: {
      type: String,
      required: [true, 'CTC / Compensation package is required'],
      default: '8.5 - 12 LPA',
    },
    location: {
      type: String,
      default: 'Bengaluru / Hybrid',
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'Hybrid',
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Internship', 'Internship + PPO'],
      default: 'Full-Time',
    },
    eligibility: {
      type: String,
      default: 'Attendance >= 80% & CGPA >= 7.0',
    },
    minAttendance: {
      type: Number,
      default: 80,
    },
    minCgpa: {
      type: Number,
      default: 7.0,
    },
    allowedCourses: {
      type: [String],
      default: ['MERN Stack Development', 'Java Full Stack Engineering', 'Data Structures & Algorithms'],
    },
    deadline: {
      type: String,
      default: 'Next Week',
    },
    driveDate: {
      type: String,
      default: 'TBA',
    },
    vacancies: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ['Active', 'Upcoming', 'Closed', 'Archived'],
      default: 'Active',
    },
    rounds: {
      type: [String],
      default: ['Resume Screen', 'DSA Coding Assessment', 'System Architecture', 'HR Culture Fit'],
    },
    description: {
      type: String,
      default: '',
    },
    requirements: {
      type: [String],
      default: ['Strong fundamentals in JavaScript/TypeScript', 'Hands-on React & Node.js experience', 'Knowledge of RESTful APIs & MongoDB'],
    },
    websiteUrl: {
      type: String,
      default: '',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

placementDriveSchema.index({ company: 1, role: 1 });
placementDriveSchema.index({ status: 1 });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
