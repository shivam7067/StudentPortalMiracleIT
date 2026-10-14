const Course = require('../models/course.model');

// ==================== GET ALL COURSES ====================
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email').sort({ createdAt: -1 });

    const formatted = courses.map((c) => ({
      ...c.toObject(),
      id: c.code || c._id.toString(),
      _id: c._id,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message,
    });
  }
};

// ==================== GET SINGLE COURSE ====================
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    let course = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(id).populate('teacher', 'name email');
    }
    if (!course) {
      course = await Course.findOne({ code: id.toUpperCase() }).populate('teacher', 'name email');
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        id: course.code,
      },
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course details',
      error: error.message,
    });
  }
};

// ==================== CREATE COURSE (TEACHER) ====================
const createCourse = async (req, res) => {
  try {
    const {
      code,
      title,
      instructor,
      description,
      level,
      duration,
      enrolledStudents,
      maxCapacity,
      projectsCount,
      status,
      tags,
      badge,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Course title is required',
      });
    }

    // Generate course code if not provided
    let finalCode = code ? code.trim().toUpperCase() : '';
    if (!finalCode) {
      const count = await Course.countDocuments();
      finalCode = `CRS-${100 + count + 1}`;
    }

    // Check duplicate code
    const existingCode = await Course.findOne({ code: finalCode });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: `Course with code ${finalCode} already exists`,
      });
    }

    // Normalize tags
    let formattedTags = [];
    if (Array.isArray(tags)) {
      formattedTags = tags;
    } else if (typeof tags === 'string') {
      formattedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const newCourse = new Course({
      code: finalCode,
      title: title.trim(),
      teacher: req.user?.id || null,
      instructor: instructor || req.user?.name || 'Rahul Sharma',
      description: description || '',
      level: level || 'Intermediate',
      duration: duration || '6 Months',
      enrolledStudents: Number(enrolledStudents) || 0,
      maxCapacity: Number(maxCapacity) || 50,
      projectsCount: projectsCount || '6 Projects',
      status: status || 'Active',
      tags: formattedTags,
      badge: badge || 'Popular',
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        ...newCourse.toObject(),
        id: newCourse.code,
      },
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message,
    });
  }
};

// ==================== UPDATE COURSE (TEACHER) ====================
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    let course = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(id);
    }
    if (!course) {
      course = await Course.findOne({ code: id.toUpperCase() });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const updates = req.body;

    if (updates.tags) {
      if (typeof updates.tags === 'string') {
        updates.tags = updates.tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    Object.keys(updates).forEach((key) => {
      if (key !== '_id' && key !== '__v') {
        course[key] = updates[key];
      }
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: {
        ...course.toObject(),
        id: course.code,
      },
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message,
    });
  }
};

// ==================== DELETE COURSE (TEACHER) ====================
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Course.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Course.findOneAndDelete({ code: id.toUpperCase() });
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Course not found to delete',
      });
    }

    res.status(200).json({
      success: true,
      message: `Course '${deleted.title}' deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCourses,
  getCourses: getAllCourses, // alias for compatibility
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
