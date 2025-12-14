import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Farjad.io</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            A living library for founders and builders.
                            Real talk about startups, immigration, and hard work.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/topics" className="hover:text-primary">Topics</Link></li>
                            <li><Link href="/series" className="hover:text-primary">Series</Link></li>
                            <li><Link href="/tools" className="hover:text-primary">Tools & Frameworks</Link></li>
                            <li><Link href="/start-here" className="hover:text-primary">Start Here</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">About</Link></li>
                            <li><Link href="/newsletter" className="hover:text-primary">Newsletter</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact / Work</Link></li>
                            <li><a href="#" className="hover:text-primary">Twitter / X</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Terms of Use</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Farjad.io. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
