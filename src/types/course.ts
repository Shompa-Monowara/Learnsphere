export interface CourseInstructor {
  _id: string
  name: string
  avatar?: string
}

export interface Course {
  _id: string
  title: string
  thumbnail?: string
  shortDescription?: string
  level?: "beginner" | "intermediate" | "advanced"
  price: number
  discountPrice?: number
  ratingAvg: number
  ratingCount: number
  lessonsCount: number
  studentsCount: number
  instructor?: CourseInstructor
  category?: { _id: string; name: string }
}