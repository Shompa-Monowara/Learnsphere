import { Check } from "lucide-react"
import type { ReactNode } from "react"

/* Teal circle er vitor white tick */
export function CheckBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white ${className}`}>
      <Check size={10} strokeWidth={3.5} />
    </span>
  )
}

/* Section er upor er chhoto teal pill */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-teal-950 dark:text-teal-300">
      {children}
    </span>
  )
}