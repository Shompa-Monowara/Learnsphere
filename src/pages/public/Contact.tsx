import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getContactInfo } from "@/features/contact/api"
import type { ContactInfo } from "@/features/contact/api"
import { ContactError } from "@/features/contact/components/ContactError"
import { ContactForm } from "@/features/contact/components/ContactForm"
import { ContactHero } from "@/features/contact/components/ContactHero"
import { ContactSidebar } from "@/features/contact/components/ContactSidebar"
import { ContactSkeleton } from "@/features/contact/components/ContactSkeleton"
import { TeamPlansBanner } from "@/features/contact/components/TeamPlansBanner"
import { getErrorMessage } from "@/services/api"

export default function Contact() {
  const [params] = useSearchParams()
  const instructor = (params.get("instructor") ?? "").trim().slice(0, 80)

  const [info, setInfo] = useState<ContactInfo | null>(null)
  const [error, setError] = useState("")
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false
    getContactInfo()
      .then((res) => {
        if (!ignore) setInfo(res)
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err))
      })
    return () => {
      ignore = true
    }
  }, [attempt])

  const retry = () => {
    setError("")
    setAttempt((n) => n + 1)
  }

  if (error) return <ContactError message={error} onRetry={retry} />
  if (!info) return <ContactSkeleton />

  return (
    <>
      <ContactHero hero={info.hero} />

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.43fr)_minmax(0,1fr)] lg:gap-10">
          <ContactForm instructor={instructor} />
          <ContactSidebar info={info} />
        </div>
        <TeamPlansBanner banner={info.teamBanner} />
      </section>
    </>
  )
}