import { Mail, MapPin, Phone } from "lucide-react"
import type { ContactInfo } from "../api"
import { HelpCenter } from "./HelpCenter"
import { InfoCard } from "./InfoCard"
import { MapCard } from "./MapCard"
import { SupportHours } from "./SupportHours"

export function ContactSidebar({ info }: { info: ContactInfo }) {
  const fullAddress = `${info.address.street}, ${info.address.city}`

  return (
    <div className="space-y-4">
      <InfoCard
        icon={Mail}
        label="Email us"
        value={info.email.value}
        note={info.email.note}
        copyValue={info.email.value}
      />
      <InfoCard
        icon={Phone}
        label="Call us"
        value={info.phone.value}
        note={info.phone.note}
        copyValue={info.phone.value}
      />
      <InfoCard
        icon={MapPin}
        label="Visit us"
        value={fullAddress}
        note={info.address.note}
        copyValue={fullAddress}
      />
      <MapCard street={info.address.street} city={info.address.city} />
      <SupportHours hours={info.hours} response={info.response} />
      <HelpCenter help={info.help} />
    </div>
  )
}