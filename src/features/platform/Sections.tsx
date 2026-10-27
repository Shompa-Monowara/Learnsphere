import { useState } from "react"
import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Check, Headset, Mail, Moon, Plug, Plus, ShieldCheck, Smartphone, Users, X } from "lucide-react"
import {
  AssignmentMock,
  CertificateMock,
  ProgressMock,
  QuizMock,
  RoleDashboardMock,
  VideoMock,
} from "./Mockups"
import type { DetailIcon, FeaturesData, FeatureSection, SectionKey } from "./types"

/* Outline teal pill (section er upor) */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
      {children}
    </span>
  )
}

const h2 = "text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-[40px]"
const lead = "text-[15px] leading-relaxed text-slate-500 dark:text-slate-400"
const wrap = "mx-auto max-w-[1240px] px-5 sm:px-8"

function Tick() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
      <Check size={12} strokeWidth={3} />
    </span>
  )
}

/* ---------- 01-06 alternating feature rows ---------- */

const MOCKS: Record<SectionKey, () => ReactNode> = {
  video: () => <VideoMock />,
  quiz: () => <QuizMock />,
  assignments: () => <AssignmentMock />,
  progress: () => <ProgressMock />,
  certificates: () => <CertificateMock />,
  dashboards: () => <RoleDashboardMock />,
}

export function FeatureRow({ section, index }: { section: FeatureSection; index: number }) {
  const reverse = index % 2 === 1
  const tinted = index % 2 === 0
  return (
    <section
      className={`border-b border-slate-100 py-16 dark:border-slate-800 sm:py-20 ${
        tinted ? "bg-slate-50 dark:bg-slate-950" : "bg-white dark:bg-slate-900"
      }`}
    >
      <div className={`${wrap} grid items-center gap-10 lg:grid-cols-2 lg:gap-20`}>
        <div className={reverse ? "lg:order-2" : ""}>
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-teal-50 px-1.5 py-1 text-[11px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">
              {section.eyebrow}
            </span>
          </div>
          <h2 className={`${h2} mt-4 max-w-md`}>{section.title}</h2>
          <p className={`${lead} mt-4 max-w-lg`}>{section.body}</p>
          <ul className="mt-6 space-y-3">
            {section.bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <Tick /> {b}
              </li>
            ))}
          </ul>
        </div>
        <div className={`mx-auto w-full max-w-[560px] ${reverse ? "lg:order-1" : ""}`}>{MOCKS[section.key]()}</div>
      </div>
    </section>
  )
}

/* ---------- Hero ---------- */

export function Hero({ hero }: { hero: FeaturesData["hero"] }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-linear-to-br from-teal-50 via-white to-teal-100/60 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/40">
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-200/50 blur-3xl dark:bg-teal-900/30" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-teal-100/70 blur-3xl dark:bg-teal-900/20" />

      <div className={`${wrap} relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16`}>
        <div>
          <Pill>{hero.badge}</Pill>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[56px]">
            {hero.titleLead} <span className="text-teal-600">{hero.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-500 dark:text-slate-400">{hero.body}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={hero.primaryCta.to}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
            >
              {hero.primaryCta.label} <ArrowRight size={16} />
            </Link>
            <Link
              to={hero.secondaryCta.to}
              className="inline-flex h-12 items-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {hero.notes.map((n) => (
              <span key={n} className="inline-flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
                <Check size={14} className="text-teal-600" /> {n}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[560px] lg:ml-auto">
          <RoleDashboardMock floating />
        </div>
      </div>
    </section>
  )
}

/* ---------- Built for both sides ---------- */

