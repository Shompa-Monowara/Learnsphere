import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { INPUT } from "@/features/student/ui"
import { cn } from "@/lib/utils"
import { CATEGORY_ICONS } from "../category-icons"
import type { AdminCategory } from "../types"

interface Props {
  category: AdminCategory | null
  busy?: boolean
  onSubmit: (values: { name: string; icon: string }) => void
  onCancel: () => void
}

export default function CategoryDialog({ category, busy, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(category?.name ?? "")
  const [icon, setIcon] = useState(CATEGORY_ICONS.some((i) => i.key === category?.icon) ? category!.icon : "tag")
  const valid = name.trim().length >= 2

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onCancel()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [busy, onCancel])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valid && !busy) onSubmit({ name: name.trim(), icon })
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !busy && onCancel()} />
      <form onSubmit={submit} className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{category ? "Edit category" : "Add category"}</h3>
          <button type="button" onClick={onCancel} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <label htmlFor="cat-name" className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">
              Category name
            </label>
            <input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              autoFocus
              placeholder="e.g. Data Science"
              className={INPUT}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-900 dark:text-white">Icon</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ICONS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  title={label}
                  aria-label={label}
                  aria-pressed={icon === key}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors",
                    icon === key
                      ? "border-teal-500 bg-teal-50 text-teal-600 dark:bg-teal-500/15"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button type="button" onClick={onCancel} disabled={busy} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button type="submit" disabled={busy || !valid} className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">
            {busy ? "Saving..." : category ? "Save changes" : "Create category"}
          </button>
        </div>
      </form>
    </div>
  )
}