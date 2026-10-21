import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { api, getErrorMessage } from "@/services/api"
import { AdminContext } from "./admin-context"
import type { AdminStatsData } from "./types"

async function load() {
  const [stats, notes] = await Promise.all([
    api.get<AdminStatsData>("/admin/stats"),
    api.get<{ unread: number }>("/notifications").catch(() => null),
  ])
  return { stats: stats.data, unread: notes?.data.unread ?? 0 }
}

export default function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminStatsData | null>(null)
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const refresh = useCallback(async () => {
    try {
      const res = await load()
      setData(res.stats)
      setUnread(res.unread)
      setError("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let alive = true
    load()
      .then((res) => {
        if (!alive) return
        setData(res.stats)
        setUnread(res.unread)
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

  const value = useMemo(() => ({ data, unread, loading, error, refresh }), [data, unread, loading, error, refresh])

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}