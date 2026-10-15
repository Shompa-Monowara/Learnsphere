import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { getErrorMessage } from "@/services/api"
import { fetchStudentDashboard } from "./api"
import { StudentContext } from "./student-context"
import type { StudentDashboardData } from "./types"

export default function StudentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const refresh = useCallback(async () => {
    try {
      setData(await fetchStudentDashboard())
      setError("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const res = await fetchStudentDashboard()
        if (isMounted) {
          setData(res)
          setError("")
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(
    () => ({ data, loading, error, refresh }),
    [data, loading, error, refresh]
  )

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  )
}