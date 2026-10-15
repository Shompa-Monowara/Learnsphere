import { Award, ClipboardCheck, ClipboardList, FileText, Infinity as InfinityIcon, PlayCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { lessonStats } from "./api"
import type { CourseDetail } from "./api"

export function buildIncludes(course: CourseDetail) {
  const s = lessonStats(course.sections)
  const items: { icon: LucideIcon; text: string; show: boolean }[] = [
    { icon: PlayCircle, text: `${s.video} video lessons${course.hours > 0 ? ` (${course.hours}h)` : ""}`, show: s.video > 0 },
    { icon: FileText, text: `${s.pdf} PDF resources`, show: s.pdf > 0 },
    { icon: ClipboardCheck, text: `${s.quiz} auto-graded quizzes`, show: s.quiz > 0 },
    { icon: ClipboardList, text: `${s.assignment} assignments`, show: s.assignment > 0 },
    { icon: Award, text: "Certificate of completion", show: true },
    { icon: InfinityIcon, text: "Full lifetime access", show: true },
  ]
  return items.filter((i) => i.show)
}