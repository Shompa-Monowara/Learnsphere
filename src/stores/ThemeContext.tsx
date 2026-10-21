import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import type { ReactNode } from "react"
import { api } from "@/services/api"
import { ThemeContext } from "./theme-context"
import type { Appearance, DefaultTheme, Theme } from "./theme-context"

/* Notun key: ager version sobar browser e "theme=light" likhe diyechilo,
   ota ke user er nijer choice dhore nile default kokhono kaj korto na. */
const USER_KEY = "ls-theme"
const DEFAULT_KEY = "ls-site-default-theme"
const COLOR_KEY = "ls-site-primary"

const DEFAULT_BRAND = "#0d9488"
const HEX = /^#[0-9a-fA-F]{6}$/

/* [shade, brand %, mix color]. 600 = brand color nijei */
const SHADES: [string, number, "white" | "black" | null][] = [
  ["50", 6, "white"],
  ["100", 14, "white"],
  ["200", 28, "white"],
  ["300", 45, "white"],
  ["400", 70, "white"],
  ["500", 85, "white"],
  ["600", 100, null],
  ["700", 82, "black"],
  ["800", 66, "black"],
  ["900", 52, "black"],
  ["950", 32, "black"],
]

/* Default color hole kichui override kori na, tai design ager moto-i thake.
   Onno color hole shudhu teal-* variable gulo <html> e override hoy. */
const applyBrand = (hex: string) => {
  if (!HEX.test(hex)) return
  const style = document.documentElement.style

  if (hex.toLowerCase() === DEFAULT_BRAND) {
    SHADES.forEach(([shade]) => style.removeProperty(`--color-teal-${shade}`))
    return
  }

  SHADES.forEach(([shade, pct, mix]) => {
    const value = mix ? `color-mix(in oklab, ${hex} ${pct}%, ${mix})` : hex
    style.setProperty(`--color-teal-${shade}`, value)
  })
}

const readUserChoice = (): Theme | null => {
  const v = localStorage.getItem(USER_KEY)
  return v === "dark" || v === "light" ? v : null
}

const readSiteDefault = (): DefaultTheme => {
  const v = localStorage.getItem(DEFAULT_KEY)
  return v === "dark" || v === "system" || v === "light" ? v : "light"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [userChoice, setUserChoice] = useState<Theme | null>(readUserChoice)
  const [siteDefault, setSiteDefault] = useState<DefaultTheme>(readSiteDefault)
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  )

  /* Final theme: user nijer choice thakle seta, nahole site default */
  const theme: Theme =
    userChoice ?? (siteDefault === "system" ? (systemDark ? "dark" : "light") : siteDefault)

  /* OS theme change hole track kori ("Follow system" er jonno) */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  /* <html> e dark class */
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  /* Cache kora primary color age-i apply kori, jate load e flash na hoy */
  useLayoutEffect(() => {
    const cached = localStorage.getItem(COLOR_KEY)
    if (cached) applyBrand(cached)
  }, [])

  const applyAppearance = useCallback((a: Appearance, resetUserChoice = false) => {
    setSiteDefault(a.defaultTheme)
    localStorage.setItem(DEFAULT_KEY, a.defaultTheme)

    if (HEX.test(a.primaryColor)) {
      applyBrand(a.primaryColor)
      localStorage.setItem(COLOR_KEY, a.primaryColor)
    }

    if (resetUserChoice) {
      localStorage.removeItem(USER_KEY)
      setUserChoice(null)
    }
  }, [])

  /* App open hole server theke latest appearance ana */
  useEffect(() => {
    api
      .get<{ appearance: Appearance }>("/site-settings/public")
      .then((res) => applyAppearance(res.data.appearance))
      .catch(() => {})
  }, [applyAppearance])

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light"
    localStorage.setItem(USER_KEY, next)
    setUserChoice(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, applyAppearance }}>
      {children}
    </ThemeContext.Provider>
  )
}