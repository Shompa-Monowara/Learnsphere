import { BookOpen } from "lucide-react"
import { gradientFor } from "../data"
import type { CatalogCourse } from "../data"

export default function CourseThumb({ course, className = "" }: { course: CatalogCourse; className?: string }) {
  if (course.image) {
    return <img src={course.image} alt={course.title} className={`h-full w-full object-cover ${className}`} />
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradientFor(course.category)} ${className}`}>
      <BookOpen size={36} className="text-white/80" />
    </div>
  )
}