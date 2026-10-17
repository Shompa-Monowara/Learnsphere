import DashboardLayout from "@/layouts/DashboardLayout"
import StudentProvider from "@/features/student/StudentProvider"
import { STUDENT_NAV } from "@/features/student/nav"
import { useStudent } from "@/features/student/student-context"

function StudentShell() {
  const { data } = useStudent()
  const badges = {
    assignments: data?.badges.assignments ?? 0,
    notifications: data?.badges.notifications ?? 0,
    quizzes: data?.badges.quizzes ?? 0,
    messages: data?.badges.messages ?? 0,
  }
  return (
    <DashboardLayout
      items={STUDENT_NAV}
      label="Learning workspace"
      badges={badges}
      notificationsTo="/student/notifications"
      accent="teal"
      promo={{
        title: "Keep learning",
        text: "Explore new courses and grow your skills every day.",
        to: "/courses",
        cta: "Browse courses",
      }}
    />
  )
}

export default function StudentLayout() {
  return (
    <StudentProvider>
      <StudentShell />
    </StudentProvider>
  )
}