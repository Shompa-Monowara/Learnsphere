import { Loader2 } from "lucide-react"
import type { ReactNode } from "react"
import { BTN_PRIMARY } from "../ui"

interface Props {
  loading: boolean
  error: string
  onRetry: () => void
  children: ReactNode
}

export default function PageState({ loading, error, onRetry, children }: Props) {
  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="animate-spin text-teal-600" size={30} />
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/30 dark:bg-red-500/10">
        <p className="font-semibold text-red-700 dark:text-red-300">{error}</p>
        <button type="button" onClick={onRetry} className={`${BTN_PRIMARY} mt-3`}>
          Try again
        </button>
      </div>
    )
  }
  return <>{children}</>
}