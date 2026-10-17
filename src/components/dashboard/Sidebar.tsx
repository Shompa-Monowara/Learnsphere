import { ArrowRight, ChevronsLeft, ChevronsRight, GraduationCap } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { Accent, NavItem, Promo } from "./types"

const ACCENTS = {
  teal: {
    active: "bg-teal-600 shadow-md shadow-teal-600/30",
    logo: "bg-linear-to-br from-teal-500 to-teal-700",
    brand: "text-teal-600",
    label: "text-teal-700 dark:text-teal-400",
    promo: "from-teal-600 via-teal-700 to-emerald-900",
    promoBtn: "text-teal-700",
    collapse: "hover:text-teal-600",
  },
  orange: {
    active: "bg-orange-500 shadow-md shadow-orange-500/30",
    logo: "bg-linear-to-br from-orange-500 to-orange-600",
    brand: "text-orange-500",
    label: "text-orange-600 dark:text-orange-400",
    promo: "from-orange-600 via-orange-700 to-red-900",
    promoBtn: "text-orange-700",
    collapse: "hover:text-orange-600",
  },
}

interface Props {
  items: NavItem[]
  label: string
  badges: Record<string, number>
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onClose: () => void
  accent: Accent
  promo?: Promo
}

export default function Sidebar({
  items,
  label,
  badges,
  collapsed,
  onToggle,
  mobileOpen,
  onClose,
  accent,
  promo,
}: Props) {
  const a = ACCENTS[accent]

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
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-5 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
                a.logo
              )}
            >
              <GraduationCap size={20} />
            </span>
            <span className={cn("text-lg font-bold text-slate-900 dark:text-white", collapsed && "lg:hidden")}>
              Learn<span className={a.brand}>Sphere</span>
            </span>
          </Link>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p
            className={cn(
              "mb-[18px] px-3 text-[11px] font-semibold uppercase tracking-wider",
              a.label,
              collapsed && "lg:hidden"
            )}
          >
            {label}
          </p>

          <nav className="space-y-1">
            {items.map(({ label: text, to, icon: Icon, end, badgeKey }) => {
              const count = badgeKey ? badges[badgeKey] ?? 0 : 0
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  title={collapsed ? text : undefined}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium transition-colors",
                      isActive
                        ? `${a.active} text-white`
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                      collapsed && "lg:justify-center"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className="shrink-0" />
                      <span className={cn("flex-1", collapsed && "lg:hidden")}>{text}</span>
                      {count > 0 && (
                        <span
                          className={cn(
                            "min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold",
                            isActive ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600",
                            collapsed && "lg:hidden"
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Promo card */}
        {promo && (
          <div className={cn("shrink-0 border-t border-slate-100 p-3 dark:border-slate-800", collapsed && "lg:hidden")}>
            <div className={cn("rounded-2xl bg-linear-to-br p-4 text-white", a.promo)}>
              <p className="text-sm font-bold">{promo.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/90">{promo.text}</p>
              <Link
                to={promo.to}
                onClick={onClose}
                className={cn(
                  "mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold",
                  a.promoBtn
                )}
              >
                {promo.cta} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* Collapse */}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "hidden shrink-0 items-center justify-center gap-2 border-t border-slate-200 py-3 text-xs font-medium text-slate-500 dark:border-slate-800 lg:flex",
            a.collapse
          )}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!collapsed && "Collapse"}
        </button>
      </aside>
    </>
  )
}