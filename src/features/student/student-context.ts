import { createContext, useContext } from "react"
import type { StudentDashboardData } from "./types"

export interface StudentContextValue {
  data: StudentDashboardData | null
  loading: boolean
  error: string
  refresh: () => Promise<void>
}

export const StudentContext = createContext<StudentContextValue | null>(null)

export function useStudent() {
  const context = useContext(StudentContext)
  if (!context) throw new Error("useStudent must be used inside StudentProvider")
  return context
}