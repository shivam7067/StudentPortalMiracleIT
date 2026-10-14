const Course = require('../models/course.model');
const Teacher = require('../models/teacher.model');
const Attendance = require('../models/attendance.model');
const Enrollment = require('../models/enrolment.model');
const Assignment = require('../models/assignment.model');
const Submission = require('../models/submission.model');
const Test = require('../models/test.model');
const TestResult = require('../models/testResult.model');
const PlacementApplication = require('../models/placementApplication.model');

/**
 * Dynamically computes real academic metrics for a student from their actual
 * database records (Attendance, Submissions, TestResults, Enrollments, Placements).
 * Eliminates all fake hardcoded defaults like 95% attendance or 85% score.
 *
 * @param {Object} student - Mongoose student document or plain object
 * @returns {Promise<Object>} Student object enriched with real calculated statistics
 */
async function calculateStudentMetrics(student) {
  if (!student) return null;

  const studentObj = typeof student.toObject === 'function' ? student.toObject() : { ...student };
  delete studentObj.password;

  const studentId = student._id;
  const rollNo = student.rollNo || '';

  // 1. Calculate Real Attendance Percentage
  const attendanceSessions = await Attendance.find({
    $or: [
      { 'records.student': studentId },
      { 'records.studentRoll': rollNo },
      { 'records.studentId': String(studentId) },
    ],
  });

  let attendancePercentage = 0;
  let totalSessions = attendanceSessions.length;
  let presentSessions = 0;

  if (totalSessions > 0) {
    attendanceSessions.forEach((session) => {
      const rec = (session.records || []).find(
        (r) =>
          (r.student && String(r.student) === String(studentId)) ||
          (rollNo && r.studentRoll === rollNo) ||
          r.studentId === String(studentId)
      );
      if (rec && (rec.status === 'Present' || rec.status === 'Late')) {
        presentSessions++;
      }
    });
    attendancePercentage = Number(((presentSessions / totalSessions) * 100).toFixed(1));
  }

  // 2. Calculate Active Enrolled Courses
  const enrollments = await Enrollment.find({
    student: studentId,
    status: 'active',
  }).populate('course');

  const validEnrollments = enrollments.filter((e) => e.course != null);
  const primaryCourse = validEnrollments[0]?.course?.title || 'MERN Stack Development';
  const enrolledCoursesCount = validEnrollments.length;

  // 3. Calculate Assignments & Submissions
  const [totalAssignments, submittedCount] = await Promise.all([
    Assignment.countDocuments(),
    Submission.countDocuments({ student: studentId }),
  ]);

  // 4. Calculate Test Results & Real Average Score
  const testResults = await TestResult.find({ student: studentId });
  const testsGiven = testResults.length;

  let avgScore = 0;
  let cgpa = 0;

  if (testsGiven > 0) {
    let totalScored = 0;
    let totalMax = 0;
    testResults.forEach((tr) => {
      totalScored += Number(tr.scoredMarks) || 0;
      totalMax += Number(tr.totalMarks) || 100;
    });
    if (totalMax > 0) {
      avgScore = Number(((totalScored / totalMax) * 100).toFixed(1));
      cgpa = Number((avgScore / 10).toFixed(2));
    }
  } else if (submittedCount > 0) {
    // If no tests yet, check graded assignment scores
    const gradedSubs = await Submission.find({
      student: studentId,
      status: 'Graded',
      numericScore: { $ne: null },
    });
    if (gradedSubs.length > 0) {
      const sum = gradedSubs.reduce((acc, s) => acc + (s.numericScore || 0), 0);
      avgScore = Number((sum / gradedSubs.length).toFixed(1));
      cgpa = Number((avgScore / 10).toFixed(2));
    }
  }

  // 5. Calculate Placement Status
  const placementApps = await PlacementApplication.find({ student: studentId });
  let placementStatus = 'Eligible';

  const selectedApp = placementApps.find((p) => p.status === 'Selected');
  const appliedApp = placementApps.find((p) =>
    ['Applied', 'Shortlisted', 'Interview Scheduled'].includes(p.status)
  );

  if (selectedApp) {
    placementStatus = `Selected (${selectedApp.company})`;
  } else if (appliedApp) {
    placementStatus = `${appliedApp.status} (${appliedApp.company})`;
  } else if (totalSessions > 0 && attendancePercentage < 85) {
    placementStatus = 'Not Eligible (Attendance < 85%)';
  } else if (totalSessions === 0) {
    placementStatus = 'Eligible';
  }

  return {
    ...studentObj,
    id: studentObj.rollNo || studentObj._id.toString(),
    _id: studentObj._id,
    course: primaryCourse,
    batch: studentObj.batch || 'MIRACLE-2026-MERN-02',
    attendance: attendancePercentage,
    attendanceSessionsTotal: totalSessions,
    attendanceSessionsPresent: presentSessions,
    assignmentsSubmitted: submittedCount,
    assignmentsTotal: totalAssignments,
    testsGiven,
    avgScore,
    cgpa,
    placementStatus,
    enrolledCoursesCount,
  };
}

/**
 * Batch enrichment helper for student lists
 */
async function enrichStudentList(students) {
  if (!Array.isArray(students)) return [];
  return Promise.all(students.map((s) => calculateStudentMetrics(s)));
}

module.exports = {
  calculateStudentMetrics,
  enrichStudentList,
};
