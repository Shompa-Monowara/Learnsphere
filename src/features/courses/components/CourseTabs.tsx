import { useState } from "react"
import type { FormEvent } from "react"
import {
  BookOpen, CheckCircle2, ChevronDown, ClipboardCheck, ClipboardList, FileText, ListTree,
  Loader2, MessageSquare, PlayCircle, Star, User, Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/services/api"
import { initials } from "../data"
import { submitReview } from "../api"
import type { CourseDetail, ReviewData } from "../api"
import { buildIncludes } from "../includes"
import { HelpfulButton } from "./HelpfulButton"

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "curriculum", label: "Curriculum", icon: ListTree },
  { id: "instructor", label: "Instructor", icon: User },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
] as const

type TabId = (typeof TABS)[number]["id"]

const lessonIcon = { video: PlayCircle, pdf: FileText, quiz: ClipboardCheck, assignment: ClipboardList }

function Overview({ course }: { course: CourseDetail }) {
  const includes = buildIncludes(course)
  const paragraphs = (course.description || course.summary).split(/\n{2,}/).filter(Boolean)

  return (
    <div className="space-y-10">
      {course.outcomes.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold">What you'll learn</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {course.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-600" /> {o}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold">About this course</h3>
        {paragraphs.map((p, i) => (
          <p key={i} className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p}</p>
        ))}
        <div className="mt-4 flex flex-wrap gap-2">
          {[course.category, course.level, course.language].map((t) => (
            <span key={t} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">{t}</span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">This course includes</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {includes.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950"><Icon size={17} /></span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {course.requirements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Requirements</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {course.requirements.map((r) => (
              <li key={r} className="flex gap-2"><span className="text-orange-500">›</span>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Curriculum({ course }: { course: CourseDetail }) {
  const [open, setOpen] = useState<number | null>(0)
  const sections = course.sections

  if (sections.length === 0) {
    return <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">The instructor has not added lessons yet.</p>
  }

  return (
    <div>
      <p className="text-sm text-slate-500">{sections.length} sections · {course.lessons} lessons{course.hours > 0 && ` · ${course.hours}h total`}</p>
      <div className="mt-4 space-y-3">
        {sections.map((s, i) => {
          const isOpen = open === i
          return (
            <div key={`${s.title}-${i}`} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 bg-slate-50 px-5 py-4 text-left dark:bg-slate-900">
                <span className="font-medium">Section {i + 1}: {s.title}</span>
                <span className="flex items-center gap-3 text-xs text-slate-500">
                  {s.lessons.length} lessons
                  <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              {isOpen && (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {s.lessons.map((l, j) => {
                    const Icon = lessonIcon[l.type]
                    return (
                      <li key={l.id ?? j} className="flex items-center gap-3 px-5 py-3 text-sm">
                        <Icon size={16} className="shrink-0 text-teal-600" />
                        <span className="flex-1">{l.title}</span>
                        {l.preview && <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700 dark:bg-teal-950">Preview</span>}
                        {l.minutes > 0 && <span className="text-xs text-slate-500">{l.minutes} min</span>}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InstructorTab({ course }: { course: CourseDetail }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
      <div className="flex items-center gap-4">
        {course.instructorAvatar ? (
          <img src={course.instructorAvatar} alt={course.instructor} className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-teal-400 to-teal-700 text-2xl font-bold text-white">{initials(course.instructor)}</span>
        )}
        <div>
          <h3 className="text-lg font-semibold">{course.instructor}</h3>
          <p className="text-sm text-slate-500">{course.instructorRole}</p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Star size={13} className="fill-orange-400 text-orange-400" />{course.rating.toFixed(1)} rating</span>
            <span className="flex items-center gap-1"><Users size={13} />{course.students.toLocaleString()} students</span>
            <span className="flex items-center gap-1"><BookOpen size={13} />{course.lessons} lessons</span>
          </div>
        </div>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{course.instructorBio}</p>
    </div>
  )
}

function ReviewForm({ courseId, onDone }: { courseId: string; onDone: () => void }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!rating) {
      setError("Please choose a star rating.")
      return
    }
    setSending(true)
    setError("")
    try {
      await submitReview(courseId, rating, comment.trim())
      setRating(0)
      setComment("")
      onDone()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={submit} className="mb-8 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
      <p className="font-semibold">Rate this course</p>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
            <Star size={24} className={n <= rating ? "fill-orange-400 text-orange-400" : "text-slate-300"} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share what you liked (optional)"
        className="mt-3 w-full rounded-xl border border-slate-200 bg-transparent p-3 text-sm outline-none focus:border-teal-500 dark:border-slate-700"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={sending} className="mt-3 rounded-xl bg-teal-600 text-white hover:bg-teal-700">
        {sending && <Loader2 size={16} className="animate-spin" />} Submit review
      </Button>
    </form>
  )
}

function Reviews({ course, data, enrolled, onReviewed }: { course: CourseDetail; data: ReviewData; enrolled: boolean; onReviewed: () => void }) {
  const total = data.breakdown.reduce((n, b) => n + b.count, 0)

  return (
    <div>
      {enrolled && <ReviewForm courseId={course.id} onDone={onReviewed} />}

      <div className="grid gap-8 sm:grid-cols-[180px_1fr]">
        <div className="text-center">
          <p className="text-5xl font-bold">{course.rating.toFixed(1)}</p>
          <div className="mt-2 flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={i < Math.round(course.rating) ? "fill-orange-400 text-orange-400" : "text-slate-300"} />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">{course.reviews.toLocaleString()} reviews</p>
        </div>
        <div className="space-y-2">
          {data.breakdown.map(({ star, count }) => {
            const pct = total ? Math.round((count / total) * 100) : 0
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-slate-500">{star} stars</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-orange-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-slate-500">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {data.reviews.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No reviews yet. Be the first to review this course.</p>
      ) : (
        <ul className="mt-8 space-y-6">
          {data.reviews.map((r) => (
            <li key={r._id} className="border-t border-slate-100 pt-6 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">{initials(r.student?.name ?? "Learner")}</span>
                <div>
                  <p className="text-sm font-semibold">{r.student?.name ?? "Learner"}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} className="fill-orange-400 text-orange-400" />)}</span>
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </div>
              {r.comment && <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{r.comment}</p>}
              {r.reply && (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                  <b className="text-slate-900 dark:text-white">Instructor reply:</b> {r.reply}
                </p>
              )}
              <div className="mt-3">
                <HelpfulButton
                  key={`${r._id}-${r.helpful ?? 0}-${r.markedByMe ? 1 : 0}`}
                  reviewId={r._id}
                  authorId={r.student?._id}
                  helpful={r.helpful ?? 0}
                  markedByMe={!!r.markedByMe}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface Props {
  course: CourseDetail
  reviews: ReviewData
  enrolled: boolean
  onReviewed: () => void
}

export default function CourseTabs({ course, reviews, enrolled, onReviewed }: Props) {
  const [tab, setTab] = useState<TabId>("overview")

  return (
    <div>
      <div role="tablist" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === id ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"}`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && <Overview course={course} />}
        {tab === "curriculum" && <Curriculum course={course} />}
        {tab === "instructor" && <InstructorTab course={course} />}
        {tab === "reviews" && <Reviews course={course} data={reviews} enrolled={enrolled} onReviewed={onReviewed} />}
      </div>
    </div>
  )
}