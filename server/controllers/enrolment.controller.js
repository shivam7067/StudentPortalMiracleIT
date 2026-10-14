const Course = require('../models/course.model');
const Student = require('../models/student.model');
const Enrollment = require('../models/enrolment.model');

// Helper to find a course by ObjectId or course code
const findCourseByIdOrCode = async (idOrCode) => {
  if (!idOrCode) return null;
  const str = String(idOrCode).trim();
  if (str.match(/^[0-9a-fA-F]{24}$/)) {
    const course = await Course.findById(str);
    if (course) return course;
  }
  return await Course.findOne({ code: str.toUpperCase() });
};

// Helper to find a student by ObjectId or rollNo
const findStudentByIdOrRoll = async (idOrRoll) => {
  if (!idOrRoll) return null;
  const str = String(idOrRoll).trim();
  if (str.match(/^[0-9a-fA-F]{24}$/)) {
    const student = await Student.findById(str);
    if (student) return student;
  }
  return await Student.findOne({ rollNo: str });
};

// ==================== ENROLL STUDENT (TEACHER) ====================
const enrollStudent = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    const studentId = req.params.studentId || req.body.studentId;

    if (!courseId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Both courseId and studentId are required for enrollment',
      });
    }

    // 1. Validate course exists
    const course = await findCourseByIdOrCode(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found. Please select a valid course.',
      });
    }

    // 2. Validate student exists
    const student = await findStudentByIdOrRoll(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found. Please select a valid student.',
      });
    }

    // 3. Prevent duplicate enrollments in the same course
    const existingEnrollment = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: `Student "${student.name}" is already enrolled in "${course.title}".`,
      });
    }

    // 4. Respect the course's maximum capacity
    const totalStudents = await Enrollment.countDocuments({
      course: course._id,
      status: 'active',
    });

    const maxCap = course.maxCapacity || 50;
    if (totalStudents >= maxCap) {
      return res.status(400).json({
        success: false,
        message: `Course capacity reached (${totalStudents}/${maxCap} seats filled). Cannot enroll additional students.`,
      });
    }

    // 5. Create active enrollment
    const enrollment = await Enrollment.create({
      student: student._id,
      course: course._id,
      status: 'active',
    });

    // 6. Synchronize course enrolledStudents counter
    await Course.findByIdAndUpdate(course._id, {
      enrolledStudents: totalStudents + 1,
    });

    // Populate student details for immediate UI display
    const populated = await Enrollment.findById(enrollment._id)
      .populate('student', 'name rollNo email phone batch cgpa avatar')
      .populate('course', 'title code maxCapacity enrolledStudents instructor');

    res.status(201).json({
      success: true,
      message: `Student "${student.name}" successfully enrolled in "${course.title}"!`,
      data: populated,
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to enroll student in course',
    });
  }
};

// ==================== REMOVE STUDENT FROM COURSE (TEACHER) ====================
// IMPORTANT: Removes ONLY their enrollment in this specific course.
// DOES NOT delete the student account or their records in other courses.
const removeStudentFromCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    const studentId = req.params.studentId || req.body.studentId;

    if (!courseId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Both courseId and studentId are required',
      });
    }

    const course = await findCourseByIdOrCode(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const student = await findStudentByIdOrRoll(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const enrollment = await Enrollment.findOne({
      course: course._id,
      student: student._id,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: `Student "${student.name}" is not enrolled in "${course.title}".`,
      });
    }

    // Remove ONLY the enrollment record
    await Enrollment.findByIdAndDelete(enrollment._id);

    // Update remaining count on course
    const remainingCount = await Enrollment.countDocuments({
      course: course._id,
      status: 'active',
    });

    await Course.findByIdAndUpdate(course._id, {
      enrolledStudents: remainingCount,
    });

    res.status(200).json({
      success: true,
      message: `Student "${student.name}" removed from "${course.title}" successfully. Their student profile remains active.`,
      remainingEnrolled: remainingCount,
    });
  } catch (error) {
    console.error('Removal error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove student from course',
    });
  }
};

// ==================== GET LOGGED-IN STUDENT ENROLLED COURSES ====================
// Identifies student strictly from authenticated session/JWT (req.user.id)
const getMyEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Student authentication session token missing.',
      });
    }

    const student = await findStudentByIdOrRoll(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const enrollments = await Enrollment.find({
      student: student._id,
      status: 'active',
    })
      .populate('course')
      .sort({ createdAt: -1 });

    // Filter out any enrollments whose course may have been deleted
    const validEnrollments = enrollments.filter((e) => e.course != null);

    res.status(200).json({
      success: true,
      message: 'Enrolled courses fetched successfully',
      data: validEnrollments,
    });
  } catch (error) {
    console.error('Error fetching logged-in student courses:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch enrolled courses',
    });
  }
};

// ==================== GET STUDENT COURSES ====================
const getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    // If param is 'me', resolve to authenticated student
    if (studentId === 'me') {
      return getMyEnrolledCourses(req, res);
    }

    const student = await findStudentByIdOrRoll(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const enrollments = await Enrollment.find({
      student: student._id,
      status: 'active',
    })
      .populate('course')
      .sort({ createdAt: -1 });

    const validEnrollments = enrollments.filter((e) => e.course != null);

    res.status(200).json({
      success: true,
      message: 'Student courses fetched successfully',
      data: validEnrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student courses',
    });
  }
};

// ==================== GET COURSE STUDENTS ====================
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await findCourseByIdOrCode(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const enrollments = await Enrollment.find({
      course: course._id,
      status: 'active',
    })
      .populate('student', 'name rollNo email phone batch cgpa avatar')
      .populate('course', 'title code maxCapacity enrolledStudents instructor')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Course students fetched successfully',
      course: {
        _id: course._id,
        id: course.code,
        code: course.code,
        title: course.title,
        instructor: course.instructor,
        maxCapacity: course.maxCapacity,
        enrolledStudents: enrollments.length,
        status: course.status,
      },
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch enrolled students',
    });
  }
};

module.exports = {
  enrollStudent,
  removeStudentFromCourse,
  getMyEnrolledCourses,
  getStudentCourses,
  getCourseStudents,
};