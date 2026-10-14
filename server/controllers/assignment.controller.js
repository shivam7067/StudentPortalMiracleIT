const Assignment = require('../models/assignment.model');
const Submission = require('../models/submission.model');
const Student = require('../models/student.model');
const Course = require('../models/course.model');

// ==================== GET ALL ASSIGNMENTS ====================
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('course', 'title code')
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    const studentId = req.user?.role === 'student' ? req.user.id : null;

    // Attach submissions from Submission model
    const formatted = await Promise.all(
      assignments.map(async (a) => {
        const obj = a.toObject();
        const allSubs = await Submission.find({ assignment: a._id })
          .populate('student', 'name rollNo email avatar')
          .sort({ submittedAt: -1 });

        // Map for frontend consumption
        const formattedSubs = allSubs.map((s) => ({
          _id: s._id,
          id: s._id.toString(),
          submissionId: s._id.toString(),
          studentId: s.student?._id ? s.student._id.toString() : s.studentId,
          studentName: s.student?.name || s.studentName,
          studentRoll: s.student?.rollNo || s.studentRoll,
          repoUrl: s.repoUrl,
          notes: s.notes,
          submittedAt: s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '',
          status: s.status,
          score: s.score,
          feedback: s.feedback,
        }));

        let studentSpecificStatus = obj.status;
        let mySubmission = null;

        if (studentId) {
          const mine = formattedSubs.find(
            (s) => s.studentId === studentId || s.studentRoll === req.user.rollNo
          );
          if (mine) {
            studentSpecificStatus = mine.status === 'Graded' ? 'Graded' : 'Submitted';
            mySubmission = mine;
          } else {
            studentSpecificStatus = 'Pending Submission';
          }
        }

        const resolvedCourseName =
          (obj.course && typeof obj.course === 'object' && obj.course.title) ||
          obj.courseName ||
          'MERN Stack Development';

        return {
          ...obj,
          id: obj._id.toString(),
          courseName: resolvedCourseName,
          status: studentId ? studentSpecificStatus : obj.status,
          submissions: formattedSubs,
          mySubmission,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message,
    });
  }
};

// ==================== SUBMIT ASSIGNMENT (STUDENT) ====================
const submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { repoUrl, notes } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    const studentId = req.user.id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Check if student already submitted this assignment
    let submission = await Submission.findOne({
      assignment: assignment._id,
      student: student._id,
    });

    if (submission) {
      submission.repoUrl = repoUrl || submission.repoUrl;
      submission.notes = notes || submission.notes;
      submission.submittedAt = new Date();
      submission.status = 'Pending Review';
      await submission.save();
    } else {
      submission = await Submission.create({
        assignment: assignment._id,
        student: student._id,
        studentId: student._id.toString(),
        studentRoll: student.rollNo,
        studentName: student.name,
        repoUrl: repoUrl || '',
        notes: notes || '',
        submittedAt: new Date(),
        status: 'Pending Review',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully for mentor review',
      data: submission,
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit assignment',
      error: error.message,
    });
  }
};

// ==================== GRADE ASSIGNMENT SUBMISSION (TEACHER) ====================
const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params; // assignment id or submission id
    const { submissionId, score, feedback } = req.body;

    const targetSubId = submissionId || id;
    let submission = null;

    if (targetSubId.match(/^[0-9a-fA-F]{24}$/)) {
      submission = await Submission.findById(targetSubId);
    }

    if (!submission) {
      // Look up by assignment and submissionId
      submission = await Submission.findOne({
        $or: [{ _id: targetSubId }, { assignment: id }],
      });
    }

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission record not found to grade',
      });
    }

    if (score !== undefined) {
      submission.score = String(score);
      // Parse numeric score if possible (e.g., "48 / 50" -> 48)
      const numMatch = String(score).match(/\d+/);
      if (numMatch) {
        submission.numericScore = Number(numMatch[0]);
      }
    }

    if (feedback !== undefined) {
      submission.feedback = feedback;
    }

    submission.status = 'Graded';
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: submission,
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to grade submission',
      error: error.message,
    });
  }
};

// ==================== CREATE ASSIGNMENT (TEACHER) ====================
const createAssignment = async (req, res) => {
  try {
    const { title, subject, course, courseId, deadline, maxMarks, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Assignment title is required',
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

    const newAssignment = new Assignment({
      title: title.trim(),
      subject: subject || 'Full Stack Development',
      course: resolvedCourse ? resolvedCourse._id : null,
      courseName: resolvedCourse ? resolvedCourse.title : course || 'MERN Stack Development',
      teacher: req.user?.id || null,
      deadline: deadline || 'Next Week',
      maxMarks: Number(maxMarks) || 50,
      description: description || '',
      status: 'Pending Submission',
    });

    await newAssignment.save();

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: {
        ...newAssignment.toObject(),
        id: newAssignment._id.toString(),
        submissions: [],
      },
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
      error: error.message,
    });
  }
};

// ==================== GET STUDENT'S OWN SUBMISSIONS ====================
const getMySubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const submissions = await Submission.find({ student: studentId })
      .populate('assignment', 'title subject deadline maxMarks courseName')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student submissions',
    });
  }
};

// ==================== UPDATE ASSIGNMENT (TEACHER) ====================
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, course, courseId, deadline, maxMarks, description } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    if (title) assignment.title = title.trim();
    if (subject) assignment.subject = subject.trim();
    if (deadline) assignment.deadline = deadline.trim();
    if (maxMarks) assignment.maxMarks = Number(maxMarks);
    if (description !== undefined) assignment.description = description;

    if (courseId && courseId.match(/^[0-9a-fA-F]{24}$/)) {
      const foundCourse = await Course.findById(courseId);
      if (foundCourse) {
        assignment.course = foundCourse._id;
        assignment.courseName = foundCourse.title;
      }
    } else if (course) {
      const foundCourse =
        (await Course.findOne({ code: course.toUpperCase() })) ||
        (await Course.findOne({ title: course }));
      if (foundCourse) {
        assignment.course = foundCourse._id;
        assignment.courseName = foundCourse.title;
      } else {
        assignment.courseName = course;
      }
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment,
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update assignment',
      error: error.message,
    });
  }
};

// ==================== DELETE ASSIGNMENT (TEACHER) ====================
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Delete associated submissions
    await Submission.deleteMany({ assignment: assignment._id });
    await Assignment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Assignment and associated submissions deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment',
      error: error.message,
    });
  }
};

module.exports = {
  getAllAssignments,
  submitAssignment,
  gradeSubmission,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getMySubmissions,
};

