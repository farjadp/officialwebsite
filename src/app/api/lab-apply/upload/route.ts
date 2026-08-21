// ============================================================================
// POST /api/lab-apply/upload — public pitch-deck upload for the Founder Lab form
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_BYTES = 20 * 1024 * 1024; // 20MB

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "") || "deck";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "فایلی انتخاب نشده است." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "حجم فایل باید کمتر از ۲۰ مگابایت باشد." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: "فقط PDF، PowerPoint یا Word قابل آپلود است." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `lab-apply/${uniqueSuffix}-${sanitizeFilename(file.name)}`;

    const { url } = await put(filename, buffer, {
      access: "public",
      contentType: file.type,
      token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url, name: file.name, size: file.size });
  } catch (error) {
    console.error("[lab-apply/upload] error:", error);
    return NextResponse.json(
      { error: "آپلود ناموفق بود. دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
