import type { LucideIcon } from "lucide-react"
import { CARD } from "../styles"
import { CopyButton } from "./CopyButton"

interface InfoCardProps {
  icon: LucideIcon
  label: string
  value: string
  note: string
  copyValue: string
}

export function InfoCard({ icon: Icon, label, value, note, copyValue }: InfoCardProps) {
  return (
    <div className={`${CARD} flex items-start gap-4 p-5`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-1 truncate text-[15px] font-semibold text-slate-900 dark:text-white">{value}</p>
        <p className="mt-0.5 text-xs text-slate-500">{note}</p>
      </div>
      <CopyButton value={copyValue} label={label.toLowerCase()} />
    </div>
  )
}