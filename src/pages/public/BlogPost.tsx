import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import PostCard from "@/features/blog/PostCard"
import { POSTS, formatDate } from "@/features/blog/posts"

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

export default function BlogPost() {
  const { slug } = useParams()
  const post = POSTS.find((p) => p.slug === slug)

  if (!post) {
    return (
      <section className="mx-auto max-w-[600px] px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Article not found</h1>
        <p className="mt-3 text-slate-500">This article may have moved or no longer exists.</p>
        <Link
          to="/blog"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <ArrowLeft size={15} /> Back to the blog
        </Link>
      </section>
    )
  }

  const related = [
    ...POSTS.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3)

  return (
    <>
      <section className="border-b border-slate-200/70 bg-teal-50/60 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-[800px] px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <span>›</span>
            <Link to="/blog" className="hover:text-teal-600">Blog</Link>
            <span>›</span>
            <span className="truncate font-medium text-slate-900 dark:text-white">{post.category}</span>
          </nav>

          <span className="mt-6 inline-flex rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:bg-slate-800">
            {post.category}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
              {initials(post.author)}
            </span>
            <div className="text-sm">
              <p className="font-semibold text-slate-900 dark:text-white">{post.author}</p>
              <p className="text-slate-500">
                {post.role} · {formatDate(post.date)} · {post.readMinutes} min read
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">
        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{post.excerpt}</p>

        {post.body.map((b, i) => {
          if ("h" in b) {
            return (
              <h2 key={i} className="mt-10 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {b.h}
              </h2>
            )
          }
          if ("ul" in b) {
            return (
              <ul key={i} className="mt-4 space-y-2">
                {b.ul.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-slate-700 dark:text-slate-300">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                    {item}
                  </li>
                ))}
              </ul>
            )
          }
          return (
            <p key={i} className="mt-4 text-[16px] leading-relaxed text-slate-700 dark:text-slate-300">
              {b.p}
            </p>
          )
        })}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-900 dark:bg-teal-950/30">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Ready to start learning?</p>
            <p className="text-sm text-slate-500">Browse courses from instructors who work in the fields they teach.</p>
          </div>
          <Link
            to="/courses"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Explore courses <ArrowRight size={15} />
          </Link>
        </div>

        <Link to="/blog" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:underline">
          <ArrowLeft size={15} /> All articles
        </Link>
      </article>

      {related.length > 0 && (
        <section className="border-t border-slate-200/70 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Keep reading</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}