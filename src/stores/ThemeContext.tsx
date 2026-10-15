import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { ThemeContext } from "./theme-context"
import type { Theme } from "./theme-context"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "light"
  )

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}