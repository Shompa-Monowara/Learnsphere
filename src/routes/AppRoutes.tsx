import { Navigate, Routes, Route } from "react-router-dom"
import AuthLayout from "@/layouts/AuthLayout"
import PublicLayout from "@/layouts/PublicLayout"
import StudentLayout from "@/layouts/StudentLayout"
import TeacherLayout from "@/layouts/TeacherLayout"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import ForgotPassword from "@/pages/auth/ForgotPassword"
import ResetPassword from "@/pages/auth/ResetPassword"
import Blog from "@/pages/public/Blog"
import BlogPost from "@/pages/public/BlogPost"
import Careers from "@/pages/public/Careers"
import Contact from "@/pages/public/Contact"
import PublicComingSoon from "@/pages/public/ComingSoon"
import CourseDetails from "@/pages/public/CourseDetails"
import Courses from "@/pages/public/Courses"
import Faq from "@/pages/public/Faq"
import Home from "@/pages/public/Home"
import InstructorsPage from "@/pages/public/Instructors"
import Pricing from "@/pages/public/Pricing"
import Privacy from "@/pages/public/Privacy"
import Terms from "@/pages/public/Terms"
import Assignments from "@/pages/student/Assignments"
import Certificates from "@/pages/student/Certificates"
import CheckoutSuccess from "@/pages/student/CheckoutSuccess"
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
import TeacherMessages from "@/pages/teacher/Messages"
import TeacherNotifications from "@/pages/teacher/Notifications"
import TeacherOverview from "@/pages/teacher/Overview"
import TeacherQuizzes from "@/pages/teacher/Quizzes"
import TeacherReviews from "@/pages/teacher/Reviews"
import TeacherSettings from "@/pages/teacher/Settings"
import AdminLayout from "@/layouts/AdminLayout"
import AdminNotifications from "@/pages/admin/Notifications"
import AdminCategories from "@/pages/admin/Categories"
import AdminPayments from "@/pages/admin/Payments"
import AdminReports from "@/pages/admin/Reports"
import AdminCourses from "@/pages/admin/Courses"
import AdminMessages from "@/pages/admin/Messages"
import AdminSettings from "@/pages/admin/Settings"
import AdminSiteSettings from "@/pages/admin/SiteSettings"
import AdminUsers from "@/pages/admin/Users"
import AdminOverview from "@/pages/admin/Overview"
import TeacherStudents from "@/pages/teacher/Students"
import SubscriptionSuccess from "@/pages/teacher/SubscriptionSuccess"
import ProtectedRoute from "./ProtectedRoute"
import OAuthCallback from "@/features/auth/OAuthCallback"
import Features from "@/pages/public/Features"
import About from "@/pages/public/About"
import VerifyCertificate from "@/pages/public/VerifyCertificate"

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:verificationId" element={<VerifyCertificate />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/instructors" element={<InstructorsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/coming-soon" element={<PublicComingSoon />} />
      </Route>

      <Route path="/auth/callback" element={<OAuthCallback />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute roles={["student"]} />}>
        <Route path="/student/learn/:courseId" element={<CoursePlayer />} />
        <Route path="/student/checkout/success" element={<CheckoutSuccess />} />

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
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["teacher"]} />}>
        <Route path="/teacher/subscription/success" element={<SubscriptionSuccess />} />
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
          <Route path="messages" element={<TeacherMessages />} />
          <Route path="notifications" element={<TeacherNotifications />} />
          <Route path="settings" element={<TeacherSettings />} />
          <Route path="*" element={<Navigate to="/teacher" replace />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="site-settings" element={<AdminSiteSettings />} />
        </Route>
      </Route>
    </Routes>
  )
}