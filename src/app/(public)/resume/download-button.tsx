"use client";

// ============================================================================
// Hardware Source: download-button.tsx
// Version: 1.0.0 — 2026-05-29
// Why: Client component for browser print-to-PDF download
// Env / Identity: Client Component
// ============================================================================

import { Download } from "lucide-react";

interface DownloadResumeButtonProps {
  variant?: "primary" | "outline";
}

export function DownloadResumeButton({ variant = "primary" }: DownloadResumeButtonProps) {
  const handleDownload = () => {
    window.print();
  };

  if (variant === "outline") {
    return (
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0F3F35] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#092822] transition-colors shadow-lg"
    >
      <Download className="w-3.5 h-3.5" />
      Download PDF
    </button>
  );
}
