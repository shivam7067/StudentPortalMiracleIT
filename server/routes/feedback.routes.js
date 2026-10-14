const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  getMyFeedback,
} = require('../controllers/feedback.controller');
const { verifyToken, requireTeacher, requireStudent } = require('../middlewares/auth.middleware');

// Student submits feedback and views past submissions
router.post('/', verifyToken, requireStudent, submitFeedback);
router.get('/my-feedback', verifyToken, requireStudent, getMyFeedback);

// Teacher views all institute feedback
router.get('/', verifyToken, requireTeacher, getAllFeedback);

module.exports = router;
