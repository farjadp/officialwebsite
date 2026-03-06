// src/app/api/admin/ai-tools/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" });

const VAULT_SYSTEM_PROMPT = `
# Role
You are the "Chief Operating Officer" (COO) AI.
Your job is to create a high-value, downloadable asset (Lead Magnet) for the "Farjad Vault".

# Brand Voice
- Clinical, Action-Oriented, No Fluff.
- Do not write a "blog post". Write a functional tool/list.

# Execution
Create a structured list categorized by department (Sales, HR, Operations, Finance).
For each task, suggest the *exact* type of automation or AI tool to fix it.

# Output Format (Markdown)
## [Title based on the Topic]
*A system by Farjad.*

### 1. Finance & Admin
- [ ] **Invoice Data Entry:** (Stop typing data into Excel. Use OCR + Webhooks).
- [ ] **Expense Receipt Tracking:** (Stop hoarding paper. Use AI scanning).

... (Continue for all sections)

### Next Step
If you checked more than 10 boxes, your business is bleeding time. 
[Link to Strategy Call]
`;

const AUDIO_SYSTEM_PROMPT = `
# Role
You are the "Private Advisor" ghostwriter.
Your goal is to write a script for a 3-minute audio voice note (Telegram/Private Feed).

# The Voice (Crucial)
- Style: Spoken word, not written prose.
- Tone: "I just saw this and had to tell you." / "Here is the signal amidst the noise."
- Structure:
  1. The Hook: "Okay, quick note on [Topic]."
  2. The Context: "Everyone is hyping X, but here is what actually matters for your business."
  3. The Application: "If you run an agency, this means you can fire your scheduler."
  4. The Close: "Think about it. Talk soon."

# Formatting
- Use line breaks to indicate pauses.
- Use (parentheses) for tone instructions like (Sigh) or (Emphasis).
- Keep it under 400 words.
`;

export async function POST(req: NextRequest) {
    try {
        const { promptType, inputTopic } = await req.json();

        if (!inputTopic) {
            return NextResponse.json({ error: "Missing topic" }, { status: 400 });
        }

        let systemPrompt = "";
        let userMessage = "";

        if (promptType === "vault") {
            systemPrompt = VAULT_SYSTEM_PROMPT;
            userMessage = `Topic: "${inputTopic}"\nTarget Audience: Non-technical Business Owners in Canada.\nCreate a Checklist/Audit Document.`;
        } else if (promptType === "audio") {
            systemPrompt = AUDIO_SYSTEM_PROMPT;
            userMessage = `Topic: "${inputTopic}"\nWrite the script now based on this Input Topic.`;
        } else {
            return NextResponse.json({ error: "Invalid prompt type" }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
        });

        const result = completion.choices[0].message.content;
        return NextResponse.json({ success: true, text: result });
    } catch (error: unknown) {
        console.error("[AI Tools Error]", error);
        return NextResponse.json({ error: "Generation failed" }, { status: 500 });
    }
}
