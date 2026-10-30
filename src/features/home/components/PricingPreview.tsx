import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const PLANS = [
  { name: "Free", monthly: 0, cta: "Start for free", popular: false, features: ["Up to 2 published courses", "50 enrolled students", "Video & PDF lessons", "Auto-graded quizzes", "Basic progress tracking", "Community support"] },
  { name: "Pro", monthly: 19, cta: "Start 14-day trial", popular: true, features: ["Everything in Free", "Unlimited courses", "Up to 1,000 students", "Assignments & grading queue", "Custom PDF certificates", "Detailed analytics", "Priority email support"] },
  { name: "Academy", monthly: 79, cta: "Talk to sales", popular: false, features: ["Everything in Pro", "Unlimited students & teachers", "Admin, teacher & student roles", "Cohorts & bulk enrollment", "Branded academy portal", "Dedicated account manager"] },
]

export default function PricingPreview() {
  const [yearly, setYearly] = useState(false)

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">Simple pricing</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight">Plans that grow with your academy</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Start free and upgrade only when your audience does. No hidden fees, cancel anytime.</p>
          <div className="mt-8 inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
            {["Monthly", "Yearly"].map((label) => {
              const active = (label === "Yearly") === yearly
              return (
                <button key={label} type="button" onClick={() => setYearly(label === "Yearly")} className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${active ? "bg-teal-600 text-white" : "text-slate-600 dark:text-slate-300"}`}>
                  {label}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs font-semibold text-orange-600 dark:text-orange-400">Save 20% with yearly billing</p>
        </div>

        <div className="mt-12 grid items-start gap-6 md:grid-cols-3">
          {PLANS.map((p) => {
            const price = yearly ? Math.round(p.monthly * 0.8) : p.monthly
            return (
              <div key={p.name} className={`relative rounded-2xl border bg-white p-8 dark:bg-slate-900 ${p.popular ? "border-teal-600 shadow-xl md:-mt-4" : "border-slate-200 dark:border-slate-800"}`}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-4 text-5xl font-bold">${price}<span className="text-base font-normal text-slate-500"> /month</span></p>
                <Button asChild variant={p.popular ? "default" : "outline"} className={`mt-6 h-11 w-full rounded-xl ${p.popular ? "bg-teal-600 text-white hover:bg-teal-700" : ""}`}>
                  <Link to="/register">{p.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-teal-600" />{f}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="mt-10 text-center">
          <Link to="/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
            Compare all plan features <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}