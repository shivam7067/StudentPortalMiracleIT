const Attendance = require('../models/attendance.model');
const Student = require('../models/student.model');
const Course = require('../models/course.model');

// ==================== SAVE SESSION ATTENDANCE (TEACHER) ====================
const saveAttendance = async (req, res) => {
  try {
    const { date, course, courseId, subject, records } = req.body;

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Date and student attendance records are required',
      });
    }

    // Resolve Course ObjectId if available
    let resolvedCourse = null;
    if (courseId && courseId.match(/^[0-9a-fA-F]{24}$/)) {
      resolvedCourse = await Course.findById(courseId);
    } else if (course && course !== 'All') {
      resolvedCourse =
        (await Course.findOne({ code: course.toUpperCase() })) ||
        (await Course.findOne({ title: course }));
    }

    // Format records with proper Student ObjectId references (Requirement 3)
    const formattedRecords = [];
    for (const rec of records) {
      let studentDoc = null;
      if (rec.student && String(rec.student).match(/^[0-9a-fA-F]{24}$/)) {
        studentDoc = await Student.findById(rec.student);
      } else if (rec.studentId && rec.studentId.match(/^[0-9a-fA-F]{24}$/)) {
        studentDoc = await Student.findById(rec.studentId);
      } else if (rec.studentRoll || rec.studentId) {
        studentDoc = await Student.findOne({
          $or: [{ rollNo: rec.studentRoll }, { rollNo: rec.studentId }],
        });
      }

      formattedRecords.push({
        student: studentDoc ? studentDoc._id : null,
        studentId: studentDoc ? studentDoc._id.toString() : rec.studentId || '',
        studentRoll: studentDoc ? studentDoc.rollNo : rec.studentRoll || '',
        studentName: studentDoc ? studentDoc.name : rec.studentName || 'Student',
        status: ['Present', 'Absent', 'Late'].includes(rec.status) ? rec.status : 'Present',
      });
    }

    // Check if session for date and course already exists
    const query = {
      date,
      ...(resolvedCourse ? { course: resolvedCourse._id } : { courseName: course || 'All' }),
    };

    let attendanceDoc = await Attendance.findOne(query);

    if (attendanceDoc) {
      attendanceDoc.records = formattedRecords;
      if (subject) attendanceDoc.subject = subject;
      if (req.user?.id) attendanceDoc.teacher = req.user.id;
      await attendanceDoc.save();
    } else {
      attendanceDoc = new Attendance({
        date,
        course: resolvedCourse ? resolvedCourse._id : null,
        courseName: resolvedCourse ? resolvedCourse.title : course || 'All',
        teacher: req.user?.id || null,
        subject: subject || 'Lecture & Lab Session',
        records: formattedRecords,
      });
      await attendanceDoc.save();
    }

    res.status(200).json({
      success: true,
      message: 'Attendance saved successfully',
      data: attendanceDoc,
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save attendance records',
      error: error.message,
    });
  }
};

// ==================== GET ATTENDANCE SUMMARY (STUDENT / TEACHER) ====================
const getAttendanceSummary = async (req, res) => {
  try {
    const studentId = req.user.id;
    const studentRoll = req.user.rollNo;

    // Find all attendance sessions containing this student
    const allSessions = await Attendance.find({
      $or: [
        { 'records.student': studentId },
        { 'records.studentRoll': studentRoll },
        { 'records.studentId': studentId },
      ],
    }).sort({ date: -1, createdAt: -1 });

    const totalSessions = allSessions.length;
    let presentSessions = 0;
    let absentSessions = 0;
    let lateSessions = 0;

    const monthlyLog = [];

    allSessions.forEach((session) => {
      const rec = (session.records || []).find(
        (r) =>
          (r.student && String(r.student) === String(studentId)) ||
          (studentRoll && r.studentRoll === studentRoll) ||
          r.studentId === studentId
      );

      const status = rec ? rec.status : 'Absent';
      if (status === 'Present') presentSessions++;
      else if (status === 'Late') {
        lateSessions++;
        presentSessions++; // Late counts towards presence
      } else {
        absentSessions++;
      }

      monthlyLog.push({
        date: session.date,
        subject: session.subject || session.courseName || 'Lecture Session',
        status,
        duration: '2.5 hrs',
      });
    });

    // Calculate real attendance percentage without fake defaults (Requirement 9)
    const overallPercentage =
      totalSessions > 0
        ? Number(((presentSessions / totalSessions) * 100).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        overallPercentage,
        totalSessions,
        presentSessions,
        absentSessions,
        lateSessions,
        monthlyLog,
      },
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance summary',
      error: error.message,
    });
  }
};

module.exports = {
  saveAttendance,
  getAttendanceSummary,
};
