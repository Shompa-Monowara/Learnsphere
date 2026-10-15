import { Button } from "@/components/ui/button"
import { useAuth } from "@/stores/auth-context"

export default function DashboardPlaceholder() {
  const { user, logout } = useAuth()
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Hello, {user?.name}</h1>
        <p className="mt-2 text-slate-600">Role: {user?.role}</p>
        <Button onClick={logout} className="mt-6 bg-teal-600 text-white hover:bg-teal-700">
          Logout
        </Button>
      </div>
    </div>
  )
}