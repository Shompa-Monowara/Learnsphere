import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  Award,
  Bell,
  BookMarked,
  Clock,
  Home,
  HelpCircle,
  Lightbulb,
  LineChart,
  Play,
  PlayCircle,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const BARS = [36, 58, 44, 76, 52, 94, 68]

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
]

const COURSES = [
  { title: "Intro to Python variables", progress: 100 },
  { title: "Data structures deep dive", progress: 72 },
  { title: "Building your first model", progress: 34 },
]

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0fdf9]/80 via-white to-white py-14 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 sm:py-20 lg:py-24">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-[520px] w-[520px] rounded-full bg-teal-200/30 blur-[130px] dark:bg-teal-500/10" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-[520px] w-[520px] rounded-full bg-amber-100/40 blur-[140px] dark:bg-amber-500/5" />

      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        {/* Left Side: Typography & Action */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:max-w-[500px] shrink-0"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-[0_2px_8px_rgba(13,148,136,0.06)] dark:border-teal-800 dark:bg-slate-800 dark:text-teal-300 dark:shadow-none">
            <span className="h-2 w-2 rounded-full bg-[#f97316]" />
            Trusted by 3,400+ instructors and academies
          </span>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[56px] lg:leading-[1.12]">
            Teach brilliantly. <br />
            <span className="text-teal-600 dark:text-teal-400">Learn without limits.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            LearnSphere gives small academies and independent teachers everything they need to build courses, run
            auto-graded quizzes, collect assignments, track progress, and issue certificates — all in one calm,
            beautiful workspace.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-teal-600 px-7 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              <Link to="/register" className="flex items-center gap-2">
                Get Started Free <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Link to="/courses" className="flex items-center gap-2">
                <PlayCircle size={18} className="text-slate-600 dark:text-slate-300" /> Explore Courses
              </Link>
            </Button>
          </div>

          {/* Social Reviews */}
          <div className="mt-9 flex items-center gap-3.5">
            <div className="flex -space-x-2.5 overflow-hidden">
              {AVATARS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Student review"
                  className="inline-block h-9 w-9 rounded-full border-2 border-white object-cover shadow-2xs dark:border-slate-900"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                ))}
                <span className="ml-1 text-sm font-bold text-slate-900 dark:text-white">4.9/5</span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">from 24,800+ learner reviews</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 flex gap-10">
            {[
              ["184K+", "Active students"],
              ["12K+", "Live courses"],
              ["3400+", "Expert instructors"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{v}</p>
                <p className="mt-0.5 text-xs text-slate-500 font-medium dark:text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Dashboard Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative w-full flex-1 max-w-[620px] lg:max-w-[600px]"
        >
          {/* Main Browser Frame */}
          <div className="w-full overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_24px_60px_-15px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]">
            {/* Top Browser Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#fbfcfd] px-5 py-3 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex h-6 w-3/5 max-w-[280px] items-center justify-center rounded-md bg-[#f1f5f9]/70 text-[11px] font-medium text-slate-400 dark:bg-slate-700/60 dark:text-slate-400">
                app.learnsphere.io/student/dashboard
              </div>
              <div className="w-8" />
            </div>

            {/* Content Row */}
            <div className="flex">
              {/* Left Mini Sidebar */}
              <div className="flex w-16 flex-col items-center gap-6 border-r border-slate-100/90 py-6 dark:border-slate-800">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                  <Home size={18} />
                </span>
                <BookMarked size={18} className="cursor-pointer text-slate-400 transition hover:text-teal-600 dark:hover:text-teal-400" />
                <HelpCircle size={18} className="cursor-pointer text-slate-400 transition hover:text-teal-600 dark:hover:text-teal-400" />
                <LineChart size={18} className="cursor-pointer text-slate-400 transition hover:text-teal-600 dark:hover:text-teal-400" />
                <Award size={18} className="cursor-pointer text-slate-400 transition hover:text-teal-600 dark:hover:text-teal-400" />
              </div>

              {/* Main Inside Canvas */}
              <div className="flex-1 p-6 sm:p-7">
                {/* User Greeting & Notification Bell */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Welcome back</p>
                    <p className="text-lg font-bold text-slate-900 tracking-tight dark:text-white">Grace Lindqvist</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                    <Bell size={16} />
                  </span>
                </div>

                {/* 3 Metric Mini Cards */}
                <div className="mt-5 grid grid-cols-3 gap-3.5">
                  {[
                    { icon: BookMarked, val: "6", lbl: "Courses" },
                    { icon: Clock, val: "42", lbl: "Hours" },
                    { icon: Lightbulb, val: "3", lbl: "Certs" },
                  ].map(({ icon: Icon, val, lbl }) => (
                    <div
                      key={lbl}
                      className="rounded-2xl border border-slate-100 bg-[#f8fafc]/70 p-3.5 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                    >
                      <Icon size={14} className="text-teal-600/80 mb-2 dark:text-teal-400" />
                      <p className="text-xl font-extrabold text-slate-900 leading-none dark:text-white">{val}</p>
                      <p className="mt-1 text-[11px] font-medium text-slate-400 leading-none">{lbl}</p>
                    </div>
                  ))}
                </div>

                {/* Weekly Activity Section with Gradient Bars */}
                <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Weekly activity</span>
                    <span className="font-semibold text-teal-600 text-[11px] bg-teal-50 px-2 py-0.5 rounded-full dark:bg-teal-500/10 dark:text-teal-400">+18%</span>
                  </div>
                  <div className="mt-4 flex h-20 items-end gap-2.5">
                    {BARS.map((h, i) => (
                      <motion.span
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.85, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                        className={`flex-1 rounded-t-lg ${
                          i === 5
                            ? "bg-gradient-to-t from-teal-700 to-teal-500"
                            : "bg-gradient-to-t from-teal-200/90 to-teal-100 dark:from-teal-500/30 dark:to-teal-400/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Course Progress Rows */}
                <div className="mt-5 space-y-3.5">
                  {COURSES.map((item, idx) => (
                    <div key={item.title} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-500/10">
                        <Play size={11} className="fill-teal-600 text-teal-600 translate-x-[0.5px] dark:fill-teal-400 dark:text-teal-400" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-800 truncate dark:text-slate-200">{item.title}</span>
                          <span className="text-slate-400 text-[11px] ml-2 shrink-0">{item.progress}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <motion.div
                            className="h-full rounded-full bg-[#ea580c]"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1.1, delay: 0.45 + idx * 0.15, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Certificate Ready Badge (Type-safe direct animation props) */}
          <motion.div
            animate={reduce ? undefined : { y: [-5, 5, -5] }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            className="absolute -bottom-5 -left-6 z-20 flex items-center gap-3 rounded-2xl border border-slate-100/90 bg-white px-4 py-3 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.6)]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10b981] dark:bg-emerald-500/10">
              <Award size={19} />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Certificate ready</p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-400">Python Bootcamp</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}