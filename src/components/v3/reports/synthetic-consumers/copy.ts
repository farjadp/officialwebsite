// ============================================================================
// File Path: src/components/v3/reports/synthetic-consumers/copy.ts
// Why: Every word of report 10 in both locales, one structure for both.
//      Built on Maier et al. (2025), arXiv:2510.08338 — a preprint by
//      PyMC Labs and Colgate-Palmolive authors, licensed CC BY 4.0. Its
//      figures are quoted exactly and credited; its limits (preprint,
//      private data, anchors tuned on the same 57 surveys, one product
//      domain, two models) are stated as prominently as its results. The
//      founder angle is ours and labelled as such.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { Method } from "./data"

export type MedalKey = "ssr" | "methods" | "ceiling" | "persona" | "game"

type Copy = {
  hero: {
    kicker: string
    lead: string
    byline: string
    status: string
    kpis: { n: string; l: string; d: string }[]
    medals: string
    scope: { title: string; body: string }
  }
  ssr: {
    kicker: string
    title: string
    lead: string
    steps: { t: string; b: string }[]
    examples: Record<"probably" | "unsure" | "unlikely", { label: string; text: string; source: string }>
    anchors: string[]
    simLabel: string
    pmfLabel: string
    meanLabel: (v: string) => string
    tempLabel: string
    epsLabel: string
    reset: string
    note: string
  }
  methods: {
    kicker: string
    title: string
    lead: string
    names: Record<Method, { t: string; b: string }>
    rho: string
    k: string
    caption: string
    body: string[]
  }
  ceiling: {
    kicker: string
    title: string
    lead: string
    explain: string[]
    bars: { lightgbm: string; flr: string; ssr: string; noDem: string; human: string }
    caption: string
    callout: { title: string; body: string }
  }
  persona: {
    kicker: string
    title: string
    lead: string
    withD: string
    withoutD: string
    rho: string
    k: string
    body: string
    callout: { title: string; body: string }
  }
  mirror: {
    kicker: string
    title: string
    lead: string
    yesTitle: string
    noTitle: string
    items: Record<"age" | "income" | "category" | "source" | "price" | "gender" | "region" | "ethnicity", string>
    note: string
  }
  game: {
    kicker: string
    title: string
    lead: string
    quotes: Record<string, string>
    human: string
    ai: string
    right: string
    wrong: string
    wasHuman: string
    wasAi: string
    progress: (i: string, n: string) => string
    next: string
    done: (s: string, n: string) => string
    again: string
    lesson: string
    translated: string
  }
  founders: { kicker: string; title: string; lead: string; doTitle: string; dontTitle: string; dos: string[]; donts: string[] }
  notes: { kicker: string; title: string; items: { t: string; b: string }[] }
  medals: { title: string; hint: string; names: Record<MedalKey, string>; complete: string; open: string; close: string }
  method: { sourcesTitle: string; sources: { label: string; href: string }[]; credit: string }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

const SOURCES = [
  {
    label: "Maier, Aslak, Fiaschi, Rismal, Fletcher, Luhmann, Dow, Pappas & Wiecki (2025). LLMs Reproduce Human Purchase Intent via Semantic Similarity Elicitation of Likert Ratings. arXiv:2510.08338 v3 (preprint)",
    href: "https://arxiv.org/abs/2510.08338",
  },
  { label: "The paper, PDF (CC BY 4.0)", href: "https://arxiv.org/pdf/2510.08338" },
  { label: "Code: pymc-labs/semantic-similarity-rating (GitHub, Apache-2.0)", href: "https://github.com/pymc-labs/semantic-similarity-rating" },
  { label: "Heath & Alexander (2026). Correcting Mode Collapse in Silicon Sampling with Semantic Similarity Rating. arXiv:2607.28550 (independent test)", href: "https://arxiv.org/abs/2607.28550" },
  { label: "Vera Pichardo (2026). Measuring Self-Rating Bias in LLM-Generated Survey Data. arXiv:2602.13862", href: "https://arxiv.org/abs/2602.13862" },
  { label: "PyMC Labs blog post announcing the results (Oct 2025)", href: "https://www.pymc-labs.com/blog-posts/AI-based-Customer-Research" },
]

export const COPY: Record<Locale, Copy> = {
  en: {
    hero: {
      kicker: "Reports",
      lead: "Ask an AI to rate a product from 1 to 5 and it plays it safe: almost every answer is a 3. Let it answer in its own words, then measure how close those words sit to five reference sentences, and the picture changes. In 57 real product surveys with 9,300 people, shown the same product slides and given each person's profile, that trick brought AI “shoppers” to about 90% of the agreement a repeat human survey reaches. Here is how it works, and what it does not prove.",
      byline: "Based on Maier et al. (2025), PyMC Labs and Colgate-Palmolive. Figures are the paper's; the founder angle is ours.",
      status: "A preprint on arXiv (v3, October 2025), not yet peer-reviewed.",
      kpis: [
        { n: "57", l: "real product surveys", d: "9,300 US respondents, personal care" },
        { n: "0.26 → 0.88", l: "distribution match", d: "asking for a number vs SSR (GPT-4o)" },
        { n: "≈90%", l: "of the human ceiling", d: "how well product rankings were recovered" },
        { n: "15%", l: "without a persona", d: "ranking recovered, Gemini, no demographics" },
      ],
      medals: "Each interactive figure awards a badge the first time you use it. There are five.",
      scope: {
        title: "What was tested, and by whom",
        body: "Two models (GPT-4o and Gemini 2.0 Flash) played 9,300 survey respondents, one per real person, each given that person's age, gender, region and, where known, income. They saw the same product-concept slides as the people did and were asked how likely they were to buy. The surveys were for personal-care product concepts in the US, supplied by “a leading corporation in that market”, which the paper does not name; seven authors are from PyMC Labs, which has promoted a synthetic-consumer product, and two from Colgate-Palmolive. The survey data is not public.",
      },
    },
    ssr: {
      kicker: "1 · The trick",
      title: "Let it talk, then measure the words",
      lead: "Semantic similarity rating (SSR) never asks the model for a number. It turns the model's sentence into a spread of likely ratings. Try the arithmetic.",
      steps: [
        { t: "Ask in words", b: "The synthetic shopper answers freely: “I'd probably buy it, the price isn't too bad.”" },
        { t: "Embed", b: "That answer and five reference sentences, one per rating, become vectors (OpenAI's text-embedding-3-small)." },
        { t: "Compare", b: "Cosine similarity says how close the answer is to each reference." },
        { t: "Spread", b: "Subtract the smallest similarity and normalise: the result is a probability for each of 1 to 5, not a single number." },
      ],
      examples: {
        probably: { label: "“I'd probably buy it…”", text: "I'd probably buy it. I like that it's easy to use and I can take it with me. Plus, the price isn't too bad.", source: "the paper's own example" },
        unsure: { label: "“Somewhat interested…”", text: "I'm somewhat interested. If it works well and isn't too expensive, I might give it a try.", source: "from the paper's Figure 1" },
        unlikely: { label: "“Not for me…”", text: "Not for me. It sounds expensive and I'm happy with what I use now.", source: "our example, in the same style" },
      },
      anchors: ["I definitely wouldn't buy it.", "It's rather unlikely I'd buy it.", "I'm not sure whether I'd buy it.", "I'd probably buy it.", "It's very likely I'd buy it."],
      simLabel: "Similarity to each reference sentence",
      pmfLabel: "Resulting rating distribution",
      meanLabel: (v) => `Expected rating ${v}`,
      tempLabel: "Spread (T)",
      epsLabel: "Floor (ε)",
      reset: "Paper's settings",
      note: "Illustration: the similarity values are invented to show how the mapping behaves, not what the embedding model returns. The formula is the paper's (Eq. 8–9); its experiments use ε = 0, T = 1, and average six sets of reference sentences. The reference sentences here are examples, not the paper's.",
    },
    methods: {
      kicker: "2 · Three ways to ask",
      title: "A number, a number after a sentence, or a spread",
      lead: "The authors compared three ways of getting a rating out of the same synthetic shoppers. Switch models to see both.",
      names: {
        dlr: { t: "Direct rating", b: "Reply with 1, 2, 3, 4 or 5." },
        flr: { t: "Sentence, then rating", b: "Answer in words; the same model, told to be a “Likert rating expert”, turns it into one number." },
        ssr: { t: "Semantic similarity (SSR)", b: "Answer in words; the words become a spread over 1–5." },
      },
      rho: "Ranking recovered (% of human ceiling)",
      k: "Distribution match (KS similarity, 0–1)",
      caption: "Full demographics, image stimulus, temperature 0.5; SSR averaged over six reference sets. Source: Maier et al. (2025), Table 1.",
      body: [
        "Asked for a number, both models retreated to the middle: mostly 3s, almost never a 1 or a 5, while real people mostly answered 4 or 5. Their product rankings were still decent (about 80% of the ceiling), but the distributions looked nothing like a real panel.",
        "SSR fixed the shape and kept the ranking. With GPT-4o it matched the real distributions at 0.88 and reached 90% of the ceiling, the best of the three. With Gemini the picture is mixed: “sentence, then rating” actually ranked slightly better (92.1% against SSR's 90.6%), but its distributions were further off (0.59 against 0.80). The abstract's “KS similarity > 0.85” describes GPT-4o.",
        "One condition matters: these numbers use the product image. With a text-only description, SSR fell to 82.5% (GPT-4o) and 73.0% (Gemini), and plain direct rating with GPT-4o reached 89.6%, higher than SSR. So the advantage is about the shape of the answers more than about ranking.",
      ],
    },
    ceiling: {
      kicker: "3 · What “90%” means",
      title: "Measured against a repeat survey, not against perfection",
      lead: "Real panels are noisy, and these 57 products were rated very similarly (average 4.0 out of 5). So the authors asked: how well would a second group of real people agree with the first?",
      explain: [
        "They split each survey's respondents in half at random, 2,000 times, and correlated the two halves' average ratings. That correlation is the ceiling: the most any method could hope to match.",
        "“Correlation attainment” is the synthetic panel's correlation with real people divided by that ceiling. 90% means the AI panel's rankings correlated with people's about nine-tenths as strongly as two random halves of the people correlated with each other. It is not “90% accurate”.",
      ],
      bars: { lightgbm: "LightGBM trained on half the surveys", flr: "Sentence, then rating", ssr: "SSR", noDem: "SSR without a persona (Gemini)", human: "A repeat human panel" },
      caption: "First four rows: GPT-4o, temperature 0.5, image stimulus, measured on held-out halves of 29 surveys over 300 random splits (Appendix D). Persona row: Gemini 2.0 Flash, all 57 surveys, averaged reference sets (Table 1). Source: Maier et al. (2025).",
      callout: {
        title: "Beating a model that saw the answers",
        body: "A classic machine-learning model (LightGBM), trained on half the surveys with eight features (demographics plus product category, price tier and source, but never the concept itself), reached 65% on the other half. The language models, which saw no survey answers but did see the concept, reached 83–88% on the same halves. The authors read this as the models using what the concept says; the comparison also gives the models information LightGBM never had.",
      },
    },
    persona: {
      kicker: "4 · Who is answering matters",
      title: "Take away the persona and the ranking collapses",
      lead: "Remove every demographic detail from the prompt and something odd happens. Switch to see it.",
      withD: "With a persona",
      withoutD: "Without",
      rho: "Ranking recovered",
      k: "Distribution match",
      body: "Without age, income or anything else, Gemini's synthetic shoppers produced distributions that looked even more like the real ones (0.91), averaging about 4.1 against the real 4.0. But they liked almost everything, and their ranking of products fell to 15.5% of the ceiling, against 90.6% with personas (averaged reference sets; the paper's text quotes its best single sets, 50% against 92%).",
      callout: {
        title: "Looking right is not being right",
        body: "A synthetic panel can reproduce the shape of human answers while carrying almost no information about which product is better. The authors' conclusion: without a detailed persona, the model rates everything positively and stops using what is in the concept.",
      },
    },
    mirror: {
      kicker: "5 · Who it imitates well",
      title: "Some groups came through, others did not",
      lead: "Splitting the results by respondent and product features shows where the synthetic shoppers behaved like people.",
      yesTitle: "Mirrored reasonably well",
      noTitle: "Not reliably mirrored",
      items: {
        age: "Age: middle-aged people liked the products most, younger and older less (GPT-4o followed the curve; Gemini only for the young)",
        income: "Income: people describing money trouble were less keen",
        category: "Product category: the same categories scored highest and lowest",
        source: "Concept source: both rated concepts from one of the two sources lower",
        price: "Price tier: cheapest tier lowest for both",
        gender: "Gender",
        region: "US region",
        ethnicity: "Ethnicity (recorded in only nine surveys)",
      },
      note: "The authors' warning: persona conditioning is not yet a reliable proxy for every subgroup, so treat subgroup results from synthetic panels with caution.",
    },
    game: {
      kicker: "6 · Your turn",
      title: "Human or synthetic?",
      lead: "Eight comments from the study's appendix. Some were written by real respondents, some by the AI shoppers. Guess which.",
      quotes: {
        good: "It's good.",
        ease: "The ease of use and […] safety are appealing, but I'd want to know more about its effectiveness and any potential side effects.",
        steps: "Not much, just the steps and how it tells you what it was for.",
        highend: "It seems a bit too high-end for my needs and budget.",
        bougie: "Seems kinda bougie for [this kind of product].",
        inexpensive: "Inexpensive and affordable. New & light. [Application] from your own home.",
        microbiome: "Sounds expensive, and I'm not sure I buy all that ‘microbiome’ talk. I'll stick with what I know.",
        trusted: "The ease of use and the promise of no […] sensitivity are appealing. Plus, it's from a trusted brand.",
      },
      human: "A person",
      ai: "The AI",
      right: "Right",
      wrong: "Not this time",
      wasHuman: "A real respondent wrote this.",
      wasAi: "A synthetic shopper wrote this.",
      progress: (i, n) => `Comment ${i} of ${n}`,
      next: "Next",
      done: (s, n) => `${s} of ${n}`,
      again: "Play again",
      lesson: "The paper's point: real respondents' comments were mostly short, while the synthetic ones explained their reasons and named their doubts. Square brackets are the authors' redactions.",
      translated: "",
    },
    founders: {
      kicker: "7 · For founders",
      title: "What this does and does not let you do",
      lead: "Our reading, not the paper's claim: a cheap first filter for ideas, not a replacement for customers.",
      doTitle: "Reasonable",
      dontTitle: "Not supported by this study",
      dos: [
        "Screen many early concepts cheaply and send only the promising ones to real people, the use the authors themselves suggest.",
        "Read the synthetic comments for objections you had not thought of.",
        "Give every synthetic respondent a realistic persona; without one the signal disappears.",
        "Validate on a few real surveys of your own before trusting the ranking.",
      ],
      donts: [
        "Skip real customer research for a launch or a price decision.",
        "Trust results for a product category the models know little about; the authors warn SSR will not conjure preferences where training data is thin.",
        "Read subgroup results (by gender, region, ethnicity) as real.",
        "Assume the paper's reference sentences work for your survey: they were tuned on these 57 surveys.",
      ],
    },
    notes: {
      kicker: "Read it carefully",
      title: "Eight cautions",
      items: [
        { t: "A preprint", b: "Posted on arXiv; not yet peer-reviewed." },
        { t: "Industry authors, private data", b: "Seven authors are from PyMC Labs, which promoted the results and a “Synthetic Consumers” platform when the paper came out, and two from Colgate-Palmolive. The paper does not name the data provider and the data is not public; the SSR code is (Apache-2.0)." },
        { t: "What others found", b: "An independent test on US political surveys (Heath & Alexander, 2026) found SSR made the spread of answers much more realistic but did not fix the models' bias towards extreme opinions. A second study (Vera Pichardo, 2026) found direct LLM scoring matched human ratings more often than SSR, and valued SSR for independence, not accuracy." },
        { t: "Tuned on the test", b: "The reference sentences were manually optimised for these same 57 surveys, so how well they transfer to other surveys is unknown, as the authors say." },
        { t: "One domain, one country", b: "US personal-care concepts. The authors expect it to work where models have read many human discussions of a product type, and not elsewhere." },
        { t: "Two models", b: "GPT-4o and Gemini 2.0 Flash, with OpenAI's text-embedding-3-small; results depend on the embedding model." },
        { t: "Intent is not purchase", b: "The benchmark is what people said they would buy, not what they bought." },
        { t: "Image, persona, one setting", b: "The ≈90% needs the product image and a demographic persona. With text only it fell to 73–83%; without personas, to 15.5%. The products also averaged 4.0 with very little spread (SD 0.1 in one part of the paper, 0.2 in another), which is why the ceiling, not a perfect score, is the yardstick." },
      ],
    },
    medals: {
      title: "Survey-lab badges",
      hint: "One for each interactive figure.",
      names: { ssr: "Embedder", methods: "Method tester", ceiling: "Ceiling finder", persona: "Persona keeper", game: "Turing judge" },
      complete: "All five. You now know more about synthetic survey panels than most people selling them.",
      open: "Your badges",
      close: "Close",
    },
    method: {
      sourcesTitle: "Sources",
      sources: SOURCES,
      credit: "All figures are from Maier et al. (2025), arXiv:2510.08338 v3, licensed CC BY 4.0, quoted exactly; charts are redrawn from its tables. The SSR playground uses the paper's formula with illustrative inputs. The founder section, the framing and any errors are ours, not the authors'.",
    },
    colophon: {
      shareTitle: "The Synthetic Shopper — can AI stand in for a consumer panel?",
      disclaimer: "A summary of a preprint for a general audience. It is not the authors' text; read the paper for the full method and results.",
      cta: "Book a session",
    },
  },
  fa: {
    hero: {
      kicker: "گزارش‌ها",
      lead: "از هوش مصنوعی بخواه به یک محصول از ۱ تا ۵ نمره بدهد؛ محافظه‌کاری می‌کند و تقریباً همیشه ۳ می‌گوید. اما بگذار با کلمات خودش جواب بدهد، بعد بسنج آن کلمات چقدر به پنج جمله‌ی مرجع نزدیک‌اند، و تصویر عوض می‌شود. در ۵۷ نظرسنجی واقعی محصول با ۹٬۳۰۰ نفر، با همان اسلایدهای محصول و مشخصات هر آدم، این ترفند «خریداران» هوش مصنوعی را به حدود ۹۰٪ توافقی رساند که یک نظرسنجی تکراری با آدم‌ها به آن می‌رسد. این‌جا می‌بینی چطور کار می‌کند، و چه چیزی را ثابت نمی‌کند.",
      byline: "بر اساس مقاله‌ی مایر و همکاران (۲۰۲۵)، PyMC Labs و کلگیت-پامولیو. عددها از مقاله‌اند؛ زاویه‌ی بنیان‌گذاران از ماست.",
      status: "پیش‌انتشار در arXiv (نسخه‌ی ۳، اکتبر ۲۰۲۵)؛ هنوز داوری نشده.",
      kpis: [
        { n: "۵۷", l: "نظرسنجی واقعی محصول", d: "۹٬۳۰۰ پاسخ‌دهنده‌ی آمریکایی، محصولات مراقبت شخصی" },
        { n: "۰٫۲۶ → ۰٫۸۸", l: "شباهت توزیع پاسخ‌ها", d: "پرسیدن عدد در برابر SSR (GPT-4o)" },
        { n: "≈۹۰٪", l: "از سقف انسانی", d: "بازسازی رتبه‌بندی محصولات" },
        { n: "۱۵٪", l: "بدون پرسونا", d: "بازسازی رتبه‌بندی، Gemini، بدون اطلاعات جمعیتی" },
      ],
      medals: "هر نمودار تعاملی بار اولی که با آن کار کنی یک نشان می‌دهد. پنج نشان در این صفحه هست.",
      scope: {
        title: "چه چیزی آزمایش شد و توسط چه کسی",
        body: "دو مدل (GPT-4o و Gemini 2.0 Flash) نقش ۹٬۳۰۰ پاسخ‌دهنده را بازی کردند، برای هر آدم واقعی یکی، با سن، جنسیت، منطقه و در صورت وجود درآمدِ همان آدم. همان اسلایدهای معرفی محصول را دیدند که آدم‌ها دیده بودند و پرسیده شد چقدر احتمال دارد بخرند. نظرسنجی‌ها درباره‌ی ایده‌های محصولات مراقبت شخصی در آمریکا بود و «یک شرکت پیشرو در همین بازار» آن‌ها را داده که مقاله نامش را نمی‌برد؛ هفت نویسنده از PyMC Labs هستند که یک محصول «مصرف‌کننده‌ی مصنوعی» را تبلیغ کرده، و دو نفر از کلگیت-پامولیو. داده‌ی نظرسنجی‌ها عمومی نیست.",
      },
    },
    ssr: {
      kicker: "۱ · ترفند",
      title: "بگذار حرف بزند، بعد کلماتش را بسنج",
      lead: "رتبه‌دهی با شباهت معنایی (SSR) هیچ‌وقت از مدل عدد نمی‌خواهد. جمله‌ی مدل را به پخشی از نمره‌های محتمل تبدیل می‌کند. حسابش را امتحان کن.",
      steps: [
        { t: "با کلمات بپرس", b: "خریدار مصنوعی آزادانه جواب می‌دهد: «احتمالاً می‌خرمش، قیمتش هم بد نیست.»" },
        { t: "به بردار تبدیل کن", b: "آن جواب و پنج جمله‌ی مرجع، یکی برای هر نمره، به بردار تبدیل می‌شوند (مدل text-embedding-3-small از OpenAI)." },
        { t: "مقایسه کن", b: "شباهت کسینوسی نشان می‌دهد جواب چقدر به هر مرجع نزدیک است." },
        { t: "پخش کن", b: "کمترین شباهت را کم کن و نرمال کن: نتیجه احتمالی برای هر نمره از ۱ تا ۵ است، نه یک عدد." },
      ],
      examples: {
        probably: { label: "«احتمالاً می‌خرمش…»", text: "احتمالاً می‌خرمش. خوشم می‌آید که استفاده‌اش ساده است و می‌توانم همراهم ببرم. قیمتش هم بد نیست.", source: "مثال خود مقاله، ترجمه" },
        unsure: { label: "«تا حدی علاقه‌مندم…»", text: "تا حدی علاقه‌مندم. اگر خوب کار کند و خیلی گران نباشد، شاید امتحانش کنم.", source: "از شکل ۱ مقاله، ترجمه" },
        unlikely: { label: "«به کارم نمی‌آید…»", text: "به کارم نمی‌آید. گران به نظر می‌رسد و از چیزی که الان استفاده می‌کنم راضی‌ام.", source: "مثال ما، به همان سبک" },
      },
      anchors: ["قطعاً نمی‌خرمش.", "بعید است بخرمش.", "مطمئن نیستم بخرمش یا نه.", "احتمالاً می‌خرمش.", "خیلی احتمال دارد بخرمش."],
      simLabel: "شباهت به هر جمله‌ی مرجع",
      pmfLabel: "توزیع نمره‌ی حاصل",
      meanLabel: (v) => `نمره‌ی مورد انتظار ${v}`,
      tempLabel: "پخش (T)",
      epsLabel: "کف (ε)",
      reset: "تنظیمات مقاله",
      note: "تصویرسازی: مقادیر شباهت ساختگی‌اند تا رفتار نگاشت را نشان دهند، نه چیزی که مدل امبدینگ برمی‌گرداند. فرمول از مقاله است (معادله‌ی ۸ و ۹)؛ آزمایش‌هایش ε = ۰ و T = ۱ دارند و میانگین شش مجموعه جمله‌ی مرجع را می‌گیرند. جمله‌های مرجع این‌جا نمونه‌اند، نه جمله‌های مقاله.",
    },
    methods: {
      kicker: "۲ · سه راه پرسیدن",
      title: "یک عدد، یک عدد بعد از یک جمله، یا یک پخش",
      lead: "نویسندگان سه راه گرفتن نمره از همان خریداران مصنوعی را مقایسه کردند. مدل را عوض کن تا هر دو را ببینی.",
      names: {
        dlr: { t: "نمره‌ی مستقیم", b: "با ۱، ۲، ۳، ۴ یا ۵ جواب بده." },
        flr: { t: "جمله، بعد نمره", b: "با کلمات جواب بده؛ همان مدل، با نقش «کارشناس مقیاس لیکرت»، آن را به یک عدد تبدیل می‌کند." },
        ssr: { t: "شباهت معنایی (SSR)", b: "با کلمات جواب بده؛ کلمات به پخشی روی ۱ تا ۵ تبدیل می‌شوند." },
      },
      rho: "بازسازی رتبه‌بندی (٪ از سقف انسانی)",
      k: "شباهت توزیع (شباهت KS، ۰ تا ۱)",
      caption: "با اطلاعات جمعیتی کامل، محرک تصویری، دمای ۰٫۵؛ SSR میانگین شش مجموعه‌ی مرجع. منبع: مایر و همکاران (۲۰۲۵)، جدول ۱.",
      body: [
        "وقتی عدد خواسته شد، هر دو مدل به وسط پناه بردند: بیشتر ۳، تقریباً هیچ‌وقت ۱ یا ۵، در حالی که آدم‌های واقعی بیشتر ۴ یا ۵ دادند. رتبه‌بندی محصولاتشان هنوز بد نبود (حدود ۸۰٪ سقف)، اما توزیع‌ها هیچ شباهتی به یک پنل واقعی نداشتند.",
        "SSR شکل را درست کرد و رتبه‌بندی را هم نگه داشت. با GPT-4o شباهت توزیع به ۰٫۸۸ و ۹۰٪ سقف رسید، بهترینِ این سه روش. با Gemini تصویر مخلوط است: «جمله، بعد نمره» کمی بهتر رتبه‌بندی کرد (۹۲٫۱٪ در برابر ۹۰٫۶٪ برای SSR)، اما توزیع‌هایش دورتر بود (۰٫۵۹ در برابر ۰٫۸۰). عبارت «شباهت KS بیش از ۰٫۸۵» در چکیده‌ی مقاله مربوط به GPT-4o است.",
        "یک شرط مهم است: این عددها با تصویر محصول به دست آمده‌اند. با توضیح متنی بدون تصویر، SSR به ۸۲٫۵٪ (GPT-4o) و ۷۳٫۰٪ (Gemini) افتاد و نمره‌ی مستقیم ساده با GPT-4o به ۸۹٫۶٪ رسید، بالاتر از SSR. پس برتری روش بیشتر در شکل پاسخ‌هاست تا در رتبه‌بندی.",
      ],
    },
    ceiling: {
      kicker: "۳ · «۹۰٪» یعنی چه",
      title: "در برابر یک نظرسنجی تکراری سنجیده شده، نه در برابر کمال",
      lead: "پنل‌های واقعی پرنویزند و این ۵۷ محصول نمره‌های خیلی نزدیکی گرفتند (میانگین ۴٫۰ از ۵). پس نویسندگان پرسیدند: یک گروه دوم از آدم‌های واقعی چقدر با گروه اول هم‌نظر می‌شد؟",
      explain: [
        "پاسخ‌دهنده‌های هر نظرسنجی را ۲٬۰۰۰ بار تصادفی نصف کردند و میانگین نمره‌ی دو نیمه را همبسته کردند. این همبستگی سقف است: بیشترین چیزی که هر روشی می‌تواند امید داشته باشد به آن برسد.",
        "«دستیابی به همبستگی» یعنی همبستگی پنل مصنوعی با آدم‌های واقعی تقسیم بر همین سقف. ۹۰٪ یعنی همبستگی رتبه‌بندی پنل هوش مصنوعی با آدم‌ها حدود نه‌دهمِ همبستگی دو نیمه‌ی تصادفی خود آدم‌ها با هم بود. یعنی «۹۰٪ دقت» نیست.",
      ],
      bars: { lightgbm: "LightGBM آموزش‌دیده روی نیمی از نظرسنجی‌ها", flr: "جمله، بعد نمره", ssr: "SSR", noDem: "SSR بدون پرسونا (Gemini)", human: "یک پنل انسانی تکراری" },
      caption: "چهار ردیف اول: GPT-4o، دمای ۰٫۵، محرک تصویری، روی نیمه‌های کنارگذاشته‌ی ۲۹ نظرسنجی در ۳۰۰ تقسیم تصادفی (پیوست D). ردیف پرسونا: Gemini 2.0 Flash، هر ۵۷ نظرسنجی، میانگین مجموعه‌های مرجع (جدول ۱). منبع: مایر و همکاران (۲۰۲۵).",
      callout: {
        title: "بهتر از مدلی که جواب‌ها را دیده بود",
        body: "یک مدل کلاسیک یادگیری ماشین (LightGBM) که روی نیمی از نظرسنجی‌ها با هشت ویژگی آموزش دیده بود (اطلاعات جمعیتی به‌اضافه‌ی دسته، رده‌ی قیمت و منبع محصول، اما هرگز خودِ ایده)، روی نیمه‌ی دیگر به ۶۵٪ رسید. مدل‌های زبانی که هیچ پاسخ نظرسنجی ندیده بودند اما خود ایده را دیده بودند، روی همان نیمه‌ها به ۸۳ تا ۸۸٪ رسیدند. نویسندگان این را نشانه‌ی استفاده از محتوای ایده می‌دانند؛ البته این مقایسه به مدل‌های زبانی اطلاعاتی می‌دهد که LightGBM هرگز نداشت.",
      },
    },
    persona: {
      kicker: "۴ · مهم است چه کسی جواب می‌دهد",
      title: "پرسونا را بردار، رتبه‌بندی فرو می‌ریزد",
      lead: "همه‌ی جزئیات جمعیتی را از پرامپت حذف کن تا اتفاق عجیبی بیفتد. جابه‌جا کن تا ببینی.",
      withD: "با پرسونا",
      withoutD: "بدون پرسونا",
      rho: "بازسازی رتبه‌بندی",
      k: "شباهت توزیع",
      body: "بدون سن، درآمد یا هر چیز دیگری، خریداران مصنوعی Gemini توزیع‌هایی ساختند که حتی شبیه‌تر به واقعی بود (۰٫۹۱)، با میانگین حدود ۴٫۱ در برابر ۴٫۰ واقعی. اما تقریباً از همه چیز خوششان آمد و رتبه‌بندی محصولاتشان به ۱۵٫۵٪ سقف افتاد، در برابر ۹۰٫۶٪ با پرسونا (میانگین مجموعه‌های مرجع؛ متن مقاله بهترین مجموعه‌ها را نقل می‌کند، ۵۰٪ در برابر ۹۲٪).",
      callout: {
        title: "درست به نظر رسیدن یعنی درست بودن نیست",
        body: "یک پنل مصنوعی می‌تواند شکل پاسخ‌های انسانی را بازسازی کند و هم‌زمان تقریباً هیچ اطلاعاتی درباره‌ی این‌که کدام محصول بهتر است نداشته باشد. نتیجه‌گیری نویسندگان: بدون پرسونای دقیق، مدل به همه چیز نمره‌ی مثبت می‌دهد و از محتوای ایده استفاده نمی‌کند.",
      },
    },
    mirror: {
      kicker: "۵ · چه کسی را خوب تقلید می‌کند",
      title: "بعضی گروه‌ها درست درآمدند، بعضی نه",
      lead: "تفکیک نتایج بر اساس ویژگی‌های پاسخ‌دهنده و محصول نشان می‌دهد خریداران مصنوعی کجا مثل آدم‌ها رفتار کردند.",
      yesTitle: "تا حد خوبی بازتاب داده شد",
      noTitle: "به‌طور قابل اتکا بازتاب داده نشد",
      items: {
        age: "سن: میانسال‌ها بیشتر از همه علاقه داشتند، جوان‌ترها و مسن‌ترها کمتر (GPT-4o منحنی را دنبال کرد؛ Gemini فقط برای جوان‌ترها)",
        income: "درآمد: کسانی که از مشکل مالی گفتند کم‌اشتیاق‌تر بودند",
        category: "دسته‌ی محصول: همان دسته‌ها بالاترین و پایین‌ترین نمره را گرفتند",
        source: "منبع ایده: هر دو به ایده‌های یکی از دو منبع نمره‌ی کمتری دادند",
        price: "رده‌ی قیمت: ارزان‌ترین رده برای هر دو پایین‌ترین بود",
        gender: "جنسیت",
        region: "منطقه‌ی محل زندگی در آمریکا",
        ethnicity: "قومیت (فقط در ۹ نظرسنجی ثبت شده بود)",
      },
      note: "هشدار نویسندگان: شرطی‌سازی با پرسونا هنوز جانشین قابل اتکایی برای همه‌ی زیرگروه‌ها نیست، پس نتایج زیرگروه‌ها در پنل‌های مصنوعی را با احتیاط بخوان.",
    },
    game: {
      kicker: "۶ · نوبت تو",
      title: "آدم یا مصنوعی؟",
      lead: "هشت نظر از پیوست مقاله. بعضی را پاسخ‌دهنده‌های واقعی نوشته‌اند و بعضی را خریداران هوش مصنوعی. حدس بزن کدام.",
      quotes: {
        good: "خوب است.",
        ease: "سادگی استفاده و […] ایمنی‌اش جذاب است، اما می‌خواهم بیشتر درباره‌ی اثربخشی و عوارض احتمالی‌اش بدانم.",
        steps: "چیز زیادی نه، فقط مراحل و این‌که می‌گوید برای چیست.",
        highend: "برای نیاز و بودجه‌ی من کمی زیادی لوکس به نظر می‌رسد.",
        bougie: "برای [این نوع محصول] یک‌کم زیادی پز دارد.",
        inexpensive: "ارزان و مقرون‌به‌صرفه. تازه و سبک. [استفاده] در خانه‌ی خودت.",
        microbiome: "گران به نظر می‌رسد و آن حرف‌های «میکروبیوم» را هم چندان باور نمی‌کنم. همان چیزی را که می‌شناسم استفاده می‌کنم.",
        trusted: "سادگی استفاده و وعده‌ی بی‌[…]حساسیت جذاب است. تازه از یک برند معتبر هم هست.",
      },
      human: "یک آدم",
      ai: "هوش مصنوعی",
      right: "درست",
      wrong: "این بار نه",
      wasHuman: "این را یک پاسخ‌دهنده‌ی واقعی نوشته.",
      wasAi: "این را یک خریدار مصنوعی نوشته.",
      progress: (i, n) => `نظر ${i} از ${n}`,
      next: "بعدی",
      done: (s, n) => `${s} از ${n}`,
      again: "دوباره بازی کن",
      lesson: "نکته‌ی مقاله: نظرهای پاسخ‌دهنده‌های واقعی بیشتر کوتاه بودند، در حالی که نظرهای مصنوعی دلیل می‌آوردند و تردیدهایشان را نام می‌بردند. کروشه‌ها حذفیات خود نویسندگان‌اند.",
      translated: "نقل‌ها از انگلیسی ترجمه شده‌اند.",
    },
    founders: {
      kicker: "۷ · برای بنیان‌گذاران",
      title: "این روش چه کاری را ممکن می‌کند و چه کاری را نه",
      lead: "برداشت ما، نه ادعای مقاله: یک صافی ارزان اولیه برای ایده‌ها، نه جانشین مشتری.",
      doTitle: "معقول",
      dontTitle: "این پژوهش پشتیبانی‌اش نمی‌کند",
      dos: [
        "ایده‌های اولیه‌ی زیادی را ارزان غربال کن و فقط امیدوارکننده‌ها را سراغ آدم‌های واقعی ببر؛ همان کاربردی که خود نویسندگان پیشنهاد می‌کنند.",
        "نظرهای مصنوعی را برای اعتراض‌هایی بخوان که به ذهنت نرسیده بود.",
        "به هر پاسخ‌دهنده‌ی مصنوعی یک پرسونای واقع‌بینانه بده؛ بدون آن سیگنال از بین می‌رود.",
        "پیش از اعتماد به رتبه‌بندی، آن را روی چند نظرسنجی واقعی خودت بسنج.",
      ],
      donts: [
        "تحقیق واقعی مشتری را برای عرضه یا تصمیم قیمت کنار بگذاری.",
        "به نتایج در دسته‌ی محصولی اعتماد کنی که مدل‌ها درباره‌اش کم می‌دانند؛ نویسندگان هشدار می‌دهند SSR جایی که داده‌ی آموزشی کم است ترجیح نمی‌سازد.",
        "نتایج زیرگروه‌ها (جنسیت، منطقه، قومیت) را واقعی بخوانی.",
        "فرض کنی جمله‌های مرجع مقاله برای نظرسنجی تو هم کار می‌کنند: روی همین ۵۷ نظرسنجی تنظیم شده‌اند.",
      ],
    },
    notes: {
      kicker: "با دقت بخوان",
      title: "هشت احتیاط",
      items: [
        { t: "پیش‌انتشار", b: "در arXiv منتشر شده؛ هنوز داوری نشده." },
        { t: "نویسندگان صنعتی، داده‌ی خصوصی", b: "هفت نویسنده از PyMC Labs هستند که هم‌زمان با انتشار مقاله نتایج و یک پلتفرم «مصرف‌کننده‌ی مصنوعی» را تبلیغ کرد، و دو نفر از کلگیت-پامولیو. مقاله تأمین‌کننده‌ی داده را نام نمی‌برد و داده عمومی نیست؛ کد SSR عمومی است (Apache-2.0)." },
        { t: "دیگران چه یافتند", b: "یک آزمون مستقل روی نظرسنجی‌های سیاسی آمریکا (هیث و الکساندر، ۲۰۲۶) دید SSR پخش پاسخ‌ها را خیلی واقعی‌تر می‌کند اما سوگیری مدل‌ها به سمت نظرهای افراطی را اصلاح نمی‌کند. پژوهش دوم (ورا پیچاردو، ۲۰۲۶) دید نمره‌دهی مستقیم مدل‌ها بیشتر از SSR با نمره‌ی آدم‌ها یکی درمی‌آید و ارزش SSR را در استقلال روش‌شناختی می‌داند، نه دقت." },
        { t: "تنظیم‌شده روی خود آزمون", b: "جمله‌های مرجع به‌صورت دستی برای همین ۵۷ نظرسنجی بهینه شده‌اند، پس معلوم نیست برای نظرسنجی‌های دیگر چقدر کار کنند؛ خود نویسندگان هم همین را می‌گویند." },
        { t: "یک حوزه، یک کشور", b: "ایده‌های محصولات مراقبت شخصی در آمریکا. نویسندگان انتظار دارند روش جایی کار کند که مدل‌ها بحث‌های انسانی زیادی درباره‌ی آن نوع محصول خوانده‌اند، نه جای دیگر." },
        { t: "دو مدل", b: "GPT-4o و Gemini 2.0 Flash، با مدل امبدینگ text-embedding-3-small؛ نتایج به مدل امبدینگ بستگی دارد." },
        { t: "قصد خرید، خرید نیست", b: "معیار، چیزی است که آدم‌ها گفتند می‌خرند، نه چیزی که خریدند." },
        { t: "تصویر، پرسونا، یک تنظیم", b: "آن ≈۹۰٪ به تصویر محصول و پرسونای جمعیتی نیاز دارد. فقط با متن به ۷۳ تا ۸۳٪ افتاد و بدون پرسونا به ۱۵٫۵٪. میانگین محصولات هم ۴٫۰ بود با پخش خیلی کم (انحراف معیار در یک بخش مقاله ۰٫۱ و در بخش دیگر ۰٫۲)؛ برای همین معیار سقف است، نه نمره‌ی کامل." },
      ],
    },
    medals: {
      title: "نشان‌های آزمایشگاه نظرسنجی",
      hint: "یکی برای هر نمودار تعاملی.",
      names: { ssr: "برداری‌ساز", methods: "آزماینده‌ی روش", ceiling: "سقف‌یاب", persona: "نگهبان پرسونا", game: "داور تورینگ" },
      complete: "هر پنج نشان. حالا درباره‌ی پنل‌های نظرسنجی مصنوعی از بیشتر کسانی که آن را می‌فروشند بیشتر می‌دانی.",
      open: "نشان‌های تو",
      close: "بستن",
    },
    method: {
      sourcesTitle: "منابع",
      sources: SOURCES,
      credit: "همه‌ی عددها از مایر و همکاران (۲۰۲۵)، arXiv:2510.08338 نسخه‌ی ۳ با مجوز CC BY 4.0 و عیناً نقل شده‌اند؛ نمودارها از جدول‌های آن دوباره رسم شده‌اند. زمین بازی SSR فرمول مقاله را با ورودی‌های نمونه به کار می‌برد. بخش بنیان‌گذاران، چارچوب و هر خطایی از ماست، نه از نویسندگان.",
    },
    colophon: {
      shareTitle: "خریدار مصنوعی؛ آیا هوش مصنوعی می‌تواند جای پنل مصرف‌کننده را بگیرد؟",
      disclaimer: "خلاصه‌ای از یک پیش‌انتشار برای مخاطب عمومی. متن نویسندگان نیست؛ برای روش و نتایج کامل، خود مقاله را بخوان.",
      cta: "رزرو جلسه",
    },
  },
}
