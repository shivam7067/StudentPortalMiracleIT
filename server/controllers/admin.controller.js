const bcrypt = require('bcryptjs');
const { loginUser } = require('./auth.controller');
const Teacher = require('../models/teacher.model');

// Register teacher
const adminregister = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const existing = await Teacher.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Teacher already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name: name || username || 'Teacher Faculty',
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'teacher',
    });
    await teacher.save();

    res.status(201).json({ success: true, message: 'Teacher registered successfully' });
  } catch (error) {
    console.error('Error registering teacher:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Login teacher
const adminlogin = async (req, res) => {
  req.body.role = 'teacher';
  return loginUser(req, res);
};

module.exports = {
  adminregister,
  adminlogin,
};
