import { ArrowRight, Compass, GraduationCap, ShieldCheck, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import CompareTable from "@/features/pricing/CompareTable"
import PlanCards from "@/features/pricing/PlanCards"
import PricingFaq from "@/features/pricing/PricingFaq"
import type { PricingData } from "@/features/pricing/types"
import { Eyebrow } from "@/features/pricing/ui"
import { api, getErrorMessage } from "@/services/api"

const TRUSTED = [
  "Northgate Academy",
  "Brightpath School",
  "Ivy Lane College",
  "CodeCamp Collective",
  "Meridian Institute",
  "Summit Tutors",
]

export default function Pricing() {
  const [data, setData] = useState<PricingData | null>(null)
  const [error, setError] = useState("")
  const [yearly, setYearly] = useState(false)

  useEffect(() => {
    api
      .get<PricingData>("/pricing")
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-white pb-12 pt-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="pointer-events-none absolute -left-32 -top-10 h-80 w-80 rounded-full bg-teal-200/50 blur-3xl dark:bg-teal-900/30" />
        <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-900/20" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <Eyebrow>
            <Tag size={11} /> Simple pricing
          </Eyebrow>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Plans that grow with your academy
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Start free and upgrade only when your audience does. Every plan includes video lessons, auto-graded
            quizzes, and progress tracking — no hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Loading / error */}
      {!data && !error && (
        <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        </div>
      )}
      {error && <p className="py-20 text-center text-sm font-medium text-red-600">{error}</p>}

      {/* Plan cards + compare table */}
      {data && (
        <>
          <PlanCards
            plans={data.plans}
            yearly={yearly}
            onYearlyChange={setYearly}
            discount={data.yearlyDiscountPercent}
          />
          <CompareTable plans={data.plans} groups={data.comparison} />
        </>
      )}

      {/* Trusted by */}
      <section className="bg-white py-14 dark:bg-slate-900">
        <div className="mx-auto max-w-[1100px] px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <ShieldCheck size={12} /> Trusted by academies and schools worldwide
          </span>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUSTED.map((n) => (
              <span key={n} className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <GraduationCap size={14} /> {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      <PricingFaq />

      {/* CTA */}
      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-600 via-teal-800 to-emerald-950 px-8 py-14 text-center text-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to launch your first course?</h2>
            <p className="relative mx-auto mt-3 max-w-md text-sm text-teal-50">
              Create your free account in minutes and publish your first course today. Upgrade whenever you're ready to grow.
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Get started free <ArrowRight size={15} />
              </Link>
              <Link
                to="/courses"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Compass size={15} /> Explore courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}