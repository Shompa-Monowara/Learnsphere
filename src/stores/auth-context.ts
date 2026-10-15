import { createContext, useContext } from "react"

export type Role = "student" | "teacher" | "admin"

export interface User {
  _id: string
  name: string
  email: string
  role: Role
  avatar?: string
  bio?: string
  headline?: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: "student" | "teacher"
}

export interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string, remember: boolean) => Promise<User>
  register: (data: RegisterPayload) => Promise<User>
  logout: () => void
  updateUser: (patch: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}