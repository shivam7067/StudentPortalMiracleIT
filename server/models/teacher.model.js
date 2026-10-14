const mongoose = require('mongoose');

// Teacher schema representing faculty members
const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Teacher name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Teacher email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      default: 'teacher',
      enum: ['teacher'],
    },
    phone: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: 'General Faculty',
    },
    experience: {
      type: String,
      default: '1 Year',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Teacher', teacherSchema);
