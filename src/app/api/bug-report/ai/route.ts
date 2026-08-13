import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy" })

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { currentUrl } = body

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ 
                guess: "به نظر می‌رسد مشکلی در این صفحه رخ داده است. متأسفانه در حال حاضر هوش مصنوعی غیرفعال است، اما شما می‌توانید مشکل خود را برای ما بنویسید." 
            })
        }

        const prompt = `
You are a helpful AI assistant integrated into a web application's Bug Reporting system.
The user just clicked "Report Bug" while they were on this URL: ${currentUrl}

Based on this URL, make a highly educated, specific, and brief guess (1 or 2 sentences) about what their problem might be. 
Write the response IN PERSIAN (Farsi).
Be friendly and ask if this is their issue.

Examples:
- If url contains "/profile/startup-intake": "به نظر می‌رسد در صفحه ثبت استارتاپ هستید. آیا در آپلود فایل یا ذخیره فرم مشکلی پیش آمده است؟"
- If url contains "/login": "به نظر می‌رسد در ورود به سیستم مشکل دارید. آیا رمز عبور خود را فراموش کرده‌اید یا خطایی دریافت می‌کنید؟"
- Otherwise: "به نظر می‌رسد در این صفحه با مشکلی مواجه شده‌اید. آیا بخشی از صفحه به درستی کار نمی‌کند؟"

Do not explain yourself, just output the Persian text.
`

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            max_tokens: 150,
        })

        const guess = response.choices[0].message.content?.trim() || "آیا در این بخش با مشکلی روبرو شدید؟"

        return NextResponse.json({ guess })
    } catch (error) {
        console.error("[BUG_REPORT_AI_ERROR]", error)
        return NextResponse.json(
            { guess: "متأسفانه در پردازش درخواست شما توسط هوش مصنوعی خطایی رخ داد. لطفاً مشکل خود را در کادر زیر بنویسید." },
            { status: 200 } // Send 200 so the UI can still gracefully degrade to the text box
        )
    }
}
