import { api } from "@/services/api"

export type OAuthProvider = "google" | "github"

export const OAUTH_ERRORS: Record<string, string> = {
  cancelled: "Sign-in was cancelled.",
  invalid_state: "Your sign-in session expired. Please try again.",
  oauth_failed: "We could not sign you in with that provider. Please try again.",
  email_unverified: "Your email is not verified with that provider. Verify it there or sign up with email.",
  no_email: "That provider did not share an email address.",
  no_account: "No account found for that email. Choose your role and sign up below.",
  account_exists: "An account with this email already exists. Please sign in with your password.",
  already_linked: "This email is already linked to a different account from that provider.",
  blocked: "Your account has been blocked.",
  not_configured: "This sign-in method is not available right now.",
}

export function startOAuth(provider: OAuthProvider, mode: "login" | "register", role?: "student" | "teacher") {
  const params = new URLSearchParams({ mode })
  if (role) params.set("role", role)
  window.location.assign(`${api.defaults.baseURL}/auth/${provider}?${params}`)
}