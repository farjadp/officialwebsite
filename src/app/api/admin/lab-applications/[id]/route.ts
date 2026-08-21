// ============================================================================
// /api/admin/lab-applications/[id] — update Lab Application status (admin only)
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const VALID_STATUSES = new Set(["NEW", "CONTACTED", "ARCHIVED"]);

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
  const { status } = await req.json();

  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await prisma.labApplication.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/lab-applications] update failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
