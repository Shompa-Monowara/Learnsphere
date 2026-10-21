export type UserRole = "student" | "teacher" | "admin"

export interface AdminUserRow {
  _id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  headline?: string
  bio?: string
  isBlocked?: boolean
  createdAt: string
  coursesCount: number
}

export interface UsersResponse {
  users: AdminUserRow[]
  total: number
  page: number
  pages: number
  summary: {
    total: number
    students: number
    teachers: number
    admins: number
    suspended: number
  }
}

export type SortKey = "name" | "role" | "status" | "courses" | "joined"