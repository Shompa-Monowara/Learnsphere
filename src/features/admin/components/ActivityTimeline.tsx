import { CircleAlert, CircleDollarSign, FileUp, GraduationCap, UserPlus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { CARD } from "@/features/student/ui"
import { timeAgo } from "@/features/student/utils"
import { cn } from "@/lib/utils"
import type { ActivityEvent, ActivityKind } from "../types"

const KINDS: Record<ActivityKind, { Icon: LucideIcon; box: string; dot: string }> = {
  user: { Icon: UserPlus, box: "bg-teal-50 text-teal-600 dark:bg-teal-500/15", dot: "bg-teal-500" },
  teacher: { Icon: UserPlus, box: "bg-teal-50 text-teal-600 dark:bg-teal-500/15", dot: "bg-teal-500" },
  enroll: { Icon: GraduationCap, box: "bg-blue-50 text-blue-600 dark:bg-blue-500/15", dot: "bg-blue-500" },
  course: { Icon: FileUp, box: "bg-orange-50 text-orange-500 dark:bg-orange-500/15", dot: "bg-orange-500" },
  payment: { Icon: CircleDollarSign, box: "bg-green-50 text-green-600 dark:bg-green-500/15", dot: "bg-green-500" },
  failed: { Icon: CircleAlert, box: "bg-red-50 text-red-500 dark:bg-red-500/15", dot: "bg-red-500" },
}

export default function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  return (
    <div className={cn(CARD, "p-6")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Activity timeline</h2>
          <p className="text-sm text-slate-500">Latest events across the platform</p>
        </div>
        <Link to="/admin/reports" className="text-sm font-semibold text-slate-900 hover:text-teal-600 dark:text-white">
          View all
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">No activity yet.</p>
      ) : (
        <ul className="relative mt-5 space-y-5">
          <span className="absolute bottom-3 left-[3px] top-3 w-px bg-slate-200 dark:bg-slate-800" aria-hidden />
          {events.map((e) => {
            const { Icon, box, dot } = KINDS[e.kind]
            return (
              <li key={e.id} className="relative flex items-start gap-3 pl-0">
                <span className={cn("z-10 mt-4 h-2 w-2 shrink-0 rounded-full ring-4 ring-white dark:ring-slate-900", dot)} />
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", box)}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{e.title}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{e.text}</p>
                </div>
                <span className="shrink-0 pt-0.5 text-xs text-slate-400">{timeAgo(e.at)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}