import { useCallback, useEffect, useState } from "react"
import { api, getErrorMessage } from "@/services/api"

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  /* Manual reload (retry button, submit er por refresh) */
  const reload = useCallback(async () => {
    try {
      const res = await api.get<T>(url)
      setData(res.data)
      setError("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [url])

  /* Prothom load: unmount hole state update hoy na */
  useEffect(() => {
    let alive = true
    api
      .get<T>(url)
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
  }, [url])

  return { data, setData, loading, error, reload }
}