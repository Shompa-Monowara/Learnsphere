import type { ReactNode } from "react"

export default function Notice({ type, children }: { type: "success" | "error"; children: ReactNode }) {
  const style =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300"
      : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
  return <div className={`rounded-xl border px-4 py-3 text-sm ${style}`}>{children}</div>
}