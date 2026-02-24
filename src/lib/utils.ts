// ============================================================================
// Hardware Source: utils.ts
// Version: 1.0.0 — 2026-02-24
// Why: Core utility / logic function
// Env / Identity: Shared Library
// ============================================================================

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
