const express = require('express');
const {
  enrollStudent,
  removeStudentFromCourse,
  getMyEnrolledCourses,
  getStudentCourses,
  getCourseStudents,
} = require('../controllers/enrolment.controller.js');
const { verifyToken, requireTeacher } = require('../middlewares/auth.middleware');

const router = express.Router();

// ==================== ENROLLMENT ROUTES (TEACHER ONLY) ====================

// Enroll student in a course (Supports URL parameters or request body)
router.post(
  '/:courseId/students/:studentId',
  verifyToken,
  requireTeacher,
  enrollStudent
);

router.post(
  '/',
  verifyToken,
  requireTeacher,
  enrollStudent
);

// Remove student from course (Supports URL parameters or request body)
router.delete(
  '/:courseId/students/:studentId',
  verifyToken,
  requireTeacher,
  removeStudentFromCourse
);

router.delete(
  '/',
  verifyToken,
  requireTeacher,
  removeStudentFromCourse
);

// ==================== STUDENT / COURSE DATA ====================

// Get logged-in student's enrolled courses (Identity verified strictly from JWT session token)
router.get(
  '/my-courses',
  verifyToken,
  getMyEnrolledCourses
);

// Get all courses of a specific student (or 'me')
router.get(
  '/student/:studentId',
  verifyToken,
  getStudentCourses
);

// Get all students enrolled in a specific course
router.get(
  '/:courseId/students',
  verifyToken,
  getCourseStudents
);

module.exports = router;