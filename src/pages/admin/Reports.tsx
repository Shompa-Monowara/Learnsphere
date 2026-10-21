import { ArrowDown, ArrowUp, Award, ChevronDown, Download, Percent, UserCheck, UserPlus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"
import ReportChart from "@/features/admin/components/ReportChart"
import type { AdminReport, ReportKpi } from "@/features/admin/types"
import { money, num } from "@/features/admin/utils"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_PRIMARY, CARD, INPUT } from "@/features/student/ui"
import { useFetch } from "@/hooks/useFetch"
import { cn } from "@/lib/utils"

const RANGES = [
  { value: 3, label: "Last 3 months" },
  { value: 6, label: "Last 6 months" },
  { value: 12, label: "Last 12 months" },
]

const monthLabel = (key: string) =>
  new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })

function Pill({ kpi, points }: { kpi: ReportKpi; points?: boolean }) {
  if (kpi.change === null) {
    return <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">New</span>
  }
  const up = kpi.change >= 0
  const Arrow = up ? ArrowUp : ArrowDown
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        up ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400" : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
      )}
    >
      <Arrow size={12} />
      {up ? "+" : ""}
      {kpi.change}
      {points ? " pts" : "%"}
    </span>
  )
}

function Kpi({ icon: Icon, tone, label, value, kpi, points }: { icon: LucideIcon; tone: string; label: string; value: string; kpi: ReportKpi; points?: boolean }) {
  return (
    <div className={cn(CARD, "p-5")}>
      <div className="flex items-start justify-between">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tone)}>
          <Icon size={20} />
        </span>
        <Pill kpi={kpi} points={points} />
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold leading-none text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}

