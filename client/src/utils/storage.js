import studentsInitialData from '../data/students.json';
import coursesInitialData from '../data/courses.json';
import teachersData from '../data/teachers.json';

const STUDENTS_STORAGE_KEY = 'portal_students_data';
const COURSES_STORAGE_KEY = 'portal_courses_data';

// ==================== STUDENTS STORAGE ==================== //

export function getStoredStudents() {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(studentsInitialData));
      return studentsInitialData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading students from localStorage:', err);
    return studentsInitialData;
  }
}

export function saveStoredStudents(students) {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students to localStorage:', err);
  }
}

export function getStudentById(id) {
  const students = getStoredStudents();
  return students.find((s) => s.id === id || s.rollNo === id) || null;
}

export function addStudent(newStudentData) {
  const students = getStoredStudents();
  const nextNum = students.length + 1;
  const newStudent = {
    id: newStudentData.id || `ST${String(nextNum).padStart(3, '0')}`,
    rollNo: newStudentData.rollNo || `MIT-${String(840 + nextNum).padStart(4, '0')}`,
    name: newStudentData.name || '',
    email: newStudentData.email || '',
    password: newStudentData.password || 'student123',
    phone: newStudentData.phone || '',
    course: newStudentData.course || 'MERN Stack Development',
    batch: newStudentData.batch || 'MIRACLE-2026-MERN-02',
    enrollmentDate: newStudentData.enrollmentDate || new Date().toISOString().split('T')[0],
    status: newStudentData.status || 'Active',
    attendance: Number(newStudentData.attendance) || 95,
    cgpa: Number(newStudentData.cgpa) || 8.5,
    assignmentsSubmitted: Number(newStudentData.assignmentsSubmitted) || 0,
    assignmentsTotal: 19,
    testsGiven: Number(newStudentData.testsGiven) || 0,
    avgScore: Number(newStudentData.avgScore) || 85,
    placementStatus: newStudentData.placementStatus || 'Eligible',
    avatar:
      newStudentData.avatar ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
    address: newStudentData.address || 'Bengaluru, Karnataka',
    ...newStudentData,
  };

  const updated = [newStudent, ...students];
  saveStoredStudents(updated);
  return newStudent;
}

export function updateStudent(id, updatedFields) {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === id || s.rollNo === id);
  if (index === -1) return null;

  students[index] = { ...students[index], ...updatedFields };
  saveStoredStudents(students);
  return students[index];
}

export function deleteStudent(id) {
  const students = getStoredStudents();
  const filtered = students.filter((s) => s.id !== id && s.rollNo !== id);
  saveStoredStudents(filtered);
  return filtered;
}

// ==================== COURSES STORAGE ==================== //

export function getStoredCourses() {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesInitialData));
      return coursesInitialData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading courses from localStorage:', err);
    return coursesInitialData;
  }
}

export function saveStoredCourses(courses) {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch (err) {
    console.error('Error saving courses to localStorage:', err);
  }
}

export function getCourseById(id) {
  const courses = getStoredCourses();
  return courses.find((c) => c.id === id || c.code === id) || null;
}

export function addCourse(newCourseData) {
  const courses = getStoredCourses();
  const nextNum = 100 + courses.length + 1;
  const newCourse = {
    id: newCourseData.id || `CRS-${nextNum}`,
    code: newCourseData.code || `CRS-${courses.length + 1}`,
    title: newCourseData.title || '',
    instructor: newCourseData.instructor || 'Rahul Sharma',
    description: newCourseData.description || '',
    level: newCourseData.level || 'Intermediate',
    duration: newCourseData.duration || '6 Months',
    enrolledStudents: Number(newCourseData.enrolledStudents) || 0,
    maxCapacity: Number(newCourseData.maxCapacity) || 50,
    projectsCount: newCourseData.projectsCount || '6 Projects',
    status: newCourseData.status || 'Active',
    tags: Array.isArray(newCourseData.tags)
      ? newCourseData.tags
      : (newCourseData.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    badge: newCourseData.badge || 'New',
    ...newCourseData,
  };

  const updated = [newCourse, ...courses];
  saveStoredCourses(updated);
  return newCourse;
}

export function updateCourse(id, updatedFields) {
  const courses = getStoredCourses();
  const index = courses.findIndex((c) => c.id === id || c.code === id);
  if (index === -1) return null;

  if (typeof updatedFields.tags === 'string') {
    updatedFields.tags = updatedFields.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  courses[index] = { ...courses[index], ...updatedFields };
  saveStoredCourses(courses);
  return courses[index];
}

export function deleteCourse(id) {
  const courses = getStoredCourses();
  const filtered = courses.filter((c) => c.id !== id && c.code !== id);
  saveStoredCourses(filtered);
  return filtered;
}

// ==================== TEACHERS LOOKUP ==================== //

export function getTeachersList() {
  return teachersData;
}
