import { useEffect, useRef, useState } from "react"
import { fetchPublicStats } from "../api"
import type { PublicStats } from "../api"

const ITEMS: { key: keyof PublicStats; label: string }[] = [
  { key: "students", label: "Students learning" },
  { key: "courses", label: "Courses published" },
  { key: "instructors", label: "Expert instructors" },
  { key: "certificates", label: "Certificates issued" },
]

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1400, 1)
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to])

  return <span ref={ref}>{n.toLocaleString()}</span>
}

export default function Stats() {
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    fetchPublicStats()
      .then((data) => alive && setStats(data))
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [])

  /* Server na pele fake number dekhanor cheye section lukiye felai bhalo */
  if (failed) return null

  return (
    <section className="py-6">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 rounded-3xl bg-linear-to-r from-teal-700 to-teal-900 px-8 py-12 text-white lg:grid-cols-4">
          {ITEMS.map(({ key, label }) => (
            <div key={key} className="text-center">
              {stats ? (
                <p className="text-4xl font-bold">
                  <Counter to={stats[key]} />
                  {stats[key] > 0 && <span className="text-orange-400">+</span>}
                </p>
              ) : (
                <div className="mx-auto h-10 w-28 animate-pulse rounded-lg bg-white/15" aria-hidden />
              )}
              <p className="mt-1 text-sm text-teal-100">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}