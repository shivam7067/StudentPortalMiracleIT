const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

// Route handlers
const authRouter = require('./routes/auth.routes');
const studentRouter = require('./routes/student.routes');
const courseRouter = require('./routes/course.routes');
const assignmentRouter = require('./routes/assignment.routes');
const attendanceRouter = require('./routes/attendance.routes');
const announcementRouter = require('./routes/announcement.routes');
const enrollmentRouter = require('./routes/enrollment.routes');
const adminRouter = require('./routes/admin.routes');
const testRouter = require('./routes/test.routes');
const placementRouter = require('./routes/placement.routes');
const feedbackRouter = require('./routes/feedback.routes');

const app = express();

// Middleware configuration
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173','https://student-portal-miracle-3misy3dt3-shivamrajput70x-7222.vercel.app/'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/courses', courseRouter);
app.use('/api/assignments', assignmentRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/announcements', announcementRouter);
app.use('/api/enrollment', enrollmentRouter);
app.use('/api/tests', testRouter);
app.use('/api/placements', placementRouter);
app.use('/api/feedback', feedbackRouter);

// Backward compatibility routes
app.use('/api/teacher', adminRouter);
app.use('/api/student', studentRouter);
app.use('/api/course', courseRouter);
app.use('/api/test', testRouter);
app.use('/api/placement', placementRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MERN Student Portal API is running' });
});

app.get('/', (req, res) => {
  res.send('Welcome to MERN Student Portal API');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred',
  });
});

module.exports = app;
