import { Link } from "react-router-dom"
import { ArrowRight, Check, PlayCircle, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const INSTRUCTORS_DATA = [
  {
    name: "Dr. Amara Okafor",
    role: "Data Science Lead & Former ML Engineer at Spotify",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    students: "48,200",
    courses: 12,
  },
  {
    name: "Marcus Bennett",
    role: "Senior Full-Stack Engineer & Tech Educator",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    students: "56,400",
    courses: 15,
  },
  {
    name: "Priya Raghavan",
    role: "Product Design Lead & Figma Community Advocate",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    students: "39,700",
    courses: 9,
  },
  {
    name: "Daniel Kowalski",
    role: "Cloud Architect & AWS Certified Instructor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    students: "31,200",
    courses: 11,
  },
]

export default function Instructors() {
  return (
    <section className="bg-white py-20 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-block rounded-full bg-[#ccfbf1]/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0f766e] dark:bg-teal-500/10 dark:text-teal-300">
              Learn from the best
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[42px]">
              Top-rated instructors
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
              Practitioners who still work in their field and teach what they actually use every day.
            </p>
          </div>
          <Link
            to="/instructors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0d9488] transition-colors hover:text-[#0f766e] dark:text-teal-400 dark:hover:text-teal-300"
          >
            View all instructors <ArrowRight size={16} />
          </Link>
        </div>

        {/* Instructors Card Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INSTRUCTORS_DATA.map((p) => (
            <div
              key={p.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-800/50 dark:shadow-none dark:hover:border-slate-700"
            >
              <div>
                {/* Profile Image with Verified Badge */}
                <div className="relative mx-auto h-24 w-24">
                  <div className="h-full w-full overflow-hidden rounded-full border-2 border-teal-100 p-0.5 shadow-xs dark:border-teal-800">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0d9488] text-white ring-2 ring-white dark:ring-slate-800">
                    <Check size={12} strokeWidth={3} />
                  </span>
                </div>

                {/* Name & Role */}
                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="mt-1.5 min-h-10 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {p.role}
                </p>

                {/* Ratings */}
                <div className="mt-3 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-[#f97316] text-[#f97316]"
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Details Footer */}
              <div className="mt-5 flex items-center justify-center gap-4 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-slate-400" />
                  {p.students}
                </span>
                <span className="flex items-center gap-1.5">
                  <PlayCircle size={14} className="text-slate-400" />
                  {p.courses} courses
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-14 text-center">
          <Button
            asChild
            size="lg"
            className="h-11 rounded-xl bg-[#0d9488] px-7 text-sm font-semibold text-white shadow-sm hover:bg-[#0f766e]"
          >
            <Link to="/register" className="flex items-center gap-2">
              Become an instructor <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}