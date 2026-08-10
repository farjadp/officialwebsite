import type { Metadata } from "next";
import PortfolioClientPage from "./portfolio-client";

export const metadata: Metadata = {
  title: "Portfolio | Projects, Startups & Case Studies",
  description: "A curated look at Farjad's projects: startups built, companies advised, and systems designed. Real outcomes, honest about what worked.",
  openGraph: {
    title: "Portfolio | Farjad .P",
    description: "Startups built, companies advised, and systems designed. Real outcomes.",
    images: ["/images/og-default.png"],
  },
};

export default function PortfolioPage() {
  return <PortfolioClientPage />;
}
