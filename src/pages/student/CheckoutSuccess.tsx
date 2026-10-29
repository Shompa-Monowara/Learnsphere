import { useCallback, useEffect, useRef, useState } from "react"
import { isAxiosError } from "axios"
import { Link, useSearchParams } from "react-router-dom"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { confirmPayment } from "@/features/courses/api"
import { getErrorMessage } from "@/services/api"

type State =
  | { status: "loading" }
  | { status: "success"; courseId: string; courseTitle: string }
  | { status: "error"; message: string }

const MAX_TRIES = 4
const RETRY_DELAY_MS = 2500

/* Network / server error hole abar try kori. 4xx (jemon "payment hoyni", "tomar na") hole retry kore lav nai */
const isRetryable = (err: unknown) => !isAxiosError(err) || !err.response || err.response.status >= 500

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function CheckoutSuccess() {
  const [params] = useSearchParams()
  const sessionId = params.get("session_id")
  const [state, setState] = useState<State>(sessionId ? { status: "loading" } : { status: "error", message: "Missing payment session." })
  const started = useRef(false)

  const confirm = useCallback(async () => {
    if (!sessionId) return
    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
      try {
        const result = await confirmPayment(sessionId)
        setState({ status: "success", ...result })
        return
      } catch (err) {
        if (attempt === MAX_TRIES || !isRetryable(err)) {
          setState({ status: "error", message: getErrorMessage(err) })
          return
        }
        await wait(RETRY_DELAY_MS)
      }
    }
  }, [sessionId])

  useEffect(() => {
    if (!sessionId || started.current) return
    started.current = true
    void confirm()
  }, [sessionId, confirm])

  const retry = () => {
    setState({ status: "loading" })
    void confirm()
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {state.status === "loading" && (
          <>
            <Loader2 size={40} className="mx-auto animate-spin text-teal-600" />
            <h1 className="mt-4 text-xl font-bold">Confirming your payment...</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please don&apos;t close this page.</p>
          </>
        )}

        {state.status === "success" && (
          <>
            <CheckCircle2 size={44} className="mx-auto text-teal-600" />
            <h1 className="mt-4 text-2xl font-bold">Payment successful</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              You are now enrolled in <b>{state.courseTitle}</b>.
            </p>
            <div className="mt-6 space-y-3">
              <Button asChild className="h-11 w-full rounded-xl bg-teal-600 text-white hover:bg-teal-700">
                <Link to={`/student/learn/${state.courseId}`}>Start learning</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                <Link to="/student/courses">Go to my courses</Link>
              </Button>
            </div>
          </>
        )}

        {state.status === "error" && (
          <>
            <AlertCircle size={44} className="mx-auto text-red-600" />
            <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
            <p role="alert" className="mt-2 text-sm text-red-600">{state.message}</p>
            <p className="mt-2 text-xs text-slate-500">
              If you were charged, check &quot;My courses&quot; in a minute or contact support.
            </p>
            <div className="mt-6 space-y-3">
              {sessionId && (
                <Button onClick={retry} className="h-11 w-full rounded-xl bg-teal-600 text-white hover:bg-teal-700">
                  Try again
                </Button>
              )}
              <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                <Link to="/student/courses">Check my courses</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                <Link to="/courses">Browse courses</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}