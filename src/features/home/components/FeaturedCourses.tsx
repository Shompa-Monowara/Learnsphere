import { useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Heart, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { COURSES } from "../data"

export default function FeaturedCourses() {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * 320, behavior: "smooth" })

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">Handpicked for you</span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">Featured courses loved by learners</h2>
            <p className="mt-3 max-w-lg text-slate-600 dark:text-slate-400">Fresh, highly rated courses across data, development, design, and business.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll(-1)} aria-label="Previous"><ChevronLeft size={18} /></Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll(1)} aria-label="Next"><ChevronRight size={18} /></Button>
          </div>
        </div>

        <div ref={track} className="no-scrollbar mt-10 flex snap-x gap-6 overflow-x-auto pb-4">
          {COURSES.map((c) => (
            <article key={c.id} className="w-[290px] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="relative aspect-video">
                {c.image ? (
                  <img src={c.image} alt={c.title} className="h-full w-full object-cover" />
                ) : (
                  <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${c.gradient}`}>
                    <BookOpen size={36} className="text-white/80" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {c.tags.map((t, i) => (
                    <span key={t} className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${i === 0 ? "bg-teal-600 text-white" : "bg-orange-500 text-white"}`}>{t}</span>
                  ))}
                </div>
                <button type="button" aria-label="Add to wishlist" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 hover:text-red-500">
                  <Heart size={15} />
                </button>
              </div>
              <div className="p-5">
                <h3 className="line-clamp-2 min-h-12 font-semibold leading-snug">{c.title}</h3>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-[10px] font-semibold text-teal-700">
                    {c.instructor.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  {c.instructor}
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><BookOpen size={13} />{c.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Users size={13} />{c.students}</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className="fill-orange-400 text-orange-400" />)}
                  <b className="ml-1">{c.rating}</b>
                  <span className="text-slate-500">({c.reviews.toLocaleString()})</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold">${c.price}</span>
                    <span className="text-xs text-slate-400 line-through">${c.old}</span>
                    <span className="text-xs font-semibold text-green-600">-{c.off}%</span>
                  </div>
                  <Button asChild size="sm" className="rounded-lg bg-teal-600 text-white hover:bg-teal-700">
                    <Link to="/courses">Enroll</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/courses">Browse all 12,000+ courses <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}