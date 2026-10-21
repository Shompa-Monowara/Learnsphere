import { ArrowRight, ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { CARD } from "@/features/student/ui"
import { cn } from "@/lib/utils"

export interface AttentionItem {
  key: string
  icon: LucideIcon
  box: string
  title: string
  text: string
  to: string
}

export default function NeedsAttention({ items }: { items: AttentionItem[] }) {
  return (
    <div className={cn(CARD, "p-6")}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Needs attention</h2>
        {items.length > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-50 px-1.5 text-xs font-semibold text-red-600 dark:bg-red-500/15">
            {items.length}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 && (
          <p className="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
            All clear. Nothing needs your attention right now.
          </p>
        )}
        {items.map(({ key, icon: Icon, box, title, text, to }) => (
          <Link
            key={key}
            to={to}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", box)}>
              <Icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
              <p className="truncate text-xs text-slate-500">{text}</p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-slate-300" />
          </Link>
        ))}

        <Link
          to="/admin/courses"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-100 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800"
        >
          Open moderation tools <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}