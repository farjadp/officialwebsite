import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, telegram, social, stage, problem, why, deckUrl, deckName } = body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
    }

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

    const message = lines.join("\n");

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Telegram API error:", err);
      return NextResponse.json({ error: "Failed to send to Telegram" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lab apply error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
