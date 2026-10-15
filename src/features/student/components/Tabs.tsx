import { cn } from "@/lib/utils"

interface Tab<T extends string> {
  value: T
  label: string
  count?: number
}

interface Props<T extends string> {
  tabs: Tab<T>[]
  value: T
  onChange: (value: T) => void
}

export default function Tabs<T extends string>({ tabs, value, onChange }: Props<T>) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-slate-100 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
            value === t.value
              ? "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          )}
        >
          {t.label}
          {t.count !== undefined && ` (${t.count})`}
        </button>
      ))}
    </div>
  )
}