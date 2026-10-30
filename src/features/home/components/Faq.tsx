import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react"

const FAQS = [
  {
    q: "Do my students need to pay to use LearnSphere?",
    a: "No. Students always learn for free. Only teachers and academies pay for the plan that fits their needs, and the Free plan is generous enough for a first course.",
  },
  {
    q: "Can I import courses I already have on another platform?",
    a: "Yes. You can upload existing videos and PDFs, and our team can help migrate larger course libraries on the Academy plan.",
  },
  {
    q: "How do the auto-graded quizzes work?",
    a: "Add questions with a correct answer and marks. Students get their score, a correct and incorrect breakdown, and explanations immediately.",
  },
  {
    q: "What do the completion certificates look like?",
    a: "A branded PDF with the student's name, course title, completion date, and a unique verification ID anyone can check.",
  },
  {
    q: "Is there a limit on video uploads?",
    a: "The Free plan includes generous storage for two courses. Pro and Academy plans raise limits significantly for larger libraries.",
  },
  {
    q: "Can I switch or cancel my plan at any time?",
    a: "Absolutely. Upgrade, downgrade, or cancel whenever you like. Changes apply from your next billing cycle.",
  },
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-white py-20 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto grid max-w-[1200px] items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.55fr] lg:gap-16">
        {/* Left Side: Header & Help Link */}
        <div>
          <span className="inline-block rounded-full bg-[#ccfbf1]/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0f766e] dark:bg-teal-500/10 dark:text-teal-300">
            Questions & Answers
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
            Everything you need to know
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
            Still curious after reading these? Our team is one message away.
          </p>
          <div className="mt-6">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0d9488] transition-colors hover:text-[#0f766e] dark:text-teal-400 dark:hover:text-teal-300"
            >
              Visit the full help center <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right Side: Accordion Items */}
        <div className="space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={f.q}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-[#0d9488] bg-white shadow-[0_4px_20px_-4px_rgba(13,148,136,0.12)] dark:bg-slate-800 dark:shadow-none"
                    : "border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-200 dark:border-slate-800 dark:bg-slate-800/50 dark:shadow-none dark:hover:border-slate-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                    {f.q}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isOpen
                        ? "bg-[#0d9488] text-white"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-[13px]">
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}