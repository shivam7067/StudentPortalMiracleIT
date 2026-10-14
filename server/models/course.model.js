const mongoose = require('mongoose');

// Course schema representing academic programs offered by the institute
const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },
    instructor: {
      type: String,
      default: 'Rahul Sharma',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Pro', 'Intermediate to Advanced'],
      default: 'Intermediate',
    },
    duration: {
      type: String,
      default: '6 Months',
    },
    enrolledStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxCapacity: {
      type: Number,
      default: 50,
      min: 1,
    },
    projectsCount: {
      type: String,
      default: '6 Projects',
    },
    status: {
      type: String,
      enum: ['Active', 'Upcoming', 'Completed', 'Inactive'],
      default: 'Active',
    },
    tags: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      default: 'Popular',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);