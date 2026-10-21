import { CircleAlert, CircleCheck, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ToastContext } from "./toast-context"

type Toast = { id: number; type: "success" | "error"; title: string; text?: string }

const DURATION = 4000

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id)
    if (t) clearTimeout(t)
    timers.current.delete(id)
    setToasts((list) => list.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (type: Toast["type"], title: string, text?: string) => {
      const id = nextId.current++
      setToasts((list) => [...list.slice(-3), { id, type, title, text }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), DURATION)
      )
    },
    [dismiss]
  )

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach((t) => clearTimeout(t))
      map.clear()
    }
  }, [])

  const api = useMemo(
    () => ({
      success: (title: string, text?: string) => push("success", title, text),
      error: (title: string, text?: string) => push("error", title, text),
    }),
    [push]
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-3"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const ok = t.type === "success"
          const Icon = ok ? CircleCheck : CircleAlert
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 shadow-lg dark:bg-slate-900",
                ok ? "border-green-200 dark:border-green-500/40" : "border-red-200 dark:border-red-500/40"
              )}
            >
              <Icon size={22} className={cn("shrink-0", ok ? "text-green-500" : "text-red-500")} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</p>
                {t.text && <p className="mt-0.5 text-xs text-slate-500">{t.text}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}