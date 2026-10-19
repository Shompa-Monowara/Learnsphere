import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { api } from "@/services/api"
import { clearToken, getToken, setToken } from "@/services/token"
import { AuthContext } from "./auth-context"
import type { CompleteRegisterPayload, OtpSent, RegisterPayload, User } from "./auth-context"

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

  const startSession = (data: { token: string; user: User }) => {
    setToken(data.token, true)
    setUser(data.user)
    return data.user
  }

  const login = async (email: string, password: string, remember: boolean) => {
    const res = await api.post("/auth/login", { email, password })
    setToken(res.data.token, remember)
    setUser(res.data.user)
    return res.data.user as User
  }

  const register = async (data: RegisterPayload) => {
    const res = await api.post("/auth/register", data)
    return startSession(res.data)
  }

  const requestRegisterOtp = async (data: RegisterPayload): Promise<OtpSent> => {
    const res = await api.post("/auth/register/request-otp", data)
    return res.data
  }

  const resendRegisterOtp = async (email: string): Promise<OtpSent> => {
    const res = await api.post("/auth/register/resend-otp", { email })
    return res.data
  }

  const completeRegister = async (data: CompleteRegisterPayload) => {
    const res = await api.post("/auth/register/complete", data)
    return startSession(res.data)
  }

  const exchangeOAuthCode = async (code: string) => {
    const res = await api.post("/auth/oauth/exchange", { code })
    return startSession(res.data)
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  const updateUser = (patch: Partial<User>) => setUser((prev) => (prev ? { ...prev, ...patch } : prev))

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        requestRegisterOtp,
        resendRegisterOtp,
        completeRegister,
        exchangeOAuthCode,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}