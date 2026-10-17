interface Props {
  points: { label: string; revenue: number }[]
}

export default function RevenueChart({ points }: Props) {
  const total = points.reduce((n, p) => n + p.revenue, 0)
  const max = Math.max(...points.map((p) => p.revenue), 1)
  const n = points.length

  const xs = points.map((_, i) => (i / (n - 1)) * 100)
  const ys = points.map((p) => 100 - (p.revenue / max) * 88)
  const line = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ")

  return (
    <div>
      <div className="relative mx-2 mt-6 h-56">
        {[0, 33, 66, 100].map((y) => (
          <span
            key={y}
            className="absolute inset-x-0 border-t border-dashed border-slate-100 dark:border-slate-800"
            style={{ top: `${y}%` }}
          />
        ))}

        {total === 0 ? (
          <p className="absolute inset-0 grid place-items-center text-sm text-slate-500">
            No revenue in the last 7 months.
          </p>
        ) : (
          <>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${line} L100,100 L0,100 Z`} fill="url(#revFill)" />
              <path d={line} fill="none" stroke="#f97316" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            {points.map((p, i) => (
              <span
                key={p.label + i}
                title={`${p.label}: $${p.revenue.toLocaleString("en-US")}`}
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-900"
                style={{ left: `${xs[i]}%`, top: `${ys[i]}%` }}
              />
            ))}
          </>
        )}
      </div>

      <div className="mt-3 flex justify-between px-2 text-xs text-slate-400">
        {points.map((p, i) => (
          <span key={p.label + i}>{p.label}</span>
        ))}
      </div>
    </div>
  )
}