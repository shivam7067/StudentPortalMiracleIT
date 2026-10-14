const express = require('express');
const router = express.Router();
const { loginUser, getMe, logoutUser } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Public route for unified login (Teacher & Student)
router.post('/login', loginUser);

// Protected route to get currently authenticated user info
router.get('/me', verifyToken, getMe);

// Logout route
router.post('/logout', logoutUser);

module.exports = router;
