import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { confirmSubscription } from "@/features/pricing/api"
import { getErrorMessage } from "@/services/api"

type State =
  | { status: "loading" }
  | { status: "success"; planName: string; renews?: string }
  | { status: "error"; message: string }

export default function SubscriptionSuccess() {
  const [params] = useSearchParams()
  const sessionId = params.get("session_id")
  const [state, setState] = useState<State>(
    sessionId ? { status: "loading" } : { status: "error", message: "Missing payment session." }
  )
  const started = useRef(false)

  useEffect(() => {
    if (!sessionId || started.current) return
    started.current = true
    confirmSubscription(sessionId)
      .then((r) =>
        setState({
          status: "success",
          planName: r.planName,
          renews: r.subscription?.currentPeriodEnd
            ? new Date(r.subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : undefined,
        })
      )
      .catch((err) => setState({ status: "error", message: getErrorMessage(err) }))
  }, [sessionId])

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {state.status === "loading" && (
          <>
            <Loader2 size={40} className="mx-auto animate-spin text-teal-600" />
            <h1 className="mt-4 text-xl font-bold">Activating your plan...</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please don&apos;t close this page.</p>
          </>
        )}

        {state.status === "success" && (
          <>
            <CheckCircle2 size={44} className="mx-auto text-teal-600" />
            <h1 className="mt-4 text-2xl font-bold">You&apos;re on {state.planName}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Your subscription is active.
              {state.renews && (
                <>
                  {" "}
                  Next billing date: <b>{state.renews}</b>.
                </>
              )}
            </p>
            <div className="mt-6 space-y-3">
              <Button asChild className="h-11 w-full rounded-xl bg-teal-600 text-white hover:bg-teal-700">
                <Link to="/teacher">Go to dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                <Link to="/pricing">View plans</Link>
              </Button>
            </div>
          </>
        )}

        {state.status === "error" && (
          <>
            <AlertCircle size={44} className="mx-auto text-red-600" />
            <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
            <p role="alert" className="mt-2 text-sm text-red-600">
              {state.message}
            </p>
            <div className="mt-6 space-y-3">
              <Button asChild className="h-11 w-full rounded-xl bg-teal-600 text-white hover:bg-teal-700">
                <Link to="/pricing">Back to pricing</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}