import { Link } from "react-router-dom"

const UPDATED = "October 23, 2026"

interface Section {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

const SECTIONS: Section[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      "This policy explains what LearnSphere collects when you use the platform, why we collect it and the choices you have. We keep the data we collect to what we need to run courses, certificates and support.",
    ],
  },
  {
    id: "collect",
    title: "Information we collect",
    bullets: [
      "Account details: your name, email address, password (stored only as a hash), role, profile photo, headline and bio.",
      "Learning activity: enrollments, lesson progress, quiz attempts, assignment submissions, reviews and certificates.",
      "Messages: chat messages and attachments you send to instructors or students, and notes you send through the contact form.",
      "Payments: records of purchases and instructor payouts.",
      "Technical data: the sign-in token kept in your browser and basic request logs used to keep the service secure.",
    ],
  },
  {
    id: "use",
    title: "How we use your information",
    bullets: [
      "To provide courses, grade quizzes and assignments, and issue certificates.",
      "To send emails you need, such as verification codes, password resets and replies to your questions.",
      "To show notifications about your courses, grades and messages.",
      "To prevent abuse and keep accounts safe, for example by rate limiting sign-in and contact requests.",
      "To understand what is working and improve the platform.",
    ],
  },
  {
    id: "sharing",
    title: "Who we share it with",
    paragraphs: ["We never sell your details. We share information only in these cases:"],
    bullets: [
      "Instructors can see your name and progress in the courses you join.",
      "Service providers that help us run LearnSphere, such as file storage, email delivery and the sign-in providers (Google or GitHub) if you choose to use them.",
      "Authorities, when the law requires us to.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    paragraphs: [
      "We use your browser's storage to keep you signed in and to remember preferences such as your theme. We do not use advertising cookies.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep data",
    paragraphs: [
      "We keep your data while your account is active. If you delete your account we remove your profile information, and we may keep records we are required to keep by law, such as transaction history.",
    ],
  },
  {
    id: "rights",
    title: "Your choices and rights",
    paragraphs: [
      "You can view and update your profile at any time from your dashboard settings. You can also ask us to give you a copy of your data, correct it or delete it by emailing hello@learnsphere.com.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "Passwords are stored as hashes, access to your data is limited by role, and we rate limit sensitive requests. No method of storing or sending data is completely secure, so we cannot promise absolute security.",
    ],
  },
  {
    id: "children",
    title: "Children's privacy",
    paragraphs: [
      "LearnSphere is not directed at children under 13, and we do not knowingly collect their information. If you believe a child has given us data, contact us and we will delete it.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "When we change this policy we will update the date at the top of this page and, for significant changes, tell you by email or in the app.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: ["Questions about this policy? Email hello@learnsphere.com or send us a message from the contact page."],
  },
]

export default function Privacy() {
  return (
    <>
      <section className="border-b border-slate-200/70 bg-teal-50/60 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">Privacy policy</span>
          </nav>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Privacy policy
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">Last updated {UPDATED}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">On this page</p>
            <ul className="mt-2 space-y-0.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="max-w-3xl space-y-10">
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                <span className="mr-2 text-teal-600">{i + 1}.</span>
                {s.title}
              </h2>
              {s.paragraphs?.map((p) => (
                <p key={p} className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-3 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <p className="border-t border-slate-200/70 pt-6 text-sm text-slate-500 dark:border-slate-800">
            Have a question about your data?{" "}
            <Link to="/contact" className="font-semibold text-teal-700 hover:underline">Contact us</Link>.
          </p>
        </div>
      </section>
    </>
  )
}