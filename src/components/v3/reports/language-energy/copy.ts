// ============================================================================
// File Path: src/components/v3/reports/language-energy/copy.ts
// Why: Every word of report 09 in both locales, one structure for both.
//      Built on Deng et al. (2026), "The Language–Energy Divide" (EMNLP 2026,
//      University of Michigan, University of Aberdeen, University of
//      Cambridge). The paper's figures are quoted exactly and credited; the
//      Persian angle and the framing are ours and labelled as such. The
//      scope is stated up front: one open model family, NVIDIA GPUs,
//      translated benchmark prompts — not ChatGPT, Gemini or Claude.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { TaskKey } from "./data"

export type MedalKey = "picker" | "penalties" | "scatter" | "script" | "persist" | "game"

type Copy = {
  hero: { kicker: string; lead: string; byline: string; kpis: { n: string; l: string; d: string }[]; medals: string; scope: { title: string; body: string } }
  picker: {
    kicker: string
    title: string
    lead: string
    choose: string
    perToken: string
    tokens: string
    energy: string
    vsEnglish: string
    accuracy: string
    english: string
    wh: (v: string) => string
    times: (v: string) => string
    resource: { high: string; low: string }
    script: string
    note: string
  }
  penalties: {
    kicker: string
    title: string
    lead: string
    tokens: string
    perToken: string
    total: string
    equation: (a: string, b: string, c: string) => string
    body: string[]
    callout: { title: string; body: string }
  }
  all: {
    kicker: string
    title: string
    lead: string
    stripTitle: string
    stripAxis: string
    scatterTitle: string
    scatterSub: string
    xAxis: string
    yAxis: string
    high: string
    low: string
    tip: (name: string, jtok: string, acc: string, ans: string) => string
    body: string[]
    caption: string
  }
  persian: {
    kicker: string
    title: string
    lead: string
    figures: { n: string; l: string }[]
    scriptTitle: string
    scriptSub: string
    energyCol: string
    accCol: string
    tajik: string
    body: string[]
    caption: string
  }
  persist: {
    kicker: string
    title: string
    lead: string
    models: string
    tasks: string
    taskNames: Record<TaskKey, string>
    ratio: (r: string) => string
    caption: string
    body: string
  }
  why: { kicker: string; title: string; lead: string; items: { t: string; stat: string; b: string }[]; note: string }
  game: {
    kicker: string
    title: string
    lead: string
    q: (n: string, of: string) => string
    which: string
    right: string
    wrong: string
    reveal: (a: string, aJ: string, b: string, bJ: string, x: string) => string
    next: string
    done: (s: string, n: string) => string
    again: string
    lesson: string
  }
  fix: { kicker: string; title: string; lead: string; items: { t: string; b: string }[]; whoPays: { title: string; body: string } }
  notes: { kicker: string; title: string; items: { t: string; b: string }[] }
  langs: Record<string, string>
  medals: { title: string; hint: string; names: Record<MedalKey, string>; complete: string; open: string; close: string }
  method: { sourcesTitle: string; sources: { label: string; href: string }[]; credit: string }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

const SOURCES = [
  { label: "Deng, Shen, Feng, Nwatu, Chung, Chowdhury, Chen & Mihalcea (2026). The Language–Energy Divide: Measuring Energy Costs of Multilingual LLM Inference. EMNLP 2026, pp. 48057–48075 (PDF)", href: "https://aclanthology.org/2026.emnlp-main.2113.pdf" },
  { label: "ACL Anthology record for the paper", href: "https://aclanthology.org/2026.emnlp-main.2113/" },
  { label: "Project page (University of Michigan LIT lab)", href: "https://lit.eecs.umich.edu/language-energy-divide/" },
  { label: "Code: MichiganNLP/language-energy-divide (GitHub)", href: "https://github.com/MichiganNLP/language-energy-divide" },
  { label: "Data: MichiganNLP/language-energy-divide (Hugging Face)", href: "https://huggingface.co/datasets/MichiganNLP/language-energy-divide" },
]

export const COPY: Record<Locale, Copy> = {
  en: {
    hero: {
      kicker: "Reports",
      lead: "Ask a language model the same 900 reading questions in English and in Pashto, on the same model and the same GPU. A new EMNLP 2026 study measured the electricity: 17.6 kJ for English, 3,147 kJ for Pashto. 179 times as much, for answers that were right less than half as often. Here is what the paper found across 122 languages, and where Persian sits.",
      byline: "Based on Deng et al. (2026), University of Michigan, University of Aberdeen and University of Cambridge. Figures are the paper's; the Persian angle is ours.",
      kpis: [
        { n: "179×", l: "Pashto vs English", d: "total energy, same 900 questions" },
        { n: "8.3×", l: "per-token gap", d: "cheapest vs costliest language" },
        { n: "122", l: "languages measured", d: "56 high-resource, 66 low-resource" },
        { n: "≈4×", l: "Persian vs English", d: "energy per answer (our arithmetic on the authors' data)" },
      ],
      medals: "Each interactive figure awards a badge the first time you use it. There are six.",
      scope: {
        title: "What was measured, and what was not",
        body: "The 122-language results come from one open model, Qwen3-8B, on one NVIDIA L40S GPU, answering Belebele reading-comprehension questions with step-by-step reasoning. The authors repeat the key comparison on five models, two GPUs, six batch sizes and three tasks. They did not measure ChatGPT, Gemini or Claude, which would need the companies' cooperation. So these are measured joules for open models, not a bill from any commercial chatbot.",
      },
    },
    picker: {
      kicker: "1 · Your language",
      title: "What does one answer cost in your language?",
      lead: "Pick any of the 122 languages. The numbers are the authors' (Qwen3-8B, Belebele, 900 questions per language); per-answer figures divide their totals by 900.",
      choose: "Language",
      perToken: "Energy per output token",
      tokens: "Tokens per answer",
      energy: "Energy per answer",
      vsEnglish: "vs English",
      accuracy: "Answers correct",
      english: "English",
      wh: (v) => `${v} Wh`,
      times: (v) => `${v}×`,
      resource: { high: "high-resource", low: "low-resource" },
      script: "Script",
      note: "Energy per answer = the authors' unrounded energy per token × output tokens ÷ 900, from their released data. This reproduces the paper's Table 1 (English: 17,588 J for 900 answers). Accuracy is the paper's lenient score, which also counts answers recovered from output that missed the required format.",
    },
    penalties: {
      kicker: "2 · Two penalties that multiply",
      title: "More tokens, and each token costs more",
      lead: "The gap is a product of two factors. Low-resource languages make the model write far more tokens, and each of those tokens costs more energy. Pick a language to see both.",
      tokens: "Tokens per answer",
      perToken: "Energy per token",
      total: "Energy per answer",
      equation: (a, b, c) => `${a}× the tokens × ${b}× the energy per token = ${c}× the energy per answer`,
      body: [
        "The four low-resource languages in the paper's subset emit 20–25 times as many output tokens as English. That alone would be expensive. But the per-token cost rises too, by up to 8.3 times.",
        "The authors' explanation for why the two travel together: longer answers take more GPU memory per request, so a server can run fewer requests at once, and a less busy GPU spends more energy on each token. They call for ablation studies to test it.",
      ],
      callout: {
        title: "A double penalty",
        body: "The costliest languages are also where the model does worst. English answers were right 94.6% of the time at the lowest energy; the five costliest languages were all at or below 43%, Shan at 10.6%. The authors stress this is co-occurrence, not cause: both come from weak tokenizer coverage and thin training data.",
      },
    },
    all: {
      kicker: "3 · All 122 languages",
      title: "One model, 122 bills",
      lead: "Every dot is a language. Tap or hover to read it.",
      stripTitle: "Energy per answer, log scale",
      stripAxis: "joules per answer",
      scatterTitle: "Higher energy, lower accuracy",
      scatterSub: "Energy per output token against the share of answers correct",
      xAxis: "J per output token",
      yAxis: "% correct",
      high: "High-resource",
      low: "Low-resource",
      tip: (name, jtok, acc, ans) => `${name}: ${jtok} J/token, ${acc}% correct, ${ans} J per answer`,
      body: [
        "Most languages cluster between 0.10 and 0.20 J per token. A long tail of low-resource languages in non-Latin scripts, led by Tibetan, Pashto, Tigrinya, Shan and Amharic, sits above 0.4.",
        "Script is not destiny. Simplified Chinese matches English at 0.10 J/token, and Egyptian Arabic, a low-resource variety, is among the five cheapest per answer; the authors attribute this to sharing Modern Standard Arabic's well-covered script.",
      ],
      caption: "Source: Deng et al. (2026), Table 5 and the authors' released data. Qwen3-8B, zero-shot chain of thought, Belebele, one NVIDIA L40S, batch size 256.",
    },
    persian: {
      kicker: "4 · Where Persian sits",
      title: "Persian: cheaper than most, about four times English",
      lead: "In the paper's table, Western Persian is a high-resource language and lands in the cheaper half. It still costs about four times as much as English per answer, and the model gets a third of the answers wrong.",
      figures: [
        { n: "0.14", l: "J per output token (English 0.10)" },
        { n: "≈563", l: "tokens per answer (English ≈186)" },
        { n: "≈4×", l: "energy per answer vs English" },
        { n: "67.4%", l: "answers correct (English 94.6%)" },
      ],
      scriptTitle: "Same script, very different bills",
      scriptSub: "Every Arabic-script language in the table, energy per answer",
      energyCol: "J per answer",
      accCol: "% correct",
      tajik: "Tajik, a close relative of Persian written in Cyrillic, is listed as low-resource and costs about 2.7 times Western Persian per answer. Its 58.0% is the lenient score: almost every Tajik answer missed the required format.",
      body: [
        "The Arabic script is no excuse on its own: Egyptian, Najdi and Modern Standard Arabic sit among the cheapest languages in the table, while Pashto, in the same script, is the most expensive of all 122. What differs is how much of each language the model and its tokenizer have seen.",
        "For Persian speakers that means two things. The energy gap with English is real but moderate; the accuracy gap is the bigger cost. And it is a property of today's models, not of the language.",
      ],
      caption: "Source: Deng et al. (2026), Table 5 and the authors' released data. The ×English figures are our arithmetic on that data. Belebele covers Western Persian and Tajik, not Dari.",
    },
    persist: {
      kicker: "5 · Not one model's quirk",
      title: "The gap holds across models and tasks",
      lead: "The authors re-ran the eight-language subset on five models and three tasks. The ratio between the costliest and cheapest language never fell below 7×.",
      models: "Across models",
      tasks: "Across tasks",
      taskNames: { reading: "Reading (Belebele)", math: "Math (GSM8K)", chat: "Open chat (LM-Arena)" },
      ratio: (r) => `${r}× costliest ÷ cheapest`,
      caption: "J per output token. Source: Deng et al. (2026), Tables 3 and 4.",
      body: "Bigger models cost more per token for every language (English rises from 0.10 J on Qwen3-8B to 0.51 J on Qwen3-32B), but the divide does not shrink with scale. The high- and low-resource groups never overlap on any model.",
    },
    why: {
      kicker: "6 · Why it happens",
      title: "Four things the model does in an under-served language",
      lead: "The paper reads the actual answers and finds four recurring patterns.",
      items: [
        { t: "Token explosion", stat: "45×", b: "In Tigrinya the model repeated one sentence 45 times. For Shan, Pashto, Tibetan, Tigrinya, Burmese and Amharic it emitted up to about 4,700 tokens per question, stuck in a loop." },
        { t: "Over-generation", stat: "3.4×", b: "In Latvian it understood enough to answer, but at length: 896 tokens, 3.4 times the English answer, at a similar per-token cost." },
        { t: "Too many tokens per character", stat: "0.78", b: "Tibetan text averaged 0.78 characters per token, against 4.84 for English: the tokenizer breaks the script into tiny pieces." },
        { t: "Switching language", stat: "EN", b: "For Khmer, the model simply answered in English." },
      ],
      note: "None of this is a verdict on the languages. It is how current models, tokenizers and training data treat them.",
    },
    game: {
      kicker: "7 · Your turn",
      title: "Which answer costs more?",
      lead: "Eight pairs from the full table. Guess which language costs more energy per answer, then see the numbers.",
      q: (n, of) => `Pair ${n} of ${of}`,
      which: "Which costs more per answer?",
      right: "Right",
      wrong: "Not this time",
      reveal: (a, aJ, b, bJ, x) => `${a}: ${aJ} J · ${b}: ${bJ} J · ${x}× apart`,
      next: "Next pair",
      done: (s, n) => `${s} of ${n}`,
      again: "Play again",
      lesson: "The usual surprise: script and familiarity are weaker guides than they look. What predicts the bill is how well the model and its tokenizer cover the language.",
    },
    fix: {
      kicker: "8 · What the authors recommend",
      title: "Make the cost visible, then cut it",
      lead: "The paper ends with concrete proposals for researchers, model makers and the companies that serve models.",
      items: [
        { t: "Report energy, not just accuracy", b: "Add energy to the Responsible NLP checklist and to model cards. Two systems with the same accuracy at very different energy are not equivalent." },
        { t: "Report it per language", b: "A model that is cheap and right in English but costly and wrong in Tibetan is two different systems for two communities. One “multilingual” claim hides both." },
        { t: "Serve each language on its own terms", b: "Detect the language and cap output length, stop early, penalise repetition; tune batch sizes per language rather than for the average." },
        { t: "Route by language", b: "Send some queries to smaller specialised models, or translate to English, answer, and translate back — except where culture, idiom or register matter." },
        { t: "Treat it as an equity issue", b: "Equity audits at release, transparent per-language pricing, or subsidised inference for under-served languages." },
      ],
      whoPays: {
        title: "Who pays, and who is served",
        body: "The authors flag the risk themselves: a provider could use these numbers to deprioritise expensive languages. Their answer is that leaving the gap unmeasured lets that happen silently. Meanwhile the electricity, water and carbon are paid by everyone, and the worst service falls on speakers of under-served languages.",
      },
    },
    notes: {
      kicker: "Read it carefully",
      title: "Six cautions",
      items: [
        { t: "Open models, not chatbots you use", b: "Qwen, Gemma and Llama on NVIDIA L40S and RTX 6000 Pro GPUs. ChatGPT, Gemini and Claude were not measured." },
        { t: "The 122-language table is one setup", b: "Qwen3-8B, one L40S, batch size 256, reading comprehension. Absolute joules change with hardware; the authors say to re-validate as hardware evolves." },
        { t: "Translated prompts", b: "Benchmarks are standardised translations, not text people actually write. The authors read the gap as a lower bound for real, noisier input." },
        { t: "Co-occurrence, not cause", b: "High energy does not cause low accuracy or the reverse; both come from tokenizer coverage and training data." },
        { t: "Modelled totals, lenient accuracy", b: "Totals are steady-state energy per token × output tokens, not a meter reading of the whole run. The paper's Table 5 rounds per-token energy first, which inflates ratios; we use the authors' unrounded data. Accuracy is the paper's lenient score." },
        { t: "Energy, not price", b: "The study measures joules on the GPU. It does not say what any provider charges." },
      ],
    },
    langs: {},
    medals: {
      title: "Field-researcher badges",
      hint: "One for each interactive figure.",
      names: { picker: "Bill reader", penalties: "Multiplier", scatter: "Dot hunter", script: "Script sleuth", persist: "Replicator", game: "Cost guesser" },
      complete: "All six. You now know more about the language–energy divide than most people building with these models.",
      open: "Your badges",
      close: "Close",
    },
    method: {
      sourcesTitle: "Sources",
      sources: SOURCES,
      credit: "All figures are from Deng et al. (2026), quoted exactly; per-language values use the authors' released data (GitHub, Apache-2.0), and ratios marked “ours” are arithmetic on it. Charts redrawn from the paper's published data. The framing, the Persian section and any errors are ours, not the authors'.",
    },
    colophon: {
      shareTitle: "The Language Tax — same question, up to 179× the energy",
      disclaimer: "A summary of a peer-reviewed study for a general audience. It is not the authors' text; read the paper for the full method and results.",
      cta: "Book a session",
    },
  },
  fa: {
    hero: {
      kicker: "گزارش‌ها",
      lead: "همان ۹۰۰ سؤال درک مطلب را یک بار به انگلیسی و یک بار به پشتو از یک مدل زبانی بپرس؛ با همان مدل و همان کارت گرافیک. پژوهشی تازه در EMNLP 2026 برقِ مصرفی را اندازه گرفت: ۱۷٫۶ کیلوژول برای انگلیسی و ۳٬۱۴۷ کیلوژول برای پشتو. یعنی ۱۷۹ برابر، برای جواب‌هایی که کمتر از نصف دفعات درست بودند. این‌جا یافته‌های مقاله در ۱۲۲ زبان را می‌بینی، و این‌که فارسی کجای این صف است.",
      byline: "بر اساس مقاله‌ی دنگ و همکاران (۲۰۲۶)، دانشگاه میشیگان، دانشگاه ابردین و دانشگاه کمبریج. عددها از مقاله‌اند؛ زاویه‌ی فارسی از ماست.",
      kpis: [
        { n: "۱۷۹×", l: "پشتو در برابر انگلیسی", d: "کل انرژی، همان ۹۰۰ سؤال" },
        { n: "۸٫۳×", l: "شکاف انرژی هر توکن", d: "ارزان‌ترین در برابر گران‌ترین زبان" },
        { n: "۱۲۲", l: "زبانِ اندازه‌گیری‌شده", d: "۵۶ پرمنبع، ۶۶ کم‌منبع" },
        { n: "≈۴×", l: "فارسی در برابر انگلیسی", d: "انرژی هر جواب (حساب ما روی داده‌ی نویسندگان)" },
      ],
      medals: "هر نمودار تعاملی بار اولی که با آن کار کنی یک نشان می‌دهد. شش نشان در این صفحه هست.",
      scope: {
        title: "چه چیزی اندازه‌گیری شد و چه چیزی نه",
        body: "نتایج ۱۲۲ زبان از یک مدل باز، Qwen3-8B، روی یک کارت گرافیک NVIDIA L40S به دست آمده که به سؤال‌های درک مطلب Belebele با استدلال گام‌به‌گام جواب داده. نویسندگان مقایسه‌ی اصلی را روی پنج مدل، دو کارت گرافیک، شش اندازه‌ی دسته و سه نوع کار تکرار کرده‌اند. ChatGPT، Gemini و Claude اندازه‌گیری نشده‌اند، چون به همکاری شرکت‌ها نیاز دارد. پس این‌ها ژولِ اندازه‌گیری‌شده برای مدل‌های بازند، نه قبض هیچ چت‌بات تجاری.",
      },
    },
    picker: {
      kicker: "۱ · زبان تو",
      title: "یک جواب به زبان تو چقدر انرژی می‌برد؟",
      lead: "هر کدام از ۱۲۲ زبان را انتخاب کن. عددها از نویسندگان‌اند: مدل Qwen3-8B روی بنچمارک Belebele، با ۹۰۰ سؤال برای هر زبان. عددهای هر جواب، کل آن‌ها تقسیم بر ۹۰۰ است.",
      choose: "زبان",
      perToken: "انرژی هر توکن خروجی",
      tokens: "توکن در هر جواب",
      energy: "انرژی هر جواب",
      vsEnglish: "در برابر انگلیسی",
      accuracy: "جواب‌های درست",
      english: "انگلیسی",
      wh: (v) => `${v} وات‌ساعت`,
      times: (v) => `${v} برابر`,
      resource: { high: "پرمنبع", low: "کم‌منبع" },
      script: "خط",
      note: "انرژی هر جواب = انرژی گردنشده‌ی هر توکن × تعداد توکن‌های خروجی ÷ ۹۰۰، از داده‌های منتشرشده‌ی نویسندگان. این همان جدول ۱ مقاله را بازتولید می‌کند (انگلیسی: ۱۷٬۵۸۸ ژول برای ۹۰۰ جواب). دقت، امتیاز «آسان‌گیر» مقاله است که جواب‌های بیرون‌کشیده از خروجیِ بدقالب را هم حساب می‌کند.",
    },
    penalties: {
      kicker: "۲ · دو جریمه که در هم ضرب می‌شوند",
      title: "توکن بیشتر، و هر توکن گران‌تر",
      lead: "این شکاف حاصل‌ضرب دو عامل است. زبان‌های کم‌منبع مدل را وادار می‌کنند توکن خیلی بیشتری بنویسد، و هر کدام از آن توکن‌ها هم انرژی بیشتری می‌برد. یک زبان انتخاب کن تا هر دو را ببینی.",
      tokens: "توکن در هر جواب",
      perToken: "انرژی هر توکن",
      total: "انرژی هر جواب",
      equation: (a, b, c) => `${a} برابر توکن × ${b} برابر انرژی هر توکن = ${c} برابر انرژی هر جواب`,
      body: [
        "چهار زبان کم‌منبعِ زیرمجموعه‌ی مقاله ۲۰ تا ۲۵ برابر انگلیسی توکن خروجی تولید می‌کنند. همین به تنهایی گران است. اما هزینه‌ی هر توکن هم بالا می‌رود، تا ۸٫۳ برابر.",
        "توضیح نویسندگان برای این‌که چرا این دو با هم می‌آیند: جواب‌های طولانی‌تر برای هر درخواست حافظه‌ی بیشتری از کارت گرافیک می‌گیرند، پس سرور می‌تواند درخواست‌های کمتری را همزمان اجرا کند، و کارت گرافیکِ کم‌کارتر برای هر توکن انرژی بیشتری می‌سوزاند. خودشان خواسته‌اند این با آزمایش‌های جداسازی سنجیده شود.",
      ],
      callout: {
        title: "جریمه‌ی دوگانه",
        body: "گران‌ترین زبان‌ها همان‌هایی‌اند که مدل در آن‌ها بدترین عملکرد را دارد. جواب‌های انگلیسی ۹۴٫۶٪ مواقع درست بودند، با کمترین انرژی؛ پنج زبانِ گران‌تر همه ۴۳٪ یا کمتر بودند و شانی ۱۰٫۶٪. نویسندگان تأکید می‌کنند این هم‌زمانی است، نه علت و معلول: هر دو از پوشش ضعیف توکنایزر و داده‌ی آموزشیِ کم می‌آیند.",
      },
    },
    all: {
      kicker: "۳ · هر ۱۲۲ زبان",
      title: "یک مدل، ۱۲۲ قبض",
      lead: "هر نقطه یک زبان است. رویش بزن یا ماوس را نگه دار تا بخوانی‌اش.",
      stripTitle: "انرژی هر جواب، مقیاس لگاریتمی",
      stripAxis: "ژول در هر جواب",
      scatterTitle: "انرژی بیشتر، دقت کمتر",
      scatterSub: "انرژی هر توکن خروجی در برابر درصد جواب‌های درست",
      xAxis: "ژول بر توکن خروجی",
      yAxis: "٪ درست",
      high: "پرمنبع",
      low: "کم‌منبع",
      tip: (name, jtok, acc, ans) => `${name}: ${jtok} ژول بر توکن، ${acc}٪ درست، ${ans} ژول در هر جواب`,
      body: [
        "بیشتر زبان‌ها بین ۰٫۱۰ و ۰٫۲۰ ژول بر توکن جمع شده‌اند. دنباله‌ی بلندی از زبان‌های کم‌منبع با خط غیرلاتین، با تبتی، پشتو، تیگرینیایی، شانی و امهری در صدر، بالای ۰٫۴ نشسته‌اند.",
        "خط سرنوشت نیست. چینیِ ساده‌شده با ۰٫۱۰ ژول بر توکن هم‌پای انگلیسی است، و عربی مصری، که کم‌منبع حساب می‌شود، از نظر انرژی هر جواب جزو پنج زبان ارزان است؛ نویسندگان این را به خطِ مشترک و خوب‌پوشش‌داده‌اش با عربی معیار نسبت می‌دهند.",
      ],
      caption: "منبع: دنگ و همکاران (۲۰۲۶)، جدول ۵ و داده‌های منتشرشده‌ی نویسندگان. Qwen3-8B، زنجیره‌ی فکر بدون مثال، Belebele، یک NVIDIA L40S، اندازه‌ی دسته ۲۵۶.",
    },
    persian: {
      kicker: "۴ · فارسی کجاست",
      title: "فارسی: ارزان‌تر از بیشتر زبان‌ها، حدود چهار برابر انگلیسی",
      lead: "در جدول مقاله، فارسی (غربی) زبانی پرمنبع است و در نیمه‌ی ارزان‌تر می‌نشیند. با این حال هر جواب حدود چهار برابر انگلیسی انرژی می‌برد، و مدل یک‌سوم جواب‌ها را غلط می‌دهد.",
      figures: [
        { n: "۰٫۱۴", l: "ژول بر توکن خروجی (انگلیسی ۰٫۱۰)" },
        { n: "≈۵۶۳", l: "توکن در هر جواب (انگلیسی ≈۱۸۶)" },
        { n: "≈۴×", l: "انرژی هر جواب در برابر انگلیسی" },
        { n: "۶۷٫۴٪", l: "جواب‌های درست (انگلیسی ۹۴٫۶٪)" },
      ],
      scriptTitle: "یک خط، قبض‌های بسیار متفاوت",
      scriptSub: "همه‌ی زبان‌های خط عربی در جدول، انرژی هر جواب",
      energyCol: "ژول در هر جواب",
      accCol: "٪ درست",
      tajik: "تاجیکی، خویشاوند نزدیک فارسی که به خط سیریلیک نوشته می‌شود، کم‌منبع حساب شده و هر جوابش حدود ۲٫۷ برابر فارسی غربی انرژی می‌برد. آن ۵۸٫۰٪ امتیاز آسان‌گیر است: تقریباً همه‌ی جواب‌های تاجیکی قالب خواسته‌شده را رعایت نکردند.",
      body: [
        "خط عربی به تنهایی بهانه نیست: عربی مصری، نجدی و معیار جزو ارزان‌ترین زبان‌های جدول‌اند، در حالی که پشتو، با همین خط، گران‌ترینِ هر ۱۲۲ زبان است. آن‌چه فرق می‌کند این است که مدل و توکنایزرش چقدر از هر زبان دیده‌اند.",
        "برای فارسی‌زبان‌ها این دو معنا دارد. شکاف انرژی با انگلیسی واقعی اما متوسط است؛ هزینه‌ی بزرگ‌تر، شکاف دقت است. و این ویژگیِ مدل‌های امروز است، نه خود زبان.",
      ],
      caption: "منبع: دنگ و همکاران (۲۰۲۶)، جدول ۵ و داده‌های منتشرشده‌ی نویسندگان. نسبت‌ها به انگلیسی حساب ما روی همان داده است. Belebele فارسی غربی و تاجیکی را دارد، نه دری.",
    },
    persist: {
      kicker: "۵ · ایراد یک مدل نیست",
      title: "شکاف در مدل‌ها و کارهای مختلف هم می‌ماند",
      lead: "نویسندگان زیرمجموعه‌ی هشت‌زبانه را روی پنج مدل و سه نوع کار دوباره اجرا کردند. نسبت گران‌ترین به ارزان‌ترین زبان هیچ‌وقت زیر ۷ برابر نیامد.",
      models: "در مدل‌ها",
      tasks: "در کارها",
      taskNames: { reading: "درک مطلب (Belebele)", math: "ریاضی (GSM8K)", chat: "گفت‌وگوی آزاد (LM-Arena)" },
      ratio: (r) => `${r} برابر: گران‌ترین ÷ ارزان‌ترین`,
      caption: "ژول بر توکن خروجی. منبع: دنگ و همکاران (۲۰۲۶)، جدول‌های ۳ و ۴.",
      body: "مدل‌های بزرگ‌تر برای همه‌ی زبان‌ها هر توکن را گران‌تر تمام می‌کنند (انگلیسی از ۰٫۱۰ ژول در Qwen3-8B به ۰٫۵۱ ژول در Qwen3-32B می‌رسد)، اما شکاف با بزرگ شدن مدل کم نمی‌شود. دو گروه پرمنبع و کم‌منبع در هیچ مدلی روی هم نمی‌افتند.",
    },
    why: {
      kicker: "۶ · چرا این اتفاق می‌افتد",
      title: "چهار کاری که مدل در زبانِ کم‌پوشش می‌کند",
      lead: "مقاله جواب‌های واقعی را خوانده و چهار الگوی تکرارشونده پیدا کرده.",
      items: [
        { t: "انفجار توکن", stat: "۴۵×", b: "در تیگرینیایی، مدل یک جمله را ۴۵ بار تکرار کرد. برای شانی، پشتو، تبتی، تیگرینیایی، برمه‌ای و امهری تا حدود ۴٬۷۰۰ توکن برای هر سؤال نوشت و در یک حلقه گیر کرد." },
        { t: "پرگویی", stat: "۳٫۴×", b: "در لتونیایی آن‌قدر فهمید که جواب بدهد، اما مفصل: ۸۹۶ توکن، ۳٫۴ برابر جواب انگلیسی، با هزینه‌ی تقریباً یکسان برای هر توکن." },
        { t: "توکن زیاد برای هر حرف", stat: "۰٫۷۸", b: "متن تبتی به‌طور میانگین ۰٫۷۸ حرف در هر توکن داشت، در برابر ۴٫۸۴ برای انگلیسی: توکنایزر این خط را به تکه‌های ریز خرد می‌کند." },
        { t: "عوض کردن زبان", stat: "EN", b: "برای خمری، مدل خیلی ساده به انگلیسی جواب داد." },
      ],
      note: "هیچ‌کدام از این‌ها حکمی درباره‌ی خود این زبان‌ها نیست. این طرز برخورد مدل‌ها، توکنایزرها و داده‌های آموزشیِ امروز با آن‌هاست.",
    },
    game: {
      kicker: "۷ · نوبت تو",
      title: "جواب کدام گران‌تر است؟",
      lead: "هشت جفت از جدول کامل. حدس بزن کدام زبان برای هر جواب انرژی بیشتری می‌برد، بعد عددها را ببین.",
      q: (n, of) => `جفت ${n} از ${of}`,
      which: "هر جواب کدام گران‌تر است؟",
      right: "درست",
      wrong: "این بار نه",
      reveal: (a, aJ, b, bJ, x) => `${a}: ${aJ} ژول · ${b}: ${bJ} ژول · ${x} برابر فاصله`,
      next: "جفت بعدی",
      done: (s, n) => `${s} از ${n}`,
      again: "دوباره بازی کن",
      lesson: "غافلگیری معمول: خط و آشنا بودن زبان راهنمای ضعیف‌تری از آن‌اند که به نظر می‌رسند. چیزی که قبض را پیش‌بینی می‌کند این است که مدل و توکنایزرش چقدر آن زبان را پوشش می‌دهند.",
    },
    fix: {
      kicker: "۸ · پیشنهاد نویسندگان",
      title: "هزینه را دیدنی کن، بعد کمش کن",
      lead: "مقاله با پیشنهادهای مشخص برای پژوهشگران، سازندگان مدل و شرکت‌هایی که مدل‌ها را ارائه می‌دهند تمام می‌شود.",
      items: [
        { t: "انرژی را گزارش کن، نه فقط دقت را", b: "انرژی را به چک‌لیست NLP مسئولانه و به کارت مدل اضافه کن. دو سیستم با دقت یکسان و انرژی بسیار متفاوت هم‌ارز نیستند." },
        { t: "برای هر زبان جدا گزارش کن", b: "مدلی که در انگلیسی ارزان و درست است اما در تبتی گران و غلط، دو سیستم متفاوت برای دو جامعه است. یک ادعای «چندزبانه» هر دو را پنهان می‌کند." },
        { t: "هر زبان را با شرایط خودش سرو کن", b: "زبان را تشخیص بده و طول خروجی را محدود کن، زود متوقف کن، تکرار را جریمه کن؛ اندازه‌ی دسته را برای هر زبان تنظیم کن، نه برای میانگین." },
        { t: "بر اساس زبان مسیریابی کن", b: "بعضی پرسش‌ها را به مدل‌های کوچک‌تر و تخصصی بفرست، یا به انگلیسی ترجمه کن، جواب بده و برگردان؛ جز جایی که فرهنگ، اصطلاح یا لحن مهم است." },
        { t: "آن را مسئله‌ی عدالت ببین", b: "ممیزی عدالت هنگام انتشار مدل، قیمت‌گذاری شفاف برای هر زبان، یا یارانه‌ی پردازش برای زبان‌های کم‌برخوردار." },
      ],
      whoPays: {
        title: "چه کسی می‌پردازد و به چه کسی خدمت می‌رسد",
        body: "خود نویسندگان این خطر را گوشزد کرده‌اند: یک ارائه‌دهنده می‌تواند با این عددها زبان‌های گران را کنار بگذارد. جوابشان این است که اندازه نگرفتن این شکاف اجازه می‌دهد همین اتفاق بی‌صدا بیفتد. در این میان، برق و آب و کربن را همه می‌پردازند و بدترین خدمت به سخنگویان زبان‌های کم‌برخوردار می‌رسد.",
      },
    },
    notes: {
      kicker: "با دقت بخوان",
      title: "شش احتیاط",
      items: [
        { t: "مدل‌های باز، نه چت‌بات‌هایی که استفاده می‌کنی", b: "Qwen، Gemma و Llama روی کارت‌های گرافیک NVIDIA L40S و RTX 6000 Pro. ChatGPT، Gemini و Claude اندازه‌گیری نشده‌اند." },
        { t: "جدول ۱۲۲ زبانه یک چیدمان است", b: "Qwen3-8B، یک L40S، اندازه‌ی دسته ۲۵۶، درک مطلب. ژول مطلق با سخت‌افزار عوض می‌شود؛ نویسندگان می‌گویند با تغییر سخت‌افزار باید دوباره سنجیده شود." },
        { t: "پرامپت‌های ترجمه‌شده", b: "بنچمارک‌ها ترجمه‌های استانداردند، نه متنی که آدم‌ها واقعاً می‌نویسند. نویسندگان این شکاف را حد پایین برای ورودی‌های واقعی و پرنویزتر می‌دانند." },
        { t: "هم‌زمانی، نه علت", b: "انرژی بالا باعث دقت پایین نمی‌شود و برعکس؛ هر دو از پوشش توکنایزر و داده‌ی آموزشی می‌آیند." },
        { t: "کل‌های مدل‌شده، دقت آسان‌گیر", b: "کل‌ها انرژی پایدار هر توکن × توکن‌های خروجی‌اند، نه خواندن کنتور کل اجرا. جدول ۵ مقاله انرژی هر توکن را اول گرد می‌کند و نسبت‌ها را بزرگ‌تر نشان می‌دهد؛ ما از داده‌ی گردنشده‌ی نویسندگان استفاده کرده‌ایم. دقت، امتیاز آسان‌گیر مقاله است." },
        { t: "انرژی، نه قیمت", b: "این پژوهش ژول روی کارت گرافیک را می‌سنجد. نمی‌گوید هیچ ارائه‌دهنده‌ای چقدر پول می‌گیرد." },
      ],
    },
    langs: {},
    medals: {
      title: "نشان‌های پژوهشگر میدانی",
      hint: "یکی برای هر نمودار تعاملی.",
      names: { picker: "قبض‌خوان", penalties: "ضرب‌کننده", scatter: "نقطه‌یاب", script: "کارآگاه خط", persist: "تکرارکننده", game: "حدس‌زن هزینه" },
      complete: "هر شش نشان. حالا درباره‌ی شکاف زبان و انرژی از بیشتر کسانی که با این مدل‌ها کار می‌کنند بیشتر می‌دانی.",
      open: "نشان‌های تو",
      close: "بستن",
    },
    method: {
      sourcesTitle: "منابع",
      sources: SOURCES,
      credit: "همه‌ی عددها از دنگ و همکاران (۲۰۲۶) و عیناً نقل شده‌اند؛ مقادیر هر زبان از داده‌های منتشرشده‌ی نویسندگان (GitHub، مجوز Apache-2.0) است و نسبت‌هایی که «حساب ما» نوشته شده، محاسبه روی همان داده‌اند. نمودارها از داده‌های منتشرشده‌ی مقاله دوباره رسم شده‌اند. چارچوب، بخش فارسی و هر خطایی از ماست، نه از نویسندگان.",
    },
    colophon: {
      shareTitle: "مالیات زبان؛ یک سؤال، تا ۱۷۹ برابر انرژی",
      disclaimer: "خلاصه‌ای از یک پژوهش داوری‌شده برای مخاطب عمومی. متن نویسندگان نیست؛ برای روش و نتایج کامل، خود مقاله را بخوان.",
      cta: "رزرو جلسه",
    },
  },
}
