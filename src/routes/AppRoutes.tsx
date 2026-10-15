import { Routes, Route } from "react-router-dom"
import AuthLayout from "@/layouts/AuthLayout"
import PublicLayout from "@/layouts/PublicLayout"
import StudentLayout from "@/layouts/StudentLayout"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import CourseDetails from "@/pages/public/CourseDetails"
import Courses from "@/pages/public/Courses"
import Home from "@/pages/public/Home"
import DashboardPlaceholder from "@/pages/shared/DashboardPlaceholder"
import Assignments from "@/pages/student/Assignments"
import Certificates from "@/pages/student/Certificates"
import ComingSoon from "@/pages/student/ComingSoon"
import Messages from "@/pages/student/Messages"
import MyCourses from "@/pages/student/MyCourses"
import Notifications from "@/pages/student/Notifications"
import Overview from "@/pages/student/Overview"
import Progress from "@/pages/student/Progress"
import QuizPlayer from "@/pages/student/QuizPlayer"
import Quizzes from "@/pages/student/Quizzes"
import Settings from "@/pages/student/Settings"
import Wishlist from "@/pages/student/Wishlist"
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
        <Route path="/teacher" element={<DashboardPlaceholder />} />
      </Route>
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<DashboardPlaceholder />} />
      </Route>
    </Routes>
  )
}