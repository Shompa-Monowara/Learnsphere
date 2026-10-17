import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { api, getErrorMessage } from "@/services/api"
import { TeacherContext } from "./teacher-context"
import type { TeacherDashboardData } from "./types"

export default function TeacherProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TeacherDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  
  const refresh = useCallback(async () => {
    try {
      const res = await api.get<TeacherDashboardData>("/dashboard/teacher")
      setData(res.data)
      setError("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])


  useEffect(() => {
    let alive = true
    api
      .get<TeacherDashboardData>("/dashboard/teacher")
      .then((res) => {
        if (!alive) return
        setData(res.data)
        setError("")
      })
      .catch((err) => {
        if (alive) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(() => ({ data, loading, error, refresh }), [data, loading, error, refresh])

  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
}