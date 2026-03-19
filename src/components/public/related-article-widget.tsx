import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

export async function RelatedArticleWidget({ slug }: { slug: string }) {
    const post = await prisma.post.findUnique({
        where: { slug, status: "PUBLISHED" },
        select: {
            title: true,
            slug: true,
            excerpt: true,
            categories: { select: { name: true }, take: 1 }
        }
    })

    if (!post) return null

    return (
        <div className="bg-gradient-to-br from-[#1B4B43]/5 to-[#1B4B43]/10 border-l-4 border-[#1B4B43] rounded-r-2xl p-6 md:p-8 my-10 relative overflow-hidden group shadow-sm transition-all hover:shadow-md">
            {/* Background decorative icon */}
            <div className="absolute -right-6 -top-6 opacity-[0.03] text-[#1B4B43] pointer-events-none transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <BookOpen className="w-48 h-48" />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-[#1B4B43] px-3 py-1.5 rounded-full shadow-sm">
                        Recommended Reading
                    </span>
                    {post.categories[0] && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B4B43]/70">
                            • {post.categories[0].name}
                        </span>
                    )}
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-[#111827] mb-3 pr-8 leading-tight">
                    {post.title}
                </h3>
                
                {post.excerpt && (
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-5 max-w-2xl">
                        {post.excerpt}
                    </p>
                )}
                
                <Link 
                    href={`/blog/${post.slug}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-wrap items-center gap-2 text-sm font-bold text-[#1B4B43] hover:text-[#111827] transition-colors"
                >
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
            </div>
        </div>
    )
}
