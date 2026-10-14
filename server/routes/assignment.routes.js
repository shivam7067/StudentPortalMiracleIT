const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  submitAssignment,
  gradeSubmission,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getMySubmissions,
} = require('../controllers/assignment.controller');
const { verifyToken, requireTeacher, requireStudent } = require('../middlewares/auth.middleware');

// Get all assignments
router.get('/', verifyToken, getAllAssignments);

// Student gets their own submissions
router.get('/my-submissions', verifyToken, requireStudent, getMySubmissions);

// Teacher creates new assignment
router.post('/', verifyToken, requireTeacher, createAssignment);

// Teacher updates an assignment
router.put('/:id', verifyToken, requireTeacher, updateAssignment);

// Teacher deletes an assignment
router.delete('/:id', verifyToken, requireTeacher, deleteAssignment);

// Student submits an assignment
router.post('/:id/submit', verifyToken, requireStudent, submitAssignment);

// Teacher grades a submission
router.put('/:id/grade', verifyToken, requireTeacher, gradeSubmission);

module.exports = router;

