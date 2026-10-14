const Feedback = require('../models/feedback.model');
const Student = require('../models/student.model');

// ==================== SUBMIT FEEDBACK (STUDENT) ====================
const submitFeedback = async (req, res) => {
  try {
    const { moduleOrMentor, rating, comments, isAnonymous } = req.body;
    const studentId = req.user.id;

    if (!moduleOrMentor || !comments) {
      return res.status(400).json({
        success: false,
        message: 'Module/mentor and comments are required fields',
      });
    }

    const student = await Student.findById(studentId);

    const feedback = new Feedback({
      student: isAnonymous ? null : student?._id,
      studentName: isAnonymous ? 'Anonymous Student' : student?.name || 'Student',
      moduleOrMentor: moduleOrMentor.trim(),
      rating: Number(rating) || 5,
      comments: comments.trim(),
      isAnonymous: Boolean(isAnonymous),
      status: 'Submitted',
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully and forwarded to academic mentors',
      data: feedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message,
    });
  }
};

// ==================== GET ALL FEEDBACK (TEACHER) ====================
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('student', 'name email rollNo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
};

// ==================== GET OWN SUBMITTED FEEDBACK (STUDENT) ====================
const getMyFeedback = async (req, res) => {
  try {
    const studentId = req.user.id;
    const feedbacks = await Feedback.find({ student: studentId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your feedback history' });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getMyFeedback,
};
