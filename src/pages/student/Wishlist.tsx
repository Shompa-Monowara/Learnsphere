import { Star, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import EmptyState from "@/features/student/components/EmptyState"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import type { WishItem } from "@/features/student/portal-types"
import { BTN_PRIMARY, CARD } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { api, getErrorMessage } from "@/services/api"

export default function Wishlist() {
  const navigate = useNavigate()
  const { data, setData, loading, error, reload } = useFetch<{ courses: (WishItem | null)[] }>("/wishlist")
  const [busy, setBusy] = useState("")
  const [actionError, setActionError] = useState("")

  const courses = (data?.courses ?? []).filter((c): c is WishItem => !!c)

  const remove = async (id: string) => {
    setBusy(id)
    setActionError("")
    try {
      await api.delete(`/wishlist/${id}`)
      setData((d) => (d ? { courses: d.courses.filter((c) => c && c._id !== id) } : d))
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setBusy("")
    }
  }

  const enroll = async (id: string) => {
    setBusy(id)
    setActionError("")
    try {
      await api.post(`/enrollments/${id}`)
      await api.delete(`/wishlist/${id}`).catch(() => null)
      navigate("/student/courses")
    } catch (err) {
      setActionError(getErrorMessage(err))
      setBusy("")
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader crumb="Wishlist" title="Wishlist" subtitle="Courses you've saved for later. Enroll whenever you're ready." />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        {actionError && <Notice type="error">{actionError}</Notice>}

        {courses.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            text="Tap the heart on any course to save it here."
            action={<Link to="/courses" className={BTN_PRIMARY}>Browse courses</Link>}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((c) => {
              const price = c.discountPrice ?? c.price
              return (
                <div key={c._id} className={`${CARD} flex flex-col overflow-hidden`}>
                  <Link to={`/courses/${c._id}`} className="relative block h-40 bg-linear-to-br from-teal-500 to-emerald-900">
                    {c.thumbnail && <img src={c.thumbnail} alt={c.title} loading="lazy" className="h-full w-full object-cover" />}
                    {c.category?.name && (
                      <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-800">
                        {c.category.name}
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-4">
                    <Link to={`/courses/${c._id}`} className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 hover:text-teal-700 dark:text-white">
                      {c.title}
                    </Link>
                    <p className="mt-2 text-xs text-slate-500">{c.instructor?.name}</p>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < Math.round(c.ratingAvg) ? "fill-orange-400 text-orange-400" : "text-slate-300"}
                        />
                      ))}
                      <span className="ml-1 font-semibold text-slate-900 dark:text-white">{c.ratingAvg.toFixed(1)}</span>
                      <span className="text-slate-400">({c.ratingCount})</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{price > 0 ? `$${price}` : "Free"}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void remove(c._id)}
                          disabled={busy === c._id}
                          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                        <button type="button" onClick={() => void enroll(c._id)} disabled={busy === c._id} className={`${BTN_PRIMARY} !px-4 !py-2`}>
                          Enroll
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </PageState>
    </div>
  )
}