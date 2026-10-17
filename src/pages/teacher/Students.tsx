import { useMemo, useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import Avatar from "@/features/student/components/Avatar"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import type { StudentRow } from "@/features/teacher/types"
import { useLoad } from "@/features/teacher/useLoad"

const STATUS = {
  active: { label: "Active", cls: "bg-teal-50 text-teal-700" },
  completed: { label: "Completed", cls: "bg-green-50 text-green-700" },
  "at-risk": { label: "At risk", cls: "bg-amber-50 text-amber-700" },
}

const DAY = 24 * 60 * 60 * 1000

const joinedDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

/* Today / Yesterday / 3 days ago / 1 week ago, tarpor full date */
function lastSeen(iso: string) {
  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const days = Math.floor((startOfToday - new Date(iso).setHours(0, 0, 0, 0)) / DAY)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) {
    const w = Math.floor(days / 7)
    return `${w} week${w === 1 ? "" : "s"} ago`
  }
  return joinedDate(iso)
}

export default function Students() {
  const { data, loading, error, reload } = useLoad<{ students: StudentRow[] }>("/teacher/students")
  const [q, setQ] = useState("")
  const [filter, setFilter] = useState("all")

  const maxCourses = Math.max(...(data?.students.map((s) => s.courses) ?? [1]), 1)

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return (data?.students ?? []).filter(
      (s) =>
        (!term || s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)) &&
        (filter === "all" || s.courses === Number(filter))
    )
  }, [data, q, filter])

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="Students"
        title="Students"
        subtitle="Track everyone enrolled in your courses and how they're progressing."
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-64 flex-1 sm:max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-[11px] pl-10 pr-4 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="relative w-full sm:w-[222px]">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-[11px] pl-4 pr-10 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All students</option>
            {Array.from({ length: maxCourses }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} course{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {rows.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">
              {data?.students.length ? "No students match your filters." : "No students have enrolled yet."}
            </p>
          ) : (
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <th className="px-4 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Courses</th>
                  <th className="px-4 py-3.5">Progress</th>
                  <th className="px-4 py-3.5">Last active</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((s) => (
                  <tr key={s._id}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} src={s.avatar} size={36} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{s.name}</p>
                          <p className="truncate text-xs text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-200" title={s.courseTitles.join(", ")}>
                      {s.courses}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full ${s.progress >= 100 ? "bg-green-500" : "bg-teal-600"}`}
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-[13px] font-medium text-slate-600 dark:text-slate-300">
                          {s.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{lastSeen(s.lastActive)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS[s.status].cls}`}>
                        {STATUS[s.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{joinedDate(s.joined)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </PageState>
    </div>
  )
}