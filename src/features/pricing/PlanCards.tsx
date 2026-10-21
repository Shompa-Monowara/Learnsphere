import { Tag } from "lucide-react"
import { Link } from "react-router-dom"
import type { Plan } from "./types"
import { CheckBadge } from "./ui"

interface Props {
  plans: Plan[]
  yearly: boolean
  onYearlyChange: (value: boolean) => void
  discount: number
}

export default function PlanCards({ plans, yearly, onYearlyChange, discount }: Props) {
  return (
    <section className="bg-white pb-20 pt-10 dark:bg-slate-900">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        {/* Monthly / Yearly toggle */}
        <div className="flex flex-col items-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {(["Monthly", "Yearly"] as const).map((label) => {
              const active = (label === "Yearly") === yearly
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onYearlyChange(label === "Yearly")}
                  className={`rounded-full px-5 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-600 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400">
            <Tag size={11} /> Save {discount}% with yearly billing
          </span>
        </div>

        {/* Cards */}
        <div className="mt-10 grid items-start gap-6 md:grid-cols-3">
          {plans.map((p) => {
            const price = yearly ? Math.round(p.monthlyPrice * (1 - discount / 100)) : p.monthlyPrice
            const note = p.monthlyPrice === 0 ? p.priceNote : yearly ? `${p.priceNote}, billed yearly` : p.priceNote

            return (
              <div
                key={p.slug}
                className={`relative rounded-2xl border bg-white p-6 dark:bg-slate-900 ${
                  p.popular
                    ? "border-teal-500 shadow-xl shadow-teal-600/10 md:-mt-4"
                    : "border-slate-100 shadow-sm dark:border-slate-800"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold text-white">
                    Most Popular
                  </span>
                )}

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{p.tagline}</p>

                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">${price}</span>
                  <span className="text-xs text-slate-500">{note}</span>
                </p>

                <Link
                  to={p.ctaTo}
                  className={`mt-5 flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                    p.popular
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                  }`}
                >
                  {p.cta}
                </Link>

                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <CheckBadge />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}