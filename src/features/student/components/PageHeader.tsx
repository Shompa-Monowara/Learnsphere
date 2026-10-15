import type { ReactNode } from "react"

interface Props {
  crumb: string
  title: string
  subtitle: string
  action?: ReactNode
}

export default function PageHeader({ crumb, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm text-slate-500">
          Student <span className="mx-1.5">›</span>
          <span className="text-slate-900 dark:text-white">{crumb}</span>
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-1 text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}