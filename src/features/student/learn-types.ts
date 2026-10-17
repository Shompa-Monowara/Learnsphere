export interface LearnLesson {
  _id: string
  title: string
  type: "video" | "pdf" | "quiz" | "assignment"
  url?: string
  duration?: number
  isPreview?: boolean
  quiz?: string
  assignment?: string
}

export interface LearnSection {
  _id: string
  title: string
  lessons: LearnLesson[]
}

export interface LearnCourse {
  _id: string
  title: string
  description?: string
  instructor?: { _id?: string; name: string; avatar?: string }
  sections: LearnSection[]
  lessonsCount?: number
  totalDuration?: number
}

export interface LearnEnrollment {
  _id: string
  progress: number
  completedLessons: { lesson: string; completedAt?: string }[]
  completedAt?: string
}

export interface LearnPayload {
  course: LearnCourse
  enrollment: LearnEnrollment | null
}