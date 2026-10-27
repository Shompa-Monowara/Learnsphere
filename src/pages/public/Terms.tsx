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
    id: "acceptance",
    title: "Accepting these terms",
    paragraphs: [
      "These terms are an agreement between you and LearnSphere. By creating an account or using the platform you agree to them. If you do not agree, please do not use LearnSphere.",
    ],
  },
  {
    id: "accounts",
    title: "Your account",
    bullets: [
      "You must be at least 13 years old to create an account.",
      "Give us accurate information and keep it up to date.",
      "You are responsible for your password and for everything that happens under your account. Tell us right away if you think someone else has access.",
      "Each account belongs to one person. Please do not share your sign-in with others.",
    ],
  },
  {
    id: "students",
    title: "Learning on LearnSphere",
    paragraphs: [
      "When you enroll in a course, you get a personal, non-transferable licence to watch and use its materials for your own learning.",
    ],
    bullets: [
      "Do not copy, record, resell or share course videos, files or quizzes.",
      "Do not share answers to graded quizzes or assignments, and do not submit work that is not your own.",
    ],
  },
  {
    id: "instructors",
    title: "Teaching on LearnSphere",
    paragraphs: ["If you publish courses as an instructor, you also agree to the following:"],
    bullets: [
      "You own, or have the rights to use, everything you upload, and it does not infringe anyone else's rights.",
      "Courses are reviewed before they go live, and we may ask for changes or decline a course that does not meet our standards.",
      "You keep 80% of every enrollment. Earnings are paid out monthly.",
      "You are responsible for the accuracy and quality of your courses and for replying to your students.",
      "We may unpublish a course that breaks these terms or receives serious complaints.",
    ],
  },
  {
    id: "payments",
    title: "Payments and refunds",
    paragraphs: [
      "Prices are shown at checkout, and any applicable taxes are added before you pay. Team plans renew each billing period until you cancel.",
      "If something went wrong with a purchase, contact us and we will look at your request fairly. Refunds are decided case by case.",
    ],
  },
  {
    id: "use",
    title: "Acceptable use",
    paragraphs: ["Please do not use LearnSphere to:"],
    bullets: [
      "Break the law or encourage others to.",
      "Harass, threaten or discriminate against other people.",
      "Upload malware, or try to break into accounts, servers or other systems.",
      "Scrape or copy the platform in bulk, or send spam through messages or the contact form.",
      "Pretend to be someone else or give false information about who you are.",
    ],
  },
  {
    id: "content",
    title: "Content you submit",
    paragraphs: [
      "You keep ownership of what you post, including courses, reviews, messages and assignments. You give LearnSphere permission to host, display and deliver that content so the platform can work, for example showing your course to students or your review on a course page.",
    ],
  },
  {
    id: "certificates",
    title: "Certificates",
    paragraphs: [
      "A certificate is issued when you complete a course. Each one has a unique verification ID so others can confirm it is genuine. We may cancel a certificate that was earned through cheating or by breaking these terms.",
    ],
  },
  {
    id: "ip",
    title: "Our intellectual property",
    paragraphs: [
      "The LearnSphere name, logo, design and software belong to us. These terms do not give you any right to use them beyond using the platform as intended.",
    ],
  },
  {
    id: "third-party",
    title: "Third-party services",
    paragraphs: [
      "LearnSphere may link to other websites or let you sign in with services such as Google or GitHub. Those services have their own terms and privacy practices, and we are not responsible for them.",
    ],
  },
  {
    id: "termination",
    title: "Suspension and termination",
    paragraphs: [
      "You can stop using LearnSphere and ask us to delete your account at any time. We may suspend or close an account that breaks these terms or puts other people or the platform at risk. Where we reasonably can, we will tell you why.",
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimers",
    paragraphs: [
      "LearnSphere is provided \"as is\". Courses are created by independent instructors, and we do not guarantee any particular result, job or grade from taking one. We work hard to keep the platform running, but we cannot promise it will always be available or error free.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the extent the law allows, LearnSphere is not liable for indirect or consequential losses, such as lost profits or lost data. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. We will change the date at the top of this page and, for significant changes, tell you by email or in the app. If you keep using LearnSphere after a change, you accept the new terms.",
    ],
  },
  {
    id: "law",
    title: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of the place where LearnSphere is established, and any dispute will be handled by the courts there, unless the law where you live says otherwise.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: ["Questions about these terms? Email hello@learnsphere.com or send us a message from the contact page."],
  },
]

export default function Terms() {
  return (
    <>
      <section className="border-b border-slate-200/70 bg-teal-50/60 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <span className="font-medium text-slate-900 dark:text-white">Terms &amp; conditions</span>
          </nav>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Terms &amp; conditions
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
            See also our{" "}
            <Link to="/privacy" className="font-semibold text-teal-700 hover:underline">privacy policy</Link>, or{" "}
            <Link to="/contact" className="font-semibold text-teal-700 hover:underline">contact us</Link> with any
            questions.
          </p>
        </div>
      </section>
    </>
  )
}