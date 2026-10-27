import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Award, BadgeCheck, CalendarDays, Eye, Flag, MapPin, Users } from "lucide-react"
import { Pill } from "@/features/platform/Sections"
import type { AboutData } from "./types"

const wrap = "mx-auto max-w-[1240px] px-5 sm:px-8"
const h2 = "text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-[40px]"
const lead = "text-[15px] leading-relaxed text-slate-500 dark:text-slate-400"

const META_ICONS = { pin: MapPin, calendar: CalendarDays, users: Users }

/* ---------- 1. Hero ---------- */

export function AboutHero({ hero }: { hero: AboutData["hero"] }) {
  const [imgOk, setImgOk] = useState(true)

  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-linear-to-br from-teal-50 via-white to-teal-50/40 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/30">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl dark:bg-teal-900/20" />

      <div className={`${wrap} relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16`}>
        <div>
          <Pill>
            <BadgeCheck size={13} /> {hero.badge}
          </Pill>
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

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
            {hero.meta.map((m) => {
              const Icon = META_ICONS[m.icon]
              return (
                <span key={m.label} className="inline-flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
                  <Icon size={15} className="text-teal-600" /> {m.label}
                </span>
              )
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-linear-to-br from-teal-100 to-teal-200 shadow-xl shadow-slate-900/10 dark:from-teal-900/40 dark:to-slate-800">
            {imgOk && (
              <img
                src={hero.image.src}
                alt={hero.image.alt}
                loading="eager"
                onError={() => setImgOk(false)}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <span className="absolute -right-3 top-4 inline-flex rotate-[4deg] items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg">
            <BadgeCheck size={14} /> {hero.floatingBadge}
          </span>

          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
              <Award size={18} />
            </span>
            <div>
              <p className="text-lg font-extrabold leading-tight text-slate-900 dark:text-white">{hero.rating.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{hero.rating.label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- 2. Mission + Vision ---------- */

export function MissionVision({ mission, vision }: { mission: AboutData["mission"]; vision: AboutData["vision"] }) {
  return (
    <section className="bg-white dark:bg-slate-950">
      <div className={`${wrap} grid gap-5 py-20 md:grid-cols-2`}>
        <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-7 dark:border-slate-800 dark:bg-slate-900/60">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Flag size={20} />
          </span>
          <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white">{mission.title}</h3>
          <p className={`${lead} mt-3`}>{mission.body}</p>
        </article>

        <article className="rounded-2xl border border-teal-200 bg-teal-50/70 p-7 dark:border-teal-900 dark:bg-teal-950/30">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm dark:bg-slate-900 dark:text-teal-300">
            <Eye size={20} />
          </span>
          <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white">{vision.title}</h3>
          <p className={`${lead} mt-3`}>{vision.body}</p>
        </article>
      </div>
    </section>
  )
}

/* ---------- 3. Our story (left sticky, right timeline) ---------- */

export function Story({ story }: { story: AboutData["story"] }) {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/40">
      <div className={`${wrap} grid gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-24`}>
        <div className="self-start lg:sticky lg:top-24">
          <Pill>{story.badge}</Pill>
          <h2 className={`${h2} mt-5 max-w-sm`}>{story.title}</h2>
          <p className={`${lead} mt-4 max-w-md text-base`}>{story.body}</p>

          <figure className="mt-8 max-w-[490px] rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <blockquote className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
              “{story.quote.text}”
            </blockquote>
            <figcaption className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-teal-600">
              {story.quote.author} · {story.quote.role}
            </figcaption>
          </figure>
        </div>

        <ol className="relative border-l border-slate-200 dark:border-slate-700">
          {story.timeline.map((t) => (
            <li key={t.year} className="relative pb-10 pl-10 last:pb-0">
              <span className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full bg-teal-600 ring-4 ring-slate-50 dark:ring-slate-900" />
              <span className="inline-flex rounded-full border border-teal-200 bg-teal-50/70 px-2.5 py-0.5 text-[11px] font-bold text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
                {t.year}
              </span>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t.title}</h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}