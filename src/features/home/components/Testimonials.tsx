import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const ITEMS = [
  {
    name: "Rachel Whitfield",
    role: "Founder, Brightpath School",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    text: "We moved our whole academy onto LearnSphere in a weekend. Attendance is up, grading takes minutes, and parents love the progress reports.",
  },
  {
    name: "Omar Haddad",
    role: "Independent Instructor",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
    text: "The auto-graded quizzes alone gave me back ten hours a week. I finally have time to actually teach instead of chasing spreadsheets.",
  },
  {
    name: "Grace Lindqvist",
    role: "Student, Data Analytics",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    text: "The certificate I downloaded after finishing my first course helped me land my first analyst interview. It felt genuinely professional.",
  },
  {
    name: "Tanvir Hasan",
    role: "Teacher, Web Development",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    text: "Students submit assignments in one place and I leave feedback inline. My review queue has never been this organised.",
  },
  {
    name: "Nusrat Jahan",
    role: "Academy Owner, Lumen Studio",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    text: "Role-based dashboards mean my staff only see what they need. Onboarding a new teacher takes ten minutes.",
  },
  {
    name: "Imran Hossain",
    role: "Student, UI Design",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    text: "Resuming exactly where I left off on any device keeps me consistent. The progress bar is oddly motivating.",
  },
]

export default function Testimonials() {
  const [page, setPage] = useState(0)
  const pages = Math.ceil(ITEMS.length / 3)
  const visible = ITEMS.slice(page * 3, page * 3 + 3)

  return (
    <section className="bg-white py-20 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-block rounded-full bg-[#ccfbf1]/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0f766e] dark:bg-teal-500/10 dark:text-teal-300">
              Loved by educators
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[42px]">
              What our community says
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
              Real feedback from academy owners, instructors, and students who use LearnSphere every week.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              onClick={() => setPage((p) => (p - 1 + pages) % pages)}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              onClick={() => setPage((p) => (p + 1) % pages)}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {visible.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-800/50 dark:shadow-none dark:hover:border-slate-700"
            >
              <div>
                {/* 5 Rating Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} className="fill-[#f97316] text-[#f97316]" />
                  ))}
                </div>

                {/* Feedback Quote */}
                <blockquote className="mt-4 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                  “{t.text}”
                </blockquote>
              </div>

              {/* Author Info with Divider & Image Avatar */}
              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-slate-100 pt-5 dark:border-slate-700">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover shadow-2xs"
                />
                <div className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900 leading-snug truncate dark:text-white">
                    {t.name}
                  </span>
                  <span className="block text-xs font-medium text-slate-400 mt-0.5 truncate">
                    {t.role}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="mt-10 flex justify-center items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === page
                  ? "w-6 bg-[#0d9488]"
                  : "w-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}