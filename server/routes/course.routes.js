const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course.controller');
const { verifyToken, requireTeacher } = require('../middlewares/auth.middleware');

// Public or authenticated reading
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Teacher management
router.post('/', verifyToken, requireTeacher, createCourse);
router.put('/:id', verifyToken, requireTeacher, updateCourse);
router.delete('/:id', verifyToken, requireTeacher, deleteCourse);

module.exports = router;