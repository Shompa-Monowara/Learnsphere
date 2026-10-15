import { Link, Outlet } from "react-router-dom"
import { ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthShowcase } from "@/features/auth"
import { useTheme } from "@/stores/theme-context"

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="grid min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 lg:grid-cols-2">
      <AuthShowcase />

      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-end gap-3 p-6">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/">
              <ArrowLeft size={16} /> Back to website
            </Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        <p className="p-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LearnSphere. All rights reserved.
        </p>
      </div>
    </div>
  )
}