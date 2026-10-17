import { ArrowDown, ArrowUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const TONES = {
  teal: { icon: "bg-teal-50 text-teal-600 dark:bg-teal-500/10", bar: "bg-teal-400" },
  green: { icon: "bg-green-50 text-green-600 dark:bg-green-500/10", bar: "bg-teal-400" },
  orange: { icon: "bg-orange-50 text-orange-500 dark:bg-orange-500/10", bar: "bg-orange-400" },
  slate: { icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", bar: "bg-teal-400" },
}

interface Props {
  label: string
  value: number
  icon: LucideIcon
  tone: keyof typeof TONES
  bars: number[]
  delta?: number
}

export default function StatCard({ label, value, icon: Icon, tone, bars, delta }: Props) {
  const t = TONES[tone]
  const max = Math.max(...bars, 1)

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.icon}`}>
          <Icon size={20} />
        </span>
        {delta !== undefined && delta !== 0 && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              delta > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
          >
            {delta > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value.toLocaleString("en-US")}</p>
        <div className="flex h-8 items-end gap-1">
          {bars.map((b, i) => (
            <span
              key={i}
              className={`w-1.5 rounded-full ${t.bar}`}
              style={{ height: `${Math.max((b / max) * 100, 18)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}