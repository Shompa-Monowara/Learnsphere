import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Ban,
  ChevronDown,
  CircleAlert,
  Eye,
  GraduationCap,
  LockOpen,
  Presentation,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { RoleBadge, StatusBadge } from "@/features/admin/components/Badges"
import ConfirmDialog from "@/features/admin/components/ConfirmDialog"
import UserDrawer from "@/features/admin/components/UserDrawer"
import { useToast } from "@/features/admin/toast-context"
import type { AdminUserRow, SortKey, UserRole, UsersResponse } from "@/features/admin/user-types"
import Avatar from "@/features/student/components/Avatar"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_OUTLINE, CARD, INPUT } from "@/features/student/ui"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"

const PAGE_SIZE = 10

type RoleFilter = "all" | UserRole
type StatusFilter = "all" | "active" | "suspended"

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

function MiniStat({ icon: Icon, tone, value, label }: { icon: LucideIcon; tone: string; value: number; label: string }) {
  return (
    <div className={cn(CARD, "flex items-center gap-4 p-5")}>
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tone)}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none text-slate-900 dark:text-white">{value.toLocaleString("en-US")}</p>
        <p className="mt-1 text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

function SortHead({
  label,
  k,
  sort,
  order,
  onSort,
  className,
}: {
  label: string
  k: SortKey
  sort: SortKey
  order: "asc" | "desc"
  onSort: (key: SortKey) => void
  className?: string
}) {
  const active = sort === k
  const Icon = !active ? ArrowUpDown : order === "asc" ? ArrowUp : ArrowDown
  return (
    <th className={cn("px-4 py-4 font-semibold", className)}>
      <button
        type="button"
        onClick={() => onSort(k)}
        className={cn(
          "inline-flex items-center gap-1.5 transition-colors hover:text-slate-900 dark:hover:text-white",
          className?.includes("text-right") && "flex-row-reverse"
        )}
      >
        {label}
        <Icon size={13} className={active ? "text-teal-600" : "text-slate-300"} />
      </button>
    </th>
  )
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(INPUT, "appearance-none pr-10")}>
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

