import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  // farjadp.com is an alias of the same Vercel project and was serving a full
  // second copy of the site. Send it permanently to the canonical host so the
  // brand and the link equity land on one domain.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?farjadp\\.com" }],
        destination: "https://www.farjadp.info/:path*",
        permanent: true,
      },

      // The Persian blog routes rendered the same English post records as /blog
      // — the Post model has no locale, so both paths read one row. Rather than
      // keep 97 indexable English articles on Persian URLs, the routes were
      // deleted and the traffic sent to the article it was always showing.
      { source: "/fa/blog", destination: "/blog", permanent: true },
      { source: "/fa/blog/:slug", destination: "/blog/:slug", permanent: true },

      // /series, /series/[slug] and /topics were hardcoded placeholders, and
      // /series/anything returned 200 with identical content. Deleted.
      { source: "/series", destination: "/blog", permanent: true },
      { source: "/series/:slug", destination: "/blog", permanent: true },
      { source: "/topics", destination: "/blog", permanent: true },
      { source: "/topics/:slug", destination: "/blog", permanent: true },
      { source: "/fa/series", destination: "/blog", permanent: true },
      { source: "/fa/series/:slug", destination: "/blog", permanent: true },
      { source: "/fa/topics", destination: "/blog", permanent: true },

      // Footer links that never had a route behind them.
      { source: "/essays", destination: "/blog", permanent: true },
      { source: "/start-here", destination: "/about", permanent: true },
      { source: "/reading-list", destination: "/blog", permanent: true },
      { source: "/newsletter", destination: "/blog", permanent: true },
    ]
  },
  async headers() {
    return [
      {
        // Mail clients and the browser view load these from another origin, and
        // a font request without CORS headers is rejected outright
        source: "/fonts/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
