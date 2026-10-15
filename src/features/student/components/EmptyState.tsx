import type { ReactNode } from "react"

interface Props {
  title: string
  text: string
  action?: ReactNode
}

export default function EmptyState({ title, text, action }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}