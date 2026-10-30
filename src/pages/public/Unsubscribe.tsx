import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Check, MailX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { unsubscribeNewsletter } from "@/features/home/api"
import { getErrorMessage } from "@/services/api"

/* Email er link e click korle ekhane ashe. GET e kichu change hoy na (email scanner safe),
   user button e click korle POST jay. */
export default function Unsubscribe() {
  const { token = "" } = useParams()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const confirm = async () => {
    setLoading(true)
    setError("")
    try {
      await unsubscribeNewsletter(token)
      setDone(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
          {done ? <Check size={26} /> : <MailX size={26} />}
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">{done ? "You are unsubscribed" : "Unsubscribe from our newsletter?"}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {done ? "You will not receive any more newsletter emails from us." : "You will stop getting course ideas and teaching tips from LearnSphere."}
        </p>
        {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
        <div className="mt-6 flex justify-center gap-3">
          {!done && (
            <Button onClick={confirm} disabled={loading} className="rounded-xl bg-teal-600 px-6 text-white hover:bg-teal-700">
              {loading ? "Unsubscribing…" : "Yes, unsubscribe"}
            </Button>
          )}
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}