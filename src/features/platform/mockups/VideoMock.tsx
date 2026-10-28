import { Check, Maximize, Play, Volume2 } from "lucide-react"
import MockCard from "./MockCard"

const LESSONS = [
  { title: "Component composition", time: "12:04", done: true },
  { title: "State that scales", time: "18:22", done: true },
  { title: "Testing the interface", time: "21:47", done: false },
]

export function VideoMock() {
  return (
    <MockCard>
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 p-3.5 text-white">
        <div className="flex items-start justify-between">
          <span className="rounded-md bg-white/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider">
            Module 2 · Lesson 4
          </span>
          <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold">1080p</span>
        </div>

        <div className="my-7 flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
            <Play size={22} className="ml-0.5 fill-current" />
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-semibold">
          <span>12:44</span>
          <div className="h-1 flex-1 rounded-full bg-white/20">
            <div className="h-1 w-[62%] rounded-full bg-teal-400" />
          </div>
          <span>20:30</span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-black/40 px-3 py-2.5">
          <span className="text-[11px] font-semibold">Component composition in practice</span>
          <span className="flex items-center gap-3 text-white/80">
            <Volume2 size={13} />
            <Maximize size={13} />
          </span>
        </div>
      </div>

      <ul className="mt-2.5 space-y-1">
        {LESSONS.map((l, i) => (
          <li
            key={l.title}
            className={`flex items-center gap-3 rounded-lg px-2.5 py-2 ${
              !l.done ? "bg-teal-50 dark:bg-teal-950/60" : ""
            }`}
          >
            {l.done ? (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                <Check size={13} strokeWidth={3} />
              </span>
            ) : (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[10px] font-semibold text-slate-500 dark:border-slate-600">
                {i + 1}
              </span>
            )}
            <span className="flex-1 text-xs font-medium text-slate-900 dark:text-slate-100">{l.title}</span>
            <span className="text-[11px] text-slate-400">{l.time}</span>
          </li>
        ))}
      </ul>
    </MockCard>
  )
}