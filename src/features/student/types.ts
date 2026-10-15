export interface DashboardStats {
  enrolledCourses: number
  completedLessons: number
  pendingAssignments: number
  certificates: number
}

export interface ContinueItem {
  enrollmentId: string
  courseId: string
  title: string
  thumbnail: string
  category: string
  instructor: string
  progress: number
  nextLesson: string
  minutesLeft: number
}

export interface Deadline {
  _id: string
  title: string
  courseTitle: string
  dueDate: string
}

export interface ActivityDay {
  date: string
  lessons: number
}

export interface StudentDashboardData {
  stats: DashboardStats
  trends: { enrolledCourses: number; completedLessons: number; certificates: number }
  continueLearning: ContinueItem[]
  upcomingDeadlines: Deadline[]
  weeklyActivity: ActivityDay[]
  streak: number
  badges: { assignments: number; notifications: number; quizzes: number; messages: number }
}