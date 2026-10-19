import { Button } from "@/components/ui/button"
import { startOAuth } from "../oauth"
import { GithubIcon, GoogleIcon } from "./SocialIcons"

interface Props {
  mode: "login" | "register"
  role?: "student" | "teacher"
}

export default function SocialButtons({ mode, role }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={() => startOAuth("google", mode, role)}>
        <GoogleIcon /> Google
      </Button>
      <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={() => startOAuth("github", mode, role)}>
        <GithubIcon /> GitHub
      </Button>
    </div>
  )
}