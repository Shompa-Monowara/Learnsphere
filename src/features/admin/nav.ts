import {
  Bell,
  BookOpen,
  ChartColumn,
  CreditCard,
  Gauge,
  Globe,
  GraduationCap,
  Inbox,
  Settings,
  Tags,
  Users,
} from "lucide-react"
import type { NavItem } from "@/components/dashboard/types"

export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", to: "/admin", icon: Gauge, end: true },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Courses", to: "/admin/courses", icon: BookOpen, badgeKey: "courses" },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Instructors", to: "/admin/instructors", icon: GraduationCap },
  { label: "Reports", to: "/admin/reports", icon: ChartColumn },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Messages", to: "/admin/messages", icon: Inbox },
  { label: "Site Settings", to: "/admin/site-settings", icon: Globe },
  { label: "Notifications", to: "/admin/notifications", icon: Bell, badgeKey: "notifications" },
  { label: "Settings", to: "/admin/settings", icon: Settings },
]