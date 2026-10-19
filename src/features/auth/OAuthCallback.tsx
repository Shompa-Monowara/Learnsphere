import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { AlertCircle, Loader2 } from "lucide-react"
import { ROLE_HOME } from "@/config/constants"
import { getErrorMessage } from "@/services/api"
import { useAuth } from "@/stores/auth-context"

export default function OAuthCallback() {
  const { exchangeOAuthCode } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const started = useRef(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (started.current) return
    started.current = true

    const code = params.get("code")
    if (!code) {
      setError("Missing sign-in code.")
      return
    }
    exchangeOAuthCode(code)
      .then((user) => navigate(ROLE_HOME[user.role], { replace: true }))
      .catch((err) => setError(getErrorMessage(err)))
  }, [exchangeOAuthCode, navigate, params])

  return (
    <div className="grid min-h-screen place-items-center p-6">
      {error ? (
        <div className="max-w-sm space-y-4 text-center">
          <AlertCircle className="mx-auto text-red-600" size={32} />
          <p className="text-sm text-slate-700 dark:text-slate-300">{error}</p>
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
            Back to login
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <Loader2 className="animate-spin text-teal-600" size={24} /> Signing you in...
        </div>
      )}
    </div>
  )
}