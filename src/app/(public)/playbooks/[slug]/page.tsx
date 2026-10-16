// ============================================================================
// File Path: src/app/(public)/playbooks/[slug]/page.tsx
// Why: One playbook. Everything lives in components/v3/playbooks/playbook-route.tsx.
// Env / Identity: React Server Component
// ============================================================================

import { PlaybookRoute, playbookMetadata, playbookStaticParams } from "@/components/v3/playbooks/playbook-route"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return playbookStaticParams()
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return playbookMetadata(slug, "en")
}

export default async function PlaybookPage({ params }: Props) {
  const { slug } = await params
  return <PlaybookRoute slug={slug} locale="en" />
}
