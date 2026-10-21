import { ArrowDown, ArrowUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { CARD } from "@/features/student/ui"
import { cn } from "@/lib/utils"

const TONES = {
  teal: { box: "bg-teal-50 text-teal-600 dark:bg-teal-500/15", bar: "bg-teal-500" },
  orange: { box: "bg-orange-50 text-orange-500 dark:bg-orange-500/15", bar: "bg-orange-400" },
  slate: { box: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", bar: "bg-teal-500" },
  green: { box: "bg-green-50 text-green-600 dark:bg-green-500/15", bar: "bg-teal-500" },
}

interface Props {
  icon: LucideIcon
  tone: keyof typeof TONES
  label: string
  value: string
  pill: { label: string; up: boolean }
  bars: number[]
  footnote: string
}

function heights(values: number[]) {
  const max = Math.max(...values, 0)
  return values.map((v) => (max === 0 ? 30 : Math.max(22, Math.round((v / max) * 100))))
}

export default function StatTile({ icon: Icon, tone, label, value, pill, bars, footnote }: Props) {
  const t = TONES[tone]
  const Arrow = pill.up ? ArrowUp : ArrowDown

  return (
    <div className={cn(CARD, "p-5")}>
      <div className="flex items-start justify-between">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", t.box)}>
          <Icon size={20} />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            pill.up
              ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
              : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
          )}
        >
          <Arrow size={12} />
          {pill.label}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <p className="text-3xl font-bold leading-none text-slate-900 dark:text-white">{value}</p>
        <div className="flex h-9 items-end gap-1" aria-hidden>
          {heights(bars).map((h, i) => (
            <span key={i} className={cn("w-1.5 rounded-full", t.bar)} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{footnote}</p>
    </div>
  )
}