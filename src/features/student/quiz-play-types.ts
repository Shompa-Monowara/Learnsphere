export interface PlayQuestion {
  _id: string
  type?: "mcq" | "written"
  text: string
  options: string[]
  marks?: number
}

export interface PlayQuizData {
  _id: string
  title: string
  duration: number
  passingScore: number
  questions: PlayQuestion[]
}

export interface ReviewRow {
  type?: "mcq" | "written"
  question: string
  options: string[]
  selected: number | null
  answer?: string
  correctIndex: number | null
  isCorrect: boolean | null
  explanation?: string
  marks?: number
}

export interface AttemptResult {
  attemptId: string
  score: number
  total: number
  percent: number
  passed: boolean
  status: "graded" | "pending"
  pending: number
  reveal: boolean
  correct: number
  incorrect: number
  review: ReviewRow[]
}