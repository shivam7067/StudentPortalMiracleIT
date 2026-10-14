const jwt = require('jsonwebtoken');

// Middleware to verify JWT token from Authorization header or cookie
const verifyToken = (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header (Format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.user = decoded; // Contains id, role, email, etc.
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

// Middleware to restrict access to teachers only
const requireTeacher = (req, res, next) => {
  if (!req.user || req.user.role !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only teachers can perform this action.',
    });
  }
  next();
};

// Middleware to restrict access to students only
const requireStudent = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only students can perform this action.',
    });
  }
  next();
};

module.exports = {
  verifyToken,
  requireTeacher,
  requireStudent,
};
