import { ArrowRight, ChevronDown, ChevronUp, Headphones } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Eyebrow } from "./ui"

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
    a: "The Free plan includes 2 GB of storage, Pro includes 50 GB, and Academy is unlimited. Need more? Talk to our team.",
  },
  {
    q: "Can I switch or cancel my plan at any time?",
    a: "Absolutely. You can upgrade, downgrade, or cancel from your billing settings whenever you like. Changes take effect immediately and any remaining balance is credited to your account.",
  },
]

export default function PricingFaq() {
  const [open, setOpen] = useState<number | null>(FAQS.length - 1)

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950">
      <div className="mx-auto grid max-w-[1100px] items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.7fr] lg:gap-14">
        {/* Left */}
        <div>
          <Eyebrow>Questions &amp; answers</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Pricing questions, answered
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Everything you might be wondering about plans, billing, and switching.
          </p>

          <div className="mt-7 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Headphones size={15} className="text-teal-600" /> Still need a hand?
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Our team is happy to walk you through the best plan for your academy.
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
            >
              Talk to us <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={f.q}
                className={`rounded-xl border bg-white transition-colors dark:bg-slate-900 ${
                  isOpen ? "border-teal-400" : "border-slate-100 hover:border-slate-200 dark:border-slate-800"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{f.q}</span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      isOpen ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                    }`}
                  >
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{f.a}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}