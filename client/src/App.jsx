import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';

// Student Layout & Pages
import StudentLayout from './layouts/StudentLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import CodingPractice from './pages/CodingPractice';
import Exams from './pages/Exams';
import Assignments from './pages/Assignments';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import Certificates from './pages/Certificates';
import Placement from './pages/Placement';
import Announcements from './pages/Announcements';
import Doubts from './pages/Doubts';
import Mentor from './pages/Mentor';
import Feedback from './pages/Feedback';
import Leaderboard from './pages/Leaderboard';
import Goals from './pages/Goals';
import Projects from './pages/Projects';
import IDCard from './pages/IDCard';

// Teacher Layout & Pages
import TeacherLayout from './layouts/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentList from './pages/teacher/StudentList';
import StudentForm from './pages/teacher/StudentForm';
import StudentDetails from './pages/teacher/StudentDetails';
import CourseList from './pages/teacher/CourseList';
import CourseForm from './pages/teacher/CourseForm';
import TeacherEnrollment from './pages/teacher/TeacherEnrollment';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherTests from './pages/teacher/TeacherTests';
import TeacherAnnouncements from './pages/teacher/TeacherAnnouncements';
import TeacherPlacement from './pages/teacher/TeacherPlacement';
import TeacherReports from './pages/teacher/TeacherReports';
import TeacherSettings from './pages/teacher/TeacherSettings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Student Portal Routes (/student/*) */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="coding-practice" element={<CodingPractice />} />
            <Route path="exams" element={<Exams />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="placement" element={<Placement />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="doubts" element={<Doubts />} />
            <Route path="mentor" element={<Mentor />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="goals" element={<Goals />} />
            <Route path="projects" element={<Projects />} />
            <Route path="id-card" element={<IDCard />} />
          </Route>

          {/* Protected Teacher / Faculty Routes (/teacher/*) */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />

            {/* Student Management */}
            <Route path="students" element={<StudentList />} />
            <Route path="students/add" element={<StudentForm />} />
            <Route path="students/:id" element={<StudentDetails />} />
            <Route path="students/edit/:id" element={<StudentForm />} />

            {/* Course Management */}
            <Route path="courses" element={<CourseList />} />
            <Route path="courses/add" element={<CourseForm />} />
            <Route path="courses/edit/:id" element={<CourseForm />} />

            {/* Teacher Operations */}
            <Route path="enrollment" element={<TeacherEnrollment />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="tests" element={<TeacherTests />} />
            <Route path="announcements" element={<TeacherAnnouncements />} />
            <Route path="placement" element={<TeacherPlacement />} />
            <Route path="reports" element={<TeacherReports />} />
            <Route path="settings" element={<TeacherSettings />} />
          </Route>

          {/* Backward compatibility for /portal/* routes */}
          <Route path="/portal/*" element={<Navigate to="/student/dashboard" replace />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
