import { initials } from "../utils"

interface Props {
  name: string
  src?: string
  size?: number
  className?: string
}

export default function Avatar({ name, src, size = 40, className = "" }: Props) {
  if (src) {
    return <img src={src} alt={name} style={{ width: size, height: size }} className={`shrink-0 rounded-full object-cover ${className}`} />
  }
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-700 ${className}`}
    >
      {initials(name)}
    </span>
  )
}