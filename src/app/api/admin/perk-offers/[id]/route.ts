// ============================================================================
// /api/admin/perk-offers/[id] — update a perk offer's status (admin only)
// Mirrors the lab-applications route: same auth guard, same shape.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PERK_STATUSES } from "@/lib/perk-offer";

const VALID_STATUSES = new Set<string>(PERK_STATUSES);

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = session.user.role;
  if (role !== "OWNER" && role !== "EDITOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;

  let status: unknown;
  try {
    ({ status } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof status !== "string" || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await prisma.perkOffer.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/perk-offers] update failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
