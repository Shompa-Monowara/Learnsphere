import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Sun } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Avatar from "@/features/student/components/Avatar"
import { useAuth } from "@/stores/auth-context"
import { useTheme } from "@/stores/theme-context"

interface Props {
  onMenu: () => void
  unread: number
  notificationsTo: string
}

export default function Topbar({ onMenu, unread, notificationsTo }: Props) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const iconBtn =
    "relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      <button type="button" onClick={onMenu} className={`${iconBtn} lg:hidden`} aria-label="Open menu">
        <Menu size={18} />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search courses, students, lessons..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button type="button" onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link to={notificationsTo} className={iconBtn} aria-label="Notifications">
          <Bell size={18} />
          {unread > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-orange-500" />}
        </Link>

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <Avatar name={user?.name ?? ""} src={user?.avatar} size={36} />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-slate-900 dark:text-white">
                {user?.name}
              </span>
              <span className="block text-xs capitalize text-slate-500">{user?.role}</span>
            </span>
            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}