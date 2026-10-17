export type FeedbackTiming = "immediate" | "after_pass" | "never"
export type QuestionType = "mcq" | "written"

export const FEEDBACK_OPTIONS: { value: FeedbackTiming; label: string }[] = [
  { value: "immediate", label: "Immediately after submit" },
  { value: "after_pass", label: "Only after passing" },
  { value: "never", label: "Never show answers" },
]

export interface QQuestion {
  key: string
  type: QuestionType
  text: string
  options: string[]
  correctIndex: number
  sampleAnswer: string
  marks: number
  explanation: string
}

export interface QuizDraft {
  _id?: string
  courseId: string
  title: string
  duration: number
  passingScore: number
  feedbackTiming: FeedbackTiming
  isPublished: boolean
  questions: QQuestion[]
}

export interface ServerQuestion {
  type?: string
  text?: string
  options?: string[]
  correctIndex?: number
  sampleAnswer?: string
  marks?: number
  explanation?: string
}

export interface ServerQuiz {
  _id: string
  title: string
  duration?: number
  passingScore?: number
  feedbackTiming?: string
  isPublished?: boolean
  questions?: ServerQuestion[]
}

/** তালিকায় দেখানোর জন্য কোর্সের তথ্যসহ কুইজ */
export interface QuizItem extends ServerQuiz {
  courseId: string
  courseTitle: string
}

export interface CourseOption {
  _id: string
  title: string
}

const uid = () => Math.random().toString(36).slice(2, 10)

export const newQuestion = (type: QuestionType = "mcq"): QQuestion => ({
  key: uid(),
  type,
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  sampleAnswer: "",
  marks: type === "written" ? 5 : 1,
  explanation: "",
})

export const emptyQuiz = (courseId: string): QuizDraft => ({
  courseId,
  title: "",
  duration: 10,
  passingScore: 60,
  feedbackTiming: "immediate",
  isPublished: true,
  questions: [newQuestion()],
})

const isFeedback = (v: string | undefined): v is FeedbackTiming =>
  v === "immediate" || v === "after_pass" || v === "never"

/** কমপক্ষে ৪টি ঘর দেখাই, বেশি থাকলে সবই রাখি */
function padOptions(opts: string[] | undefined): string[] {
  const list = [...(opts ?? [])]
  while (list.length < 4) list.push("")
  return list
}

export const toDraft = (q: QuizItem): QuizDraft => ({
  _id: q._id,
  courseId: q.courseId,
  title: q.title || "",
  duration: q.duration ?? 10,
  passingScore: q.passingScore ?? 60,
  feedbackTiming: isFeedback(q.feedbackTiming) ? q.feedbackTiming : "immediate",
  isPublished: q.isPublished !== false,
  questions: (q.questions ?? []).map((x) => ({
    key: uid(),
    type: x.type === "written" ? "written" : "mcq",
    text: x.text || "",
    options: padOptions(x.options),
    correctIndex: x.correctIndex ?? 0,
    sampleAnswer: x.sampleAnswer || "",
    marks: x.marks ?? 1,
    explanation: x.explanation || "",
  })),
})

/** API কখনো `[...]`, কখনো `{ key: [...] }` পাঠায় — দুটোই সামলায় */
export function listFrom<T>(data: unknown, key: string): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj[key])) return obj[key] as T[]
    const first = Object.values(obj).find((v) => Array.isArray(v))
    if (first) return first as T[]
  }
  return []
}

/* ---------- ভ্যালিডেশন ---------- */

export interface QuestionErrors {
  text?: string
  options?: string
  correct?: string
}

export interface QuizErrors {
  title?: string
  course?: string
  duration?: string
  passingScore?: string
  general?: string
  questions: QuestionErrors[]
  any: boolean
}

export function getErrors(d: QuizDraft): QuizErrors {
  const e: QuizErrors = { questions: [], any: false }

  if (!d.title.trim()) e.title = "Give your quiz a title."
  else if (d.title.trim().length > 120) e.title = "Keep the title under 120 characters."

  if (!d._id && !d.courseId) e.course = "Choose a course for this quiz."
  if (d.duration < 1) e.duration = "Enter at least 1 minute."
  if (d.passingScore < 1 || d.passingScore > 100) e.passingScore = "Enter a value from 1 to 100."
  if (d.questions.length === 0) e.general = "Add at least one question."

  e.questions = d.questions.map((q) => {
    const qe: QuestionErrors = {}
    if (!q.text.trim()) qe.text = "Write the question."
    if (q.type === "mcq") {
      const opts = q.options.map((o) => o.trim())
      if (opts.filter(Boolean).length < 2) qe.options = "Add at least two answer options."
      else if (!opts[q.correctIndex]) qe.correct = "The selected correct answer is empty. Pick another one or fill it in."
    }
    return qe
  })

  e.any =
    !!(e.title || e.course || e.duration || e.passingScore || e.general) ||
    e.questions.some((q) => q.text || q.options || q.correct)
  return e
}

/** সেভের আগে পরিষ্কার করে: ফাঁকা option বাদ, সঠিক উত্তরের index ঠিক রাখে */
export function cleanQuiz(d: QuizDraft): QuizDraft {
  return {
    ...d,
    title: d.title.trim(),
    questions: d.questions.map((q) => {
      const base = { ...q, text: q.text.trim(), explanation: q.explanation.trim() }
      if (q.type === "written") {
        return { ...base, options: [], correctIndex: 0, sampleAnswer: q.sampleAnswer.trim() }
      }
      const opts = q.options.map((o) => o.trim())
      const correctIndex = opts.slice(0, q.correctIndex).filter(Boolean).length
      return { ...base, options: opts.filter(Boolean), correctIndex, sampleAnswer: "" }
    }),
  }
}