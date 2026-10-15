import { useEffect, useRef, useState } from "react"

const STATS = [
  { value: 105126, label: "Students learning" },
  { value: 7085, label: "Courses published" },
  { value: 1942, label: "Expert instructors" },
  { value: 54838, label: "Certificates issued" },
]

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1400, 1)
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to])

  return <span ref={ref}>{n.toLocaleString()}</span>
}

export default function Stats() {
  return (
    <section className="py-6">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 rounded-3xl bg-linear-to-r from-teal-800 to-teal-950 px-8 py-12 text-white lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold">
                <Counter to={s.value} />
                <span className="text-orange-400">+</span>
              </p>
              <p className="mt-1 text-sm text-teal-100">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}