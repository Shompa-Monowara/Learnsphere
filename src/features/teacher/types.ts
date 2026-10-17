export interface EnrollmentPoint {
  label: string
  enrollments: number
}

export interface RevenuePoint {
  label: string
  revenue: number
}

export interface TeacherStats {
  totalCourses: number
  totalStudents: number
  totalRevenue: number
  avgRating: number
  [key: string]: number
}

export interface TeacherCourseSummary {
  id: string
  title: string
  thumbnail?: string
  students: number
  revenue: number
  rating: number
}

export interface TeacherReviewSummary {
  id: string
  studentName: string
  courseTitle: string
  rating: number
  comment: string
  createdAt: string
}

export interface TeacherDashboardData {
  success?: boolean
  stats?: TeacherStats
  enrollmentTrend: EnrollmentPoint[]
  enrollmentGrowth?: number | null
  revenueTrend?: RevenuePoint[]
  topCourses?: TeacherCourseSummary[]
  recentReviews?: TeacherReviewSummary[]
}