export type LessonType = "video" | "pdf" | "quiz" | "assignment"

export interface BLesson {
  key: string
  _id?: string
  title: string
  type: LessonType
  url: string
  /* minutes */
  duration: number
  isPreview: boolean
  /* quiz / assignment lesson er linked content id */
  quiz?: string
  assignment?: string
}

export interface BSection {
  key: string
  _id?: string
  title: string
  lessons: BLesson[]
}

export interface BuilderForm {
  title: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  description: string
  thumbnail: string
  price: string
  originalPrice: string
}

export interface CategoryOption {
  _id: string
  name: string
}

export const EMPTY_FORM: BuilderForm = {
  title: "",
  category: "",
  level: "beginner",
  description: "",
  thumbnail: "",
  price: "",
  originalPrice: "",
}

const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export const newLesson = (init: Partial<BLesson> = {}): BLesson => ({
  key: uid(),
  title: "",
  type: "video",
  url: "",
  duration: 0,
  isPreview: false,
  ...init,
})

export const newSection = (init: Partial<BSection> = {}): BSection => ({
  key: uid(),
  title: "",
  lessons: [],
  ...init,
})

/* ---------- server data -> builder state ---------- */

type Raw = Record<string, unknown>

const asRaw = (v: unknown): Raw => (v && typeof v === "object" ? (v as Raw) : {})
const text = (v: unknown): string => (typeof v === "string" ? v : "")

/* populated object hole _id, string hole nijei id */
const refId = (v: unknown): string | undefined => {
  if (typeof v === "string" && v) return v
  const id = asRaw(v)._id
  return typeof id === "string" && id ? id : undefined
}

const LESSON_TYPES: LessonType[] = ["video", "pdf", "quiz", "assignment"]

export function toBSections(raw: unknown): BSection[] {
  if (!Array.isArray(raw)) return []

  return raw.map((s) => {
    const sec = asRaw(s)
    const lessons = Array.isArray(sec.lessons) ? sec.lessons : []

    return newSection({
      _id: refId(sec),
      title: text(sec.title),
      lessons: lessons.map((l) => {
        const lesson = asRaw(l)
        const type = LESSON_TYPES.includes(lesson.type as LessonType) ? (lesson.type as LessonType) : "video"

        return newLesson({
          _id: refId(lesson),
          title: text(lesson.title),
          type,
          url: text(lesson.url),
          duration: typeof lesson.duration === "number" ? lesson.duration : Number(lesson.duration) || 0,
          isPreview: Boolean(lesson.isPreview),
          quiz: refId(lesson.quiz),
          assignment: refId(lesson.assignment),
        })
      }),
    })
  })
}