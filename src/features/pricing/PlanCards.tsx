import { Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"
import { cancelSubscription, getMySubscription, startCheckout } from "./api"
import type { MySubscription } from "./api"
import type { Plan } from "./types"
import { CheckBadge } from "./ui"

interface Props {
  plans: Plan[]
  yearly: boolean
  onYearlyChange: (value: boolean) => void
  discount: number
}

export default function PlanCards({ plans, yearly, onYearlyChange, discount }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mine, setMine] = useState<MySubscription | null>(null)
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (user?.role !== "teacher") return
    getMySubscription()
      .then(setMine)
      .catch(() => setMine(null))
  }, [user?.role])

  const choose = async (p: Plan) => {
    setError("")
    if (!user) {
      if (p.monthlyPrice > 0) navigate("/login", { state: { from: "/pricing" } })
      else navigate(p.ctaTo)
      return
    }
    if (user.role !== "teacher") {
      setError("Plans are for teacher accounts. Please sign in with a teacher account to subscribe.")
      return
    }
    if (p.monthlyPrice === 0) {
      navigate("/teacher")
      return
    }
    setBusy(p.slug)
    try {
      const url = await startCheckout(p.slug, yearly ? "year" : "month")
      window.location.assign(url)
    } catch (err) {
      setError(getErrorMessage(err))
      setBusy("")
    }
  }

  const cancel = async () => {
    if (!window.confirm("Cancel your subscription? You keep your plan until the end of the billing period.")) return
    setError("")
    try {
      setMine(await cancelSubscription())
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const sub = mine?.subscription?.active ? mine.subscription : null
  const endDate = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : ""

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

        {sub && (
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
            <span>
              You&apos;re on <b className="capitalize">{sub.plan}</b>
              {sub.status === "trialing" && " (free trial)"}
              {endDate && (sub.cancelAtPeriodEnd ? ` · ends on ${endDate}` : ` · renews on ${endDate}`)}
            </span>
            {!sub.cancelAtPeriodEnd && (
              <button type="button" onClick={() => void cancel()} className="font-semibold underline hover:no-underline">
                Cancel subscription
              </button>
            )}
          </div>
        )}
        {error && (
          <p role="alert" className="mt-4 text-center text-xs font-medium text-red-600">
            {error}
          </p>
        )}

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

                {mine?.plan === p.slug ? (
                  <div className="mt-5 flex h-10 w-full items-center justify-center rounded-lg border border-teal-200 bg-teal-50 text-sm font-semibold text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
                    Current plan
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => void choose(p)}
                    disabled={!!busy}
                    className={`mt-5 flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      p.popular
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                    }`}
                  >
                    {busy === p.slug ? "Redirecting to Stripe..." : p.cta}
                  </button>
                )}

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