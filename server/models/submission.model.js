const mongoose = require('mongoose');

// Submission model for student assignment work
const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    studentRoll: {
      type: String,
      default: '',
    },
    studentName: {
      type: String,
      default: '',
    },
    repoUrl: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Graded'],
      default: 'Pending Review',
    },
    score: {
      type: String,
      default: null,
    },
    numericScore: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ assignment: 1, student: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
