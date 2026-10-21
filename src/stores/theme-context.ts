import { createContext, useContext } from "react"

export type Theme = "light" | "dark"
export type DefaultTheme = "light" | "dark" | "system"

export interface Appearance {
  primaryColor: string
  defaultTheme: DefaultTheme
}

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  /** Admin save korar por (ba page load e) site er appearance apply kore */
  applyAppearance: (appearance: Appearance, resetUserChoice?: boolean) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used inside ThemeProvider")
  return context
}