const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacher.model');
const Student = require('../models/student.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrolment.model');
const Attendance = require('../models/attendance.model');
const Assignment = require('../models/assignment.model');
const Submission = require('../models/submission.model');
const Test = require('../models/test.model');
const TestResult = require('../models/testResult.model');
const PlacementApplication = require('../models/placementApplication.model');
const Feedback = require('../models/feedback.model');
const Announcement = require('../models/announcement.model');

// Initial seed data
const initialTeachers = [
  {
    name: 'Rahul Sharma',
    email: 'rahul@institute.com',
    password: 'teacher123',
    phone: '9876543210',
    subject: 'Full Stack Development',
    experience: '5 Years',
    status: 'Active',
    role: 'teacher',
  },
  {
    name: 'Priya Verma',
    email: 'priya@institute.com',
    password: 'teacher456',
    phone: '9876543211',
    subject: 'Data Structures & Algorithms',
    experience: '4 Years',
    status: 'Active',
    role: 'teacher',
  },
];

// Pure student identity schema (Requirement 1)
const initialStudents = [
  {
    rollNo: 'MIT-0842',
    name: 'Priya Sundaram',
    email: 'student@email.com',
    password: 'student123',
    phone: '+91 98765 43210',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    address: 'Indiranagar, Bengaluru, Karnataka, 560038',
    bio: 'Passionate full-stack developer in training. Focused on React 19, Node.js microservices, and high-performance cloud applications.',
    github: 'https://github.com/priyasundaram',
    linkedin: 'https://linkedin.com/in/priyasundaram',
    role: 'student',
  },
  {
    rollNo: 'MIT-0843',
    name: 'Kunal Mehra',
    email: 'kunal.mehra@institute.com',
    password: 'student123',
    phone: '+91 98765 43212',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    address: 'Koramangala, Bengaluru, Karnataka',
    bio: 'Backend & systems engineering enthusiast.',
    github: 'https://github.com/kunalmehra',
    linkedin: 'https://linkedin.com/in/kunalmehra',
    role: 'student',
  },
  {
    rollNo: 'MIT-0844',
    name: 'Aarav Gupta',
    email: 'aarav.gupta@institute.com',
    password: 'student123',
    phone: '+91 98765 43213',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    address: 'Whitefield, Bengaluru, Karnataka',
    bio: 'Java enterprise systems and cloud architectures.',
    github: 'https://github.com/aaravgupta',
    linkedin: 'https://linkedin.com/in/aaravgupta',
    role: 'student',
  },
];

const initialCourses = [
  {
    code: 'FS-MERN',
    title: 'MERN Stack Development',
    instructor: 'Rahul Sharma',
    description: 'Master React 19, Node.js, Express, MongoDB, Next.js, and modern full-stack deployment architecture.',
    level: 'Intermediate',
    duration: '6 Months',
    maxCapacity: 50,
    projectsCount: '8 Projects',
    status: 'Active',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    badge: 'Most Popular',
  },
  {
    code: 'CS-DSA',
    title: 'Data Structures & Algorithms',
    instructor: 'Priya Verma',
    description: 'Crack technical interviews with comprehensive coverage of 450+ LeetCode problems, trees, graphs, and DP.',
    level: 'Intermediate to Advanced',
    duration: '4 Months',
    maxCapacity: 60,
    projectsCount: '450+ Problems',
    status: 'Active',
    tags: ['C++', 'Java', 'Algorithms', 'System Design', 'LeetCode'],
    badge: 'Interview Focus',
  },
  {
    code: 'ENT-JAVA',
    title: 'Java Full Stack Engineering',
    instructor: 'Rahul Sharma',
    description: 'Enterprise application engineering with Core Java, Spring Boot, Microservices, Hibernate, and Angular/React.',
    level: 'Advanced',
    duration: '6 Months',
    maxCapacity: 40,
    projectsCount: '6 Projects',
    status: 'Active',
    tags: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker'],
    badge: 'Enterprise Ready',
  },
];

