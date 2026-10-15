import { Link } from "react-router-dom"
import { BookOpen, Clock, Heart, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { discount, initials } from "../data"
import type { CatalogCourse } from "../data"
import CourseThumb from "./CourseThumb"

interface Props {
  course: CatalogCourse
  view?: "grid" | "list"
  liked?: boolean
  onToggleLike?: () => void
}

export default function CourseCard({ course, view = "grid", liked = false, onToggleLike }: Props) {
  const list = view === "list"
  const off = discount(course)

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 ${
        list ? "flex flex-col sm:flex-row" : "flex flex-col"
      }`}
    >
      <div className={`relative ${list ? "aspect-video sm:aspect-auto sm:w-72 sm:shrink-0" : "aspect-video"}`}>
        <Link to={`/courses/${course.id}`} className="block h-full">
          <CourseThumb course={course} />
        </Link>
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-800">{course.category}</span>
          {course.bestseller && <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">Bestseller</span>}
        </div>
        <button
          type="button"
          onClick={onToggleLike}
          aria-label="Toggle wishlist"
          aria-pressed={liked}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 hover:text-red-500"
        >
          <Heart size={15} className={liked ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-semibold leading-snug">
          <Link to={`/courses/${course.id}`} className="hover:text-teal-600">{course.title}</Link>
        </h3>
        {list && <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{course.summary}</p>}

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-[10px] font-semibold text-teal-700">
            {initials(course.instructor)}
          </span>
          {course.instructor}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1"><BookOpen size={13} />{course.lessons} lessons</span>
          <span className="flex items-center gap-1"><Clock size={13} />{course.hours}h total</span>
          <span className="flex items-center gap-1"><Users size={13} />{course.students.toLocaleString()}</span>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className={i < Math.round(course.rating) ? "fill-orange-400 text-orange-400" : "text-slate-300"} />
          ))}
          <b className="ml-1">{course.rating.toFixed(1)}</b>
          <span className="text-slate-500">({course.reviews.toLocaleString()})</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xl font-bold">{course.price === 0 ? "Free" : `$${course.price}`}</span>
            {off > 0 && (
              <>
                <span className="text-xs text-slate-400 line-through">${course.oldPrice}</span>
                <span className="text-xs font-semibold text-orange-600">-{off}%</span>
              </>
            )}
          </div>
          <Button asChild size="sm" className="mt-4 rounded-lg bg-teal-600 text-white hover:bg-teal-700">
            <Link to={`/courses/${course.id}`}>Enroll</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}