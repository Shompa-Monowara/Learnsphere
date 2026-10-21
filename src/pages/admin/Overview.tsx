import { BookOpen, CircleAlert, CircleDollarSign, FileUp, Flag, ShieldCheck, UserCheck, Users, ChartColumn } from "lucide-react"
import { useMemo } from "react"
import { Link } from "react-router-dom"
import ActivityTimeline from "@/features/admin/components/ActivityTimeline"
import GrowthCard from "@/features/admin/components/GrowthCard"
import NeedsAttention from "@/features/admin/components/NeedsAttention"
import type { AttentionItem } from "@/features/admin/components/NeedsAttention"
import RevenueCard from "@/features/admin/components/RevenueCard"
import StatTile from "@/features/admin/components/StatTile"
import { useAdmin } from "@/features/admin/admin-context"
import type { ActivityEvent, AdminCourseRow, AdminStatsData, AdminTransaction } from "@/features/admin/types"
import { cumulative, compactMoney, fill, lastMonths, money, num, trend } from "@/features/admin/utils"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import { BTN_OUTLINE, BTN_PRIMARY } from "@/features/student/ui"
import { timeAgo } from "@/features/student/utils"
import { useFetch } from "@/hooks/useFetch"

function buildEvents(data: AdminStatsData, tx: AdminTransaction[], pending: AdminCourseRow[]): ActivityEvent[] {
  const events: ActivityEvent[] = []

  for (const u of data.recentActivity.users) {
    const teacher = u.role === "teacher"
    events.push({
      id: `user-${u._id}`,
      kind: teacher ? "teacher" : "user",
      title: teacher ? "New teacher registered" : u.role === "admin" ? "New admin added" : "New student joined",
      text: `${u.name} joined as ${u.role === "admin" ? "an" : "a"} ${u.role}.`,
      at: u.createdAt,
    })
  }

  for (const e of data.recentActivity.enrollments) {
    if (!e.student || !e.course) continue
    events.push({
      id: `enroll-${e._id}`,
      kind: "enroll",
      title: "New enrollment",
      text: `${e.student.name} enrolled in "${e.course.title}".`,
      at: e.createdAt,
    })
  }

  for (const c of pending) {
    events.push({
      id: `course-${c._id}`,
      kind: "course",
      title: "Course submitted for review",
      text: `"${c.title}" is awaiting moderation.`,
      at: c.updatedAt,
    })
  }

  for (const t of tx.slice(0, 10)) {
    const who = t.user?.name ?? "A student"
    const failed = t.status === "failed"
    events.push({
      id: `tx-${t._id}`,
      kind: failed ? "failed" : "payment",
      title: failed ? "Payment failed" : "Payment received",
      text: failed
        ? `${who}'s payment of ${money(t.amount)} did not go through.`
        : `${who} paid ${money(t.amount)}${t.course ? ` for "${t.course.title}"` : ""}.`,
      at: t.createdAt,
    })
  }

  return events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 6)
}

