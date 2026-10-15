import { Flame } from "lucide-react"
import { motion } from "framer-motion"
import type { ActivityDay } from "../types"

const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })

export default function WeeklyActivity({ days, streak }: { days: ActivityDay[]; streak: number }) {
  const max = Math.max(...days.map((d) => d.lessons), 1)

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Weekly activity</h2>
          <p className="text-sm text-slate-500">Lessons completed over the last 7 days</p>
        </div>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
            <Flame size={14} />
            {streak}-day streak
          </span>
        )}
      </div>

      <div className="mt-6 flex h-48 items-end gap-3 border-b border-slate-200 dark:border-slate-700">
        {days.map((d) => (
          <div key={d.date} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${d.lessons} lessons`}>
            <span className="text-xs font-medium text-slate-500">{d.lessons > 0 ? d.lessons : ""}</span>
            <motion.div
              className="w-full max-w-10 rounded-t-lg bg-teal-500"
              initial={{ height: 0 }}
              animate={{ height: `${Math.max((d.lessons / max) * 85, d.lessons > 0 ? 6 : 2)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-3">
        {days.map((d) => (
          <span key={d.date} className="flex-1 text-center text-xs text-slate-400">
            {dayLabel(d.date)}
          </span>
        ))}
      </div>
    </section>
  )
}