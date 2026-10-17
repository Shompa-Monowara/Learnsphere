import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Basic info", "Curriculum", "Pricing & publish"]

interface Props {
  step: number
  maxStep: number
  onGo: (i: number) => void
}

export default function Stepper({ step, maxStep, onGo }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {STEPS.map((label, i) => {
        const done = i < step
        const active = i === step
        const locked = i > maxStep

        return (
          <button
            key={label}
            type="button"
            disabled={locked}
            title={locked ? "Fill in the basics and press Continue first" : undefined}
            onClick={() => onGo(i)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition dark:bg-slate-900",
              locked && "cursor-not-allowed opacity-60",
              active || done
                ? "border-teal-400 bg-teal-50/60 dark:border-teal-700 dark:bg-teal-500/10"
                : "border-slate-100 dark:border-slate-800"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                active || done ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
              )}
            >
              {done ? <Check size={16} /> : locked ? <Lock size={14} /> : i + 1}
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Step {i + 1}
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}