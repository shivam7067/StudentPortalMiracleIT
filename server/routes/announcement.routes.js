const express = require('express');
const router = express.Router();
const {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcement.controller');
const { verifyToken, requireTeacher } = require('../middlewares/auth.middleware');

// Public/authenticated view of announcements
router.get('/', getAllAnnouncements);

// Teacher creates and deletes announcements
router.post('/', verifyToken, requireTeacher, createAnnouncement);
router.delete('/:id', verifyToken, requireTeacher, deleteAnnouncement);

module.exports = router;
