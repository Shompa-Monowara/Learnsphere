import { Bell, CheckCheck, CircleHelp, MessageCircle, SquarePen, Star, UserPlus, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import EmptyState from "@/features/student/components/EmptyState"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import Tabs from "@/features/student/components/Tabs"
import type { NotificationItem } from "@/features/student/portal-types"
import { CARD } from "@/features/student/ui"
import { isToday, timeAgo } from "@/features/student/utils"
import { useTeacher } from "@/features/teacher/teacher-context"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"
import { api } from "@/services/api"

interface Payload {
  notifications: NotificationItem[]
  unread: number
}

/* Title dekhe icon + color thik kori */
function iconFor(title: string): { Icon: LucideIcon; tone: string } {
  const t = title.toLowerCase()
  if (t.includes("submission") || t.includes("assignment")) {
    return { Icon: SquarePen, tone: "bg-orange-50 text-orange-500 dark:bg-orange-500/15" }
  }
  if (t.includes("review")) return { Icon: Star, tone: "bg-green-50 text-green-600 dark:bg-green-500/15" }
  if (t.includes("enroll")) return { Icon: UserPlus, tone: "bg-teal-50 text-teal-600 dark:bg-teal-500/15" }
  if (t.includes("payout")) return { Icon: Wallet, tone: "bg-green-50 text-green-600 dark:bg-green-500/15" }
  if (t.includes("question")) return { Icon: CircleHelp, tone: "bg-blue-50 text-blue-600 dark:bg-blue-500/15" }
  if (t.includes("message")) return { Icon: MessageCircle, tone: "bg-blue-50 text-blue-600 dark:bg-blue-500/15" }
  return { Icon: Bell, tone: "bg-slate-100 text-slate-500 dark:bg-slate-800" }
}

export default function TeacherNotifications() {
  const navigate = useNavigate()
  const { refresh } = useTeacher()
  const { data, setData, loading, error, reload } = useFetch<Payload>("/notifications")
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const items = data?.notifications ?? []
  const unread = items.filter((n) => !n.read).length
  const visible = items.filter((n) => filter === "all" || !n.read)
  const today = visible.filter((n) => isToday(n.createdAt))
  const earlier = visible.filter((n) => !isToday(n.createdAt))

  const markRead = async (n: NotificationItem) => {
    if (!n.read) {
      setData((d) =>
        d
          ? {
              unread: Math.max(0, d.unread - 1),
              notifications: d.notifications.map((x) => (x._id === n._id ? { ...x, read: true } : x)),
            }
          : d
      )
      try {
        await api.patch(`/notifications/${n._id}/read`)
        void refresh()
      } catch {
        void reload()
      }
    }
    if (n.link) navigate(n.link)
  }

  const markAll = async () => {
    setData((d) => (d ? { unread: 0, notifications: d.notifications.map((x) => ({ ...x, read: true })) } : d))
    try {
      await api.patch("/notifications/read-all")
      void refresh()
    } catch {
      void reload()
    }
  }

  const renderGroup = (label: string, list: NotificationItem[]) =>
    list.length > 0 && (
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        {list.map((n) => {
          const { Icon, tone } = iconFor(n.title)
          return (
            <button
              key={n._id}
              type="button"
              onClick={() => void markRead(n)}
              className={cn(
                CARD,
                "flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800",
                !n.read && "border-teal-200 dark:border-teal-500/40"
              )}
            >
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tone)}>
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {n.title}
                  {!n.read && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                </p>
                {n.message && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{n.message}</p>}
                <p className="mt-1 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
              </div>
            </button>
          )
        })}
      </div>
    )

  return (
    <div className="space-y-8">
      <PageHeader
        crumb="Notifications"
        title="Notifications"
        subtitle="Submissions, reviews, enrollments, and payouts."
      />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        <div className="flex items-center justify-between">
          <Tabs
            value={filter}
            onChange={setFilter}
            tabs={[
              { value: "all", label: "All", count: items.length },
              { value: "unread", label: "Unread", count: unread },
            ]}
          />
          {unread > 0 && (
            <button
              type="button"
              onClick={() => void markAll()}
              className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <EmptyState title="You're all caught up" text="New submissions, reviews and enrollments will appear here." />
        ) : (
          <div className="space-y-8">
            {renderGroup("Today", today)}
            {renderGroup("Earlier", earlier)}
          </div>
        )}
      </PageState>
    </div>
  )
}