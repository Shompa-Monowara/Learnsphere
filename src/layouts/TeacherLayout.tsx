import DashboardLayout from "@/layouts/DashboardLayout"
import TeacherProvider from "@/features/teacher/TeacherProvider"
import { TEACHER_NAV } from "@/features/teacher/nav"
import { useTeacher } from "@/features/teacher/teacher-context"

function TeacherShell() {
  const { data } = useTeacher()
  const badges = {
    assignments: data?.badges.assignments ?? 0,
    messages: data?.badges.messages ?? 0,
    notifications: data?.badges.notifications ?? 0,
  }

  return (
    <DashboardLayout
      items={TEACHER_NAV}
      label="Teaching workspace"
      badges={badges}
      notificationsTo="/teacher/notifications"
      accent="orange"
      promo={{
        title: "Upgrade to Academy",
        text: "Unlock unlimited students, branded portals, and priority support.",
        to: "/pricing",
        cta: "See plans",
      }}
    />
  )
}

export default function TeacherLayout() {
  return (
    <TeacherProvider>
      <TeacherShell />
    </TeacherProvider>
  )
}