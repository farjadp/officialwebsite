import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Asterisk,
  BrainCircuit,
  Check,
  CodeXml,
  MoveRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Farjad | Venture Builder & Systems Architect",
  description:
    "I help ambitious teams turn unclear ideas, fragile products, and manual operations into companies that can scale.",
};

export const revalidate = 60;

async function getLatestPosts() {
  const timeout = new Promise<never[]>((resolve) =>
    setTimeout(() => resolve([]), 3000),
  );
  const query = prisma.post
    .findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        readingTime: true,
        categories: { select: { name: true }, take: 1 },
      },
    })
    .catch(() => [] as never[]);

  return Promise.race([query, timeout]);
}

const services = [
  {
    number: "01",
    title: "Build the business",
    label: "Zero to one",
    description:
      "From uncomfortably early idea to a product people pay for. Strategy, validation, architecture, and the first team.",
    href: "/services",
  },
  {
    number: "02",
    title: "Unblock the team",
    label: "Advisory",
    description:
      "A direct sparring partner for founders and product teams facing hard decisions, execution drift, or a growth ceiling.",
    href: "/startups",
  },
  {
    number: "03",
    title: "Engineer the leverage",
    label: "AI + systems",
    description:
      "Replace brittle workflows and repetitive operations with secure custom software and useful AI automation.",
    href: "/services",
  },
];

