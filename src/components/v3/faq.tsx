"use client"

// ============================================================================
// File Path: src/components/v3/faq.tsx
// Why: Questions and answers in the v3 look, built on the site's Radix
//      accordion so keyboard and screen-reader behaviour stay correct. The
//      open item is marked by a rule of light along its start edge.
// Env / Identity: Client Component
// ============================================================================

import type { ReactNode } from "react"
import { Plus } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

export function V3Faq({ items }: { items: { q: ReactNode; a: ReactNode }[] }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className="flex flex-col border-t border-v3-line/70">
      {items.map((item, i) => (
        <AccordionPrimitive.Item
          key={i}
          value={`q-${i}`}
          className="group relative border-b border-v3-line/70 before:absolute before:inset-y-0 before:start-0 before:w-px before:origin-top before:scale-y-0 before:bg-v3-light before:transition-transform before:duration-500 data-[state=open]:before:scale-y-100"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="flex min-h-16 w-full items-center justify-between gap-6 py-6 text-start text-lg text-v3-bone transition-colors hover:text-v3-light md:text-xl group-data-[state=open]:ps-6">
              <span className="transition-[padding] duration-500">{item.q}</span>
              <Plus
                className="h-5 w-5 shrink-0 text-v3-light transition-transform duration-500 group-data-[state=open]:rotate-45"
                aria-hidden
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="max-w-3xl pb-8 ps-6 text-lg leading-relaxed text-v3-soft rtl:leading-loose">{item.a}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
