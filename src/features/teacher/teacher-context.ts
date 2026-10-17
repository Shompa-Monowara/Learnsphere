import { createContext, useContext } from "react"
import type { TeacherDashboardData } from "./types"

export interface TeacherContextValue {
  data: TeacherDashboardData | null
  loading: boolean
  error: string
  refresh: () => Promise<void>
}

export const TeacherContext = createContext<TeacherContextValue | null>(null)

export function useTeacher() {
  const context = useContext(TeacherContext)
  if (!context) throw new Error("useTeacher must be used inside TeacherProvider")
  return context
}