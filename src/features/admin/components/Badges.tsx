import { cn } from "@/lib/utils"
import type { UserRole } from "../user-types"

const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"

const ROLES: Record<UserRole, { label: string; style: string }> = {
  admin: { label: "Admin", style: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" },
  teacher: { label: "Teacher", style: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" },
  student: { label: "Student", style: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" },
}

export function RoleBadge({ role }: { role: UserRole }) {
  const r = ROLES[role] ?? ROLES.student
  return <span className={cn(base, r.style)}>{r.label}</span>
}

export function StatusBadge({ suspended }: { suspended: boolean }) {
  return (
    <span
      className={cn(
        base,
        suspended
          ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
          : "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
      )}
    >
      {suspended ? "Suspended" : "Active"}
    </span>
  )
}