function Donut({ value }: { value: number }) {
  const r = 70
  const c = 2 * Math.PI * r
  const dash = (Math.min(Math.max(value, 0), 100) / 100) * c
  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 176 176" className="h-full w-full -rotate-90" role="img" aria-label={`${value}% completion rate`}>
        <circle cx="88" cy="88" r={r} fill="none" strokeWidth="14" className="stroke-slate-100 dark:stroke-slate-800" />
        <circle cx="88" cy="88" r={r} fill="none" strokeWidth="14" strokeLinecap="round" stroke="#16a34a" strokeDasharray={`${dash} ${c}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}%</span>
        <span className="text-xs text-slate-500">complete</span>
      </div>
    </div>
  )
}

function exportCsv(r: AdminReport, labels: string[]) {
  const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const rows: (string | number)[][] = [
    ["Metric", "Value", "Change vs previous period"],
    ["New enrollments", r.kpis.enrollments.value, r.kpis.enrollments.change ?? "new"],
    ["Completions", r.kpis.completions.value, r.kpis.completions.change ?? "new"],
    ["Active users", r.kpis.activeUsers.value, r.kpis.activeUsers.change ?? "new"],
    ["Completion rate %", r.kpis.completionRate.value, r.kpis.completionRate.change ?? ""],
    [],
    ["Month", "Enrollments", "Completions", "Active users"],
    ...labels.map((l, i) => [l, r.series.enrollments[i], r.series.completions[i], r.series.activeUsers[i]]),
    [],
    ["Course", "Instructor", "Enrollments", "Completion %", "Revenue"],
    ...r.topCourses.map((c) => [c.title, c.instructor, c.enrollments, c.completionRate, c.revenue]),
  ]
  const csv = rows.map((row) => row.map(q).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const a = document.createElement("a")
  a.href = url
  a.download = `learnsphere-report-${r.range}m.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminReports() {
  const [range, setRange] = useState(6)
  const { data, error, reload } = useFetch<AdminReport>(`/admin/reports?range=${range}`)

  const loading = !data || data.range !== range
  const r = data && data.range === range ? data : null
  const labels = (r?.months ?? []).map(monthLabel)
  const rate = r?.kpis.completionRate

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="Reports"
        title="Reports & analytics"
        subtitle="Understand growth, engagement, and course performance across the platform."
        action={
          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <div className="relative w-56">
              <select value={range} onChange={(e) => setRange(Number(e.target.value))} className={cn(INPUT, "appearance-none pr-10")}>
                {RANGES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <button type="button" disabled={!r} onClick={() => r && exportCsv(r, labels)} className={cn(BTN_PRIMARY, "sm:self-end")}>
              <Download size={16} /> Export
            </button>
          </div>
        }
      />

      {error && (
        <Notice type="error">
          {error}{" "}
          <button type="button" onClick={() => void reload()} className="font-semibold underline">Retry</button>
        </Notice>
      )}

      <div className={cn("space-y-6 transition-opacity", loading && "opacity-60")}>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi icon={UserPlus} tone="bg-teal-50 text-teal-600 dark:bg-teal-500/15" label="New enrollments" value={num(r?.kpis.enrollments.value ?? 0)} kpi={r?.kpis.enrollments ?? { value: 0, change: 0 }} />
          <Kpi icon={Award} tone="bg-green-50 text-green-600 dark:bg-green-500/15" label="Completions" value={num(r?.kpis.completions.value ?? 0)} kpi={r?.kpis.completions ?? { value: 0, change: 0 }} />
          <Kpi icon={UserCheck} tone="bg-orange-50 text-orange-500 dark:bg-orange-500/15" label="Active users" value={num(r?.kpis.activeUsers.value ?? 0)} kpi={r?.kpis.activeUsers ?? { value: 0, change: 0 }} />
          <Kpi icon={Percent} tone="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" label="Completion rate" value={`${rate?.value ?? 0}%`} kpi={rate ?? { value: 0, change: 0 }} points />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className={cn(CARD, "p-6")}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Enrollments over time</h2>
            <div className="mt-4">
              {r && <ReportChart values={r.series.enrollments} labels={labels} color="#0d9488" format={num} />}
            </div>
          </div>
          <div className={cn(CARD, "p-6")}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Course completions</h2>
            <div className="mt-4">
              {r && <ReportChart values={r.series.completions} labels={labels} color="#f97316" format={num} />}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className={cn(CARD, "p-6")}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active users</h2>
            <div className="mt-4">
              {r && <ReportChart values={r.series.activeUsers} labels={labels} color="#475569" format={num} wide />}
            </div>
          </div>
          <div className={cn(CARD, "flex flex-col items-center justify-center p-6 text-center")}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Completion rate</h2>
            <p className="mt-1 text-sm text-slate-500">Students who finish their courses</p>
            <div className="my-6 w-full">
              <Donut value={rate?.value ?? 0} />
            </div>
            <p className="text-sm text-slate-500">
              {rate?.change == null || rate.change === 0
                ? "No change from last period"
                : `${rate.change > 0 ? "Up" : "Down"} ${Math.abs(rate.change)} pts from last period`}
            </p>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">Top performing courses</h2>
          <div className={cn(CARD, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                    <th className="px-5 py-4 font-semibold">Course</th>
                    <th className="px-4 py-4 font-semibold">Instructor</th>
                    <th className="px-4 py-4 font-semibold">Enrollments</th>
                    <th className="px-4 py-4 font-semibold">Completion</th>
                    <th className="px-4 py-4 pr-5 font-semibold">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {r && r.topCourses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        No enrollments in this period yet.
                      </td>
                    </tr>
                  )}
                  {!r && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        Loading report...
                      </td>
                    </tr>
                  )}
                  {r?.topCourses.map((c) => (
                    <tr key={c._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{c.title}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{c.instructor}</td>
                      <td className="px-4 py-4 tabular-nums text-slate-600 dark:text-slate-300">{num(c.enrollments)}</td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-semibold",
                            c.completionRate >= 65
                              ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                              : c.completionRate >= 40
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                          )}
                        >
                          {c.completionRate}%
                        </span>
                      </td>
                      <td className="px-4 py-4 pr-5 font-semibold tabular-nums text-slate-900 dark:text-white">{money(c.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}