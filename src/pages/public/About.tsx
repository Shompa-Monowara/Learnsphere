import { useEffect, useState } from "react"
import { AboutHero, MissionVision, Story } from "@/features/about/Sections"
import type { AboutData } from "@/features/about/types"
import { api, getErrorMessage } from "@/services/api"

export default function About() {
  const [data, setData] = useState<AboutData | null>(null)
  const [error, setError] = useState("")
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false
    api
      .get<AboutData>("/about")
      .then((res) => {
        if (!ignore) setData(res.data)
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err))
      })
    return () => {
      ignore = true
    }
  }, [attempt])

  const retry = () => {
    setError("")
    setAttempt((n) => n + 1)
  }

  if (error) {
    return (
      <div className="py-32 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
        <div className="h-8 w-40 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="mt-6 h-32 max-w-xl animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="mt-10 h-72 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
      </div>
    )
  }

  return (
    <>
      <AboutHero hero={data.hero} />
      <MissionVision mission={data.mission} vision={data.vision} />
      <Story story={data.story} />
    </>
  )
}