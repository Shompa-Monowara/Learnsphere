interface Props {
  values: number[]
  labels: string[]
  format: (n: number) => string
}

const W = 640
const H = 300
const PX = 16
const PT = 16
const PB = 34

export default function AreaChart({ values, labels, format }: Props) {
  const max = Math.max(...values, 1) * 1.08
  const step = values.length > 1 ? (W - PX * 2) / (values.length - 1) : 0
  const pts = values.map((v, i) => ({ x: PX + i * step, y: PT + (H - PT - PB) * (1 - v / max) }))

  const line = pts.reduce((d, p, i, a) => {
    if (i === 0) return `M${p.x},${p.y}`
    const mid = (a[i - 1].x + p.x) / 2
    return `${d} C${mid},${a[i - 1].y} ${mid},${p.y} ${p.x},${p.y}`
  }, "")
  const area = `${line} L${pts[pts.length - 1].x},${H - PB} L${pts[0].x},${H - PB} Z`
  const grid = [0.25, 0.5, 0.75].map((f) => PT + (H - PT - PB) * f)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Growth chart">
      <defs>
        <linearGradient id="adminGrowthFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {grid.map((y) => (
        <line key={y} x1={PX} x2={W - PX} y1={y} y2={y} className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="3 5" />
      ))}
      <line x1={PX} x2={W - PX} y1={H - PB} y2={H - PB} className="stroke-slate-200 dark:stroke-slate-800" />

      <path d={area} fill="url(#adminGrowthFill)" />
      <path d={line} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="#0d9488" stroke="white" strokeWidth="2">
            <title>{`${labels[i]}: ${format(values[i])}`}</title>
          </circle>
          <text x={p.x} y={H - 10} textAnchor="middle" className="fill-slate-400" fontSize="12">
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  )
}