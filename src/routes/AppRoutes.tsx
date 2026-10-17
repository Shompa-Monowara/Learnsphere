import { Routes, Route } from "react-router-dom"
import AuthLayout from "@/layouts/AuthLayout"
import PublicLayout from "@/layouts/PublicLayout"
import StudentLayout from "@/layouts/StudentLayout"
import TeacherLayout from "@/layouts/TeacherLayout"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import CourseDetails from "@/pages/public/CourseDetails"
import Courses from "@/pages/public/Courses"
import Home from "@/pages/public/Home"
import DashboardPlaceholder from "@/pages/shared/DashboardPlaceholder"
import Assignments from "@/pages/student/Assignments"
import Certificates from "@/pages/student/Certificates"
import ComingSoon from "@/pages/student/ComingSoon"
import CoursePlayer from "@/pages/student/CoursePlayer"
import Messages from "@/pages/student/Messages"
import MyCourses from "@/pages/student/MyCourses"
import Notifications from "@/pages/student/Notifications"
import Overview from "@/pages/student/Overview"
import Progress from "@/pages/student/Progress"
import QuizPlayer from "@/pages/student/QuizPlayer"
import Quizzes from "@/pages/student/Quizzes"
import Settings from "@/pages/student/Settings"
import Wishlist from "@/pages/student/Wishlist"
import TeacherAssignments from "@/pages/teacher/Assignments"
import TeacherBuilder from "@/pages/teacher/CourseBuilder"
import TeacherCourses from "@/pages/teacher/MyCourses"
import TeacherEarnings from "@/pages/teacher/Earnings"
import TeacherOverview from "@/pages/teacher/Overview"
import TeacherQuizzes from "@/pages/teacher/Quizzes"
import TeacherReviews from "@/pages/teacher/Reviews"
import TeacherStudents from "@/pages/teacher/Students"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute roles={["student"]} />}>
        <Route path="/student/learn/:courseId" element={<CoursePlayer />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Overview />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/:id" element={<QuizPlayer />} />
          <Route path="progress" element={<Progress />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherOverview />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="builder" element={<TeacherBuilder />} />
          <Route path="builder/:id" element={<TeacherBuilder />} />
          <Route path="quizzes" element={<TeacherQuizzes />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="reviews" element={<TeacherReviews />} />
          <Route path="earnings" element={<TeacherEarnings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<DashboardPlaceholder />} />
      </Route>
    </Routes>
  )
}