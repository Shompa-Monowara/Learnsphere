import { Loader2 } from "lucide-react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { ROLE_HOME } from "@/config/constants"
import { useAuth } from "@/stores/auth-context"
import type { Role } from "@/stores/auth-context"

export default function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role]} replace />
  return <Outlet />
}