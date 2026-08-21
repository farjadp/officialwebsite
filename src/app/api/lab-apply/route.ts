import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, telegram, social, stage, problem, why, deckUrl, deckName } = body;

    if (!name || !email || !phone || !telegram || !stage || !problem || !why) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save first — this is the durable record, Telegram is just a notification.
    const application = await prisma.labApplication.create({
      data: {
        name,
        email,
        phone,
        telegram,
        social: social || null,
        stage,
        problem,
        why,
        deckUrl: deckUrl || null,
        deckName: deckName || null,
      },
    });

    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    let chatId = process.env.TELEGRAM_ADMIN_CHAT_ID?.trim() || process.env.TELEGRAM_CHAT_ID?.trim();

    // Fall back to the admin-configurable setting if no env var is set
    if (!chatId) {
      const tgSetting = await prisma.appSetting.findUnique({ where: { key: "TELEGRAM_CHAT_ID" } });
      chatId = tgSetting?.value?.trim();
    }

    let telegramOk = false;

    if (token && chatId) {
      const stageLabel: Record<string, string> = {
        idea: "💡 Idea",
        validation: "🔍 Validation",
        "pre-mvp": "⚙️ Pre-MVP",
      };

      const lines = [
        "🚀 *درخواست جدید — Founder Development Lab*",
        "━━━━━━━━━━━━━━━━━━━━━━",
        "",
        `👤 *نام:* ${name}`,
        `📧 *ایمیل:* ${email}`,
        `📱 *تلفن:* ${phone}`,
        `💬 *تلگرام:* ${telegram}`,
      ];

      if (social) lines.push(`🔗 *سوشیال:* ${social}`);

      lines.push(
        `📍 *مرحله:* ${stageLabel[stage] ?? stage}`,
        "",
        "📝 *مسئله / ایده:*",
        problem,
        "",
        "💬 *چرا این برنامه؟*",
        why
      );

      if (deckUrl) {
        lines.push("", `📎 *پیچ‌دک:* [${deckName || "دانلود فایل"}](${deckUrl})`);
      }

      lines.push(
        "",
        "━━━━━━━━━━━━━━━━━━━━━━",
        `🕐 ${new Date().toLocaleString("fa-IR", { timeZone: "America/Toronto" })}`
      );

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: lines.join("\n"),
            parse_mode: "Markdown",
            disable_web_page_preview: true,
          }),
        });
        telegramOk = res.ok;
        if (!res.ok) console.error("Telegram API error:", await res.json());
      } catch (err) {
        console.error("Telegram send failed:", err);
      }
    } else {
      console.error("[lab-apply] Telegram not configured (missing bot token or chat id) — application saved to DB only");
    }

    if (telegramOk !== application.telegramOk) {
      await prisma.labApplication.update({
        where: { id: application.id },
        data: { telegramOk },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lab apply error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
