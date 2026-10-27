import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ChevronDown,
  Eye,
  Inbox,
  Mail,
  MailCheck,
  MailOpen,
  Reply,
  Search,
  Trash2,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import ConfirmDialog from "@/features/admin/components/ConfirmDialog"
import { useToast } from "@/features/admin/toast-context"
import Avatar from "@/features/student/components/Avatar"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_OUTLINE, CARD, INPUT } from "@/features/student/ui"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"

type Status = "new" | "read" | "replied"

interface ContactRow {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  instructor?: string
  status: Status
  createdAt: string
}

interface MessagesResponse {
  messages: ContactRow[]
  total: number
  page: number
  pages: number
  limit: number
  summary: { total: number; new: number; read: number; replied: number }
}

const PAGE_SIZE = 10
const STATUSES: Status[] = ["new", "read", "replied"]

const STATUS_LABEL: Record<Status, string> = { new: "New", read: "Read", replied: "Replied" }

const STATUS_STYLE: Record<Status, string> = {
  new: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  read: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  replied: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

function StatusPill({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLE[status])}>
      {STATUS_LABEL[status]}
    </span>
  )
}

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

function MessageModal({
  message: m,
  busy,
  onClose,
  onStatus,
  onDelete,
}: {
  message: ContactRow
  busy: boolean
  onClose: () => void
  onStatus: (next: Status) => void
  onDelete: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const first = m.name.split(" ")[0]
  const mailto = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}&body=${encodeURIComponent(
    `Hi ${first},\n\n\n\n---\nOn ${fmt(m.createdAt)} you wrote:\n${m.message}`
  )}`

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={m.name} size={44} />
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-900 dark:text-white">{m.name}</p>
              <a href={`mailto:${m.email}`} className="truncate text-sm text-teal-700 hover:underline">
                {m.email}
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <StatusPill status={m.status} />
          <span>{fmt(m.createdAt)}</span>
          {m.instructor && <span>About instructor: <b className="text-slate-700 dark:text-slate-200">{m.instructor}</b></span>}
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{m.subject}</h2>
        <p className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {m.message}
        </p>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                disabled={busy}
                onClick={() => onStatus(s)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
                  m.status === s
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:text-slate-300"
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
          >
            <Trash2 size={15} /> Delete
          </button>
          <a
            href={mailto}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            <Reply size={15} /> Reply by email
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AdminMessages() {
  const toast = useToast()

  const [q, setQ] = useState("")
  const [dq, setDq] = useState("")
  const [status, setStatus] = useState<"all" | Status>("all")
  const [page, setPage] = useState(1)
  const [tick, setTick] = useState(0)

  const [selected, setSelected] = useState<ContactRow | null>(null)
  const [deleting, setDeleting] = useState<ContactRow | null>(null)
  const [busy, setBusy] = useState(false)

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
      status: status === "all" ? undefined : status,
      page,
      limit: PAGE_SIZE,
      _r: tick,
    }),
    [dq, status, page, tick]
  )

  const [res, setRes] = useState<{ params: typeof params; data?: MessagesResponse; error?: string } | null>(null)

  useEffect(() => {
    let alive = true
    api
      .get<MessagesResponse>("/admin/contact-messages", { params })
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
  const rows = data?.messages ?? []
  const from = data && data.total > 0 ? (data.page - 1) * PAGE_SIZE + 1 : 0
  const to = data ? Math.min(data.page * PAGE_SIZE, data.total) : 0

  const closeModal = useCallback(() => setSelected(null), [])

  const changeStatus = async (m: ContactRow, next: Status, quiet = false) => {
    if (m.status === next) return
    setBusy(true)
    try {
      await api.patch(`/admin/contact-messages/${m._id}/status`, { status: next })
      setSelected((s) => (s && s._id === m._id ? { ...s, status: next } : s))
      setTick((t) => t + 1)
      if (!quiet) toast.success("Status updated", `Marked as ${STATUS_LABEL[next].toLowerCase()}.`)
    } catch (err) {
      toast.error("Could not update status", getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const openMessage = (m: ContactRow) => {
    setSelected(m)
    if (m.status === "new") void changeStatus(m, "read", true)
  }

  const remove = async (m: ContactRow) => {
    setBusy(true)
    try {
      await api.delete(`/admin/contact-messages/${m._id}`)
      toast.success("Message deleted", `The message from ${m.name} was removed.`)
      setSelected((s) => (s && s._id === m._id ? null : s))
      /* page er shesh message delete hole ager page e jai */
      if (data && data.messages.length === 1 && page > 1) setPage((p) => p - 1)
      setTick((t) => t + 1)
    } catch (err) {
      toast.error("Could not delete message", getErrorMessage(err))
    } finally {
      setBusy(false)
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="Messages"
        title="Messages"
        subtitle="Everything people send through the Contact page."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat icon={Inbox} tone="bg-teal-50 text-teal-600 dark:bg-teal-500/15" value={data?.summary.total ?? 0} label="Total messages" />
        <MiniStat icon={Mail} tone="bg-orange-50 text-orange-500 dark:bg-orange-500/15" value={data?.summary.new ?? 0} label="New" />
        <MiniStat icon={MailOpen} tone="bg-slate-100 text-slate-600 dark:bg-slate-800" value={data?.summary.read ?? 0} label="Read" />
        <MiniStat icon={MailCheck} tone="bg-teal-50 text-teal-600 dark:bg-teal-500/15" value={data?.summary.replied ?? 0} label="Replied" />
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, subject or message..."
            className={cn(INPUT, "pl-11")}
          />
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as "all" | Status)
              setPage(1)
            }}
            className={cn(INPUT, "appearance-none pr-10")}
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
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
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500 dark:border-slate-800">
                <th className="px-4 py-4 pl-5 font-semibold">Sender</th>
                <th className="px-4 py-4 font-semibold">Subject</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Received</th>
                <th className="px-4 py-4 pr-5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!data && loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-slate-500">
                    Loading messages...
                  </td>
                </tr>
              )}
              {data && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-slate-500">
                    No messages match your filters.
                  </td>
                </tr>
              )}
              {rows.map((m) => {
                const unread = m.status === "new"
                return (
                  <tr
                    key={m._id}
                    onClick={() => openMessage(m)}
                    className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-3 pl-5 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} size={40} />
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "truncate text-slate-900 dark:text-white",
                              unread ? "font-bold" : "font-semibold"
                            )}
                          >
                            {m.name}
                          </p>
                          <p className="truncate text-xs text-slate-500">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[320px] px-4 py-3">
                      <p className={cn("truncate text-slate-900 dark:text-white", unread && "font-semibold")}>
                        {m.subject}
                      </p>
                      <p className="truncate text-xs text-slate-500">{m.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={m.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{fmt(m.createdAt)}</td>
                    <td className="px-4 py-3 pr-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            openMessage(m)
                          }}
                          aria-label={`Open message from ${m.name}`}
                          title="Open"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-teal-600 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleting(m)
                          }}
                          aria-label={`Delete message from ${m.name}`}
                          title="Delete"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:border-slate-700"
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
        <MessageModal
          message={selected}
          busy={busy}
          onClose={closeModal}
          onStatus={(next) => void changeStatus(selected, next)}
          onDelete={() => setDeleting(selected)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this message?"
          text={`The message from ${deleting.name} will be removed permanently.`}
          confirmLabel="Delete"
          tone="danger"
          busy={busy}
          onConfirm={() => void remove(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}