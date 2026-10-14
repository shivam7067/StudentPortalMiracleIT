const mongoose = require('mongoose');

// Assignment schema for course tasks
const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    subject: {
      type: String,
      default: 'Full Stack Development',
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
    deadline: {
      type: String,
      default: 'Next Week',
    },
    maxMarks: {
      type: Number,
      default: 50,
    },
    status: {
      type: String,
      enum: ['Pending Submission', 'In Progress', 'Submitted', 'Graded'],
      default: 'Pending Submission',
    },
    assignedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
