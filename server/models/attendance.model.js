const mongoose = require('mongoose');

// Attendance record sub-item for each student in the session
const attendanceRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
    },
    studentId: {
      type: String,
      default: '',
    },
    studentRoll: {
      type: String,
      default: '',
    },
    studentName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      default: 'Present',
    },
  },
  { _id: false }
);

// Attendance session schema
const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'Session date is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    courseName: {
      type: String,
      default: 'All',
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },
    subject: {
      type: String,
      default: 'Lecture & Lab Session',
    },
    records: [attendanceRecordSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
