import { useMemo } from "react"
import { CARD } from "@/features/student/ui"
import { cn } from "@/lib/utils"
import { compactMoney, fill, lastMonths, money } from "../utils"
import type { AdminStatsData } from "../types"

const W = 520
const H = 250
const PB = 30
const PT = 10

export default function RevenueCard({ data }: { data: AdminStatsData }) {
  const slots = useMemo(() => lastMonths(6), [])
  const revenue = fill(data.revenueTrend, slots)
  const payouts = fill(data.payoutTrend, slots)

  const totalRevenue = data.stats.revenue
  const totalPayouts = data.stats.payouts ?? 0
  const margin = totalRevenue > 0 ? Math.round(((totalRevenue - totalPayouts) / totalRevenue) * 100) : 0

  const max = Math.max(...revenue, ...payouts, 1)
  const group = (W - 20) / slots.length
  const barW = 14
  const chartH = H - PT - PB
  const empty = Math.max(...revenue, ...payouts) === 0

  return (
    <div className={cn(CARD, "flex flex-col p-6")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revenue vs payouts</h2>
          <p className="text-sm text-slate-500">Gross revenue against instructor payouts</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {margin}% margin
        </span>
      </div>

      <div className="mt-4 flex items-center gap-5 text-xs text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-teal-600" /> Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-orange-500" /> Payouts
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full flex-1" role="img" aria-label="Revenue versus payouts">
        <line x1="10" x2={W - 10} y1={H - PB} y2={H - PB} className="stroke-slate-200 dark:stroke-slate-800" />
        {slots.map((s, i) => {
          const cx = 10 + group * i + group / 2
          const rh = (revenue[i] / max) * chartH
          const ph = (payouts[i] / max) * chartH
          return (
            <g key={s.key}>
              {revenue[i] > 0 && (
                <rect x={cx - barW - 2} y={H - PB - rh} width={barW} height={rh} rx="4" fill="#0d9488">
                  <title>{`${s.label} revenue: ${money(revenue[i])}`}</title>
                </rect>
              )}
              {payouts[i] > 0 && (
                <rect x={cx + 2} y={H - PB - ph} width={barW} height={ph} rx="4" fill="#f97316">
                  <title>{`${s.label} payouts: ${money(payouts[i])}`}</title>
                </rect>
              )}
              <text x={cx} y={H - 10} textAnchor="middle" className="fill-slate-400" fontSize="12">
                {s.label}
              </text>
            </g>
          )
        })}
        {empty && (
          <text x={W / 2} y={(H - PB) / 2} textAnchor="middle" className="fill-slate-400" fontSize="13">
            No revenue recorded in the last 6 months
          </text>
        )}
      </svg>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500">Total revenue</p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{compactMoney(totalRevenue)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Total payouts</p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{compactMoney(totalPayouts)}</p>
        </div>
      </div>
    </div>
  )
}