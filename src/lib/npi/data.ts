export type QuestionType = 'single' | 'multiple' | 'text';

export interface QuestionDef {
  id: string; // e.g. "q1"
  step: 'narrative' | 'presence' | 'impact';
  question: string;
  type: QuestionType;
  options?: string[];
  maxSelections?: number;
  placeholder?: string;
  allowOther?: boolean;
}

export const npiQuestions: QuestionDef[] = [
  // ── STEP 2 — NARRATIVE ──
  {
    id: "q1",
    step: "narrative",
    question: "Who do you primarily help?",
    type: "single",
    allowOther: true,
    options: [
      "Entrepreneurs and startup founders",
      "Small and medium business owners",
      "Professionals and executives",
      "Freelancers and consultants",
      "Students and career changers"
    ]
  },
  {
    id: "q2",
    step: "narrative",
    question: "What is the main problem you solve for them?",
    type: "text",
    placeholder: "Example: They have great skills but no market visibility or clear strategy."
  },
  {
    id: "q3",
    step: "narrative",
    question: "What do you want to be known for?",
    type: "multiple",
    maxSelections: 3,
    allowOther: true,
    options: [
      "Strategic thinking",
      "Honest and practical advice",
      "Technical expertise",
      "Business growth and revenue",
      "Leadership and team building",
      "Innovation and creativity",
      "Community and culture"
    ]
  },
  {
    id: "q4",
    step: "narrative",
    question: "Choose 3 to 5 topics you want to own in your content:",
    type: "multiple",
    maxSelections: 5,
    options: [
      "Business strategy",
      "Startup and entrepreneurship",
      "Personal brand and visibility",
      "Leadership and management",
      "Technology and AI",
      "Finance and business model",
      "Marketing and sales",
      "Career and professional growth",
      "Immigrant entrepreneurship",
      "Execution and discipline"
    ]
  },

  // ── STEP 3 — PRESENCE ──
  {
    id: "q5",
    step: "presence",
    question: "Where is your audience?",
    type: "multiple",
    options: [
      "LinkedIn",
      "Instagram",
      "X (Twitter)",
      "YouTube",
      "TikTok",
      "Newsletter / Email",
      "Podcast",
      "In-person events and community"
    ]
  },
  {
    id: "q6",
    step: "presence",
    question: "How often can you realistically create content?",
    type: "single",
    options: [
      "Every day (aggressive mode)",
      "3–4 times per week (recommended)",
      "1–2 times per week (sustainable)",
      "A few times per month (starter)"
    ]
  },
  {
    id: "q7",
    step: "presence",
    question: "Which content formats fit you best?",
    type: "multiple",
    maxSelections: 3,
    options: [
      "Short text posts",
      "Long-form articles or essays",
      "Video (short or long)",
      "Newsletters",
      "Carousels or visual posts",
      "Podcasts or audio",
      "Case studies and stories",
      "Comments and conversations"
    ]
  },
  {
    id: "q8",
    step: "presence",
    question: "How consistent have you been with content in the past 3 months?",
    type: "single",
    options: [
      "Very consistent — I posted regularly",
      "Somewhat consistent — I posted sometimes",
      "Inconsistent — I started and stopped",
      "Not active — I am starting now"
    ]
  },

  // ── STEP 4 — IMPACT ──
  {
    id: "q9",
    step: "impact",
    question: "What is your primary goal from building your personal brand?",
    type: "single",
    options: [
      "Get more consulting or freelance clients",
      "Attract investors or partnerships",
      "Get speaking invitations",
      "Build a community or audience",
      "Find a better job or career opportunity",
      "Launch and sell a product or service",
      "Become a recognized thought leader"
    ]
  },
  {
    id: "q10",
    step: "impact",
    question: "What does success look like for you in 90 days?",
    type: "text",
    placeholder: "Example: 5 qualified leads per month and 2 speaking invitations."
  },
  {
    id: "q11",
    step: "impact",
    question: "How do you currently track whether your brand is working?",
    type: "single",
    options: [
      "I track followers and likes",
      "I track inbound leads and opportunities",
      "I track conversations and relationships",
      "I do not track anything yet",
      "I track revenue influenced by my brand"
    ]
  },
  {
    id: "q12",
    step: "impact",
    question: "What is your biggest challenge with personal branding right now?",
    type: "single",
    options: [
      "I do not know what to say or stand for",
      "I do not show up consistently enough",
      "I get attention but no real results",
      "I do not have time",
      "I do not know which platform to focus on",
      "I am starting from zero"
    ]
  }
];
