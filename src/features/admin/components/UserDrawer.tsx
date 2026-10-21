import { Ban, LockOpen, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import Avatar from "@/features/student/components/Avatar"
import { INPUT } from "@/features/student/ui"
import { cn } from "@/lib/utils"
import type { AdminUserRow, UserRole } from "../user-types"
import { RoleBadge, StatusBadge } from "./Badges"

interface Props {
  user: AdminUserRow
  isSelf: boolean
  busy: boolean
  onClose: () => void
  onToggleBlock: () => void
  onDelete: () => void
  onChangeRole: (role: UserRole) => Promise<void>
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

export default function UserDrawer({ user, isSelf, busy, onClose, onToggleBlock, onDelete, onChangeRole }: Props) {
  const [role, setRole] = useState<UserRole>(user.role)
  const [saving, setSaving] = useState(false)
  const suspended = !!user.isBlocked
  const isAdmin = user.role === "admin"

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  const saveRole = async () => {
    setSaving(true)
    try {
      await onChangeRole(role)
    } finally {
      setSaving(false)
    }
  }

  const info = [
    { label: "Joined", value: fmtDate(user.createdAt) },
    { label: user.role === "teacher" ? "Courses created" : "Courses enrolled", value: String(user.coursesCount) },
  ]

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">User details</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} src={user.avatar} size={64} />
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-slate-900 dark:text-white">{user.name}</p>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <RoleBadge role={user.role} />
                <StatusBadge suspended={suspended} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {info.map((i) => (
              <div key={i.label} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <p className="text-xs text-slate-500">{i.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{i.value}</p>
              </div>
            ))}
          </div>

          {(user.headline || user.bio) && (
            <div className="space-y-2">
              {user.headline && <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.headline}</p>}
              {user.bio && <p className="text-sm leading-relaxed text-slate-500">{user.bio}</p>}
            </div>
          )}

          <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
            <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white">Role</label>
            <div className="flex gap-3">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={isSelf || saving}
                className={cn(INPUT, "flex-1")}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="button"
                onClick={() => void saveRole()}
                disabled={isSelf || saving || role === user.role}
                className="rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update"}
              </button>
            </div>
            {isSelf && <p className="mt-1.5 text-xs text-slate-400">You can't change your own role.</p>}
            {!isSelf && role === "admin" && role !== user.role && (
              <p className="mt-1.5 text-xs text-orange-600">Admins have full control of the platform.</p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 p-6 dark:border-slate-800">
          <button
            type="button"
            onClick={onToggleBlock}
            disabled={busy || isAdmin}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
              suspended
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:hover:bg-red-500/10"
            )}
          >
            {suspended ? <LockOpen size={16} /> : <Ban size={16} />}
            {suspended ? "Restore account" : "Suspend account"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy || isAdmin || isSelf}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10"
          >
            <Trash2 size={16} />
            Delete account
          </button>
          {isAdmin && <p className="mt-2 text-center text-xs text-slate-400">Admin accounts can't be suspended or deleted.</p>}
        </div>
      </aside>
    </div>
  )
}