const express = require('express');
const router = express.Router();
const {
  getAllPlacementDrives,
  applyForPlacement,
  updateApplicationStatus,
  getMyApplications,
} = require('../controllers/placement.controller');
const { verifyToken, requireTeacher, requireStudent } = require('../middlewares/auth.middleware');

// Drives and applications
router.get('/', verifyToken, getAllPlacementDrives);
router.get('/my-applications', verifyToken, requireStudent, getMyApplications);
router.post('/apply', verifyToken, requireStudent, applyForPlacement);
router.put('/:id', verifyToken, requireTeacher, updateApplicationStatus);

module.exports = router;
