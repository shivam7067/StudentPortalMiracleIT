const mongoose = require('mongoose');

// TestResult model recording student test outcomes
const testResultSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    scoredMarks: {
      type: Number,
      required: [true, 'Scored marks are required'],
      min: 0,
    },
    totalMarks: {
      type: Number,
      default: 100,
      min: 1,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    percentile: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Completed', 'Absent'],
      default: 'Completed',
    },
    feedback: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

testResultSchema.index({ test: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('TestResult', testResultSchema);
