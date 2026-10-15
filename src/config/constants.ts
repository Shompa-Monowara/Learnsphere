export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Instructors", to: "/instructors" },
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const

export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
} as const

export const ROLE_HOME = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
} as const