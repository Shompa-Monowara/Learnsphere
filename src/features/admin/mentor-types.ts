export interface AdminMentor {
  _id: string
  name: string
  avatar: string
  headline: string
  bio: string
  category: string
  skills: string[]
  isPublished: boolean
  createdAt: string
}

/* skills form-e comma diye lekha string, backend array banay */
export interface MentorValues {
  name: string
  avatar: string
  headline: string
  bio: string
  category: string
  skills: string
  isPublished: boolean
}