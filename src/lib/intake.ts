// ============================================================================
// Startup Intake — server-side helpers (invite codes, validation)
// ============================================================================

import { randomInt } from "crypto"
import { prisma } from "@/lib/prisma"

// Alphabet without ambiguous characters (no I, L, O, 0, 1)
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
const CODE_PREFIX = "ASH-"
const CODE_LENGTH = 6

export function generateInviteCode(): string {
    let body = ""
    for (let i = 0; i < CODE_LENGTH; i++) {
        body += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
    }
    return CODE_PREFIX + body
}

export function normalizeInviteCode(raw: string): string {
    return raw.trim().toUpperCase()
}

export const INVITE_CODE_REGEX = /^ASH-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/

export type InviteValidation =
    | { valid: true; invite: { id: string; code: string; label: string | null } }
    | { valid: false; reason: "format" | "not_found" | "inactive" | "used_up" }

/** Validate an invite code against the DB. Does NOT consume a use. */
export async function validateInviteCode(raw: string): Promise<InviteValidation> {
    const code = normalizeInviteCode(raw || "")
    if (!INVITE_CODE_REGEX.test(code)) {
        return { valid: false, reason: "format" }
    }
    const invite = await prisma.intakeInvite.findUnique({ where: { code } })
    if (!invite) return { valid: false, reason: "not_found" }
    if (!invite.isActive) return { valid: false, reason: "inactive" }
    if (invite.usedCount >= invite.maxUses) return { valid: false, reason: "used_up" }
    return { valid: true, invite: { id: invite.id, code: invite.code, label: invite.label } }
}

export const INVITE_ERROR_FA: Record<Exclude<InviteValidation, { valid: true }>["reason"], string> = {
    format: "فرمت کد دعوت صحیح نیست.",
    not_found: "کد دعوت معتبر نیست.",
    inactive: "این کد دعوت غیرفعال شده است.",
    used_up: "این کد دعوت قبلاً استفاده شده است.",
}

// Allowed upload MIME types
export const INTAKE_ALLOWED_MIME = new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
])

export const INTAKE_MAX_FILE_BYTES = 20 * 1024 * 1024 // 20MB
