const mongoose = require('mongoose');

// PlacementApplication schema connecting students with recruitment drives
const placementApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      default: null,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    ctc: {
      type: String,
      default: '8.5 - 12 LPA',
    },
    location: {
      type: String,
      default: 'Bengaluru / Hybrid',
    },
    eligibility: {
      type: String,
      default: 'Attendance > 80%',
    },
    status: {
      type: String,
      enum: ['Eligible to Apply', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    deadline: {
      type: String,
      default: 'Next Week',
    },
    interviewDate: {
      type: String,
      default: 'TBA',
    },
    rounds: {
      type: [String],
      default: ['Resume Screen', 'Technical Interview', 'HR Round'],
    },
    notes: {
      type: String,
      default: '',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

placementApplicationSchema.index({ student: 1, company: 1, role: 1 });

module.exports = mongoose.model('PlacementApplication', placementApplicationSchema);
