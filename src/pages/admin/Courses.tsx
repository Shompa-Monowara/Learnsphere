import { BookOpen, Check, Clock, Eye, ListChecks, Tag, Trash2, X } from "lucide-react"
import { useMemo, useState } from "react"
import CourseReviewModal from "@/features/admin/components/CourseReviewModal"
import ConfirmDialog from "@/features/admin/components/ConfirmDialog"
import RejectDialog from "@/features/admin/components/RejectDialog"
import { useAdmin } from "@/features/admin/admin-context"
import { useToast } from "@/features/admin/toast-context"
import type { AdminCourseRow, ModerationStatus } from "@/features/admin/types"
import { money } from "@/features/admin/utils"
import EmptyState from "@/features/student/components/EmptyState"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_OUTLINE, CARD } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"

type Action = "approve" | "reject" | "unpublish"

const TABS: { key: ModerationStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "published", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "unpublished", label: "Unpublished" },
]

const BADGE: Record<ModerationStatus, { label: string; style: string }> = {
  pending: { label: "Pending", style: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  published: { label: "Approved", style: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400" },
  rejected: { label: "Rejected", style: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400" },
  unpublished: { label: "Unpublished", style: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
}

const BTN_SOLID = "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return "yesterday"
  if (days < 30) return `${days} days ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

const hours = (secs = 0) => {
  const h = Math.round(secs / 3600)
  return h >= 1 ? `${h}h` : `${Math.max(Math.round(secs / 60), 0)}m`
}

export default function AdminCourses() {
  const toast = useToast()
  const { refresh } = useAdmin()
  const { data, loading, error, reload } = useFetch<{ courses: AdminCourseRow[]; counts: Record<string, number> }>("/admin/courses")

  const [tab, setTab] = useState<ModerationStatus>("pending")
  const [reviewing, setReviewing] = useState<AdminCourseRow | null>(null)
  const [rejecting, setRejecting] = useState<AdminCourseRow | null>(null)
  const [unpublishing, setUnpublishing] = useState<AdminCourseRow | null>(null)
  const [deleting, setDeleting] = useState<AdminCourseRow | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const counts = data?.counts ?? {}
  const list = useMemo(() => (data?.courses ?? []).filter((c) => c.status === tab), [data, tab])

  const moderate = async (c: AdminCourseRow, action: Action, reason?: string) => {
    setBusyId(c._id)
    try {
      await api.patch(`/admin/courses/${c._id}/moderate`, { action, reason })
      const msg = { approve: "Course approved", reject: "Course rejected", unpublish: "Course unpublished" }[action]
      toast.success(msg, `"${c.title}" was updated and the teacher has been notified.`)
      setReviewing(null)
      setRejecting(null)
      setUnpublishing(null)
      await Promise.all([reload(), refresh()])
    } catch (err) {
      toast.error("Action failed", getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const removeCourse = async (c: AdminCourseRow) => {
    setBusyId(c._id)
    try {
      await api.delete(`/courses/${c._id}`)
      toast.success("Course deleted", `"${c.title}" was permanently removed.`)
      setDeleting(null)
      await Promise.all([reload(), refresh()])
    } catch (err) {
      toast.error("Could not delete course", getErrorMessage(err))
      setDeleting(null)
    } finally {
      setBusyId(null)
    }
  }

  const actionsFor = (c: AdminCourseRow, onDone?: () => void) => {
    const busy = busyId === c._id
    const approve = (label: string) => (
      <button type="button" disabled={busy} onClick={() => void moderate(c, "approve")} className={cn(BTN_SOLID, "bg-teal-600 hover:bg-teal-700")}>
        <Check size={16} /> {label}
      </button>
    )
    const reject = (
      <button type="button" disabled={busy} onClick={() => { onDone?.(); setRejecting(c) }} className={cn(BTN_SOLID, "bg-red-600 hover:bg-red-700")}>
        <X size={16} /> Reject
      </button>
    )
    if (c.status === "pending") return <>{approve("Approve")}{reject}</>
    if (c.status === "published")
      return (
        <button type="button" disabled={busy} onClick={() => { onDone?.(); setUnpublishing(c) }} className={cn(BTN_SOLID, "bg-slate-700 hover:bg-slate-800")}>
          Unpublish
        </button>
      )
    return approve(c.status === "unpublished" ? "Republish" : "Approve")
  }

  return (
    <div className="space-y-6">
      <PageHeader crumb="Courses" title="Course moderation" subtitle="Review new courses before they go live and keep the catalog high quality." />

      <div className="inline-flex flex-wrap gap-1 rounded-full border border-slate-100 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key ? "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {t.label} ({counts[t.key] ?? 0})
          </button>
        ))}
      </div>

      {error && (
        <Notice type="error">
          {error}{" "}
          <button type="button" onClick={() => void reload()} className="font-semibold underline">Retry</button>
        </Notice>
      )}

      {loading && !data && <p className="py-10 text-center text-slate-500">Loading courses...</p>}

      {data && list.length === 0 && (
        <EmptyState title={`No ${BADGE[tab].label.toLowerCase()} courses`} text="Nothing to show in this tab right now." />
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {list.map((c) => {
          const b = BADGE[c.status as ModerationStatus] ?? BADGE.pending
          const price = c.discountPrice ?? c.price ?? 0
          return (
            <div key={c._id} className={cn(CARD, "p-5")}>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/15">
                  <BookOpen size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                    <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", b.style)}>{b.label}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {c.instructor?.name ?? "Unknown"}{c.category?.name ? ` · ${c.category.name}` : ""}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><ListChecks size={13} />{c.lessonsCount ?? 0} lessons</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={13} />{hours(c.totalDuration)}</span>
                <span className="inline-flex items-center gap-1.5"><Tag size={13} />{money(price)}</span>
                <span>Updated {timeAgo(c.updatedAt)}</span>
              </div>

              {c.status === "rejected" && c.rejectionReason && (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-300">
                  Reason: {c.rejectionReason}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button type="button" onClick={() => setReviewing(c)} className={cn(BTN_OUTLINE, "!py-2.5")}>
                  <Eye size={16} /> Review
                </button>
                {actionsFor(c)}
                <button
                  type="button"
                  onClick={() => setDeleting(c)}
                  disabled={busyId === c._id}
                  aria-label={`Delete ${c.title}`}
                  title="Delete course"
                  className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {reviewing && (
        <CourseReviewModal course={reviewing} onClose={() => setReviewing(null)} actions={actionsFor(reviewing, () => setReviewing(null))} />
      )}

      {rejecting && (
        <RejectDialog
          title={rejecting.title}
          busy={busyId === rejecting._id}
          onConfirm={(reason: string) => void moderate(rejecting, "reject", reason)}
          onCancel={() => setRejecting(null)}
        />
      )}

      {unpublishing && (
        <ConfirmDialog
          title={`Unpublish ${unpublishing.title}?`}
          text="The course will be hidden from the catalog. Enrolled students keep their data."
          confirmLabel="Unpublish"
          tone="danger"
          busy={busyId === unpublishing._id}
          onConfirm={() => void moderate(unpublishing, "unpublish")}
          onCancel={() => setUnpublishing(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.title}?`}
          text="This permanently removes the course along with its quizzes and assignments. This can't be undone. Courses with enrolled students can't be deleted, so unpublish those instead."
          confirmLabel="Delete course"
          tone="danger"
          busy={busyId === deleting._id}
          onConfirm={() => void removeCourse(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}