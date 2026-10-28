import type { ReactNode } from "react"

/* Shob mockup er baire er white card + vitorer halka panel */
export default function MockCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  )
}