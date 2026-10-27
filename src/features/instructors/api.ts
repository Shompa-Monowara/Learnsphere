import { api } from "@/services/api"

export interface InstructorItem {
  _id: string
  name: string
  avatar?: string
  headline?: string
  bio?: string
  coursesCount: number
  studentsCount: number
  rating: number
  category: string
  categories: string[]
  skills: string[]
}

export interface InstructorsResponse {
  instructors: InstructorItem[]
  total: number
  page: number
  pages: number
  limit: number
  summary: { instructors: number; students: number; avgRating: number; disciplines: number }
  categories: { name: string; count: number }[]
}

export interface InstructorParams {
  q?: string
  category?: string
  minRating?: number
  sort?: string
  page?: number
}

export async function fetchInstructors(params: InstructorParams) {
  const { data } = await api.get<InstructorsResponse>("/instructors", { params })
  return data
}