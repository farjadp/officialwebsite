"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { generateNPIOperatingSystem } from "@/lib/npi/excel-os-generator";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key_for_build");

export async function submitNPIPlanLead(payload: {
  leadData: { name: string; email: string; role?: string; agreed: boolean };
  answers: Record<string, string | string[]>;
}) {
  try {
    const { leadData, answers } = payload;

    try {
        await prisma.lead.upsert({
        where: {
            email_toolId: { email: leadData.email, toolId: "npi-plan" },
        },
        update: {
            name: leadData.name,
            score: 0,
            segment: leadData.role || "unknown",
            answers: answers as any, // Cast to any to store varying structure
        },
        create: {
            email: leadData.email,
            name: leadData.name,
            toolId: "npi-plan",
            score: 0,
            segment: leadData.role || "unknown",
            answers: answers as any,
        },
        });
    } catch (dbError) {
        console.error("Non-fatal: Failed to save to DB", dbError);
    }

    const formatAns = (id: string) => {
      const ans = answers[id];
      if (!ans) return "Not provided";
      if (Array.isArray(ans)) return ans.join(", ");
      return ans;
    };

    // No longer generating legacy emailText since we send directly via Telegram and Resend.
    
    // Generate Excel File
    const excelBuffer = await generateNPIOperatingSystem(leadData, answers);

    if (process.env.RESEND_API_KEY) {
      // 1. Email the user their result
      await resend.emails.send({
        from: "Farjad Pourmohammad <hello@verixa.io>", // Update to verified sending domain
        to: [leadData.email], // Directly sending lead to the user
        subject: `Your Personal Brand NPI Plan`,
        text: `Hi ${leadData.name.split(' ')[0]},\n\nYour personalized NPI Operating System is attached.\n\nBest,\nFarjad Pourmohammad`,
        attachments: [
          {
              filename: `${leadData.name.replace(/\s+/g, '_')}_NPI_Operating_System.xlsx`,
              content: excelBuffer,
          },
        ],
      });
      console.log("NPI Plan emailed to user via Resend successfully.");
    }
    
    // 2. Telegram the lead details to the admin
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    let telegramChatId = process.env.TELEGRAM_ADMIN_CHAT_ID?.trim() || process.env.TELEGRAM_CHAT_ID?.trim();
    
    // Check DB if not in ENV
    if (!telegramChatId) {
       const tgSetting = await prisma.appSetting.findUnique({ where: { key: 'TELEGRAM_CHAT_ID' } });
       telegramChatId = tgSetting?.value?.trim();
    }
    
    if (botToken && telegramChatId) {
      try {
        const tgText = `⚡ <b>New NPI Tool Lead</b>\n\n<b>Name:</b> ${leadData.name}\n<b>Email:</b> ${leadData.email}\n<b>Role:</b> ${leadData.role || 'N/A'}\n\n<b>Goal:</b> ${formatAns('q9')}\n<b>Challenge:</b> ${formatAns('q12')}`;
        
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: tgText,
            parse_mode: "HTML"
          })
        });
        console.log("Lead details sent via Telegram.");
      } catch (e) {
        console.error("Failed to send Telegram lead alert", e);
      }
    } else {
      console.warn("Skipped Telegram alert (Missing TELEGRAM_BOT_TOKEN or Chat ID).");
    }

    const base64Excel = excelBuffer.toString("base64");

    return {
      success: true,
      downloadBase64: base64Excel,
    };
  } catch (error) {
    console.error("Error in submitNPIPlanLead:", error);
    return {
      success: false,
      error: "Internal server error submitting lead.",
    };
  }
}
