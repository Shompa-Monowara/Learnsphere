import type { ReactNode } from "react"
import { useAuth } from "@/stores/auth-context"

interface Props {
  crumb: string | string[]
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function PageHeader({ crumb, title, subtitle, action }: Props) {
  const { user } = useAuth()
  const root = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Home"
  const trail = [root, ...(Array.isArray(crumb) ? crumb : [crumb])]

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm text-slate-500">
          {trail.map((t, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-1.5">›</span>}
              <span className={i === trail.length - 1 ? "text-slate-900 dark:text-white" : ""}>{t}</span>
            </span>
          ))}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}