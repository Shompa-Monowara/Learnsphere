/* ---------- Dashboard: GET /dashboard/teacher ---------- */

export interface EnrollmentPoint {
  label: string
  enrollments: number
}

export interface RecentSubmission {
  _id: string
  studentName: string
  studentAvatar: string
  courseTitle: string
  assignmentTitle: string
  status: "submitted" | "graded"
  submittedAt: string
}

export interface RecentReview {
  _id: string
  studentName: string
  studentAvatar: string
  courseTitle: string
  rating: number
  comment: string
  reply: string
  createdAt: string
}

export interface TeacherDashboardData {
  stats: {
    totalCourses: number
    totalStudents: number
    pendingSubmissions: number
    averageRating: number
  }
  trends: {
    courses: number
    students: number
  }
  enrollmentTrend: EnrollmentPoint[]
  growth: number | null
  recentSubmissions: RecentSubmission[]
  recentReviews: RecentReview[]
  badges: {
    assignments: number
    messages: number
    notifications: number
  }
}

/* ---------- My Courses: GET /teacher/courses ---------- */

export type CourseStatus = "draft" | "pending" | "published" | "rejected" | "unpublished"

export interface TeacherCourseRow {
  _id: string
  title: string
  thumbnail: string
  status: CourseStatus
  rejectionReason: string
  category: string
  lessonsCount: number
  studentsCount: number
  ratingAvg: number
  ratingCount: number
  revenue: number
  createdAt: string
}

/* ---------- Students: GET /teacher/students ---------- */

export type StudentStatus = "active" | "completed" | "at-risk"

export interface StudentRow {
  _id: string
  name: string
  email: string
  avatar: string
  courses: number
  courseTitles: string[]
  progress: number
  lastActive: string
  joined: string
  status: StudentStatus
}

/* ---------- Reviews: GET /teacher/reviews ---------- */

export interface ReviewItem {
  _id: string
  studentName: string
  studentAvatar: string
  courseTitle: string
  rating: number
  comment: string
  reply: string
  createdAt: string
}

export interface ReviewsPageData {
  summary: {
    average: number
    total: number
    distribution: { star: number; count: number; percent: number }[]
  }
  reviews: ReviewItem[]
}

/* ---------- Earnings: GET /teacher/earnings ---------- */

export type PayoutStatus = "pending" | "paid" | "rejected"

export interface PayoutRow {
  _id: string
  reference: string
  amount: number
  method: "bank" | "paypal"
  status: PayoutStatus
  createdAt: string
}

export interface EarningsData {
  cards: {
    thisMonth: number
    lastMonth: number
    lifetime: number
    available: number
    thisMonthChange: number | null
    lastMonthChange: number | null
  }
  series: { label: string; revenue: number }[]
  topCourses: { _id: string; title: string; revenue: number; sales: number }[]
  payouts: PayoutRow[]
}