export default function AdminUsers() {
  const { user: me } = useAuth()
  const toast = useToast()
  const [searchParams] = useSearchParams()

  const [q, setQ] = useState("")
  const [dq, setDq] = useState("")
  const [role, setRole] = useState<RoleFilter>("all")
  const [status, setStatus] = useState<StatusFilter>(() => {
    const s = searchParams.get("status")
    if (s === "blocked" || s === "suspended") return "suspended"
    return s === "active" ? "active" : "all"
  })
  const [sort, setSort] = useState<SortKey>("name")
  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [tick, setTick] = useState(0)

  const [selected, setSelected] = useState<AdminUserRow | null>(null)
  const [confirm, setConfirm] = useState<AdminUserRow | null>(null)
  const [deleting, setDeleting] = useState<AdminUserRow | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  /* search e proti key te request na pathiye 350ms opekkha kori */
  useEffect(() => {
    const t = setTimeout(() => {
      setDq(q.trim())
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [q])

  const params = useMemo(
    () => ({
      q: dq || undefined,
      role: role === "all" ? undefined : role,
      status: status === "all" ? undefined : status === "suspended" ? "blocked" : "active",
      sort,
      order,
      page,
      limit: PAGE_SIZE,
      _r: tick,
    }),
    [dq, role, status, sort, order, page, tick]
  )

  const [res, setRes] = useState<{ params: typeof params; data?: UsersResponse; error?: string } | null>(null)

  useEffect(() => {
    let alive = true
    api
      .get<UsersResponse>("/admin/users", { params })
      .then((r) => {
        if (alive) setRes({ params, data: r.data })
      })
      .catch((err) => {
        if (alive) setRes({ params, error: getErrorMessage(err) })
      })
    return () => {
      alive = false
    }
  }, [params])

  const loading = res?.params !== params
  const data = res?.data
  const error = res?.params === params ? res.error : undefined

  const toggleSort = (key: SortKey) => {
    if (key === sort) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"))
    } else {
      setSort(key)
      setOrder(key === "joined" || key === "courses" ? "desc" : "asc")
    }
    setPage(1)
  }

  const toggleBlock = async (u: AdminUserRow) => {
    setBusyId(u._id)
    try {
      const r = await api.patch<{ user: { isBlocked?: boolean } }>(`/admin/users/${u._id}/block`)
      const blocked = !!r.data.user.isBlocked
      if (blocked) toast.success("User suspended", `${u.name} can no longer sign in.`)
      else toast.success("User restored", `${u.name} can sign in again.`)
      setSelected((s) => (s && s._id === u._id ? { ...s, isBlocked: blocked } : s))
      setTick((t) => t + 1)
    } catch (err) {
      toast.error("Action failed", getErrorMessage(err))
    } finally {
      setBusyId(null)
      setConfirm(null)
    }
  }

  const removeUser = async (u: AdminUserRow) => {
    setBusyId(u._id)
    try {
      await api.delete(`/admin/users/${u._id}`)
      toast.success("User deleted", `${u.name} was removed from the platform.`)
      setSelected((s) => (s && s._id === u._id ? null : s))
      /* page er shesh user delete hole ager page e jai */
      if (data && data.users.length === 1 && page > 1) setPage((p) => p - 1)
      setTick((t) => t + 1)
    } catch (err) {
      toast.error("Could not delete user", getErrorMessage(err))
    } finally {
      setBusyId(null)
      setDeleting(null)
    }
  }

  const changeRole = async (u: AdminUserRow, next: UserRole) => {
    try {
      await api.patch(`/admin/users/${u._id}/role`, { role: next })
      toast.success("Role updated", `${u.name} is now ${next === "admin" ? "an admin" : `a ${next}`}.`)
      setSelected((s) => (s && s._id === u._id ? { ...s, role: next } : s))
      setTick((t) => t + 1)
    } catch (err) {
      toast.error("Could not update role", getErrorMessage(err))
    }
  }

  const users = data?.users ?? []
  const from = data && data.total > 0 ? (data.page - 1) * PAGE_SIZE + 1 : 0
  const to = data ? Math.min(data.page * PAGE_SIZE, data.total) : 0

  return (
    <div className="space-y-6">
      <PageHeader crumb="Users" title="Users" subtitle="Manage every student, teacher, and admin on the platform." />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat icon={Users} tone="bg-teal-50 text-teal-600 dark:bg-teal-500/15" value={data?.summary.total ?? 0} label="Total users" />
        <MiniStat icon={GraduationCap} tone="bg-orange-50 text-orange-500 dark:bg-orange-500/15" value={data?.summary.students ?? 0} label="Students" />
        <MiniStat icon={Presentation} tone="bg-teal-50 text-teal-600 dark:bg-teal-500/15" value={data?.summary.teachers ?? 0} label="Teachers" />
        <MiniStat icon={CircleAlert} tone="bg-orange-50 text-orange-500 dark:bg-orange-500/15" value={data?.summary.suspended ?? 0} label="Suspended" />
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_190px_190px]">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email..."
            className={cn(INPUT, "pl-11")}
          />
        </div>
        <Select
          value={role}
          onChange={(v) => {
            setRole(v as RoleFilter)
            setPage(1)
          }}
        >
          <option value="all">All roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </Select>
        <Select
          value={status}
          onChange={(v) => {
            setStatus(v as StatusFilter)
            setPage(1)
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      {error && (
        <Notice type="error">
          {error}{" "}
          <button type="button" onClick={() => setTick((t) => t + 1)} className="font-semibold underline">
            Retry
          </button>
        </Notice>
      )}

      <div className={cn(CARD, "overflow-hidden")}>
        <div className={cn("overflow-x-auto transition-opacity", loading && data && "opacity-60")}>
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500 dark:border-slate-800">
                <SortHead label="User" k="name" sort={sort} order={order} onSort={toggleSort} className="pl-5" />
                <SortHead label="Role" k="role" sort={sort} order={order} onSort={toggleSort} />
                <SortHead label="Status" k="status" sort={sort} order={order} onSort={toggleSort} />
                <SortHead label="Courses" k="courses" sort={sort} order={order} onSort={toggleSort} className="text-right" />
                <SortHead label="Joined" k="joined" sort={sort} order={order} onSort={toggleSort} />
                <th className="px-4 py-4 pr-5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!data && loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              )}
              {data && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-500">
                    No users match your filters.
                  </td>
                </tr>
              )}
              {users.map((u) => {
                const suspended = !!u.isBlocked
                const isAdmin = u.role === "admin"
                return (
                  <tr
                    key={u._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-3 pl-5 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} src={u.avatar} size={40} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="truncate text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge suspended={suspended} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">{u.coursesCount}</td>
                    <td className="px-4 py-3 text-slate-500">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-3 pr-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(u)}
                          aria-label={`View ${u.name}`}
                          title="View details"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-teal-600 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirm(u)}
                          disabled={isAdmin || busyId === u._id}
                          aria-label={suspended ? `Restore ${u.name}` : `Suspend ${u.name}`}
                          title={isAdmin ? "Admin accounts can't be suspended" : suspended ? "Restore account" : "Suspend account"}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700",
                            suspended ? "hover:bg-teal-50 hover:text-teal-600" : "hover:bg-red-50 hover:text-red-600"
                          )}
                        >
                          {suspended ? <LockOpen size={16} /> : <Ban size={16} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(u)}
                          disabled={isAdmin || busyId === u._id}
                          aria-label={`Delete ${u.name}`}
                          title={isAdmin ? "Admin accounts can't be deleted" : "Delete account"}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {data && data.total > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-sm text-slate-500 dark:border-slate-800">
            <span>
              Showing {from}–{to} of {data.total.toLocaleString("en-US")}
            </span>
            {data.pages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={cn(BTN_OUTLINE, "!py-1.5 disabled:opacity-50")}
                >
                  Previous
                </button>
                <span className="px-2">
                  Page {data.page} of {data.pages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                  disabled={page >= data.pages}
                  className={cn(BTN_OUTLINE, "!py-1.5 disabled:opacity-50")}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selected && (
        <UserDrawer
          user={selected}
          isSelf={selected._id === me?._id}
          busy={busyId === selected._id}
          onClose={() => setSelected(null)}
          onToggleBlock={() => setConfirm(selected)}
          onDelete={() => setDeleting(selected)}
          onChangeRole={(next) => changeRole(selected, next)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.isBlocked ? `Restore ${confirm.name}?` : `Suspend ${confirm.name}?`}
          text={
            confirm.isBlocked
              ? "They will be able to sign in and use the platform again."
              : "They will be signed out and won't be able to log in until you restore the account."
          }
          confirmLabel={confirm.isBlocked ? "Restore account" : "Suspend account"}
          tone={confirm.isBlocked ? "primary" : "danger"}
          busy={busyId === confirm._id}
          onConfirm={() => void toggleBlock(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.name}?`}
          text="This permanently removes the account along with their enrollments, reviews, messages and notifications. This can't be undone. To block access without losing data, suspend the account instead."
          confirmLabel="Delete account"
          tone="danger"
          busy={busyId === deleting._id}
          onConfirm={() => void removeUser(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}