const initialAssignments = [
  {
    title: 'Authentication Microservice with JWT & Refresh Tokens',
    subject: 'Backend Security',
    courseName: 'MERN Stack Development',
    deadline: 'Tomorrow at 11:59 PM',
    maxMarks: 50,
    status: 'Pending Submission',
    assignedDate: '2026-10-01',
    description: 'Build an express service with secure httpOnly cookie authentication, rate limiting, and bcrypt password hashing.',
  },
  {
    title: 'E-Commerce Cart State Reducer & Context',
    subject: 'React Fundamentals',
    courseName: 'MERN Stack Development',
    deadline: 'Submitted',
    maxMarks: 50,
    status: 'Graded',
    assignedDate: '2026-09-22',
    description: 'State machine for cart management with persistent local state.',
  },
];

const initialAnnouncements = [
  {
    title: 'MiracleIT Inter-Batch Hackathon 2026 Announced!',
    category: 'Hackathon',
    content: 'Registrations are now open for the 48-Hour Full-Stack Hackathon. Winner gets direct interview placement with Top Tier partner companies and cash prize.',
    urgent: true,
    date: 'Today, 09:30 AM',
  },
  {
    title: 'Special Masterclass on Next.js 15 App Router & Server Actions',
    category: 'Masterclass',
    content: 'Join Staff Engineer Rohan Bose from HyperScale on Saturday 05:00 PM for an exclusive session on server side rendering and streaming architectures.',
    urgent: false,
    date: 'Yesterday',
  },
  {
    title: 'Mid-Term Examination Schedule Released for Batch MERN-02',
    category: 'Exams',
    content: 'The exams portal will open on Oct 12th. Please review system compatibility and ensure webcam/microphone access is tested.',
    urgent: true,
    date: 'Oct 02, 2026',
  },
];

