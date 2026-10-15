import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { api } from "@/services/api"
import { clearToken, getToken, setToken } from "@/services/token"
import { AuthContext } from "./auth-context"
import type { RegisterPayload, User } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(() => !!getToken())

  useEffect(() => {
    if (!getToken()) return
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string, remember: boolean) => {
    const res = await api.post("/auth/login", { email, password })
    setToken(res.data.token, remember)
    setUser(res.data.user)
    return res.data.user as User
  }

  const register = async (data: RegisterPayload) => {
    const res = await api.post("/auth/register", data)
    setToken(res.data.token, true)
    setUser(res.data.user)
    return res.data.user as User
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  const updateUser = (patch: Partial<User>) => setUser((prev) => (prev ? { ...prev, ...patch } : prev))

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}