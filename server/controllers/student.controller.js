const bcrypt = require('bcryptjs');
const Student = require('../models/student.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrolment.model');
const { calculateStudentMetrics, enrichStudentList } = require('../utils/studentMetrics');

// ==================== GET ALL STUDENTS (TEACHER) ====================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password').sort({ createdAt: -1 });
    const enriched = await enrichStudentList(students);

    res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students list',
      error: error.message,
    });
  }
};

// ==================== GET SINGLE STUDENT BY ID / ROLLNO ====================
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    let student = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(id).select('-password');
    }
    if (!student) {
      student = await Student.findOne({ rollNo: id }).select('-password');
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found',
      });
    }

    const enriched = await calculateStudentMetrics(student);

    res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student details',
      error: error.message,
    });
  }
};

// ==================== CREATE NEW STUDENT (TEACHER) ====================
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rollNo,
      phone,
      course,
      courseId,
      status,
      address,
      bio,
      github,
      linkedin,
      avatar,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Student name and email are required fields',
      });
    }

    // Check for existing student with same email
    const existingEmail = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'A student with this email already exists',
      });
    }

    // Generate rollNo if not provided
    let finalRollNo = rollNo ? rollNo.trim() : '';
    if (!finalRollNo) {
      const count = await Student.countDocuments();
      finalRollNo = `MIT-${String(840 + count + 1).padStart(4, '0')}`;
    }

    // Check for duplicate rollNo
    const existingRoll = await Student.findOne({ rollNo: finalRollNo });
    if (existingRoll) {
      const count = await Student.countDocuments();
      finalRollNo = `MIT-${String(840 + count + 10).padStart(4, '0')}`;
    }

    // Hash password with bcrypt (Requirement 10)
    const rawPassword = password || 'student123';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newStudent = new Student({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      rollNo: finalRollNo,
      phone: phone || '',
      status: status || 'Active',
      address: address || '',
      bio: bio || '',
      github: github || '',
      linkedin: linkedin || '',
      avatar:
        avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    await newStudent.save();

    // If course was selected during creation, establish an Enrollment record (Requirement 2 & 3)
    let matchedCourse = null;
    if (courseId) {
      matchedCourse = await Course.findById(courseId);
    } else if (course) {
      matchedCourse =
        (await Course.findOne({ code: course.toUpperCase() })) ||
        (await Course.findOne({ title: course }));
    }

    if (matchedCourse) {
      await Enrollment.create({
        student: newStudent._id,
        course: matchedCourse._id,
        status: 'active',
      });
      // Increment course enrolledStudents count
      const totalEnrolled = await Enrollment.countDocuments({
        course: matchedCourse._id,
        status: 'active',
      });
      await Course.findByIdAndUpdate(matchedCourse._id, { enrolledStudents: totalEnrolled });
    }

    const enriched = await calculateStudentMetrics(newStudent);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: enriched,
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create student record',
      error: error.message,
    });
  }
};

// ==================== UPDATE STUDENT (TEACHER) ====================
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    let student = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(id);
    }
    if (!student) {
      student = await Student.findOne({ rollNo: id });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found',
      });
    }

    const updates = { ...req.body };

    // If updating password, hash with bcrypt (Requirement 10)
    if (updates.password && updates.password.trim()) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    // Apply valid updates for student schema
    const allowedFields = [
      'name',
      'email',
      'rollNo',
      'phone',
      'avatar',
      'address',
      'bio',
      'github',
      'linkedin',
      'status',
      'password',
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        student[field] = updates[field];
      }
    });

    await student.save();

    const enriched = await calculateStudentMetrics(student);

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      data: enriched,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student profile',
      error: error.message,
    });
  }
};

// ==================== DELETE STUDENT (TEACHER) ====================
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Student.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Student.findOneAndDelete({ rollNo: id });
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Student not found to delete',
      });
    }

    // Clean up student enrollments
    await Enrollment.deleteMany({ student: deleted._id });

    res.status(200).json({
      success: true,
      message: `Student '${deleted.name}' deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message,
    });
  }
};

// ==================== GET OWN PROFILE (STUDENT) ====================
const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const enriched = await calculateStudentMetrics(student);

    res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student profile',
    });
  }
};

// ==================== UPDATE OWN PROFILE (STUDENT) ====================
const updateMyProfile = async (req, res) => {
  try {
    const { bio, phone, github, linkedin, address, avatar, password } = req.body;

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    if (bio !== undefined) student.bio = bio;
    if (phone !== undefined) student.phone = phone;
    if (github !== undefined) student.github = github;
    if (linkedin !== undefined) student.linkedin = linkedin;
    if (address !== undefined) student.address = address;
    if (avatar !== undefined) student.avatar = avatar;

    if (password && password.trim()) {
      student.password = await bcrypt.hash(password, 10);
    }

    await student.save();

    const enriched = await calculateStudentMetrics(student);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: enriched,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student profile',
    });
  }
};

// Backward compatibility aliases
const studentregister = async (req, res) => {
  return createStudent(req, res);
};

const studentlogin = async (req, res) => {
  const { loginUser } = require('./auth.controller');
  req.body.role = 'student';
  return loginUser(req, res);
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getMyProfile,
  updateMyProfile,
  studentregister,
  studentlogin,
};