export default function AdminOverview() {
  const { data, loading, error, refresh } = useAdmin()
  const tx = useFetch<{ transactions: AdminTransaction[] }>("/admin/transactions")
  const pending = useFetch<{ courses: AdminCourseRow[] }>("/admin/courses?status=pending")
  const blocked = useFetch<{ total: number }>("/admin/users?status=blocked&limit=1")

  const slots = useMemo(() => lastMonths(6), [])
  const transactions = useMemo(() => tx.data?.transactions ?? [], [tx.data])
  const pendingCourses = useMemo(() => pending.data?.courses ?? [], [pending.data])

  const view = useMemo(() => {
    if (!data) return null
    const users = fill(data.userGrowth, slots)
    const enrollments = fill(data.enrollmentTrend, slots)
    const revenue = fill(data.revenueTrend, slots)
    const by = data.stats.coursesByStatus
    return {
      users,
      enrollments,
      revenue,
      usersCum: cumulative(users, data.stats.users),
      enrollCum: cumulative(enrollments, data.stats.enrollments),
      statusBars: [by.published ?? 0, by.pending ?? 0, by.draft ?? 0, by.rejected ?? 0, by.unpublished ?? 0],
    }
  }, [data, slots])

  const events = useMemo(
    () => (data ? buildEvents(data, transactions, pendingCourses) : []),
    [data, transactions, pendingCourses]
  )

  const attention = useMemo(() => {
    if (!data) return []
    const items: AttentionItem[] = []
    const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

    const pendingCount = data.stats.coursesByStatus.pending ?? 0
    if (pendingCount > 0) {
      const oldest = pendingCourses.length
        ? pendingCourses.reduce((a, c) => (new Date(c.updatedAt) < new Date(a) ? c.updatedAt : a), pendingCourses[0].updatedAt)
        : null
      items.push({
        key: "pending",
        icon: FileUp,
        box: "bg-orange-50 text-orange-500 dark:bg-orange-500/15",
        title: `${plural(pendingCount, "course")} awaiting review`,
        text: oldest ? `Oldest submission is ${timeAgo(oldest)}.` : "Waiting for moderation.",
        to: "/admin/courses?status=pending",
      })
    }

    const failed = transactions.filter((t) => t.status === "failed").length
    if (failed > 0) {
      items.push({
        key: "failed",
        icon: CircleAlert,
        box: "bg-red-50 text-red-500 dark:bg-red-500/15",
        title: `${plural(failed, "failed payment")}`,
        text: "Retry or contact the customers.",
        to: "/admin/payments?status=failed",
      })
    }

    const rejected = data.stats.coursesByStatus.rejected ?? 0
    if (rejected > 0) {
      items.push({
        key: "rejected",
        icon: Flag,
        box: "bg-rose-50 text-rose-500 dark:bg-rose-500/15",
        title: `${plural(rejected, "rejected course")}`,
        text: "Waiting for instructors to fix and resubmit.",
        to: "/admin/courses?status=rejected",
      })
    }

    const blockedCount = blocked.data?.total ?? 0
    if (blockedCount > 0) {
      items.push({
        key: "blocked",
        icon: Users,
        box: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        title: `${plural(blockedCount, "blocked account")}`,
        text: "Review and unblock if needed.",
        to: "/admin/users?status=blocked",
      })
    }
    return items
  }, [data, transactions, pendingCourses, blocked.data])

  return (
    <div className="space-y-8">
      <PageHeader
        crumb="Overview"
        title="Platform overview"
        subtitle="A live snapshot of users, courses, revenue, and everything that needs your attention across LearnSphere."
        action={
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/reports" className={BTN_OUTLINE}>
              <ChartColumn size={16} /> View reports
            </Link>
            <Link to="/admin/courses?status=pending" className={BTN_PRIMARY}>
              <ShieldCheck size={16} /> Review queue
            </Link>
          </div>
        }
      />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void refresh()}>
        {data && view && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                icon={Users}
                tone="teal"
                label="Total users"
                value={num(data.stats.users)}
                pill={trend(view.usersCum)}
                bars={view.users}
                footnote={`${num(view.users[view.users.length - 1])} joined this month`}
              />
              <StatTile
                icon={BookOpen}
                tone="orange"
                label="Total courses"
                value={num(data.stats.courses)}
                pill={{ label: `${data.stats.coursesByStatus.published ?? 0} live`, up: true }}
                bars={view.statusBars}
                footnote={`${data.stats.coursesByStatus.pending ?? 0} awaiting moderation`}
              />
              <StatTile
                icon={UserCheck}
                tone="slate"
                label="Enrollments"
                value={num(data.stats.enrollments)}
                pill={trend(view.enrollCum)}
                bars={view.enrollments}
                footnote={`${num(view.enrollments[view.enrollments.length - 1])} this month`}
              />
              <StatTile
                icon={CircleDollarSign}
                tone="green"
                label="Revenue"
                value={money(data.stats.revenue)}
                pill={trend(view.revenue)}
                bars={view.revenue}
                footnote={`${compactMoney(data.stats.payouts ?? 0)} withdrawn by instructors`}
              />
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <GrowthCard data={data} />
              <RevenueCard data={data} />
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
              <ActivityTimeline events={events} />
              <NeedsAttention items={attention} />
            </div>
          </>
        )}
      </PageState>
    </div>
  )
}