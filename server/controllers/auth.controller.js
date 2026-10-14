const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacher.model');
const Student = require('../models/student.model');
const { calculateStudentMetrics } = require('../utils/studentMetrics');

// Helper function to compare passwords (supports bcrypt with seamless legacy upgrade)
const checkPassword = async (inputPassword, storedPassword, userDoc = null) => {
  try {
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    if (isMatch) return true;
  } catch (err) {
    // Continue to legacy check
  }

  // Fallback for legacy unhashed passwords
  if (inputPassword === storedPassword) {
    if (userDoc) {
      try {
        userDoc.password = await bcrypt.hash(inputPassword, 10);
        await userDoc.save();
      } catch (err) {
        console.error('Password hash upgrade error:', err);
      }
    }
    return true;
  }

  return false;
};

// ==================== USER LOGIN (TEACHER & STUDENT) ====================
const loginUser = async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.email || req.body.rollNo;
    const { password, role } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your identifier (email/ID) and password.',
      });
    }

    const selectedRole = (role || 'student').toLowerCase();

    // 1. TEACHER LOGIN
    if (selectedRole === 'teacher') {
      const teacher = await Teacher.findOne({
        email: identifier.toLowerCase().trim(),
      });

      if (!teacher) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Teacher email or password.',
        });
      }

      const isPasswordValid = await checkPassword(password, teacher.password, teacher);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Teacher email or password.',
        });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: teacher._id, role: 'teacher', email: teacher.email, name: teacher.name },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '7d' }
      );

      // Safe user object without sensitive password (Requirement 10)
      const safeTeacher = {
        id: teacher._id,
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        phone: teacher.phone || '',
        subject: teacher.subject || '',
        experience: teacher.experience || '',
        status: teacher.status || 'Active',
      };

      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.status(200).json({
        success: true,
        message: 'Teacher login successful',
        token,
        user: safeTeacher,
      });
    }

    // 2. STUDENT LOGIN
    if (selectedRole === 'student') {
      const cleanId = identifier.trim();
      const student = await Student.findOne({
        $or: [
          { email: cleanId.toLowerCase() },
          { rollNo: cleanId },
        ],
      });

      if (!student) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Student ID / Email or password.',
        });
      }

      const isPasswordValid = await checkPassword(password, student.password, student);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Student ID / Email or password.',
        });
      }

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: student._id,
          role: 'student',
          email: student.email,
          name: student.name,
          rollNo: student.rollNo,
        },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '7d' }
      );

      // Dynamically calculate metrics from database records (Requirement 9 & 10)
      const enrichedStudent = await calculateStudentMetrics(student);

      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.status(200).json({
        success: true,
        message: 'Student login successful',
        token,
        user: enrichedStudent,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid role specified. Supported roles are "teacher" and "student".',
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
    });
  }
};

// ==================== GET CURRENT LOGGED IN USER ====================
const getMe = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role === 'teacher') {
      const teacher = await Teacher.findById(id).select('-password');
      if (!teacher) {
        return res.status(404).json({ success: false, message: 'Teacher profile not found' });
      }
      return res.status(200).json({
        success: true,
        user: { ...teacher.toObject(), id: teacher._id },
      });
    }

    if (role === 'student') {
      const student = await Student.findById(id).select('-password');
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student profile not found' });
      }
      const enrichedStudent = await calculateStudentMetrics(student);
      return res.status(200).json({
        success: true,
        user: enrichedStudent,
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid role' });
  } catch (error) {
    console.error('Error in getMe:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};

// ==================== LOGOUT ====================
const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = {
  loginUser,
  getMe,
  logoutUser,
};
