import { ChevronsLeft, ChevronsRight, GraduationCap } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { NavItem } from "./types"

interface Props {
  items: NavItem[]
  label: string
  badges: Record<string, number>
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onClose: () => void
}

export default function Sidebar({ items, label, badges, collapsed, onToggle, mobileOpen, onClose }: Props) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 lg:z-30",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed && "lg:w-[76px]"
        )}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-5 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
              <GraduationCap size={20} />
            </span>
            <span className={cn("text-lg font-bold text-slate-900 dark:text-white", collapsed && "lg:hidden")}>
              Learn<span className="text-teal-600">Sphere</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p
            className={cn(
              "mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400",
              collapsed && "lg:hidden"
            )}
          >
            {label}
          </p>

          <nav className="space-y-1">
            {items.map(({ label: text, to, icon: Icon, end, badgeKey }) => {
              const count = badgeKey ? badges[badgeKey] : 0
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  title={collapsed ? text : undefined}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                      collapsed && "lg:justify-center"
                    )
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className={cn("flex-1", collapsed && "lg:hidden")}>{text}</span>
                  {count > 0 && (
                    <span
                      className={cn(
                        "rounded-full bg-orange-100 px-1.5 py-0.5 text-[11px] font-semibold text-orange-600",
                        collapsed && "lg:hidden"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className={cn("p-3", collapsed && "lg:hidden")}>
          <div className="rounded-2xl bg-linear-to-br from-teal-600 to-emerald-900 p-4 text-white">
            <p className="text-sm font-semibold">Keep learning</p>
            <p className="mt-1 text-xs text-teal-50/90">Explore new courses and grow your skills every day.</p>
            <Link
              to="/courses"
              className="mt-3 inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-teal-700"
            >
              Browse courses
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="hidden items-center justify-center gap-2 border-t border-slate-200 py-3 text-xs font-medium text-slate-500 hover:text-teal-600 dark:border-slate-800 lg:flex"
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!collapsed && "Collapse"}
        </button>
      </aside>
    </>
  )
}