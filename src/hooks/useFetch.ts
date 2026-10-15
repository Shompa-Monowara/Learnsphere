import { useCallback, useEffect, useState } from "react"
import { api, getErrorMessage } from "@/services/api"

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
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

  useEffect(() => {
    void load()
  }, [load])

  return { data, setData, loading, error, reload: load }
}