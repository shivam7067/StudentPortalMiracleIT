const Announcement = require('../models/announcement.model');

// ==================== GET ALL ANNOUNCEMENTS ====================
const getAllAnnouncements = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};

    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });

    const formatted = announcements.map((a) => {
      const obj = a.toObject();
      return {
        ...obj,
        id: obj._id.toString(),
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message,
    });
  }
};

// ==================== CREATE ANNOUNCEMENT (TEACHER) ====================
const createAnnouncement = async (req, res) => {
  try {
    const { title, category, content, urgent } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const newAnnouncement = new Announcement({
      title: title.trim(),
      category: category || 'General',
      content: content.trim(),
      urgent: Boolean(urgent),
      date: 'Just now',
    });

    await newAnnouncement.save();

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      data: {
        ...newAnnouncement.toObject(),
        id: newAnnouncement._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message,
    });
  }
};

// ==================== DELETE ANNOUNCEMENT (TEACHER) ====================
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
      error: error.message,
    });
  }
};

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};
