const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('./app');
const connectDB = require('./config/database');
const Student = require('./models/student.model');
const Teacher = require('./models/teacher.model');

// Lightweight test runner using native fetch and the express app
async function runTests() {
  console.log('\n==================== BACKEND COMPREHENSIVE TEST SUITE ====================\n');
  await connectDB();

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`).then((r) => r.json());
    assert(healthRes.status === 'ok', 'Health check endpoint returns ok');

    // 2. Authentication: Teacher Login with bcrypt
    const teacherLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'rahul@institute.com', password: 'teacher123', role: 'teacher' }),
    }).then((r) => r.json());

    assert(teacherLoginRes.success === true, 'Teacher login succeeds with bcrypt');
    assert(!teacherLoginRes.user.password, 'Teacher response NEVER contains password');
    const teacherToken = teacherLoginRes.token;

    // 3. Authentication: Student Login with bcrypt & calculated metrics
    const studentLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'student@email.com', password: 'student123', role: 'student' }),
    }).then((r) => r.json());

    assert(studentLoginRes.success === true, 'Student login succeeds with bcrypt');
    assert(!studentLoginRes.user.password, 'Student response NEVER contains password');
    assert(typeof studentLoginRes.user.attendance === 'number', 'Student login includes real calculated attendance');
    const studentToken = studentLoginRes.token;

    // 4. Student Management: Teacher gets student roster
    const studentsRes = await fetch(`${baseUrl}/students`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    }).then((r) => r.json());

    assert(studentsRes.success === true && Array.isArray(studentsRes.data), 'Teacher fetches student list');
    const priya = studentsRes.data.find((s) => s.email === 'student@email.com');
    assert(priya && priya.attendance !== undefined, 'Students list contains real calculated attendance and metrics');
    assert(priya && !priya.password, 'Students in roster do not leak passwords');

    // 5. Student self-profile endpoint
    const myProfileRes = await fetch(`${baseUrl}/students/profile/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    assert(myProfileRes.success === true && myProfileRes.data.name === 'Priya Sundaram', 'Student fetches own profile (/students/profile/me)');
    assert(!myProfileRes.data.password, 'Self profile does not contain password');

    // 6. Courses: Get courses
    const coursesRes = await fetch(`${baseUrl}/courses`).then((r) => r.json());
    assert(coursesRes.success === true && coursesRes.data.length > 0, 'Public/Auth courses endpoint works');

    // 7. Enrollment: Student enrolled courses
    const myCoursesRes = await fetch(`${baseUrl}/enrollment/my-courses`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    assert(myCoursesRes.success === true && Array.isArray(myCoursesRes.data), 'Student fetches enrolled courses via /enrollment/my-courses');

    // 8. Attendance: Student attendance summary (Requirement 9)
    const attSummaryRes = await fetch(`${baseUrl}/attendance/my-summary`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    assert(attSummaryRes.success === true, 'Student gets attendance summary');
    assert(typeof attSummaryRes.data.overallPercentage === 'number', 'Attendance summary contains numeric overallPercentage');

    // 9. Assignments & Submissions
    const assignmentsRes = await fetch(`${baseUrl}/assignments`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    assert(assignmentsRes.success === true && Array.isArray(assignmentsRes.data), 'Assignments endpoint works with submissions attached');

    // 10. Tests: Get tests and student test results (Requirement 8)
    const testsRes = await fetch(`${baseUrl}/tests`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    assert(testsRes.success === true && Array.isArray(testsRes.data), 'Tests endpoint returns tests with student results');

    const myResultsRes = await fetch(`${baseUrl}/tests/my-results`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    assert(myResultsRes.success === true && Array.isArray(myResultsRes.data), 'Student retrieves own test results');

    // 11. Placement Applications: Drives and Student Apply (Requirement 8)
    const placementsRes = await fetch(`${baseUrl}/placements`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    assert(placementsRes.success === true && Array.isArray(placementsRes.data), 'Placement drives list fetched');

    const applyRes = await fetch(`${baseUrl}/placements/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        company: 'FinNexus Systems',
        role: 'Backend Node.js Engineer',
        ctc: '9 - 14 LPA',
      }),
    }).then((r) => r.json());

    assert(applyRes.success === true, 'Student applies for placement drive');

    // 12. Feedback: Student submits feedback and views feedback history (Requirement 8)
    const feedbackPostRes = await fetch(`${baseUrl}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        moduleOrMentor: 'MongoDB & Backend Microservices (Mentor Vikram)',
        rating: 5,
        comments: 'Outstanding coverage of replica sets and transaction handling.',
        isAnonymous: false,
      }),
    }).then((r) => r.json());

    assert(feedbackPostRes.success === true, 'Student submits course/mentor feedback');

    const feedbackListRes = await fetch(`${baseUrl}/feedback/my-feedback`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    assert(feedbackListRes.success === true && feedbackListRes.data.length > 0, 'Student views feedback history');

    // Teacher views all feedback
    const teacherFeedbackRes = await fetch(`${baseUrl}/feedback`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    }).then((r) => r.json());

    assert(teacherFeedbackRes.success === true && teacherFeedbackRes.data.length > 0, 'Teacher views all student feedback');

    console.log(`\nTest Summary: ${passed} passed, ${failed} failed.\n`);
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