export default async function HomePage() {
  const latestPosts = await getLatestPosts();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-emerald-500 selection:text-black">
      {/* Hero Section */}
      <section className="relative flex min-h-[100dvh] flex-col border-b border-white/10 px-5 pb-10 pt-24 md:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_40%)]" />
        
        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 lg:w-2/3 lg:pb-12">
            <div className="mb-12 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Toronto / Working globally / 2026
            </div>

            <h1 className="text-[clamp(4rem,8vw,9.5rem)] font-black uppercase leading-[0.8] tracking-[-0.04em] text-zinc-50">
              Build what
              <span className="block italic text-emerald-500">
                survives
              </span>
              reality.
            </h1>

            <div className="mt-12 grid max-w-4xl gap-8 border-t border-white/10 pt-8 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-xl text-lg leading-relaxed text-zinc-400 md:text-2xl">
                I&apos;m Farjad. I turn ambiguous ideas, stuck teams, and manual
                operations into products and companies built to compound.
              </p>
              <Link
                href="/booking"
                className="group inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 transition-transform duration-300 hover:scale-105 md:h-20 md:w-20"
                aria-label="Book a discovery call"
              >
                <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:h-8 md:w-8" />
              </Link>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 relative duration-1000 lg:w-1/3 lg:justify-self-end">
            <div className="absolute -left-4 top-6 z-10 bg-emerald-500 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-950 md:-left-8">
              Engineer × Advisor
            </div>
            <div className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden bg-zinc-900 grayscale transition duration-700 hover:grayscale-0">
              <img
                src="/images/farjad-portrait.jpg"
                alt="Farjad Pourmohammad"
                className="h-full w-full object-cover object-top opacity-80 mix-blend-luminosity"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent px-6 pb-6 pt-24">
                <div className="flex items-end justify-between gap-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                    Software / Anthropology
                    <br />
                    Strategy / Execution
                  </p>
                  <Asterisk className="h-8 w-8 animate-[spin_16s_linear_infinite] text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-12 flex w-full max-w-[1600px] items-center justify-between border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          <span>Scroll to inspect the work</span>
          <ArrowDownRight className="h-4 w-4 text-emerald-500" />
        </div>
      </section>

      {/* Marquee Section */}
      <div className="overflow-hidden border-b border-zinc-950 bg-zinc-50 py-4 text-zinc-950">
        <div className="flex w-max animate-[home-marquee_30s_linear_infinite] items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-widest">
          {[0, 1].map((set) => (
            <div className="flex items-center gap-8" key={set} aria-hidden={set === 1}>
              <span>17 years in technology</span><Asterisk className="h-3 w-3" />
              <span>25+ startups mentored</span><Asterisk className="h-3 w-3" />
              <span>$3m+ raised by teams</span><Asterisk className="h-3 w-3" />
              <span>ISO 27001 lead auditor</span><Asterisk className="h-3 w-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Practice Section */}
      <section className="border-b border-white/10 px-5 py-24 md:px-10 lg:px-14 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-20">
            <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Strategy is useless until it changes what gets built on Monday.
            </h2>
          </div>

          <div className="border-t border-white/10">
            {services.map((service) => (
              <Link
                href={service.href}
                key={service.number}
                className="group grid gap-6 border-b border-white/10 py-10 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:px-6"
              >
                <span className="font-mono text-xs text-zinc-600 md:col-span-1">{service.number}</span>
                <span className="text-sm font-medium uppercase tracking-wider text-emerald-400 md:col-span-2">{service.label}</span>
                <h3 className="text-2xl font-medium tracking-tight text-zinc-50 md:col-span-4 md:text-4xl">{service.title}</h3>
                <p className="max-w-lg leading-relaxed text-zinc-400 md:col-span-4">{service.description}</p>
                <ArrowUpRight className="h-6 w-6 text-zinc-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-500 md:col-span-1 md:justify-self-end" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="grid border-b border-white/10 lg:grid-cols-2">
        <div className="flex min-h-[600px] flex-col justify-between bg-zinc-900 p-8 md:p-14 lg:p-20">
          <div className="flex items-center justify-between">
             <Sparkles className="h-5 w-5 text-zinc-600" />
          </div>
          <div>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-zinc-400">
              I work where business, people, and technology collide. That is usually where the expensive problems hide.
            </p>
            <h2 className="text-[clamp(3.5rem,7vw,7rem)] font-black uppercase leading-[0.85] tracking-tight text-zinc-50">
              Less
              <br />noise.
              <br /><span className="italic text-emerald-500">More</span>
              <br />signal.
            </h2>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-zinc-950 p-8 md:p-14 lg:p-20">
          {[
            [CodeXml, "Technical depth", "Architecture decisions grounded in real implementation, not slideware."],
            [BrainCircuit, "Human context", "Products and organizations are social systems before they are software systems."],
            [ShieldCheck, "Responsible scale", "Security, compliance, and operational reality are designed in from the start."],
          ].map(([Icon, title, copy]) => {
            const FeatureIcon = Icon as typeof CodeXml;
            return (
              <div key={title as string} className="grid gap-6 border-b border-white/10 py-10 first:border-t md:grid-cols-[70px_1fr]">
                <FeatureIcon className="h-8 w-8 text-emerald-500" />
                <div>
                  <h3 className="mb-2 text-xl font-medium tracking-tight text-zinc-50">{title as string}</h3>
                  <p className="max-w-md leading-relaxed text-zinc-400">{copy as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blog Section */}
      <section className="px-5 py-24 md:px-10 lg:px-14 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 flex flex-col justify-between gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">Thinking in public.</h2>
            </div>
            <Link href="/blog" className="group flex items-center gap-3 text-sm font-medium uppercase tracking-wider text-emerald-400 hover:text-emerald-300">
              Explore the library <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-px bg-white/5 lg:grid-cols-3">
            {latestPosts.length > 0 ? latestPosts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex min-h-[380px] flex-col justify-between bg-zinc-950 p-8 transition-colors hover:bg-zinc-900 md:p-10">
                <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  <span>{String(index + 1).padStart(2, "0")} / {post.categories[0]?.name ?? "Essay"}</span>
                  <span>{post.readingTime ?? 5} min</span>
                </div>
                <div>
                  <h3 className="mb-4 text-2xl font-medium leading-tight tracking-tight text-zinc-50 transition-colors group-hover:text-emerald-400">{post.title}</h3>
                  {post.excerpt && <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>}
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  <span>{post.publishedAt ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(post.publishedAt)) : "New"}</span>
                  <ArrowUpRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-400" />
                </div>
              </Link>
            )) : (
              <div className="col-span-3 bg-zinc-950 p-12 text-center text-zinc-500">New field notes are being prepared.</div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-5 pb-10 md:px-10 lg:px-14">
        <div className="relative mx-auto overflow-hidden bg-emerald-500 px-8 py-16 text-zinc-950 md:px-16 md:py-24 lg:max-w-[1600px]">
          <Asterisk className="absolute -right-16 -top-24 h-80 w-80 text-black/5" />
          <div className="relative grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="text-[clamp(3.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-tight">
                Let&apos;s make it
                <br /><span className="italic">move.</span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <ul className="mb-10 space-y-4 text-sm font-semibold">
                {["30-minute diagnostic", "Direct, honest feedback", "No agency theatre"].map((item) => (
                  <li className="flex items-center gap-3" key={item}><Check className="h-5 w-5" /> {item}</li>
                ))}
              </ul>
              <Link href="/booking" className="group flex items-center justify-between border-t-2 border-zinc-950 py-6 text-lg font-black uppercase tracking-tight hover:text-zinc-800">
                Book a conversation <ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
