const Test = require('../models/test.model');
const TestResult = require('../models/testResult.model');
const Student = require('../models/student.model');
const Course = require('../models/course.model');

// ==================== GET ALL TESTS ====================
// Teachers view all tests; Students view tests for their tracks
const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .populate('course', 'title code')
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    const studentId = req.user?.role === 'student' ? req.user.id : null;

    const formattedTests = await Promise.all(
      tests.map(async (t) => {
        const obj = t.toObject();
        let myResult = null;

        if (studentId) {
          const resDoc = await TestResult.findOne({ test: t._id, student: studentId });
          if (resDoc) {
            myResult = {
              scoredMarks: resDoc.scoredMarks,
              totalMarks: resDoc.totalMarks,
              percentage: resDoc.percentage,
              percentile: resDoc.percentile,
              feedback: resDoc.feedback,
              status: resDoc.status,
            };
          }
        }

        // Get top scorer info for teachers or general view
        const topResult = await TestResult.findOne({ test: t._id })
          .populate('student', 'name')
          .sort({ scoredMarks: -1 });

        return {
          ...obj,
          id: obj._id.toString(),
          scoredMarks: myResult ? myResult.scoredMarks : undefined,
          percentile: myResult ? myResult.percentile : undefined,
          topScorer: topResult?.student?.name
            ? `${topResult.student.name} (${topResult.percentage || Math.round((topResult.scoredMarks / topResult.totalMarks) * 100)}%)`
            : t.status === 'Completed'
            ? 'Completed'
            : 'Pending Test',
          myResult,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: formattedTests,
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests',
      error: error.message,
    });
  }
};

// ==================== GET SINGLE TEST BY ID ====================
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id)
      .populate('course', 'title code')
      .populate('teacher', 'name email');

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        ...test.toObject(),
        id: test._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch test' });
  }
};

// ==================== CREATE TEST (TEACHER) ====================
const createTest = async (req, res) => {
  try {
    const { title, subject, course, courseId, date, time, duration, totalMarks, type, instructions, status } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: 'Test title and date are required',
      });
    }

    let resolvedCourse = null;
    if (courseId && courseId.match(/^[0-9a-fA-F]{24}$/)) {
      resolvedCourse = await Course.findById(courseId);
    } else if (course) {
      resolvedCourse =
        (await Course.findOne({ code: course.toUpperCase() })) ||
        (await Course.findOne({ title: course }));
    }

    const newTest = new Test({
      title: title.trim(),
      subject: subject || 'Full Stack Engineering',
      course: resolvedCourse ? resolvedCourse._id : null,
      courseName: resolvedCourse ? resolvedCourse.title : course || 'MERN Stack Development',
      teacher: req.user?.id || null,
      date,
      time: time || '10:00 AM - 11:30 AM',
      duration: duration || '90 Mins',
      totalMarks: Number(totalMarks) || 100,
      type: type || 'Coding + Proctored MCQ',
      instructions: instructions || 'Strict fullscreen proctoring enabled.',
      status: status || 'Scheduled',
    });

    await newTest.save();

    res.status(201).json({
      success: true,
      message: 'Test scheduled successfully',
      data: {
        ...newTest.toObject(),
        id: newTest._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule test',
      error: error.message,
    });
  }
};

// ==================== UPDATE TEST (TEACHER) ====================
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    Object.assign(test, req.body);
    await test.save();

    res.status(200).json({
      success: true,
      message: 'Test updated successfully',
      data: {
        ...test.toObject(),
        id: test._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update test' });
  }
};

// ==================== DELETE TEST (TEACHER) ====================
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Test.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Remove associated results
    await TestResult.deleteMany({ test: deleted._id });

    res.status(200).json({
      success: true,
      message: `Test '${deleted.title}' deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete test' });
  }
};

// ==================== SUBMIT / RECORD TEST RESULT (TEACHER) ====================
const recordTestResult = async (req, res) => {
  try {
    const { id } = req.params; // testId
    const { studentId, studentRoll, scoredMarks, totalMarks, feedback, status } = req.body;

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    let student = null;
    if (studentId && studentId.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(studentId);
    }
    if (!student && studentRoll) {
      student = await Student.findOne({ rollNo: studentRoll });
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const total = Number(totalMarks) || test.totalMarks || 100;
    const scored = Number(scoredMarks) || 0;
    const percentage = Number(((scored / total) * 100).toFixed(1));

    let result = await TestResult.findOne({ test: test._id, student: student._id });

    if (result) {
      result.scoredMarks = scored;
      result.totalMarks = total;
      result.percentage = percentage;
      result.feedback = feedback || result.feedback;
      result.status = status || 'Completed';
      await result.save();
    } else {
      result = await TestResult.create({
        test: test._id,
        student: student._id,
        scoredMarks: scored,
        totalMarks: total,
        percentage,
        feedback: feedback || '',
        status: status || 'Completed',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Test result recorded successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error recording test result:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record test result',
      error: error.message,
    });
  }
};

// ==================== GET STUDENT'S OWN TEST RESULTS ====================
const getMyTestResults = async (req, res) => {
  try {
    const studentId = req.user.id;
    const results = await TestResult.find({ student: studentId })
      .populate('test')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test results',
    });
  }
};

module.exports = {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  recordTestResult,
  getMyTestResults,
};
