const express = require('express');
const router = express.Router();
const {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  recordTestResult,
  getMyTestResults,
} = require('../controllers/test.controller');
const { verifyToken, requireTeacher, requireStudent } = require('../middlewares/auth.middleware');

// Public or student/teacher view of tests
router.get('/', verifyToken, getAllTests);
router.get('/my-results', verifyToken, requireStudent, getMyTestResults);
router.get('/:id', verifyToken, getTestById);

// Teacher manages tests and grades
router.post('/', verifyToken, requireTeacher, createTest);
router.put('/:id', verifyToken, requireTeacher, updateTest);
router.delete('/:id', verifyToken, requireTeacher, deleteTest);
router.post('/:id/results', verifyToken, requireTeacher, recordTestResult);

module.exports = router;
