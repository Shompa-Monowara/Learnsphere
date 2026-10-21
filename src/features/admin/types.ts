export interface Point {
  month: string
  value: number
}

export interface AdminStatsData {
  stats: {
    users: number
    usersByRole: Record<string, number>
    courses: number
    coursesByStatus: Record<string, number>
    enrollments: number
    revenue: number
    payouts?: number
  }
  userGrowth: Point[]
  revenueTrend: Point[]
  enrollmentTrend: Point[]
  payoutTrend?: Point[]
  recentActivity: {
    users: { _id: string; name: string; role: string; createdAt: string }[]
    enrollments: {
      _id: string
      createdAt: string
      student?: { name: string } | null
      course?: { title: string } | null
    }[]
  }
}

export interface AdminTransaction {
  _id: string
  amount: number
  status: "paid" | "pending" | "failed" | "refunded"
  createdAt: string
  user?: { name: string } | null
  course?: { title: string } | null
}

export interface AdminCourseRow {
  _id: string
  title: string
  status: string
  updatedAt: string
  price?: number
  discountPrice?: number
  lessonsCount?: number
  totalDuration?: number
  studentsCount?: number
  rejectionReason?: string
  instructor?: { _id: string; name: string; email?: string } | null
  category?: { name: string } | null
}

export type ModerationStatus = "pending" | "published" | "rejected" | "unpublished"

export type ActivityKind = "user" | "teacher" | "enroll" | "course" | "payment" | "failed"

export interface ActivityEvent {
  id: string
  kind: ActivityKind
  title: string
  text: string
  at: string
}

export interface AdminCategory {
  _id: string
  name: string
  slug: string
  icon: string
  coursesCount: number
  teachersCount: number
}

export interface ReportKpi {
  value: number
  /* null = ager period e kichu chilo na ("New" dekhai) */
  change: number | null
}

export interface AdminReport {
  range: number
  months: string[]
  kpis: {
    enrollments: ReportKpi
    completions: ReportKpi
    activeUsers: ReportKpi
    completionRate: ReportKpi
  }
  series: { enrollments: number[]; completions: number[]; activeUsers: number[] }
  topCourses: {
    _id: string
    title: string
    instructor: string
    enrollments: number
    completionRate: number
    revenue: number
  }[]
}

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded"

export interface AdminPayment {
  _id: string
  transactionId: string
  amount: number
  method?: string
  status: PaymentStatus
  createdAt: string
  customer?: { name?: string; email?: string }
  course?: { title?: string }
  instructor?: { name?: string }
}

export interface PaymentsResponse {
  payments: AdminPayment[]
  total: number
  page: number
  pages: number
  summary: {
    revenue: number
    transactions: number
    methods: { method: string; count: number; percent: number }[]
  }
}

export type PaymentSortKey = "transaction" | "customer" | "course" | "amount" | "method" | "date"