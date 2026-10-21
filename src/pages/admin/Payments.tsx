import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Download, Eye, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import PaymentModal from "@/features/admin/components/PaymentModal"
import { fmtDate, fmtMoney, methodLabel, METHOD_COLORS, STATUS_META } from "@/features/admin/payment-utils"
import { useToast } from "@/features/admin/toast-context"
import type { AdminPayment, PaymentSortKey, PaymentsResponse } from "@/features/admin/types"
import Notice from "@/features/student/components/Notice"
import PageHeader from "@/features/student/components/PageHeader"
import { BTN_OUTLINE, CARD, INPUT } from "@/features/student/ui"
import { cn } from "@/lib/utils"
import { api, getErrorMessage } from "@/services/api"

const PAGE_SIZE = 10

function SortHead({
  label,
  k,
  sort,
  order,
  onSort,
  className,
}: {
  label: string
  k: PaymentSortKey
  sort: PaymentSortKey
  order: "asc" | "desc"
  onSort: (key: PaymentSortKey) => void
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

export default function AdminPayments() {
  const toast = useToast()

  const [q, setQ] = useState("")
  const [dq, setDq] = useState("")
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState<PaymentSortKey>("date")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [tick, setTick] = useState(0)
  const [selected, setSelected] = useState<AdminPayment | null>(null)
  const [exporting, setExporting] = useState(false)

  /* search e proti key te request na pathiye 350ms opekkha kori */
  useEffect(() => {
    const t = setTimeout(() => {
      setDq(q.trim())
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [q])

  const filters = useMemo(
    () => ({ q: dq || undefined, status: status === "all" ? undefined : status, sort, order }),
    [dq, status, sort, order]
  )
  const params = useMemo(() => ({ ...filters, page, limit: PAGE_SIZE, _r: tick }), [filters, page, tick])

  const [res, setRes] = useState<{ params: typeof params; data?: PaymentsResponse; error?: string } | null>(null)

  useEffect(() => {
    let alive = true
    api
      .get<PaymentsResponse>("/admin/payments", { params })
      .then((r) => alive && setRes({ params, data: r.data }))
      .catch((err) => alive && setRes({ params, error: getErrorMessage(err) }))
    return () => {
      alive = false
    }
  }, [params])

  const loading = res?.params !== params
  const data = res?.data
  const error = res?.params === params ? res.error : undefined
  const rows = data?.payments ?? []
  const summary = data?.summary

  const toggleSort = (key: PaymentSortKey) => {
    if (key === sort) setOrder((o) => (o === "asc" ? "desc" : "asc"))
    else {
      setSort(key)
      setOrder(key === "date" || key === "amount" ? "desc" : "asc")
    }
    setPage(1)
  }

  const exportCsv = async () => {
    setExporting(true)
    try {
      const r = await api.get<PaymentsResponse>("/admin/payments", { params: { ...filters, all: 1 } })
      const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
      const lines = [
        ["Transaction", "Customer", "Email", "Course", "Amount", "Method", "Status", "Date"],
        ...r.data.payments.map((p) => [
          p.transactionId,
          p.customer?.name ?? "",
          p.customer?.email ?? "",
          p.course?.title ?? "",
          p.amount,
          methodLabel(p.method),
          STATUS_META[p.status]?.label ?? p.status,
          fmtDate(p.createdAt),
        ]),
      ]
      const csv = lines.map((row) => row.map(q).join(",")).join("\n")
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
      const a = document.createElement("a")
      a.href = url
      a.download = "learnsphere-transactions.csv"
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      toast.error("Export failed", getErrorMessage(err))
    } finally {
      setExporting(false)
    }
  }

  const from = data && data.total > 0 ? (data.page - 1) * PAGE_SIZE + 1 : 0
  const to = data ? Math.min(data.page * PAGE_SIZE, data.total) : 0

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="Payments"
        title="Payments & transactions"
        subtitle="Monitor revenue, methods, and every transaction on the platform."
        action={
          <button type="button" onClick={() => void exportCsv()} disabled={exporting} className={BTN_OUTLINE}>
            <Download size={16} /> {exporting ? "Exporting..." : "Export"}
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className={cn(CARD, "p-6")}>
          <p className="text-sm text-slate-500">Completed revenue</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{fmtMoney(summary?.revenue ?? 0)}</p>
        </div>
        <div className={cn(CARD, "p-6")}>
          <p className="text-sm text-slate-500">Transactions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{(summary?.transactions ?? 0).toLocaleString("en-US")}</p>
        </div>
        <div className={cn(CARD, "p-6")}>
          <p className="text-sm text-slate-500">Payment methods</p>
          <div className="mt-4 space-y-3">
            {summary && summary.methods.length === 0 && <p className="text-sm text-slate-400">No payments yet.</p>}
            {summary?.methods.map((m, i) => (
              <div key={m.method} className="flex items-center gap-3 text-xs">
                <span className="w-16 shrink-0 truncate text-slate-500" title={methodLabel(m.method)}>
                  {methodLabel(m.method)}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <span className={cn("block h-full rounded-full", METHOD_COLORS[i % METHOD_COLORS.length])} style={{ width: `${m.percent}%` }} />
                </span>
                <span className="w-9 text-right font-semibold text-slate-900 dark:text-white">{m.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by customer, course, or ID..." className={cn(INPUT, "pl-11")} />
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className={cn(INPUT, "appearance-none pr-10")}
          >
            <option value="all">All statuses</option>
            <option value="paid">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {error && (
        <Notice type="error">
          {error}{" "}
          <button type="button" onClick={() => setTick((t) => t + 1)} className="font-semibold underline">Retry</button>
        </Notice>
      )}

      <div className={cn(CARD, "overflow-hidden")}>
        <div className={cn("overflow-x-auto transition-opacity", loading && data && "opacity-60")}>
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500 dark:border-slate-800">
                <SortHead label="Transaction" k="transaction" sort={sort} order={order} onSort={toggleSort} className="pl-5" />
                <SortHead label="Customer" k="customer" sort={sort} order={order} onSort={toggleSort} />
                <SortHead label="Course" k="course" sort={sort} order={order} onSort={toggleSort} />
                <SortHead label="Amount" k="amount" sort={sort} order={order} onSort={toggleSort} className="text-right" />
                <SortHead label="Method" k="method" sort={sort} order={order} onSort={toggleSort} />
                <th className="px-4 py-4 font-semibold">Status</th>
                <SortHead label="Date" k="date" sort={sort} order={order} onSort={toggleSort} />
                <th className="px-4 py-4 pr-5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!data && loading && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-slate-500">
                    Loading transactions...
                  </td>
                </tr>
              )}
              {data && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-slate-500">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
              {rows.map((p) => {
                const s = STATUS_META[p.status] ?? STATUS_META.pending
                return (
                  <tr key={p._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="py-4 pl-5 pr-4 font-mono text-xs text-slate-600 dark:text-slate-300">{p.transactionId}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{p.customer?.name ?? "Deleted user"}</p>
                      <p className="text-xs text-slate-500">{p.customer?.email ?? ""}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{p.course?.title ?? "Deleted course"}</td>
                    <td className="px-4 py-4 text-right font-semibold tabular-nums text-slate-900 dark:text-white">{fmtMoney(p.amount)}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{methodLabel(p.method)}</td>
                    <td className="px-4 py-4">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", s.style)}>{s.label}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{fmtDate(p.createdAt)}</td>
                    <td className="px-4 py-4 pr-5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelected(p)}
                          aria-label={`View ${p.transactionId}`}
                          title="View details"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-teal-600 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          <Eye size={16} />
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
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className={cn(BTN_OUTLINE, "!py-1.5 disabled:opacity-50")}>
                  Previous
                </button>
                <span className="px-2">
                  Page {data.page} of {data.pages}
                </span>
                <button type="button" onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page >= data.pages} className={cn(BTN_OUTLINE, "!py-1.5 disabled:opacity-50")}>
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selected && <PaymentModal payment={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}