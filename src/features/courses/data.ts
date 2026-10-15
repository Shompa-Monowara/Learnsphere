export type Level = "Beginner" | "Intermediate" | "Advanced"

export interface CatalogCourse {
  id: string
  title: string
  summary: string
  category: string
  level: Level
  bestseller: boolean
  instructor: string
  lessons: number
  hours: number
  students: number
  rating: number
  reviews: number
  price: number
  oldPrice: number
  image: string
}

export interface Filters {
  categories: string[]
  levels: string[]
  rating: number
  durations: string[]
  prices: string[]
}

export const EMPTY_FILTERS: Filters = {
  categories: [],
  levels: [],
  rating: 0,
  durations: [],
  prices: [],
}

export const COURSES: CatalogCourse[] = [
  { id: "1", title: "Complete Python Bootcamp: From Zero to Data Science", summary: "Go from your first line of Python to analysing real datasets with pandas and visualising results.", category: "Data Science", level: "Beginner", bestseller: true, instructor: "Dr. Amara Okafor", lessons: 148, hours: 26, students: 32540, rating: 4.9, reviews: 8420, price: 49, oldPrice: 129, image: "" },
  { id: "2", title: "Modern React & TypeScript: Build Production Apps", summary: "Build and ship production-ready React applications with TypeScript, routing, and testing.", category: "Web Development", level: "Intermediate", bestseller: true, instructor: "Marcus Bennett", lessons: 182, hours: 31, students: 28110, rating: 4.8, reviews: 6130, price: 59, oldPrice: 149, image: "" },
  { id: "3", title: "Digital Marketing Strategy: SEO, Ads & Analytics", summary: "Plan campaigns, rank in search, run paid ads, and measure what actually works.", category: "Marketing", level: "Beginner", bestseller: false, instructor: "Sofia Marchetti", lessons: 96, hours: 18, students: 26340, rating: 4.8, reviews: 4720, price: 39, oldPrice: 109, image: "" },
  { id: "4", title: "UI/UX Design Masterclass: From Figma to Prototype", summary: "Design beautiful, usable interfaces in Figma and turn wireframes into clickable prototypes clients love.", category: "Design", level: "Beginner", bestseller: true, instructor: "Priya Raghavan", lessons: 120, hours: 22, students: 24780, rating: 4.9, reviews: 5210, price: 45, oldPrice: 119, image: "" },
  { id: "5", title: "Advanced CSS & Tailwind: Responsive Interfaces", summary: "Master modern layout, animation, and utility-first styling for fully responsive interfaces.", category: "Web Development", level: "Intermediate", bestseller: false, instructor: "Marcus Bennett", lessons: 118, hours: 20, students: 20110, rating: 4.8, reviews: 3560, price: 42, oldPrice: 115, image: "" },
  { id: "6", title: "AWS Certified Solutions Architect 2026", summary: "Prepare for the certification while designing resilient, cost-aware cloud architectures.", category: "Cloud & DevOps", level: "Advanced", bestseller: false, instructor: "Daniel Kowalski", lessons: 156, hours: 34, students: 19870, rating: 4.7, reviews: 3910, price: 69, oldPrice: 179, image: "" },
  { id: "7", title: "SQL & Database Design for Analysts", summary: "Write confident SQL, model clean schemas, and answer business questions straight from the database.", category: "Data Science", level: "Beginner", bestseller: false, instructor: "Daniel Kowalski", lessons: 104, hours: 17, students: 18930, rating: 4.8, reviews: 2980, price: 38, oldPrice: 99, image: "" },
  { id: "8", title: "Flutter & Dart: Build iOS & Android Apps", summary: "Create polished cross-platform mobile apps from a single Flutter codebase.", category: "Mobile Development", level: "Intermediate", bestseller: false, instructor: "Hiroshi Tanaka", lessons: 164, hours: 29, students: 17420, rating: 4.9, reviews: 3280, price: 55, oldPrice: 139, image: "" },
  { id: "9", title: "Machine Learning with scikit-learn & TensorFlow", summary: "Train, evaluate, and deploy machine learning models with the most popular Python libraries.", category: "Data Science", level: "Advanced", bestseller: true, instructor: "Dr. Amara Okafor", lessons: 174, hours: 33, students: 16450, rating: 4.9, reviews: 3080, price: 72, oldPrice: 189, image: "" },
  { id: "10", title: "Financial Modeling & Valuation Fundamentals", summary: "Build three-statement models and value companies the way analysts do.", category: "Business & Finance", level: "Intermediate", bestseller: false, instructor: "Elena Vasquez", lessons: 88, hours: 16, students: 12600, rating: 4.7, reviews: 1840, price: 0, oldPrice: 89, image: "" },
  { id: "11", title: "Ethical Hacking & Network Security Essentials", summary: "Learn how attackers think and how to defend networks, applications, and users.", category: "Cybersecurity", level: "Intermediate", bestseller: false, instructor: "Kareem Nasser", lessons: 132, hours: 24, students: 11240, rating: 4.7, reviews: 1620, price: 52, oldPrice: 129, image: "" },
  { id: "12", title: "Product Management: From Idea to Launch", summary: "Discover customer problems, prioritise a roadmap, and launch products people actually use.", category: "Business & Finance", level: "Beginner", bestseller: false, instructor: "Julia Rossi", lessons: 76, hours: 14, students: 9870, rating: 4.6, reviews: 1290, price: 36, oldPrice: 95, image: "" },
]

