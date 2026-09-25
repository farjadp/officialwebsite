"use client";

// ============================================================================
// File Path: src/app/(public)/resume/download-button.tsx
// Version: 3.0.0 — 2026-09-25
// Why: The resume's "Download PDF" — the browser's print-to-PDF, styled in
//      the v3 "Light" look (primary = the bone/light pill, outline = the
//      secondary outline). Never printed itself.
// Env / Identity: Client Component
// ============================================================================

import { Download } from "lucide-react";

interface DownloadResumeButtonProps {
  variant?: "primary" | "outline";
  /** Button text. The Persian resume passes its own; English is the default. */
  label?: string;
  className?: string;
}

const STYLES = {
  primary: "bg-v3-bone font-semibold text-v3-ink hover:-translate-y-0.5 hover:bg-v3-light",
  outline: "border border-v3-bone/60 font-medium text-v3-bone hover:border-v3-light hover:text-v3-light",
} as const;

export function DownloadResumeButton({ variant = "primary", label = "Download PDF", className }: DownloadResumeButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`group inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 py-2.5 text-sm transition-all duration-300 print:hidden ${STYLES[variant]} ${className ?? ""}`}
    >
      <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
      {label}
    </button>
  );
}
