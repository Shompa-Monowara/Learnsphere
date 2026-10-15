import { api } from "@/services/api"
import type { StudentDashboardData } from "./types"

export async function fetchStudentDashboard() {
  const { data } = await api.get<StudentDashboardData>("/dashboard/student")
  return data
}