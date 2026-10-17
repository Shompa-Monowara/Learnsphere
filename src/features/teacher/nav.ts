import {
  Bell,
  BookOpen,
  CircleHelp,
  CirclePlus,
  Gauge,
  MessageCircle,
  Settings,
  SquarePen,
  Star,
  Users,
  Wallet,
} from "lucide-react"
import type { NavItem } from "@/components/dashboard/types"

export const TEACHER_NAV: NavItem[] = [
  { label: "Overview", to: "/teacher", icon: Gauge, end: true },
  { label: "My Courses", to: "/teacher/courses", icon: BookOpen },
  { label: "Course Builder", to: "/teacher/builder", icon: CirclePlus },
  { label: "Quizzes", to: "/teacher/quizzes", icon: CircleHelp },
  { label: "Assignments", to: "/teacher/assignments", icon: SquarePen, badgeKey: "assignments" },
  { label: "Students", to: "/teacher/students", icon: Users },
  { label: "Reviews", to: "/teacher/reviews", icon: Star },
  { label: "Earnings", to: "/teacher/earnings", icon: Wallet },
  { label: "Messages", to: "/teacher/messages", icon: MessageCircle, badgeKey: "messages" },
  { label: "Notifications", to: "/teacher/notifications", icon: Bell, badgeKey: "notifications" },
  { label: "Settings", to: "/teacher/settings", icon: Settings },
]