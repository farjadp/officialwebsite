// ============================================================================
// File Path: src/components/v3/pages/blog-index.tsx
// Why: /blog in the v3 "Light" look. English only — the Persian blog was
//      deleted and /fa/blog redirects here, so there is no locale switch.
//      Every query, filter, page size and category rule is the v2 page's own,
//      carried over untouched; the copy is verbatim. Only the look changed.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { PostStatus } from "@prisma/client"
import { ArrowLeft, ArrowRight, Clock, Eye } from "lucide-react"
import { getPosts } from "@/app/actions/posts"
import { getCategories } from "@/app/actions/categories"
import {
  Chip,
  Headline,
  PageHero,
  Parallax,
  Reveal,
  Section,
  V3Page,
} from "@/components/v3/kit"

const WRAP = "mx-auto w-full max-w-[1600px] px-5 md:px-10 lg:px-14"

/** date · reading time · (optional) views, in one quiet line. */
function Meta({
  date,
  readingTime,
  views,
  className,
}: {
  date: Date
  readingTime?: number | null
  views?: number
  className?: string
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-v3-mute ${className ?? ""}`}>
      <time dateTime={date.toISOString()}>{format(new Date(date), "MMM d, yyyy")}</time>
      {readingTime ? (
        <>
          <span aria-hidden className="text-v3-line">&middot;</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {readingTime} min
          </span>
        </>
      ) : null}
      {typeof views === "number" && (
        <>
          <span aria-hidden className="text-v3-line">&middot;</span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" aria-hidden /> {views}
          </span>
        </>
      )}
    </div>
  )
}

export async function BlogIndex({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const page = parseInt(searchParams.page || "1")
  const categoryId = searchParams.category

  const { posts, totalPages } = await getPosts({ status: PostStatus.PUBLISHED, page, limit: 12, categoryId })
  const categories = await getCategories()

  // Only show featured on first page without filters
  const isFirstPage = page === 1 && !categoryId
  const featuredPost = isFirstPage && posts.length > 0 ? posts[0] : null
  const regularPosts = isFirstPage && posts.length > 1 ? posts.slice(1) : isFirstPage ? [] : posts

  return (
    <V3Page>
      <PageHero
        title="Insights &"
        accent="Thoughts"
        lead="Deep dives into building real businesses, software engineering, and the psychology behind startup survival."
      />

      {/* ── Category filters ────────────────────────────────────────── */}
      <section className={`${WRAP} pt-14 md:pt-20`}>
        <Reveal className="flex flex-wrap gap-2.5">
          <Link
            href="/blog"
            aria-current={!categoryId ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
              !categoryId
                ? "border-v3-light/60 bg-v3-raise text-v3-light"
                : "border-v3-line text-v3-soft hover:border-v3-light/50 hover:text-v3-light"
            }`}
          >
            All Articles
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`?category=${c.id}`}
              aria-current={categoryId === c.id ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
                categoryId === c.id
                  ? "border-v3-light/60 bg-v3-raise text-v3-light"
                  : "border-v3-line text-v3-soft hover:border-v3-light/50 hover:text-v3-light"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </Reveal>
      </section>

      {/* ── Featured ────────────────────────────────────────────────── */}
      {featuredPost && (
        <Section title="Featured Article" bordered={!!regularPosts.length}>
          <Reveal>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <article
                className={`grid items-stretch gap-px overflow-hidden rounded-2xl border border-v3-line/80 bg-v3-line/70 transition-all duration-500 group-hover:border-v3-light/60 ${
                  featuredPost.coverImage ? "md:grid-cols-2" : ""
                }`}
              >
                {featuredPost.coverImage && (
                  <Parallax className="aspect-[4/3] bg-v3-raise md:aspect-auto md:h-full">
                    <Image
                      className="object-cover"
                      fill
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </Parallax>
                )}
                <div className="flex h-full flex-col justify-center gap-5 bg-v3-ink p-8 transition-colors duration-500 group-hover:bg-v3-raise md:p-12">
                  {featuredPost.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.categories.map((c) => (
                        <Chip key={c.id} className="border-v3-light/40 text-v3-light">
                          {c.name}
                        </Chip>
                      ))}
                    </div>
                  )}
                  <Headline as="h3" size="card" className="transition-colors duration-300 group-hover:text-v3-light md:text-4xl">
                    {featuredPost.title}
                  </Headline>
                  {featuredPost.excerpt && (
                    <p className="line-clamp-3 text-lg leading-relaxed text-v3-soft">{featuredPost.excerpt}</p>
                  )}
                  <Meta
                    date={featuredPost.createdAt}
                    readingTime={featuredPost.readingTime}
                    views={featuredPost.views}
                    className="mt-auto pt-2"
                  />
                </div>
              </article>
            </Link>
          </Reveal>
        </Section>
      )}

      {/* ── Latest ──────────────────────────────────────────────────── */}
      {regularPosts.length > 0 && (
        <Section title="Latest Articles" bordered={false}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {regularPosts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-v3-line/80 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise"
                >
                  {post.coverImage && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-v3-raise">
                      <Image
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        fill
                        src={post.coverImage}
                        alt={post.title}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-4 p-7 md:p-8">
                    {post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((c) => (
                          <Chip key={c.id}>{c.name}</Chip>
                        ))}
                      </div>
                    )}
                    <Headline as="h3" size="card" className="text-2xl transition-colors duration-300 group-hover:text-v3-light">
                      {post.title}
                    </Headline>
                    {post.excerpt && (
                      <p className="line-clamp-3 leading-relaxed text-v3-soft">{post.excerpt}</p>
                    )}
                    <Meta
                      date={post.createdAt}
                      readingTime={post.readingTime}
                      className="mt-auto border-t border-v3-line/70 pt-5"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Reveal className="mt-16 flex items-center justify-center gap-6">
              {page > 1 && (
                <Link
                  href={`?page=${page - 1}${categoryId ? `&category=${categoryId}` : ""}`}
                  className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-v3-bone/60 px-6 py-3 text-v3-bone transition-colors duration-300 hover:border-v3-light hover:text-v3-light"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
                  Previous
                </Link>
              )}
              <span className="text-sm text-v3-mute">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`?page=${page + 1}${categoryId ? `&category=${categoryId}` : ""}`}
                  className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-v3-bone/60 px-6 py-3 text-v3-bone transition-colors duration-300 hover:border-v3-light hover:text-v3-light"
                >
                  Next
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </Link>
              )}
            </Reveal>
          )}
        </Section>
      )}

      {!featuredPost && regularPosts.length === 0 && (
        <Section bordered={false}>
          <Reveal className="py-20 text-center">
            <p className="text-xl text-v3-mute">No posts published yet. Check back soon!</p>
          </Reveal>
        </Section>
      )}
    </V3Page>
  )
}
