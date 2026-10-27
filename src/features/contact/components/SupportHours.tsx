import { useEffect, useState } from "react"
import { Clock, Timer } from "lucide-react"
import type { ContactInfo } from "../api"
import { isSupportOnline } from "../hours"
import { CARD } from "../styles"

interface SupportHoursProps {
  hours: ContactInfo["hours"]
  response: ContactInfo["response"]
}

export function SupportHours({ hours, response }: SupportHoursProps) {
  const [online, setOnline] = useState(() => isSupportOnline(hours))

  useEffect(() => {
    const t = setInterval(() => setOnline(isSupportOnline(hours)), 60_000)
    return () => clearInterval(t)
  }, [hours])

  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950">
            <Clock size={17} />
          </span>
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Support hours</h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            online ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-slate-400"}`} />
          {online ? "Online now" : "Offline"}
        </span>
      </div>

      <div className="mt-4">
        {hours.rows.map((row, k) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-2.5 text-sm ${
              k < hours.rows.length - 1 ? "border-b border-dashed border-slate-200 dark:border-slate-700" : ""
            }`}
          >
            <span className="text-slate-500">{row.label}</span>
            <span className="font-semibold text-slate-900 dark:text-white">{row.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl bg-teal-50/80 p-3.5 dark:bg-teal-950/50">
        <Timer size={17} className="shrink-0 text-teal-600" />
        <div>
          <p className="text-xs text-slate-700 dark:text-slate-200">
            Average first response: <b className="text-slate-900 dark:text-white">{response.average}</b>
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{response.note}</p>
        </div>
      </div>
    </div>
  )
}