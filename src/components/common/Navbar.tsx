import { useEffect, useRef, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { GraduationCap, LayoutDashboard, LogOut, Menu, Moon, Sun, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAV_LINKS, ROLE_HOME } from "@/config/constants"
import { useAuth } from "@/stores/auth-context"
import { useTheme } from "@/stores/theme-context"

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")

function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full border border-slate-200 py-1 pl-1 pr-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
            {getInitials(user.name)}
          </span>
        )}
        <span className="max-w-[110px] truncate text-sm font-medium text-slate-900 dark:text-white">
          {user.name.split(" ")[0]}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
            <p className="truncate text-xs capitalize text-slate-500">{user.role}</p>
          </div>
          <Link
            to={ROLE_HOME[user.role]}
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
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
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, loading, logout } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-teal-600 ${
      isActive ? "text-teal-600" : "text-slate-600 dark:text-slate-300"
    }`

  const primaryBtn = "bg-teal-600 text-white hover:bg-teal-700"

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
            <GraduationCap size={22} />
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            Learn<span className="text-teal-600">Sphere</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {loading ? null : user ? (
            <UserMenu />
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className={primaryBtn}>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {!loading && (
            <div className="mt-5 flex gap-3">
              {user ? (
                <>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={ROLE_HOME[user.role]} onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className={`flex-1 ${primaryBtn}`}>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}