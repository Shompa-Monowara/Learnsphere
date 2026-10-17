import { ArrowDown, ArrowUp } from "lucide-react"
import type { TeacherDashboardData } from "../types"

interface Props {
  points: TeacherDashboardData["enrollmentTrend"]
  growth: number | null
}

export default function EnrollmentTrend({ points, growth }: Props) {
  const total = points.reduce((n, p) => n + p.enrollments, 0)
  const max = Math.max(...points.map((p) => p.enrollments), 1)
  const n = points.length

  const xs = points.map((_, i) => (i / (n - 1)) * 100)
  const ys = points.map((p) => 100 - (p.enrollments / max) * 88)
  const line = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ")

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Enrollment trend</h2>
          <p className="text-sm text-slate-500">New students per month across all courses</p>
        </div>
        {growth !== null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              growth >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
          >
            {growth >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(growth)}%
          </span>
        )}
      </div>

      <div className="relative mx-2 mt-6 h-56">
        {total === 0 ? (
          <p className="absolute inset-0 grid place-items-center text-sm text-slate-500">
            No enrollments in the last 7 months.
          </p>
        ) : (
          <>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${line} L100,100 L0,100 Z`} fill="url(#enrollFill)" />
              <path d={line} fill="none" stroke="#0d9488" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            {points.map((p, i) => (
              <span
                key={p.label + i}
                title={`${p.label}: ${p.enrollments}`}
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-600 ring-2 ring-white dark:ring-slate-900"
                style={{ left: `${xs[i]}%`, top: `${ys[i]}%` }}
              />
            ))}
          </>
        )}
      </div>

      <div className="mt-3 flex justify-between px-2 text-xs text-slate-400">
        {points.map((p, i) => (
          <span key={p.label + i}>{p.label}</span>
        ))}
      </div>
    </section>
  )
}