const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getMyProfile,
  updateMyProfile,
  studentregister,
  studentlogin,
} = require('../controllers/student.controller');
const { verifyToken, requireTeacher, requireStudent } = require('../middlewares/auth.middleware');

// ==================== STUDENT SELF PROFILE ROUTES ====================
// Student accesses own profile
router.get('/profile/me', verifyToken, getMyProfile);
router.put('/profile/me', verifyToken, updateMyProfile);

// ==================== TEACHER MANAGEMENT ROUTES ====================
// Teacher manages student directory
router.get('/', verifyToken, requireTeacher, getAllStudents);
router.post('/', verifyToken, requireTeacher, createStudent);
router.get('/:id', verifyToken, getStudentById);
router.put('/:id', verifyToken, requireTeacher, updateStudent);
router.delete('/:id', verifyToken, requireTeacher, deleteStudent);

// Backward compatibility routes
router.post('/login', studentlogin);
router.post('/register', studentregister);

module.exports = router;