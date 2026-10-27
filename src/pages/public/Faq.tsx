import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ChevronDown, Headphones, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface FaqItem {
  category: string
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    category: "Getting started",
    q: "How do I create an account?",
    a: "Choose Get Started, pick whether you are joining as a student or an instructor, and confirm your email with the code we send you. You can also sign in with Google or GitHub.",
  },
  {
    category: "Getting started",
    q: "Is it free to join LearnSphere?",
    a: "Creating an account is free. Individual courses are priced by their instructors, and many courses include preview lessons you can watch before you enroll.",
  },
  {
    category: "Courses & learning",
    q: "Can I learn at my own pace?",
    a: "Yes. Once you are enrolled, lessons are available whenever you want and your progress is saved lesson by lesson. The exception is a course whose instructor has scheduled a drip release.",
  },
  {
    category: "Courses & learning",
    q: "How do quizzes and assignments work?",
    a: "Quizzes are graded automatically the moment you submit them. Assignments are graded by your instructor, and you get a notification when your grade is posted.",
  },
  {
    category: "Certificates",
    q: "How does certificate verification work?",
    a: "When you complete a course you earn a certificate with a unique verification ID. Anyone who has that ID can confirm the certificate is genuine, and you can download your own copy as a PDF from the Certificates page in your dashboard.",
  },
  {
    category: "Billing & plans",
    q: "How am I billed?",
    a: "Course purchases are one-time payments shown at checkout. Team plans are billed monthly or yearly, with a discount when you choose yearly billing.",
  },
  {
    category: "Billing & plans",
    q: "How do I change or cancel a plan?",
    a: "Contact our team and we will switch or cancel your plan for you. Changes apply from the start of your next billing cycle.",
  },
  {
    category: "Teams",
    q: "How do I move a team onto LearnSphere?",
    a: "Team plans include onboarding and a named support contact. Tell us your team size through the contact form and we will help you set up roles, cohorts and bulk enrollment.",
  },
  {
    category: "Instructors",
    q: "How do I become an instructor?",
    a: "Register as an instructor, complete your profile and build your course in the course builder. When it is ready, submit it for review. Approved courses go live on the platform.",
  },
  {
    category: "Instructors",
    q: "How much do instructors earn?",
    a: "Instructors keep 80% of every enrollment and own their content. Earnings are paid out monthly.",
  },
]

const CATEGORIES = ["All", ...Array.from(new Set(FAQS.map((f) => f.category)))]

export default function Faq() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [open, setOpen] = useState<string | null>(FAQS[0].q)

  const items = useMemo(() => {
    const term = query.trim().toLowerCase()
    return FAQS.filter(
      (f) =>
        (category === "All" || f.category === category) &&
        (!term || f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term))
    )
  }, [query, category])

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
      active
        ? "border-teal-600 bg-teal-600 text-white"
        : "border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    }`

  return (
    <>
      <section className="border-b border-slate-200/70 bg-teal-50/60 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">Help Center</span>
          </nav>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            How can we help?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Quick answers on enrollment, certificates, billing and teaching on LearnSphere. Can't find what you need?
            Our team is one message away.
          </p>

          <div className="relative mt-7 max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the help center..."
              className="h-12 rounded-xl bg-white pl-11 dark:bg-slate-800"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" className={chip(category === c)} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-14 text-center">
              <p className="font-semibold text-slate-900 dark:text-white">No answers match your search</p>
              <p className="mt-1 text-sm text-slate-500">Try different words, or send us a message.</p>
            </div>
          ) : (
            items.map((f) => {
              const isOpen = open === f.q
              return (
                <div
                  key={f.q}
                  className={`rounded-xl border bg-white transition-colors dark:bg-slate-900 ${
                    isOpen ? "border-teal-400" : "border-slate-200/70 hover:border-slate-300 dark:border-slate-800"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : f.q)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-teal-700">
                        {f.category}
                      </span>
                      <span className="mt-1 block text-[15px] font-semibold text-slate-900 dark:text-white">{f.q}</span>
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-teal-600" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{f.a}</p>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-900 dark:bg-teal-950/30">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-600 shadow-xs dark:bg-slate-900">
              <Headphones size={20} />
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Still need a hand?</p>
              <p className="text-sm text-slate-500">A real person replies within one business day.</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Contact support <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  )
}