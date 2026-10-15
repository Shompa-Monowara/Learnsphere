const KEY = "token"

export const getToken = () =>
  localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)

export const clearToken = () => {
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}

export const setToken = (token: string, remember: boolean) => {
  clearToken()
  ;(remember ? localStorage : sessionStorage).setItem(KEY, token)
}