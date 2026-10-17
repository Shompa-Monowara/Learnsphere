import { motion, useReducedMotion } from "framer-motion"
import {
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  PlayCircle,
} from "lucide-react"

export default function AuthShowcase() {
  const reduce = useReducedMotion()

  return (
    <div className="relative hidden h-full min-h-screen w-full flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0d6358] via-[#094d44] to-[#053a33] p-12 text-white lg:flex select-none">
      {/* Background Soft Ambient Lights */}
      <div className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-[#188a7b]/25 blur-[120px]" />
      <div className="pointer-events-none absolute right-4 top-1/4 h-80 w-80 rounded-full bg-[#f59e0b]/10 blur-[130px]" />

      {/* 1. Header Branding */}
      <div className="relative z-10 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-sm">
          <GraduationCap size={22} className="text-white" />
        </span>
        <span className="text-xl font-bold tracking-tight text-white">LearnSphere</span>
      </div>

      {/* 2. Middle Hero & Dashboard Section */}
      <div className="relative z-10 mx-auto my-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Title */}
        <h2 className="text-4xl font-extrabold tracking-tight text-white leading-[1.2] sm:text-5xl">
          Where small academies <br /> teach big ideas.
        </h2>
        {/* Subtitle */}
        <p className="mt-4 max-w-md text-sm text-teal-100/80 leading-relaxed font-normal">
          Lectures, assignments, quizzes, and progress tracking — all in one calm, focused place for teachers and students.
        </p>

        {/* 🌟 MAIN DASHBOARD CARD 🌟 */}
        <div className="relative mt-10 w-full max-w-[470px] rounded-[26px] border border-white/20 border-t-white/30 bg-white/[0.08] p-6 text-left shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          
          {/* Header Row: Lesson Name & Percentage */}
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 border border-white/15 backdrop-blur-md shadow-inner">
              <PlayCircle size={22} className="text-white fill-white/10" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-white tracking-tight truncate">
                Frontend Development
              </p>
              <p className="text-xs text-teal-100/70 truncate mt-0.5 font-medium">
                Lesson 12 of 42 · CSS Grid
              </p>
            </div>
            <span className="rounded-full bg-white/20 border border-white/15 px-3 py-1 text-xs font-semibold text-white tracking-wide shadow-sm">
              68%
            </span>
          </div>

          {/* Progress Bar with clean glow */}
          <div className="mt-5 h-2 w-full rounded-full bg-black/30 p-[1px] overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* 3 Bottom Sub-Cards */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: BookOpen, value: "42", label: "Lessons" },
              { icon: FileText, value: "8", label: "Quizzes" },
              { icon: Award, value: "1", label: "Certificate" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md transition-all hover:bg-white/[0.12]"
              >
                <Icon size={18} className="text-teal-200/90 mb-3" />
                <div>
                  <p className="text-xl font-extrabold text-white leading-none">
                    {value}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-teal-100/65 leading-none">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FLOATING BADGE 1: Quiz passed */}
          <motion.div
            animate={reduce ? undefined : { y: [-4, 4, -4] }}
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
            className="absolute -left-7 top-[34%] z-20 flex items-center gap-3 rounded-2xl bg-white px-3.5 py-2.5 text-slate-800 shadow-[0_12px_28px_rgba(0,0,0,0.18)] border border-slate-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0">
              <CheckCircle2 size={16} />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-900 m-0">Quiz passed</p>
              <p className="text-[10px] font-semibold text-slate-400 m-0 mt-0.5">Score 18/20</p>
            </div>
          </motion.div>

          {/* FLOATING BADGE 2: Certificate earned */}
          <motion.div
            animate={reduce ? undefined : { y: [4, -4, 4] }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 5,
                    delay: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            className="absolute -right-5 bottom-3 z-20 flex items-center gap-3 rounded-2xl bg-white px-3.5 py-2.5 text-slate-800 shadow-[0_12px_28px_rgba(0,0,0,0.18)] border border-slate-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-500 flex-shrink-0">
              <Award size={16} />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-900 m-0">Certificate earned</p>
              <p className="text-[10px] font-semibold text-slate-400 m-0 mt-0.5">UI Design Basics</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. Bottom Testimonial Banner */}
      <figure className="relative z-10 w-full rounded-2xl border border-white/15 bg-white/[0.08] p-6 backdrop-blur-2xl shadow-xl">
        <span className="text-2xl font-serif text-teal-200/70 select-none block leading-none mb-2">
          ““
        </span>
        <blockquote className="text-[13px] leading-relaxed text-teal-50/90 font-normal">
          “LearnSphere made it simple to run my academy online. My students finally keep up with lessons, and I can see their progress at a glance.”
        </blockquote>
        <figcaption className="mt-3.5 flex items-center gap-3 border-t border-white/10 pt-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
            AR
          </span>
          <div>
            <span className="block text-xs font-semibold text-white leading-tight">
              Amara Reyes
            </span>
            <span className="block text-[11px] text-teal-100/70 mt-0.5">
              Academy Founder, Lumen Studio
            </span>
          </div>
        </figcaption>
      </figure>
    </div>
  )
}