async function seedDatabase() {
  try {
    // 1. Seed Teachers
    const teacherMap = {};
    for (const t of initialTeachers) {
      let doc = await Teacher.findOne({ email: t.email });
      if (!doc) {
        const hashedPassword = await bcrypt.hash(t.password, 10);
        doc = await Teacher.create({ ...t, password: hashedPassword });
        console.log(`Seeded teacher: ${t.email}`);
      }
      teacherMap[t.name] = doc._id;
    }

    // 2. Seed Students
    const studentMap = {};
    for (const s of initialStudents) {
      let doc = await Student.findOne({ email: s.email });
      if (!doc) {
        const hashedPassword = await bcrypt.hash(s.password, 10);
        doc = await Student.create({ ...s, password: hashedPassword });
        console.log(`Seeded student: ${s.email} (${s.rollNo})`);
      }
      studentMap[s.rollNo] = doc._id;
    }

    // 3. Seed Courses with Teacher reference
    const courseMap = {};
    for (const c of initialCourses) {
      let doc = await Course.findOne({ code: c.code });
      const teacherId = teacherMap[c.instructor] || null;
      if (!doc) {
        doc = await Course.create({ ...c, teacher: teacherId });
        console.log(`Seeded course: ${c.code}`);
      } else if (!doc.teacher && teacherId) {
        doc.teacher = teacherId;
        await doc.save();
      }
      courseMap[c.title] = doc._id;
      courseMap[c.code] = doc._id;
    }

    // 4. Seed Enrollments
    const mernCourseId = courseMap['MERN Stack Development'] || courseMap['FS-MERN'];
    const dsaCourseId = courseMap['Data Structures & Algorithms'] || courseMap['CS-DSA'];

    if (mernCourseId && studentMap['MIT-0842']) {
      const exists = await Enrollment.findOne({ student: studentMap['MIT-0842'], course: mernCourseId });
      if (!exists) {
        await Enrollment.create({ student: studentMap['MIT-0842'], course: mernCourseId, status: 'active' });
        console.log('Seeded enrollment for Priya (MERN)');
      }
    }
    if (mernCourseId && studentMap['MIT-0843']) {
      const exists = await Enrollment.findOne({ student: studentMap['MIT-0843'], course: mernCourseId });
      if (!exists) {
        await Enrollment.create({ student: studentMap['MIT-0843'], course: mernCourseId, status: 'active' });
        console.log('Seeded enrollment for Kunal (MERN)');
      }
    }
    if (dsaCourseId && studentMap['MIT-0844']) {
      const exists = await Enrollment.findOne({ student: studentMap['MIT-0844'], course: dsaCourseId });
      if (!exists) {
        await Enrollment.create({ student: studentMap['MIT-0844'], course: dsaCourseId, status: 'active' });
        console.log('Seeded enrollment for Aarav (DSA)');
      }
    }

    // 5. Seed Assignments with Course & Teacher references
    const assignmentMap = {};
    for (const asg of initialAssignments) {
      const courseId = courseMap[asg.courseName] || mernCourseId;
      const teacherId = Object.values(teacherMap)[0] || null;
      let doc = await Assignment.findOne({ title: asg.title });
      if (!doc) {
        doc = await Assignment.create({
          ...asg,
          course: courseId,
          teacher: teacherId,
        });
        console.log(`Seeded assignment: ${asg.title}`);
      } else if (!doc.course && courseId) {
        doc.course = courseId;
        doc.teacher = teacherId;
        await doc.save();
      }
      assignmentMap[asg.title] = doc._id;
    }

    // 6. Seed Submissions in dedicated Submission model
    const authAsgId = assignmentMap['Authentication Microservice with JWT & Refresh Tokens'];
    if (authAsgId) {
      if (studentMap['MIT-0842']) {
        const subExists = await Submission.findOne({ assignment: authAsgId, student: studentMap['MIT-0842'] });
        if (!subExists) {
          await Submission.create({
            assignment: authAsgId,
            student: studentMap['MIT-0842'],
            studentRoll: 'MIT-0842',
            studentName: 'Priya Sundaram',
            repoUrl: 'https://github.com/priyasundaram/auth-microservice',
            notes: 'Implemented cookie-based JWT refresh flow and route guards.',
            status: 'Pending Review',
          });
          console.log('Seeded Submission for Priya');
        }
      }

      if (studentMap['MIT-0843']) {
        const subExists = await Submission.findOne({ assignment: authAsgId, student: studentMap['MIT-0843'] });
        if (!subExists) {
          await Submission.create({
            assignment: authAsgId,
            student: studentMap['MIT-0843'],
            studentRoll: 'MIT-0843',
            studentName: 'Kunal Mehra',
            repoUrl: 'https://github.com/kunalmehra/auth-service',
            notes: 'Finished all unit tests with 92% coverage.',
            status: 'Graded',
            score: '48 / 50',
            numericScore: 48,
            feedback: 'Clean token rotation implementation. Well done.',
          });
          console.log('Seeded Submission for Kunal');
        }
      }
    }

    // 7. Seed Attendance with proper references
    const attCount = await Attendance.countDocuments();
    if (attCount === 0 && mernCourseId) {
      await Attendance.create({
        date: new Date().toISOString().split('T')[0],
        course: mernCourseId,
        courseName: 'MERN Stack Development',
        teacher: Object.values(teacherMap)[0] || null,
        records: [
          {
            student: studentMap['MIT-0842'] || null,
            studentId: studentMap['MIT-0842']?.toString() || 'MIT-0842',
            studentName: 'Priya Sundaram',
            studentRoll: 'MIT-0842',
            status: 'Present',
          },
          {
            student: studentMap['MIT-0843'] || null,
            studentId: studentMap['MIT-0843']?.toString() || 'MIT-0843',
            studentName: 'Kunal Mehra',
            studentRoll: 'MIT-0843',
            status: 'Present',
          },
          {
            student: studentMap['MIT-0844'] || null,
            studentId: studentMap['MIT-0844']?.toString() || 'MIT-0844',
            studentName: 'Aarav Gupta',
            studentRoll: 'MIT-0844',
            status: 'Present',
          },
        ],
      });
      console.log('Seeded initial attendance session into MongoDB.');
    }

    // 8. Seed Tests & TestResults (Requirements 2, 3, 7, 8)
    const testCount = await Test.countDocuments();
    if (testCount === 0) {
      const test1 = await Test.create({
        title: 'Node.js Event Loop & Streams Assessment',
        subject: 'Backend Architecture',
        course: mernCourseId,
        courseName: 'MERN Stack Development',
        teacher: Object.values(teacherMap)[0] || null,
        date: '2026-10-12',
        time: '11:00 AM - 12:30 PM',
        duration: '90 Mins',
        totalMarks: 100,
        status: 'Completed',
        instructions: 'Proctored online coding assessment.',
      });

      const test2 = await Test.create({
        title: 'Advanced React 19 Compiler & Server Actions',
        subject: 'Frontend Architecture',
        course: mernCourseId,
        courseName: 'MERN Stack Development',
        teacher: Object.values(teacherMap)[0] || null,
        date: '2026-10-25',
        time: '10:00 AM - 11:30 AM',
        duration: '90 Mins',
        totalMarks: 100,
        status: 'Scheduled',
        instructions: 'Covers React 19 action states and optimistic updates.',
      });

      // Seed Test Results
      if (studentMap['MIT-0842']) {
        await TestResult.create({
          test: test1._id,
          student: studentMap['MIT-0842'],
          scoredMarks: 94,
          totalMarks: 100,
          percentage: 94,
          percentile: 'Top 4%',
          status: 'Completed',
          feedback: 'Outstanding grasp of stream backpressure handling.',
        });
      }
      if (studentMap['MIT-0843']) {
        await TestResult.create({
          test: test1._id,
          student: studentMap['MIT-0843'],
          scoredMarks: 98,
          totalMarks: 100,
          percentage: 98,
          percentile: 'Top 1%',
          status: 'Completed',
          feedback: 'Flawless performance on event loop tick phase ordering.',
        });
      }
      console.log('Seeded initial tests and student test results.');
    }

    // 9. Seed Placement Applications (Requirements 2, 3, 8)
    const placementCount = await PlacementApplication.countDocuments();
    if (placementCount === 0 && studentMap['MIT-0842']) {
      await PlacementApplication.create({
        student: studentMap['MIT-0842'],
        company: 'CloudScale Technologies',
        role: 'Full Stack Engineer (MERN)',
        ctc: '8.5 - 12 LPA',
        location: 'Bengaluru / Hybrid',
        eligibility: 'Attendance > 80%',
        status: 'Shortlisted',
        interviewDate: 'Oct 18, 2026',
        rounds: ['Resume Screen (Passed)', 'DSA Coding Assessment (Passed)', 'System Design Round (Scheduled)'],
      });
      console.log('Seeded initial placement applications.');
    }

    // 10. Seed Feedback (Requirements 2, 3, 8)
    const feedbackCount = await Feedback.countDocuments();
    if (feedbackCount === 0 && studentMap['MIT-0842']) {
      await Feedback.create({
        student: studentMap['MIT-0842'],
        studentName: 'Priya Sundaram',
        moduleOrMentor: 'React 19 & Full Stack Architecture',
        rating: 5,
        comments: 'Excellent breakdown of React 19 server components and state management.',
        isAnonymous: false,
        status: 'Submitted',
      });
      console.log('Seeded initial student feedback.');
    }

    // 11. Seed Announcements
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
      await Announcement.insertMany(initialAnnouncements);
      console.log('Seeded initial announcements.');
    }
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

module.exports = seedDatabase;