export function BothSides({ data }: { data: FeaturesData["bothSides"] }) {
  const [id, setId] = useState(data.audiences[0]?.id)
  const a = data.audiences.find((x) => x.id === id) ?? data.audiences[0]
  if (!a) return null

  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-20">
      <div className={wrap}>
        <Pill>{data.badge}</Pill>
        <h2 className={`${h2} mt-4`}>{data.title}</h2>
        <p className={`${lead} mt-3 max-w-xl`}>{data.body}</p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div role="tablist" className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
              {data.audiences.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={x.id === a.id}
                  onClick={() => setId(x.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    x.id === a.id
                      ? "bg-teal-600 text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <p className="max-w-sm text-right text-xs leading-relaxed text-slate-500 dark:text-slate-400">{a.note}</p>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_1fr_260px]">
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
              {a.items.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-end rounded-2xl bg-linear-to-br from-teal-800 to-teal-500 p-6 text-white">
              <p className="text-3xl font-extrabold">{a.stat.value}</p>
              <p className="mt-2 text-sm font-medium text-teal-50">{a.stat.label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- How it works ---------- */

export function HowItWorks({ data }: { data: FeaturesData["howItWorks"] }) {
  return (
    <section className="bg-white py-16 dark:bg-slate-900 sm:py-20">
      <div className={wrap}>
        <div className="text-center">
          <Pill>{data.badge}</Pill>
          <h2 className={`${h2} mt-4`}>{data.title}</h2>
          <p className={`${lead} mt-3`}>{data.body}</p>
        </div>

        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {data.steps.map((s, i) => (
            <div key={s.title} className="contents">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-3xl font-extrabold text-teal-200 dark:text-teal-800">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{s.body}</p>
              </div>
              {i < data.steps.length - 1 && (
                <ArrowRight size={16} className="hidden self-center text-slate-300 dark:text-slate-600 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Details ---------- */

const DETAIL_ICONS: Record<DetailIcon, typeof ShieldCheck> = {
  shield: ShieldCheck,
  phone: Smartphone,
  moon: Moon,
  users: Users,
  plug: Plug,
  headset: Headset,
}

export function Details({ data }: { data: FeaturesData["details"] }) {
  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-20">
      <div className={wrap}>
        <Pill>{data.badge}</Pill>
        <h2 className={`${h2} mt-4`}>{data.title}</h2>
        <p className={`${lead} mt-3 max-w-xl`}>{data.body}</p>

        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((it) => {
            const Icon = DETAIL_ICONS[it.icon] ?? ShieldCheck
            return (
              <div
                key={it.title}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{it.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{it.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- Pricing ---------- */

export function PricingBlock({ data }: { data: FeaturesData["pricing"] }) {
  return (
    <section className="bg-white py-16 dark:bg-slate-900 sm:py-20">
      <div className={wrap}>
        <div className="text-center">
          <Pill>{data.badge}</Pill>
          <h2 className={`${h2} mt-4`}>{data.title}</h2>
          <p className={`${lead} mx-auto mt-3 max-w-md`}>{data.body}</p>
        </div>

        <div className="mt-10 grid items-center gap-5 md:grid-cols-3">
          {data.plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 ${
                p.popular
                  ? "border-teal-300 bg-teal-50/70 shadow-[0_20px_45px_-20px_rgba(13,148,136,0.35)] dark:border-teal-700 dark:bg-teal-950/40 md:py-8"
                  : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.name}</h3>
                {p.popular && (
                  <span className="rounded-full bg-teal-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">{p.tagline}</p>
              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{p.price}</span>
                <span className="text-[13px] text-slate-500 dark:text-slate-400">{p.note}</span>
              </p>
              <ul className="mt-5 min-h-[140px] space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-slate-700 dark:text-slate-200">
                    <Check size={14} className="shrink-0 text-teal-600" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to={p.to}
                className={`mt-6 flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  p.popular
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */

export function FaqBlock({ data }: { data: FeaturesData["faq"] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-20">
      <div className={`${wrap} grid items-start gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-16`}>
        <div>
          <Pill>{data.badge}</Pill>
          <h2 className={`${h2} mt-4`}>{data.title}</h2>
          <p className={`${lead} mt-4 max-w-sm`}>{data.body}</p>
          <Link
            to={data.cta.to}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            {data.cta.label} <Mail size={15} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {data.items.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className={i > 0 ? "border-t border-slate-200 dark:border-slate-800" : ""}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{f.q}</span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isOpen
                        ? "bg-teal-600 text-white"
                        : "border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"
                    }`}
                  >
                    {isOpen ? <X size={15} /> : <Plus size={15} />}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{f.a}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- Final CTA ---------- */

export function CtaBlock({ data }: { data: FeaturesData["cta"] }) {
  return (
    <section className="bg-slate-50 pb-20 pt-4 dark:bg-slate-950">
      <div className={wrap}>
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-800 via-teal-600 to-teal-500 px-6 py-14 text-center text-white shadow-[0_25px_60px_-25px_rgba(13,148,136,0.6)] sm:py-16">
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <h2 className="relative mx-auto max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-teal-50">{data.body}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to={data.primary.to}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-teal-50"
            >
              {data.primary.label} <ArrowRight size={16} />
            </Link>
            <Link
              to={data.secondary.to}
              className="inline-flex h-12 items-center rounded-xl border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {data.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}