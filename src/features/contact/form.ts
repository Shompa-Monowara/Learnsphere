export const MAX = 500
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface FormState {
  name: string
  email: string
  subject: string
  message: string
}
export type Errors = Partial<Record<keyof FormState, string>>

export function validate(f: FormState): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = "Enter your full name"
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address"
  if (!f.subject) e.subject = "Choose a topic"
  if (f.message.trim().length < 10) e.message = "Message must be at least 10 characters"
  return e
}