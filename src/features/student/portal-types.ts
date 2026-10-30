export interface EnrollmentItem {
  _id: string
  progress: number
  status: "completed" | "in-progress" | "not-started"
  course: {
    _id: string
    title: string
    thumbnail: string
    lessonsCount: number
    totalDuration: number
    category?: { name: string }
    instructor?: { name: string }
  } | null
}

export interface AssignmentItem {
  _id: string
  title: string
  instructions: string
  dueDate: string
  totalMarks: number
  attachments: string[]
  course: { _id: string; title: string } | null
  status: "pending" | "submitted" | "graded"
  submissionType?: "file" | "text" | "both"
  allowLate?: boolean
  allowResubmission?: boolean
  allowedFileTypes?: string[]
  maxFileSizeMB?: number
  submission: {
    _id: string
    fileUrl: string
    fileName?: string
    text?: string
    note: string
    isLate: boolean
    status: "submitted" | "graded"
    score?: number
    feedback?: string
  } | null
}

export interface QuizItem {
  _id: string
  title: string
  courseTitle: string
  questionsCount: number
  duration: number
  passingScore: number
  attempts: number
  bestScore: number | null
  passed: boolean
}

export interface PlayQuiz {
  _id: string
  title: string
  duration: number
  passingScore: number
  questions: { _id: string; text: string; options: string[]; marks: number }[]
}

export interface QuizResult {
  percent: number
  score: number
  total: number
  passed: boolean
  correct: number
  incorrect: number
  review: {
    question: string
    options: string[]
    selected: number | null
    correctIndex: number
    isCorrect: boolean
    explanation: string
  }[]
}

export interface ProgressData {
  stats: {
    avgCompletion: number
    timeSpentMinutes: number
    avgQuizScore: number
    coursesCompleted: number
    enrolled: number
  }
  quizTrend: { label: string; score: number | null }[]
  courseCompletion: { courseId: string; title: string; lessonsDone: number; lessonsTotal: number; progress: number }[]
  timeByDay: { date: string; minutes: number }[]
  timeBreakdown: { label: string; percent: number }[]
}

export interface CertificateItem {
  _id: string
  verificationId: string
  createdAt: string
  course: { _id: string; title: string; totalDuration: number; instructor?: { name: string } } | null
  student: { name: string } | null
}

export interface WishItem {
  _id: string
  title: string
  thumbnail: string
  price: number
  discountPrice?: number
  ratingAvg: number
  ratingCount: number
  category?: { name: string } | null
  instructor?: { name: string } | null
}

export interface Conversation {
  user: { _id: string; name: string; avatar: string; role: string }
  subtitle: string
  lastMessage: string
  lastAt: string | null
  unread: number
}

export interface ChatAttachment {
  url: string
  name: string
  kind: "image" | "pdf"
  size: number
}

export interface ChatMessage {
  _id: string
  sender: string
  receiver: string
  text: string
  attachment?: ChatAttachment
  createdAt: string
}

export interface NotificationItem {
  _id: string
  title: string
  message: string
  link: string
  read: boolean
  createdAt: string
}