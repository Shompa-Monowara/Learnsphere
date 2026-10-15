import { ArrowRight, CalendarDays, SquarePen } from "lucide-react"
import { Link } from "react-router-dom"
import type { Deadline } from "../types"
import { formatDue } from "../utils"

export default function UpcomingDeadlines({ items }: { items: Deadline[] }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming deadlines</h2>
        <CalendarDays size={18} className="text-slate-400" />
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">No upcoming deadlines. You're all caught up!</p>
      ) : (
        <ul className="space-y-3">
          {items.map((d) => {
            const due = formatDue(d.dueDate)
            return (
              <li key={d._id} className="flex gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/10">
                  <SquarePen size={18} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{d.title}</p>
                  <p className="truncate text-xs text-slate-500">{d.courseTitle}</p>
                  <p className={`mt-0.5 text-xs font-medium ${due.tone}`}>{due.label}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <Link
        to="/student/assignments"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        All assignments <ArrowRight size={14} />
      </Link>
    </section>
  )
}