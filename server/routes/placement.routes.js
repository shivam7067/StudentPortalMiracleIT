const express = require('express');
const router = express.Router();
const {
  getAllPlacementDrives,
  getPlacementDriveById,
  createPlacementDrive,
  updatePlacementDrive,
  deletePlacementDrive,
  applyForPlacement,
  updateApplicationStatus,
  getAllApplications,
  getMyApplications,
} = require('../controllers/placement.controller');
const { verifyToken, requireTeacher, requireStudent } = require('../middlewares/auth.middleware');

// Drive endpoints
router.get('/', verifyToken, getAllPlacementDrives);
router.get('/drives/:id', verifyToken, getPlacementDriveById);
router.post('/drives', verifyToken, requireTeacher, createPlacementDrive);
router.put('/drives/:id', verifyToken, requireTeacher, updatePlacementDrive);
router.delete('/drives/:id', verifyToken, requireTeacher, deletePlacementDrive);

// Application endpoints
router.get('/applications', verifyToken, requireTeacher, getAllApplications);
router.get('/my-applications', verifyToken, requireStudent, getMyApplications);
router.post('/apply', verifyToken, requireStudent, applyForPlacement);
router.put('/applications/:id', verifyToken, requireTeacher, updateApplicationStatus);

// Backward compatibility for existing update status calls
router.put('/:id', verifyToken, requireTeacher, updateApplicationStatus);

module.exports = router;
