import DashboardLayout from "@/layouts/DashboardLayout"
import AdminProvider from "@/features/admin/AdminProvider"
import ToastProvider from "@/features/admin/ToastProvider"
import { ADMIN_NAV } from "@/features/admin/nav"
import { useAdmin } from "@/features/admin/admin-context"

function AdminShell() {
  const { data, unread } = useAdmin()
  const badges = {
    courses: data?.stats.coursesByStatus.pending ?? 0,
    notifications: unread,
  }

  return (
    <DashboardLayout
      items={ADMIN_NAV}
      label="Control center"
      badges={badges}
      notificationsTo="/admin/notifications"
      accent="dark"
      promo={{
        title: "Admin toolkit",
        text: "Audit logs, bulk moderation, and advanced platform controls.",
        to: "/admin/reports",
        cta: "Open reports",
      }}
    />
  )
}

export default function AdminLayout() {
  return (
    <AdminProvider>
      <ToastProvider>
        <AdminShell />
      </ToastProvider>
    </AdminProvider>
  )
}