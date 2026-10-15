import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { api } from "@/services/api"
import { useAuth } from "@/stores/auth-context"

const EMPTY = new Set<string>()

export function useWishlist() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [ids, setIds] = useState<Set<string>>(EMPTY)

  useEffect(() => {
    if (!user) return
    let active = true
    api
      .get("/wishlist")
      .then((res) => {
        if (active) setIds(new Set((res.data.courses as ({ _id: string } | null)[]).filter(Boolean).map((c) => c!._id)))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [user])

  const toggle = useCallback(
    async (id: string) => {
      if (!user) {
        navigate("/login", { state: { from: location.pathname } })
        return
      }
      const had = ids.has(id)
      const flip = (add: boolean) =>
        setIds((prev) => {
          const next = new Set(prev)
          if (add) next.add(id)
          else next.delete(id)
          return next
        })
      flip(!had)
      try {
        if (had) await api.delete(`/wishlist/${id}`)
        else await api.post(`/wishlist/${id}`)
      } catch {
        flip(had)
      }
    },
    [user, ids, navigate, location.pathname]
  )

  return { ids: user ? ids : EMPTY, toggle }
}