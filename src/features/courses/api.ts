import { api } from "@/services/api"
import type { CatalogCourse, Level, Section } from "./data"

interface ApiLesson {
  _id: string
  title: string
  type: "video" | "pdf" | "quiz" | "assignment"
  url?: string
  duration?: number
  isPreview?: boolean
}

interface ApiCourse {
  _id: string
  title: string
  shortDescription?: string
  description?: string
  category?: { _id: string; name: string } | null
  instructor?: { _id: string; name: string; avatar?: string; bio?: string; headline?: string } | null
  level?: string
  language?: string
  price: number
  discountPrice?: number | null
  thumbnail?: string
  previewVideo?: string
  requirements?: string[]
  outcomes?: string[]
  sections?: { _id: string; title: string; lessons: ApiLesson[] }[]
  status: string
  lessonsCount?: number
  totalDuration?: number
  studentsCount?: number
  ratingAvg?: number
  ratingCount?: number
  updatedAt?: string
}

export interface CourseDetail extends CatalogCourse {
  description: string
  language: string
  status: string
  updatedAt: string
  requirements: string[]
  outcomes: string[]
  sections: Section[]
  previewUrl: string
  instructorRole: string
  instructorBio: string
  instructorAvatar: string
}

export interface ReviewItem {
  _id: string
  rating: number
  comment: string
  reply?: string
  helpful?: number
  markedByMe?: boolean
  createdAt: string
  student?: { _id: string; name: string; avatar?: string } | null
}

export interface ReviewData {
  reviews: ReviewItem[]
  breakdown: { star: number; count: number }[]
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function toCatalog(c: ApiCourse): CatalogCourse {
  const hasDiscount =
    c.discountPrice !== undefined && c.discountPrice !== null && c.price > c.discountPrice
  return {
    id: c._id,
    title: c.title,
    summary: c.shortDescription || (c.description ?? "").slice(0, 160),
    category: c.category?.name ?? "Uncategorized",
    level: capitalize(c.level ?? "beginner") as Level,
    bestseller: (c.studentsCount ?? 0) >= 100 && (c.ratingAvg ?? 0) >= 4.5,
    instructor: c.instructor?.name ?? "LearnSphere",
    lessons: c.lessonsCount ?? 0,
    hours: Math.round((c.totalDuration ?? 0) / 360) / 10,
    students: c.studentsCount ?? 0,
    rating: c.ratingAvg ?? 0,
    reviews: c.ratingCount ?? 0,
    price: hasDiscount ? (c.discountPrice as number) : c.price,
    oldPrice: hasDiscount ? c.price : 0,
    image: c.thumbnail ?? "",
  }
}

function toDetail(c: ApiCourse): CourseDetail {
  const sections: Section[] = (c.sections ?? []).map((s) => ({
    title: s.title,
    lessons: s.lessons.map((l) => ({
      id: l._id,
      title: l.title,
      type: l.type,
      minutes: Math.round((l.duration ?? 0) / 60),
      preview: !!l.isPreview,
    })),
  }))
  const previewLesson = (c.sections ?? [])
    .flatMap((s) => s.lessons)
    .find((l) => l.type === "video" && l.isPreview && l.url)

  return {
    ...toCatalog(c),
    description: c.description ?? "",
    language: c.language ?? "English",
    status: c.status,
    updatedAt: c.updatedAt ?? new Date().toISOString(),
    requirements: c.requirements ?? [],
    outcomes: c.outcomes ?? [],
    sections,
    previewUrl: c.previewVideo || previewLesson?.url || "",
    instructorRole: c.instructor?.headline || "LearnSphere Instructor",
    instructorBio: c.instructor?.bio || "An experienced practitioner who teaches what they use every day.",
    instructorAvatar: c.instructor?.avatar ?? "",
  }
}

export function lessonStats(sections: Section[]) {
  const all = sections.flatMap((s) => s.lessons)
  const count = (t: string) => all.filter((l) => l.type === t).length
  return { video: count("video"), pdf: count("pdf"), quiz: count("quiz"), assignment: count("assignment") }
}

export async function fetchAllCourses(): Promise<CatalogCourse[]> {
  const first = await api.get("/courses", { params: { limit: 50, page: 1 } })
  let list: ApiCourse[] = first.data.courses
  for (let p = 2; p <= first.data.pages; p++) {
    const res = await api.get("/courses", { params: { limit: 50, page: p } })
    list = list.concat(res.data.courses)
  }
  return list.map(toCatalog)
}

export async function fetchCourse(id: string): Promise<{ course: CourseDetail; enrolled: boolean }> {
  const res = await api.get(`/courses/${id}`)
  return { course: toDetail(res.data.course), enrolled: !!res.data.enrolled }
}

export async function fetchReviews(id: string): Promise<ReviewData> {
  const res = await api.get(`/courses/${id}/reviews`)
  return { reviews: res.data.reviews, breakdown: res.data.breakdown }
}

export async function submitReview(id: string, rating: number, comment: string) {
  await api.post(`/courses/${id}/reviews`, { rating, comment })
}

export async function toggleHelpful(id: string): Promise<{ helpful: number; markedByMe: boolean }> {
  const res = await api.post(`/reviews/${id}/helpful`)
  return { helpful: res.data.helpful, markedByMe: res.data.markedByMe }
}

export async function enrollInCourse(id: string) {
  await api.post(`/enrollments/${id}`)
}