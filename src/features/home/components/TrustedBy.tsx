const NAMES = ["Northgate Academy", "Brightpath School", "Ivy Lane College", "CodeCamp Collective", "Meridian Institute", "Summit Tutors"]

export default function TrustedBy() {
  const items = [...NAMES, ...NAMES]
  return (
    <section className="border-y border-slate-100 py-10 dark:border-slate-800">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Powering learning at</p>
      <div className="mt-6 overflow-hidden">
        <div className="animate-marquee flex w-max gap-16">
          {items.map((n, i) => (
            <span key={i} className="whitespace-nowrap text-lg font-semibold text-slate-400">{n}</span>
          ))}
        </div>
      </div>
    </section>
  )
}