import { ExternalLink, MapPin } from "lucide-react"

export function MapCard({ street, city }: { street: string; city: string }) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${street}, ${city}`)}`

  return (
    <div className="relative h-60 overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/70 dark:border-teal-900 dark:bg-slate-900">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,184,166,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,184,166,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute -left-10 top-[42%] h-10 w-[120%] -rotate-[8deg] bg-white/80 dark:bg-slate-800/60" />
      <div className="absolute -top-6 left-[22%] h-[130%] w-9 rotate-[12deg] bg-white/70 dark:bg-slate-800/50" />
      <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-teal-300/30 blur-2xl" />

      <div className="absolute inset-0 flex flex-col items-center justify-center pb-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white ring-8 ring-teal-600/10">
          <MapPin size={22} />
        </span>
        <span className="mt-4 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-xs">
          {street}
        </span>
        <span className="mt-2 text-xs text-slate-600 dark:text-slate-300">{city}</span>
      </div>

      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 shadow-xs transition-colors hover:border-teal-600 hover:text-teal-700"
      >
        <ExternalLink size={13} /> Open in Google Maps
      </a>
    </div>
  )
}