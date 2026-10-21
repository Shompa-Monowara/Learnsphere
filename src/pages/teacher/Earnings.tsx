import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, Landmark } from "lucide-react"
import PageHeader from "@/features/student/components/PageHeader"
import PageState from "@/features/student/components/PageState"
import { BTN_PRIMARY } from "@/features/student/ui"
import { formatDate } from "@/features/student/utils"
import PayoutDialog from "@/features/teacher/components/PayoutDialog"
import RevenueChart from "@/features/teacher/components/RevenueChart"
import type { EarningsData, PayoutRow } from "@/features/teacher/types"
import { useLoad } from "@/features/teacher/useLoad"
import { usd } from "@/features/teacher/utils"

const BAR_COLORS = ["bg-teal-600", "bg-orange-500", "bg-slate-500", "bg-teal-600"]

const SOURCE_COLORS = ["bg-teal-600", "bg-orange-500", "bg-sky-600", "bg-slate-500"]

type SortKey = "reference" | "createdAt" | "amount"
type EarningsWithSources = EarningsData & { sources?: { label: string; percent: number }[] }

const STATUS: Record<string, string> = {
  paid: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
}

function Change({ value }: { value: number | null }) {
  if (value === null) return <p className="mt-2 text-xs text-slate-400">No earlier data</p>
  const up = value >= 0
  return (
    <p className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-green-600" : "text-red-600"}`}>
      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      {up ? "+" : ""}
      {value}%
    </p>
  )
}

function Card({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      {children}
    </div>
  )
}

export default function Earnings() {
  const { data, loading, error, reload } = useLoad<EarningsWithSources>("/teacher/earnings")
  const [dialog, setDialog] = useState(false)
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "createdAt", dir: "desc" })

  const payouts = useMemo(() => {
    const list: PayoutRow[] = [...(data?.payouts ?? [])]
    const { key, dir } = sort
    list.sort((a, b) => {
      const r =
        key === "amount"
          ? a.amount - b.amount
          : key === "createdAt"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : a.reference.localeCompare(b.reference)
      return dir === "asc" ? r : -r
    })
    return list
  }, [data?.payouts, sort])

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }))

  const sortIcon = (key: SortKey) =>
    sort.key !== key ? (
      <ArrowUpDown size={13} className="text-slate-300" />
    ) : sort.dir === "asc" ? (
      <ArrowUp size={13} className="text-teal-600" />
    ) : (
      <ArrowDown size={13} className="text-teal-600" />
    )

  const maxCourse = Math.max(...(data?.topCourses.map((c) => c.revenue) ?? [1]), 1)

  return (
    <div className="space-y-6">
      <PageHeader
        crumb="Earnings"
        title="Earnings & analytics"
        subtitle="Track revenue, top-performing courses, and your payout history."
        action={
          <button
            type="button"
            disabled={!data || data.cards.available < 10}
            onClick={() => setDialog(true)}
            className={`${BTN_PRIMARY} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Landmark size={16} /> Request payout
          </button>
        }
      />

      <PageState loading={loading} error={data ? "" : error} onRetry={() => void reload()}>
        {data && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <Card label="This month" value={usd(data.cards.thisMonth)}>
                <Change value={data.cards.thisMonthChange} />
              </Card>
              <Card label="Last month" value={usd(data.cards.lastMonth)}>
                <Change value={data.cards.lastMonthChange} />
              </Card>
              <Card label="Lifetime revenue" value={usd(data.cards.lifetime)}>
                <p className="mt-2 text-xs text-slate-400">All paid sales</p>
              </Card>
              <Card label="Available payout" value={usd(data.cards.available)}>
                <p
                  className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${
                    data.cards.available >= 10 ? "text-green-600" : "text-slate-400"
                  }`}
                >
                  {data.cards.available >= 10 ? (
                    <>
                      <ArrowUp size={12} /> Ready
                    </>
                  ) : (
                    "Minimum $10"
                  )}
                </p>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revenue over time</h2>
                <p className="text-sm text-slate-500">Monthly gross revenue in USD</p>
                <RevenueChart points={data.series} />
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top courses</h2>
                {data.topCourses.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-500">No sales yet.</p>
                ) : (
                  <div className="mt-5 space-y-5">
                    {data.topCourses.map((c, i) => (
                      <div key={c._id}>
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{c.title}</p>
                          <p className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">{usd(c.revenue)}</p>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                            style={{ width: `${(c.revenue / maxCourse) * 100}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {c.sales.toLocaleString("en-US")} sale{c.sales === 1 ? "" : "s"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {data.sources && data.sources.length > 0 && (
                  <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Revenue by source</h3>
                    <div className="mt-4 space-y-3">
                      {data.sources.map((s, i) => (
                        <div key={s.label} className="flex items-center gap-3 text-xs">
                          <span className="w-16 shrink-0 text-slate-600 dark:text-slate-300">{s.label}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className={`h-full rounded-full ${SOURCE_COLORS[i % SOURCE_COLORS.length]}`}
                              style={{ width: `${s.percent}%` }}
                            />
                          </div>
                          <span className="w-9 shrink-0 text-right font-semibold text-slate-700 dark:text-slate-200">
                            {s.percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            <section>
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Payout history</h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {data.payouts.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-500">No payouts requested yet.</p>
                ) : (
                  <table className="w-full min-w-[560px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 dark:border-slate-800">
                        {(
                          [
                            ["reference", "Reference", ""],
                            ["createdAt", "Date", ""],
                            ["amount", "Amount", "justify-end"],
                          ] as const
                        ).map(([key, label, align]) => (
                          <th key={key} className={`px-5 py-4 ${align ? "text-right" : ""}`}>
                            <button
                              type="button"
                              onClick={() => toggleSort(key)}
                              className={`inline-flex items-center gap-1.5 font-semibold hover:text-slate-700 ${align}`}
                            >
                              {label} {sortIcon(key)}
                            </button>
                          </th>
                        ))}
                        <th className="px-5 py-4">Method</th>
                        <th className="px-5 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {payouts.map((p) => (
                        <tr key={p._id}>
                          <td className="px-5 py-3.5 font-mono text-xs text-slate-600 dark:text-slate-300">{p.reference}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-200">{formatDate(p.createdAt)}</td>
                          <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900 dark:text-white">
                            {usd(p.amount, 2)}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                            {p.method === "paypal" ? "PayPal" : "Bank transfer"}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS[p.status]}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {dialog && (
              <PayoutDialog
                available={data.cards.available}
                onClose={() => setDialog(false)}
                onDone={() => {
                  setDialog(false)
                  void reload()
                }}
              />
            )}
          </>
        )}
      </PageState>
    </div>
  )
}