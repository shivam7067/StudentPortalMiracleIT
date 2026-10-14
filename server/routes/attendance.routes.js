const express = require('express');
const router = express.Router();
const {
  saveAttendance,
  getAttendanceSummary,
} = require('../controllers/attendance.controller');
const { verifyToken, requireTeacher } = require('../middlewares/auth.middleware');

// Teacher saves session attendance
router.post('/', verifyToken, requireTeacher, saveAttendance);

// Student or Teacher gets attendance summary
router.get('/my-summary', verifyToken, getAttendanceSummary);

module.exports = router;
