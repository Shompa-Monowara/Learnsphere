import {
  Award,
  Bell,
  BookOpen,
  CircleHelp,
  Gauge,
  Heart,
  MessageCircle,
  Settings,
  SquarePen,
  TrendingUp,
} from "lucide-react"
import type { NavItem } from "@/components/dashboard/types"

export const STUDENT_NAV: NavItem[] = [
  { label: "Overview", to: "/student", icon: Gauge, end: true },
  { label: "My Courses", to: "/student/courses", icon: BookOpen },
  { label: "Assignments", to: "/student/assignments", icon: SquarePen, badgeKey: "assignments" },
  { label: "Quizzes", to: "/student/quizzes", icon: CircleHelp, badgeKey: "quizzes" },
  { label: "Progress", to: "/student/progress", icon: TrendingUp },
  { label: "Certificates", to: "/student/certificates", icon: Award },
  { label: "Wishlist", to: "/student/wishlist", icon: Heart },
  { label: "Messages", to: "/student/messages", icon: MessageCircle, badgeKey: "messages" },
  { label: "Notifications", to: "/student/notifications", icon: Bell, badgeKey: "notifications" },
  { label: "Settings", to: "/student/settings", icon: Settings },
]