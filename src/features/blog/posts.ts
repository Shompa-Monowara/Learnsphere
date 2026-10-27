import { BookOpen, Presentation, Sparkles, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Category = "Learning" | "Teaching" | "Teams" | "Product"

export type Block = { h: string } | { p: string } | { ul: string[] }

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: Category
  author: string
  role: string
  date: string
  readMinutes: number
  body: Block[]
}

export const CATEGORIES: Category[] = ["Learning", "Teaching", "Teams", "Product"]

export const CATEGORY_META: Record<Category, { gradient: string; icon: LucideIcon }> = {
  Learning: { gradient: "from-teal-500 to-teal-700", icon: BookOpen },
  Teaching: { gradient: "from-orange-400 to-orange-600", icon: Presentation },
  Teams: { gradient: "from-teal-700 to-slate-800", icon: Users },
  Product: { gradient: "from-teal-400 to-teal-600", icon: Sparkles },
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export const POSTS: BlogPost[] = [
  {
    slug: "finish-online-courses",
    title: "How to finish an online course and actually remember it",
    excerpt:
      "Most learners don't quit because the material is hard. They quit because the habit never forms. Here is a simple routine that sticks.",
    category: "Learning",
    author: "Maya Collins",
    role: "Learning designer",
    date: "2026-10-15",
    readMinutes: 6,
    body: [
      {
        p: "Almost everyone who has bought an online course has also left one unfinished. The reason is rarely difficulty. It is that studying never became part of a normal week.",
      },
      { h: "Start smaller than feels useful" },
      {
        p: "Twenty focused minutes a day beats a three-hour binge on Sunday. A small daily slot is easy to protect, and your progress bar keeps moving, which is surprisingly motivating.",
      },
      { h: "Treat quizzes as practice, not a test" },
      {
        p: "Pulling an answer out of your memory is one of the most reliable ways to learn it. When a course has quizzes, take them soon after the lesson, and read the explanation even when you got the answer right.",
      },
      {
        ul: [
          "Pick the same time every day and put it in your calendar.",
          "Finish the lesson you started before opening a new one.",
          "Write down one sentence about what you learned after each lesson.",
          "Retake a quiz a few days later to see what stuck.",
        ],
      },
      { h: "Finish with something you made" },
      {
        p: "Assignments feel like extra work, but they are where the learning turns into a skill. Even a small project gives you something to show, and feedback from your instructor shows you what to fix next.",
      },
    ],
  },
  {
    slug: "great-course-intro-video",
    title: "What makes a great course intro video",
    excerpt:
      "Your first two minutes decide whether a student keeps going. A short checklist for an intro that earns the next lesson.",
    category: "Teaching",
    author: "Daniel Reyes",
    role: "Instructor success",
    date: "2026-10-08",
    readMinutes: 5,
    body: [
      {
        p: "Students decide quickly whether a course is for them. A good intro video answers three questions before they have time to wonder: who is this for, what will I be able to do, and why should I trust you?",
      },
      { h: "Lead with the outcome" },
      {
        p: "Open with what the student will be able to do by the end, not with your biography. Something like \"By the end of this course you will have built and published your own portfolio site\" works far better than a long welcome.",
      },
      { h: "Keep it short and honest" },
      {
        ul: [
          "Aim for under two minutes.",
          "Say who the course is for, and who it is not for.",
          "Show a glimpse of the final result.",
          "Mention what students should already know.",
        ],
      },
      {
        p: "Good audio matters more than a fancy camera. Record in a quiet room, speak naturally, and re-record the first thirty seconds until it sounds like you talking to one person.",
      },
    ],
  },
  {
    slug: "certificates-employers-trust",
    title: "What a verifiable certificate really proves",
    excerpt:
      "A PDF anyone can edit proves nothing. Here is why every LearnSphere certificate carries a unique verification ID.",
    category: "Product",
    author: "Sana Iqbal",
    role: "Product manager",
    date: "2026-09-30",
    readMinutes: 4,
    body: [
      {
        p: "A certificate is only useful if the person reading it can trust it. A screenshot or a PDF can be changed in a minute, so on its own it says very little.",
      },
      { h: "A unique ID for every certificate" },
      {
        p: "When you complete a course on LearnSphere, your certificate gets its own verification ID. Anyone who has that ID can check that the certificate is real, who earned it and which course it is for.",
      },
      { h: "What it does and does not prove" },
      {
        p: "A verified certificate shows that you finished a specific course and met its requirements. It does not replace a portfolio. The strongest profiles pair a certificate with the project you built to earn it, so share both.",
      },
      {
        ul: [
          "Download your certificate as a PDF from your dashboard.",
          "Add the verification ID to your CV or LinkedIn profile.",
          "Link to your finished project next to it.",
        ],
      },
    ],
  },
  {
    slug: "build-first-course-in-a-weekend",
    title: "Build your first course in a weekend",
    excerpt:
      "You do not need a studio or a month of free time. A realistic plan for going from idea to a course ready for review.",
    category: "Teaching",
    author: "Daniel Reyes",
    role: "Instructor success",
    date: "2026-09-22",
    readMinutes: 7,
    body: [
      {
        p: "The first course is the hardest, mostly because it feels like it has to be perfect. It does not. A focused course that solves one clear problem will serve students better than a huge one that tries to cover everything.",
      },
      { h: "Saturday: plan and record" },
      {
        ul: [
          "Write the one sentence promise of your course.",
          "Outline five to eight short lessons that deliver it.",
          "Record each lesson in one take where you can. Short is fine.",
        ],
      },
      { h: "Sunday: add practice and publish for review" },
      {
        p: "Add a quiz after the key lessons and one assignment that asks students to apply what they learned. Then fill in the description, set your price and submit the course for review. Once it is approved it goes live.",
      },
      {
        p: "Plan to improve it after launch. Student reviews and questions will show you exactly which lesson to re-record first.",
      },
    ],
  },
  {
    slug: "team-training-one-platform",
    title: "Moving your team's training onto one platform",
    excerpt:
      "Spreadsheets, shared drives and email threads do not scale. How to move to a single place for onboarding and upskilling.",
    category: "Teams",
    author: "Maya Collins",
    role: "Learning designer",
    date: "2026-09-12",
    readMinutes: 6,
    body: [
      {
        p: "Many teams train people with a mix of shared documents, recorded calls and reminders in chat. It works until the team grows, and then nobody can tell who has learned what.",
      },
      { h: "Start with one program" },
      {
        p: "Do not try to move everything at once. Pick one program, such as new hire onboarding, and build it as a course. Add a quiz at the end of each module so completion means something.",
      },
      { h: "Set roles and track progress" },
      {
        ul: [
          "Give managers and trainers teacher accounts so they can follow progress.",
          "Enroll people in cohorts instead of one by one.",
          "Use certificates to mark completed programs.",
        ],
      },
      {
        p: "Team plans include onboarding and a named support contact, so you are not doing the setup alone. Tell us about your team through the contact page and we will help you plan it.",
      },
    ],
  },
  {
    slug: "auto-graded-quizzes-save-hours",
    title: "How auto-graded quizzes give instructors their time back",
    excerpt:
      "Grading is the part of teaching that eats evenings. Splitting your assessments between quizzes and assignments keeps both useful.",
    category: "Product",
    author: "Sana Iqbal",
    role: "Product manager",
    date: "2026-09-03",
    readMinutes: 4,
    body: [
      {
        p: "Feedback is what makes a course feel alive, but it is also the biggest time cost for an instructor. The trick is to spend your own time only where a human really matters.",
      },
      { h: "Let quizzes handle the checking" },
      {
        p: "Quizzes on LearnSphere are graded the moment a student submits them. Students get an instant result and an explanation, and you get a clear view of which questions most people miss.",
      },
      { h: "Save your attention for assignments" },
      {
        p: "Assignments go into your grading queue. Because quizzes already cover the basics, you can use assignments for the work that needs judgement, like projects, essays and designs, and give feedback that is worth the effort.",
      },
      {
        ul: [
          "Use quizzes to check understanding after each module.",
          "Use one meaningful assignment per course for applied work.",
          "Reply to students through messages when they need more help.",
        ],
      },
    ],
  },
]