import { createContext, useContext } from "react"
import type { AdminStatsData } from "./types"

export interface AdminContextValue {
  data: AdminStatsData | null
  unread: number
  loading: boolean
  error: string
  refresh: () => Promise<void>
}

export const AdminContext = createContext<AdminContextValue | null>(null)

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) throw new Error("useAdmin must be used inside AdminProvider")
  return context
}