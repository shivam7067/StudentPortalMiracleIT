const mongoose = require('mongoose');

// Test / Examination schema
const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
    },
    subject: {
      type: String,
      default: 'Full Stack Engineering',
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    courseName: {
      type: String,
      default: 'MERN Stack Development',
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },
    date: {
      type: String,
      required: [true, 'Test date is required'],
    },
    time: {
      type: String,
      default: '10:00 AM - 11:30 AM',
    },
    duration: {
      type: String,
      default: '90 Mins',
    },
    totalMarks: {
      type: Number,
      default: 100,
      min: 1,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Active', 'Completed', 'Upcoming'],
      default: 'Scheduled',
    },
    type: {
      type: String,
      default: 'Coding + Proctored MCQ',
    },
    instructions: {
      type: String,
      default: 'Strict fullscreen proctoring enabled. Standard institute exam rules apply.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Test', testSchema);
