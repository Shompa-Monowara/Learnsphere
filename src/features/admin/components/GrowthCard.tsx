import { ArrowDown, ArrowUp } from "lucide-react"
import { useMemo, useState } from "react"
import Tabs from "@/features/student/components/Tabs"
import { CARD } from "@/features/student/ui"
import { cn } from "@/lib/utils"
import { cumulative, fill, lastMonths, money, num, trend } from "../utils"
import type { AdminStatsData } from "../types"
import AreaChart from "./AreaChart"

type Metric = "users" | "enrollments" | "revenue"

export default function GrowthCard({ data }: { data: AdminStatsData }) {
  const [metric, setMetric] = useState<Metric>("users")
  const slots = useMemo(() => lastMonths(6), [])
  const labels = slots.map((s) => s.label)

  const series = useMemo(
    () => ({
      users: cumulative(fill(data.userGrowth, slots), data.stats.users),
      enrollments: cumulative(fill(data.enrollmentTrend, slots), data.stats.enrollments),
      revenue: fill(data.revenueTrend, slots),
    }),
    [data, slots]
  )

  const config = {
    users: { sub: "Total registered users per month", total: num(data.stats.users), format: num },
    enrollments: { sub: "Total enrollments per month", total: num(data.stats.enrollments), format: num },
    revenue: { sub: "Gross revenue per month", total: money(data.stats.revenue), format: money },
  }[metric]

  const values = series[metric]
  const t = trend(values)
  const Arrow = t.up ? ArrowUp : ArrowDown

  return (
    <div className={cn(CARD, "p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Platform growth</h2>
          <p className="text-sm text-slate-500">{config.sub}</p>
        </div>
        <Tabs
          value={metric}
          onChange={setMetric}
          tabs={[
            { value: "users", label: "Users" },
            { value: "enrollments", label: "Enrollments" },
            { value: "revenue", label: "Revenue" },
          ]}
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <p className="text-4xl font-bold text-slate-900 dark:text-white">{config.total}</p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            t.up
              ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
              : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
          )}
        >
          <Arrow size={12} />
          {t.label}
        </span>
        <span className="text-xs text-slate-400">vs last month</span>
      </div>

      <div className="mt-4">
        <AreaChart values={values} labels={labels} format={config.format} />
      </div>
    </div>
  )
}