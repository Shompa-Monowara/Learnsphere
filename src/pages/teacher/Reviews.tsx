import { useState } from "react"
import { Star } from "lucide-react"
import Avatar from "@/features/student/components/Avatar"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import { BTN_OUTLINE, BTN_PRIMARY, INPUT } from "@/features/student/ui"
import { timeAgo } from "@/features/student/utils"
import type { ReviewItem, ReviewsPageData } from "@/features/teacher/types"
import { useLoad } from "@/features/teacher/useLoad"
import { api, getErrorMessage } from "@/services/api"

const BAR: Record<number, string> = {
  5: "bg-green-500",
  4: "bg-teal-500",
  3: "bg-amber-400",
  2: "bg-orange-400",
  1: "bg-red-500",
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < Math.round(value) ? "fill-orange-500 text-orange-500" : "text-slate-300"} />
      ))}
    </div>
  )
}

export default function Reviews() {
  const { data, setData, loading, error, reload } = useLoad<ReviewsPageData>("/teacher/reviews")
  const [openId, setOpenId] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  const startReply = (r: ReviewItem) => {
    setOpenId(r._id)
    setText(r.reply)
    setFormError("")
  }

  const save = async (id: string) => {
    const reply = text.trim()
    if (!reply) {
      setFormError("Write a reply first.")
      return
    }
    setSaving(true)
    setFormError("")
    try {
      await api.patch(`/reviews/${id}/reply`, { reply })
      setData((d) => d && { ...d, reviews: d.reviews.map((r) => (r._id === id ? { ...r, reply } : r)) })
      setOpenId(null)
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="Reviews"
        title="Reviews & ratings"
        subtitle="See what students think and respond to their feedback."
      />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        {data && (
          <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Summary */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col items-center text-center">
                <p className="text-6xl font-extrabold text-slate-900 dark:text-white">
                  {data.summary.total ? data.summary.average.toFixed(1) : "–"}
                </p>
                <div className="mt-2">
                  <Stars value={data.summary.average} size={18} />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Based on {data.summary.total.toLocaleString("en-US")} review{data.summary.total === 1 ? "" : "s"}
                </p>
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                {data.summary.distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-3 text-xs">
                    <span className="w-6 text-slate-500">{d.star}★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className={`h-full rounded-full ${BAR[d.star]}`} style={{ width: `${d.percent}%` }} />
                    </div>
                    <span className="w-9 text-right font-medium text-slate-600 dark:text-slate-300">{d.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {data.reviews.length === 0 && (
                <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  No reviews yet. They will show up here once students rate your courses.
                </div>
              )}

              {data.reviews.map((r) => (
                <article
                  key={r._id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={r.studentName} src={r.studentAvatar} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">{r.studentName}</p>
                      <p className="truncate text-xs text-slate-500">
                        {r.courseTitle} · {timeAgo(r.createdAt)}
                      </p>
                    </div>
                    <Stars value={r.rating} />
                  </div>

                  {r.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{r.comment}</p>
                  )}

                  {r.reply && openId !== r._id && (
                    <div className="mt-4 rounded-lg border-l-4 border-teal-500 bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                      <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">Your reply</p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{r.reply}</p>
                    </div>
                  )}

                  {openId === r._id ? (
                    <div className="mt-4">
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a public reply..."
                        className={INPUT}
                      />
                      {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
                      <div className="mt-3 flex justify-end gap-3">
                        <button type="button" onClick={() => setOpenId(null)} className={BTN_OUTLINE}>
                          Cancel
                        </button>
                        <button type="button" disabled={saving} onClick={() => void save(r._id)} className={BTN_PRIMARY}>
                          {saving ? "Saving..." : "Post reply"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => startReply(r)}
                        className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                      >
                        {r.reply ? "Edit reply" : "Reply"}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </PageState>
    </div>
  )
}