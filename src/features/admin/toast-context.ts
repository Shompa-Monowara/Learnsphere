import { createContext, useContext } from "react"

export interface ToastApi {
  success: (title: string, text?: string) => void
  error: (title: string, text?: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used inside ToastProvider")
  return context
}