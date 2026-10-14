const mongoose = require('mongoose');

// Announcement schema for institutional batch updates
const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['General', 'Hackathon', 'Masterclass', 'Exams', 'Placement'],
      default: 'General',
    },
    content: {
      type: String,
      required: [true, 'Announcement content is required'],
      trim: true,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Announcement', announcementSchema);