export const discount = (c: CatalogCourse) =>
  c.oldPrice > 0 ? Math.round((1 - c.price / c.oldPrice) * 100) : 0

const GRADIENTS: Record<string, string> = {
  "Data Science": "from-teal-500 to-emerald-800",
  "Web Development": "from-cyan-500 to-teal-800",
  Marketing: "from-orange-400 to-amber-600",
  Design: "from-rose-400 to-orange-500",
  "Cloud & DevOps": "from-sky-500 to-slate-800",
  "Mobile Development": "from-indigo-500 to-teal-700",
  "Business & Finance": "from-emerald-500 to-teal-900",
  Cybersecurity: "from-slate-600 to-teal-950",
}

export const gradientFor = (category: string) =>
  GRADIENTS[category] ?? "from-teal-500 to-emerald-800"

export const initials = (name: string) =>
  name
    .replace("Dr. ", "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

const INSTRUCTORS: Record<string, { role: string; bio: string }> = {
  "Dr. Amara Okafor": { role: "Data Science Lead & Former ML Engineer", bio: "Amara has spent a decade building machine learning systems and now teaches data skills to over 48,000 learners." },
  "Marcus Bennett": { role: "Senior Full-Stack Engineer & Tech Educator", bio: "Marcus ships production web apps for a living and turns real project lessons into clear, practical courses." },
  "Sofia Marchetti": { role: "Growth Marketing Consultant", bio: "Sofia has led acquisition campaigns for startups and teaches the strategy behind sustainable growth." },
  "Priya Raghavan": { role: "Product Design Lead & Figma Community Advocate", bio: "Priya designs products used by millions and loves helping beginners build a confident design process." },
  "Daniel Kowalski": { role: "Cloud Architect & AWS Certified Instructor", bio: "Daniel designs cloud platforms for enterprises and has helped thousands of students pass AWS certifications." },
  "Hiroshi Tanaka": { role: "Mobile Engineer & Flutter Specialist", bio: "Hiroshi builds cross-platform apps and teaches mobile development with a focus on clean architecture." },
  "Elena Vasquez": { role: "Corporate Finance Analyst", bio: "Elena models deals and valuations for a living and explains finance without the jargon." },
  "Kareem Nasser": { role: "Security Engineer & Penetration Tester", bio: "Kareem breaks into systems professionally so companies can fix weaknesses before attackers find them." },
  "Julia Rossi": { role: "Senior Product Manager", bio: "Julia has launched products across fintech and education and mentors new product managers." },
}

export const getInstructor = (name: string) =>
  INSTRUCTORS[name] ?? { role: "LearnSphere Instructor", bio: "An experienced practitioner who teaches what they use every day." }

export interface Lesson {
  id?: string
  title: string
  type: "video" | "pdf" | "quiz" | "assignment"
  minutes: number
  preview: boolean
}
export interface Section {
  title: string
  lessons: Lesson[]
}

const SECTION_TITLES = [
  "Getting started",
  "Core concepts",
  "Hands-on projects",
  "Advanced techniques",
  "Practice and quizzes",
  "Wrap-up and next steps",
]

export function buildCurriculum(course: CatalogCourse): Section[] {
  const perSection = Math.ceil(course.lessons / SECTION_TITLES.length)
  let n = 0
  return SECTION_TITLES.map((title, s) => {
    const count = Math.min(perSection, course.lessons - n)
    const lessons: Lesson[] = []
    for (let i = 0; i < Math.max(count, 0); i++) {
      n++
      const type = n % 9 === 0 ? "quiz" : n % 7 === 0 ? "pdf" : "video"
      lessons.push({
        title:
          type === "quiz"
            ? `Quiz ${Math.ceil(n / 9)}: check your understanding`
            : type === "pdf"
              ? `Cheat sheet ${Math.ceil(n / 7)}`
              : `Lesson ${n}: ${title.toLowerCase()} part ${i + 1}`,
        type,
        minutes: ((n * 7) % 9) + 6,
        preview: s === 0 && i < 2,
      })
    }
    return { title, lessons }
  }).filter((s) => s.lessons.length > 0)
}

export const REVIEWS = [
  { name: "Imran Hossain", rating: 5, date: "2 weeks ago", text: "Clear explanations and projects that actually feel like real work. I finished it in a month." },
  { name: "Nusrat Jahan", rating: 5, date: "1 month ago", text: "The quizzes after each section kept me honest. The certificate was a nice bonus for my profile." },
  { name: "Tanvir Hasan", rating: 4, date: "1 month ago", text: "Great pacing and very practical. I would love a few more advanced exercises at the end." },
  { name: "Maya Akter", rating: 5, date: "2 months ago", text: "Best course I have taken on this platform. The instructor answers questions quickly." },
]

export const OUTCOMES = [
  "Build real, portfolio-ready projects from a blank starting point.",
  "Understand the core mental models that make the topic click.",
  "Write cleaner, more maintainable work that senior peers respect.",
  "Debug and troubleshoot problems with a repeatable process.",
  "Apply best practices for performance, structure, and clarity.",
  "Finish with a certificate you can add to your profile.",
]