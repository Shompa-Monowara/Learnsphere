import { Construction } from "lucide-react"
import { useLocation } from "react-router-dom"

export default function ComingSoon() {
  const { pathname } = useLocation()
  const name = pathname.split("/").filter(Boolean).pop() ?? "page"

  return (
    <div className="grid min-h-[50vh] place-items-center text-center">
      <div>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Construction size={26} />
        </span>
        <h1 className="mt-4 text-2xl font-bold capitalize text-slate-900 dark:text-white">{name}</h1>
        <p className="mt-1 text-slate-500">This page is coming in the next step.</p>
      </div>
    </div>
  )
}