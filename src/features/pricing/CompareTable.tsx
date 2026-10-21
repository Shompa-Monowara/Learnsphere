import { Fragment } from "react"
import type { CellValue, CompareGroup, Plan } from "./types"
import { CheckBadge, Eyebrow } from "./ui"

function Cell({ value, strong }: { value: CellValue | undefined; strong: boolean }) {
  if (value === true) return <CheckBadge className="h-[18px] w-[18px]" />
  if (!value) return <span className="text-slate-300 dark:text-slate-600">—</span>
  return (
    <span className={strong ? "font-semibold text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}>
      {value}
    </span>
  )
}

export default function CompareTable({ plans, groups }: { plans: Plan[]; groups: CompareGroup[] }) {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>Feature by feature</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Compare every plan
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            A full breakdown of what each plan includes, so you can pick with confidence.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 dark:text-white">Compare features</th>
                {plans.map((p) => (
                  <th key={p.slug} className="w-[19%] px-4 py-4 text-center text-xs font-semibold text-slate-900 dark:text-white">
                    {p.name}
                    {p.popular && (
                      <span className="ml-2 rounded bg-orange-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                        Popular
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <Fragment key={g.title}>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <td
                      colSpan={plans.length + 1}
                      className="px-6 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      {g.title}
                    </td>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.key} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-6 py-4 text-xs font-medium text-slate-900 dark:text-slate-100">{r.label}</td>
                      {plans.map((p) => (
                        <td key={p.slug} className="px-4 py-4 text-center text-xs">
                          <Cell value={p.values?.[r.key]} strong={p.popular} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}