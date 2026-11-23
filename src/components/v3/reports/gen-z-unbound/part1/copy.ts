// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/part1/copy.ts
// Why: Every word of report 11 (Gen Z series, part 1) in both locales:
//      strong views per hundred, how tightly views hang together, left and
//      right camps by country, and the issues where the generations differ
//      in degree rather than direction. Figures from Electric Twin, "Gen Z is
//      Unbound" (Oct 2026), quoted as printed. The founders' reading is ours
//      and labelled.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { Gen, IssueKey } from "../data"

const en = {
  hero: {
    lead:
      "Ask a hundred Boomers in the US, the UK, France and Germany about immigration, tax, the environment, trans athletes and the safety net, and about eight hold strong right-wing views on almost all of them. Ask a hundred of their grandchildren and you find two. A survey with 51,929 responses suggests the young are not more extreme than their parents. Their views are less bundled.",
    kpis: [
      { n: "2%", l: "of Gen Z hold strong right-wing views", d: "Boomers: 8.4%. Strong left is about 10% in both." },
      { n: "5.3%", l: "how much one view predicts the rest, Gen Z", d: "Boomers: 16%. Lower in every younger generation." },
      { n: "15", l: "points between Gen Z's left and right voters", d: "Boomers: 28 points, on a 0–100 scale." },
      { n: "42%", l: "of Boomers' exact matches vanish in a room of Gen Z", d: "Gen Z keep theirs in a room of Boomers." },
    ],
    medals: "Four figures below are interactive. Each one you try adds a badge to the series case, bottom corner.",
  },
  room: {
    kicker: "01 · The room",
    title: "Eight in a hundred, and two",
    lead: "Each dot is a person. “Strong” means answering strongly on one side of six or more of eight party-dividing questions.",
    pick: "Fill the room with",
    gens: { boomers: "100 Boomers", genz: "100 Gen Z" },
    legend: { left: "Strong left", right: "Strong right", rest: "Everyone else" },
    count: (l: string, r: string) => `${l} strong left · ${r} strong right`,
    caption:
      "Strong left: 10% of Boomers, 9.6% of Gen Z. Strong right: 8.4% of Boomers, 2.0% of Gen Z. Dots rounded to whole people. Source: Electric Twin survey, four countries, two waves (Jan–Apr 2026), 51,929 responses.",
    body: [
      "On the left, the generations look alike: about ten committed left-wingers per hundred in each. On the right they do not. The young who vote for right-wing parties hold a near-even mix of left and right positions; their older counterparts lean clearly right.",
      "So the left is no bigger among the young. The right is smaller, and closer to the middle.",
    ],
  },
  bundle: {
    kicker: "02 · Bundles",
    title: "Knowing one view tells you less about the rest",
    lead: "Everyone answered 13 policy questions, from immigration and abortion to AI and the safety net. For an older person, one answer is a good clue to the other twelve. For a young person it is a weak one.",
    gens: { boomers: "Boomers", genx: "Gen X", millennials: "Millennials", genz: "Gen Z" } as Record<Gen, string>,
    barsLabel: "% better prediction of each position from the other 12",
    barsCaption:
      "How much better each of a participant's 13 positions is predicted from their other 12 than from how common it is among peers, beyond what random combinations give (0 = no connection). Mean of four countries, both waves. It falls with each younger generation in all four countries.",
    twinsTitle: "Find someone who agrees with you on all 13",
    twinsLead:
      "Put a person in a room of 99 others from their own country and ask: does anyone there share every one of their 13 answers? Choose who walks in, and who fills the room.",
    you: "You are",
    roomOf: "The room is 99",
    match: (v: string) => `${v} find an exact match`,
    chance: (v: string) => `chance alone: ${v}`,
    times: (v: string) => `${v}× chance`,
    twinsCaption:
      "% of people who find someone with exactly their 13 policy answers in a room of 99 from each generation, same country; mean of the four countries. Chance shuffles each answer within the group, keeping how common it is but not how people combine them. Source: Electric Twin, appendix.",
    body: [
      "In a room of 100 US Boomers, 20 find someone with exactly their set of answers; among US Gen Z, 9 do. The gap survives a check against random combinations of the same answers, so it is not just that Gen Z split more evenly on each issue.",
      "The pattern is lopsided. Gen Z find a match among Boomers about as often as among each other (8.8% against 8.5%). Boomers lose 42% of their matches in a room of Gen Z. The combinations young people hold also exist among older people; many older combinations are rare among the young.",
    ],
  },
  camps: {
    kicker: "03 · Two camps",
    title: "Less polarised, mostly on the right",
    lead: "Score each person from 0 (every answer on the left) to 100 (every answer on the right). 50 is an even mix of positions, not a political centre.",
    where: "Show",
    places: { avg: "Four-country mean", us: "US", uk: "UK", fr: "France", de: "Germany" },
    gens: { boomers: "Boomers", genz: "Gen Z" },
    leftVoters: "Left-wing voters",
    rightVoters: "Right-wing voters",
    gap: (v: string) => `${v}-point gap`,
    axis: { left: "More left", mid: "Even mix", right: "More right" },
    diffTitle: "Gen Z minus Boomers",
    diff: { left: "Left voters", right: "Right voters" },
    ns: "not significant",
    ci: (a: string, b: string) => `95% CI ${a} to ${b}`,
    caption:
      "Average share of right-coded answers on eight party-dividing items, by national vote; both waves pooled. Vote was asked in both waves in the US, only in wave 2 in Europe. Source: Electric Twin, appendix tables.",
    body: [
      "On average, young left-wing voters hold much the same positions as older ones. Young right-wing voters sit near an even mix, while older ones lean clearly right: 15 points between the camps among Gen Z, 28 among Boomers.",
      "The average hides a spread. The shift on the right is large in the US (19 points) and the UK (15), smaller in Germany (9), and not clearly there in France, where Boomer right-wing voters already sit close to an even mix. On the left, UK Gen Z sit further left than UK Boomers, while US Gen Z sit less far left than US Boomers.",
      "Could this be age? People are often said to move right as they get older. But left-wing voters sit in much the same place in every generation, so if age is the explanation, it hardens right-wing voters alone. The report can't rule that out: one snapshot can't tell young right-wing voters who will harden later from a cohort that never will.",
    ],
    callout: {
      title: "Young right-wing voters share a vote, not a worldview",
      body:
        "Only 3.6% of young right-wing voters find someone in a room of 99 young right-wing voters who shares all 13 of their answers, against 18.1% of Boomer right-wing voters and 12.4% of young left-wing voters. They are about as likely to find one among young left-wing voters. One caution: the UK's young right-wing group is the smallest in the survey (203 people).",
    },
  },
  issues: {
    kicker: "04 · Degree, not direction",
    title: "Not a uniform left",
    lead: "Before the chart: for each statement, who do you think backs it more? Tap a generation, then see the answer.",
    who: "Who backs it more?",
    gens: { genz: "Gen Z", boomers: "Boomers" },
    right: "Right.",
    wrong: "Not this time.",
    reveal: (z: string, b: string) => `Gen Z ${z} · Boomers ${b}`,
    score: (n: string, of: string) => `${n} of ${of} right`,
    again: "Play again",
    items: {
      safetyNet: "A strong safety net and regulation, not the market",
      progress: "Social progress and inclusivity over tradition",
      falseInfo: "Social media and government should do more against false information",
      abortion: "Abortion legal and protected in most cases",
      immigration: "Immigration strengthens the country",
      trans: "Trans athletes compete by gender identity",
      ai: "Accelerate AI rather than pause or restrict it",
    } as Record<IssueKey, string>,
    chartTitle: "All seven, side by side",
    evenSplit: "Even split",
    caption:
      "% choosing each statement of a forced-choice pair; equally weighted mean of four countries, both waves. Wording abbreviated. Source: Electric Twin survey.",
    body: [
      "On social questions Gen Z are clearly further left. On false information and AI they are less keen than their parents on institutions stepping in, though most still favour it: two thirds want more done against false information (Boomers: 76%), and 58% favour pausing or restricting AI (Boomers: 66%).",
      "The report says that on 11 of its 13 questions, majorities of both generations sit on the same side. It shows only seven, so only those can be checked, and in none of the seven are the two majorities on opposite sides. They differ in degree more than in direction.",
    ],
    abortion: {
      title: "Abortion runs the other way, and needs care",
      body:
        "On a four-point scale, 63% of Gen Z lean towards “legal and protected” against 73% of Boomers. The whole gap is in Europe, and it is mostly a softening: 53% of European Boomers strongly back legal abortion against 38% of Gen Z, while strong support for “illegal or strictly limited” rises only from 9% to 13%. In the US the generations are level (60% and 59%), and fewer young Americans strongly oppose abortion (16%, against 27% of Boomers).",
    },
  },
  reading: {
    kicker: "05 · Our reading",
    title: "What this means if you sell to, hire or organise young people",
    lead: "This part is ours, not the report's.",
    items: [
      { t: "Stop buying the package", b: "With older audiences, one known view predicts a cluster of others. With Gen Z it predicts far less. A brand that signals a whole bundle of values will meet more young people who agree with half of it." },
      { t: "Segment by what people do, not when they were born", b: "If generation explains less among the young, a “Gen Z” persona is an average of people who disagree with each other. Behaviour, need and context will segment better than birth year." },
      { t: "Don't read the young right as a copy of the old right", b: "Young right-wing voters hold a near-even mix of positions and rarely share a full set with each other. Messages written for older conservatives will miss most of them." },
      { t: "Test issue by issue", b: "Because majorities agree on most questions and differ in degree, the useful question is rarely “left or right?”. It is “how strongly, on this one?”." },
    ],
  },
}

type Copy = typeof en

const fa: Copy = {
  hero: {
    lead:
      "از صد بومر در آمریکا، بریتانیا، فرانسه و آلمان درباره‌ی مهاجرت، مالیات، محیط زیست، ورزشکاران ترنس و تور حمایت اجتماعی بپرسید؛ حدود هشت نفرشان تقریباً در همه‌ی این‌ها نظر راستِ پررنگ دارند. از صد نفر از نوه‌هایشان بپرسید؛ دو نفر. نظرسنجی‌ای با ۵۱٬۹۲۹ پاسخ نشان می‌دهد جوان‌ها از پدر و مادرشان تندروتر نیستند. نظرهایشان کمتر به هم بسته شده است.",
    kpis: [
      { n: "۲٪", l: "از نسل زد نظر راستِ پررنگ دارند", d: "بومرها: ۸٫۴٪. چپِ پررنگ در هر دو حدود ۱۰٪ است." },
      { n: "۵٫۳٪", l: "یک نظر چقدر بقیه را پیش‌بینی می‌کند، نسل زد", d: "بومرها: ۱۶٪. در هر نسلِ جوان‌تر کمتر می‌شود." },
      { n: "۱۵", l: "امتیاز فاصله‌ی رأی‌دهنده‌های چپ و راستِ نسل زد", d: "بومرها: ۲۸ امتیاز، روی مقیاس ۰ تا ۱۰۰." },
      { n: "۴۲٪", l: "از هم‌نظرهای کاملِ بومرها در اتاقی از نسل زد گم می‌شوند", d: "نسل زد در اتاقی از بومرها هم‌نظرهایش را نگه می‌دارد." },
    ],
    medals: "چهار نمودار پایین تعاملی‌اند. هر کدام را امتحان کنید یک نشان به جعبه‌ی نشان‌های مجموعه، در گوشه‌ی پایین، اضافه می‌شود.",
  },
  room: {
    kicker: "۰۱ · اتاق",
    title: "هشت از صد، و دو",
    lead: "هر نقطه یک آدم است. «پررنگ» یعنی در شش پرسش یا بیشتر از هشت پرسشِ مرزبندِ حزبی، قاطعانه در یک سمت جواب داده.",
    pick: "اتاق را پر کن با",
    gens: { boomers: "۱۰۰ بومر", genz: "۱۰۰ نفر از نسل زد" },
    legend: { left: "چپِ پررنگ", right: "راستِ پررنگ", rest: "بقیه" },
    count: (l: string, r: string) => `${l} چپِ پررنگ · ${r} راستِ پررنگ`,
    caption:
      "چپِ پررنگ: ۱۰٪ بومرها، ۹٫۶٪ نسل زد. راستِ پررنگ: ۸٫۴٪ بومرها، ۲٫۰٪ نسل زد. نقطه‌ها به نزدیک‌ترین آدمِ کامل گرد شده‌اند. منبع: نظرسنجی Electric Twin، چهار کشور، دو موج (ژانویه تا آوریل ۲۰۲۶)، ۵۱٬۹۲۹ پاسخ.",
    body: [
      "در سمت چپ، دو نسل شبیه هم‌اند: در هر صد نفر حدود ده چپِ متعهد. در سمت راست نه. جوان‌هایی که به حزب‌های راست رأی می‌دهند ترکیبی تقریباً نصف‌نصف از نظرهای چپ و راست دارند؛ هم‌تاهای مسن‌ترشان آشکارا راست‌اند.",
      "پس میان جوان‌ها چپ بزرگ‌تر نشده. راست کوچک‌تر شده، و به وسط نزدیک‌تر.",
    ],
  },
  bundle: {
    kicker: "۰۲ · بسته‌ها",
    title: "دانستنِ یک نظر، درباره‌ی بقیه کمتر می‌گوید",
    lead: "از همه ۱۳ پرسش سیاستی پرسیده شد، از مهاجرت و سقط جنین تا هوش مصنوعی و تور حمایت اجتماعی. برای یک آدم مسن، یک جواب سرنخ خوبی برای دوازده جواب دیگر است. برای یک جوان، سرنخ ضعیفی است.",
    gens: { boomers: "بومرها", genx: "نسل ایکس", millennials: "میلنیال‌ها", genz: "نسل زد" } as Record<Gen, string>,
    barsLabel: "درصدِ پیش‌بینیِ بهترِ هر نظر از روی ۱۲ نظر دیگر",
    barsCaption:
      "هر کدام از ۱۳ نظرِ یک نفر را چقدر بهتر می‌شود از روی ۱۲ نظر دیگرش پیش‌بینی کرد تا از روی رایج بودنش میان هم‌نسل‌ها، فراتر از ترکیب‌های تصادفی (۰ یعنی هیچ ارتباطی). میانگین چهار کشور، هر دو موج. در هر چهار کشور با هر نسلِ جوان‌تر کمتر می‌شود.",
    twinsTitle: "کسی را پیدا کن که در هر ۱۳ پرسش با تو هم‌نظر است",
    twinsLead:
      "یک نفر را در اتاقی با ۹۹ نفر دیگر از کشور خودش بگذارید و بپرسید: آیا کسی آن‌جا هست که در هر ۱۳ جواب دقیقاً مثل او باشد؟ انتخاب کنید چه کسی وارد می‌شود و اتاق از چه کسانی پر است.",
    you: "تو هستی",
    roomOf: "۹۹ نفرِ اتاق",
    match: (v: string) => `${v} هم‌نظرِ کامل پیدا می‌کنند`,
    chance: (v: string) => `فقط از روی شانس: ${v}`,
    times: (v: string) => `${v} برابرِ شانس`,
    twinsCaption:
      "درصد کسانی که در اتاقی با ۹۹ نفر از هر نسل، در همان کشور، کسی را با دقیقاً همان ۱۳ جواب پیدا می‌کنند؛ میانگین چهار کشور. «شانس» یعنی هر جواب درون گروه بُر خورده: رایج بودنِ هر جواب حفظ می‌شود ولی ترکیبش نه. منبع: پیوست گزارش Electric Twin.",
    body: [
      "در اتاقی با صد بومر آمریکایی، ۲۰ نفر کسی را با دقیقاً همان مجموعه جواب پیدا می‌کنند؛ در میان نسل زد آمریکا، ۹ نفر. این فاصله بعد از مقایسه با ترکیب‌های تصادفیِ همان جواب‌ها هم سر جایش می‌ماند؛ پس فقط به این خاطر نیست که نسل زد روی هر پرسش یکنواخت‌تر تقسیم شده.",
      "الگو یک‌طرفه است. نسل زد میان بومرها تقریباً به همان اندازه هم‌نظر پیدا می‌کند که میان خودش (۸٫۸٪ در برابر ۸٫۵٪). بومرها در اتاقی از نسل زد ۴۲٪ از هم‌نظرهایشان را از دست می‌دهند. ترکیب‌هایی که جوان‌ها دارند میان مسن‌ترها هم هست؛ ولی خیلی از ترکیب‌های مسن‌ترها میان جوان‌ها کمیاب است.",
    ],
  },
  camps: {
    kicker: "۰۳ · دو اردوگاه",
    title: "قطبی‌شدنِ کمتر، بیشتر در سمت راست",
    lead: "به هر نفر از ۰ (همه‌ی جواب‌ها چپ) تا ۱۰۰ (همه‌ی جواب‌ها راست) نمره بدهید. ۵۰ یعنی ترکیبِ برابرِ نظرها، نه «میانه‌ی سیاسی».",
    where: "نمایش",
    places: { avg: "میانگین چهار کشور", us: "آمریکا", uk: "بریتانیا", fr: "فرانسه", de: "آلمان" },
    gens: { boomers: "بومرها", genz: "نسل زد" },
    leftVoters: "رأی‌دهنده‌های چپ",
    rightVoters: "رأی‌دهنده‌های راست",
    gap: (v: string) => `فاصله‌ی ${v} امتیازی`,
    axis: { left: "چپ‌تر", mid: "ترکیب برابر", right: "راست‌تر" },
    diffTitle: "نسل زد منهای بومرها",
    diff: { left: "رأی‌دهنده‌های چپ", right: "رأی‌دهنده‌های راست" },
    ns: "معنادار نیست",
    ci: (a: string, b: string) => `بازه‌ی اطمینان ۹۵٪: ${a} تا ${b}`,
    caption:
      "میانگین سهمِ جواب‌های راست در هشت پرسشِ مرزبندِ حزبی، بر اساس رأی ملی؛ هر دو موج با هم. در آمریکا رأی در هر دو موج پرسیده شد، در اروپا فقط در موج دوم. منبع: جدول‌های پیوست Electric Twin.",
    body: [
      "به‌طور متوسط، رأی‌دهنده‌های چپِ جوان تقریباً همان نظرهای چپ‌های مسن را دارند. رأی‌دهنده‌های راستِ جوان نزدیک به ترکیبِ برابرند، در حالی که مسن‌ترها آشکارا راست‌اند: فاصله‌ی دو اردوگاه در نسل زد ۱۵ امتیاز است و در بومرها ۲۸.",
      "میانگین یک پراکندگی را پنهان می‌کند. جابه‌جایی در سمت راست در آمریکا (۱۹ امتیاز) و بریتانیا (۱۵) بزرگ است، در آلمان (۹) کوچک‌تر، و در فرانسه به‌روشنی دیده نمی‌شود؛ آن‌جا راست‌های بومر از قبل نزدیک ترکیبِ برابرند. در سمت چپ، نسل زدِ بریتانیا از بومرهای بریتانیا چپ‌تر است، ولی نسل زدِ آمریکا از بومرهای آمریکا کمتر چپ.",
      "شاید فقط سن باشد؟ معمولاً می‌گویند آدم‌ها با بالا رفتن سن راست‌تر می‌شوند. ولی رأی‌دهنده‌های چپ تقریباً در همه‌ی نسل‌ها یک جا ایستاده‌اند؛ پس اگر توضیح سن باشد، فقط راست‌ها را سفت‌تر می‌کند. گزارش نمی‌تواند این را رد کند: یک عکسِ لحظه‌ای نمی‌تواند راست‌های جوانی را که بعداً سفت‌تر می‌شوند از نسلی که هرگز نمی‌شود تشخیص دهد.",
    ],
    callout: {
      title: "راست‌های جوان در رأی شریک‌اند، نه در جهان‌بینی",
      body:
        "فقط ۳٫۶٪ از رأی‌دهنده‌های راستِ جوان در اتاقی با ۹۹ راستِ جوان کسی را پیدا می‌کنند که در هر ۱۳ جواب مثل خودشان باشد؛ این رقم برای راست‌های بومر ۱۸٫۱٪ است و برای چپ‌های جوان ۱۲٫۴٪. احتمال اینکه میان چپ‌های جوان هم‌نظر پیدا کنند تقریباً همان‌قدر است. یک احتیاط: گروه راست‌های جوانِ بریتانیا کوچک‌ترین گروه این نظرسنجی است (۲۰۳ نفر).",
    },
  },
  issues: {
    kicker: "۰۴ · شدت، نه جهت",
    title: "یک چپِ یکدست نیست",
    lead: "پیش از نمودار: به نظرتان کدام نسل بیشتر از هر جمله حمایت می‌کند؟ یک نسل را بزنید، بعد جواب را ببینید.",
    who: "کدام نسل بیشتر موافق است؟",
    gens: { genz: "نسل زد", boomers: "بومرها" },
    right: "درست.",
    wrong: "این بار نه.",
    reveal: (z: string, b: string) => `نسل زد ${z} · بومرها ${b}`,
    score: (n: string, of: string) => `${n} از ${of} درست`,
    again: "دوباره",
    items: {
      safetyNet: "تور حمایت اجتماعی قوی و تنظیم‌گری، نه رها کردن به بازار",
      progress: "پیشرفت اجتماعی و فراگیری به جای سنت",
      falseInfo: "شبکه‌های اجتماعی و دولت باید با اطلاعات نادرست بیشتر مقابله کنند",
      abortion: "سقط جنین در بیشتر موارد قانونی و محافظت‌شده باشد",
      immigration: "مهاجرت کشور را قوی‌تر می‌کند",
      trans: "ورزشکاران ترنس بر اساس هویت جنسیتی رقابت کنند",
      ai: "سرعت دادن به هوش مصنوعی، نه توقف یا محدود کردنش",
    } as Record<IssueKey, string>,
    chartTitle: "هر هفت پرسش، کنار هم",
    evenSplit: "نصف‌نصف",
    caption:
      "درصدِ انتخابِ هر جمله از یک جفت جمله‌ی اجباری؛ میانگین هم‌وزن چهار کشور، هر دو موج. عبارت‌ها خلاصه شده‌اند. منبع: نظرسنجی Electric Twin.",
    body: [
      "در پرسش‌های اجتماعی، نسل زد آشکارا چپ‌تر است. در اطلاعات نادرست و هوش مصنوعی، کمتر از والدینش مشتاقِ دخالت نهادهاست، هرچند بیشترشان هنوز موافق‌اند: دو سوم می‌خواهند با اطلاعات نادرست بیشتر مقابله شود (بومرها: ۷۶٪)، و ۵۸٪ موافق توقف یا محدود کردن هوش مصنوعی‌اند (بومرها: ۶۶٪).",
      "به گفته‌ی گزارش، در ۱۱ پرسش از ۱۳ اکثریتِ هر دو نسل در یک سمت‌اند. گزارش فقط هفت پرسش را نشان می‌دهد، پس فقط همین‌ها را می‌شود بررسی کرد، و در هیچ‌کدام اکثریتِ دو نسل در دو سمتِ مخالف نیستند. فرقشان بیشتر در شدت است تا جهت.",
    ],
    abortion: {
      title: "سقط جنین برعکس است، و باید با احتیاط خواند",
      body:
        "روی مقیاسی چهاردرجه‌ای، ۶۳٪ نسل زد به سمت «قانونی و محافظت‌شده» متمایل‌اند و ۷۳٪ بومرها. کل این فاصله در اروپاست و بیشترش «نرم‌تر شدن» است: ۵۳٪ بومرهای اروپایی قاطعانه از قانونی بودن حمایت می‌کنند و ۳۸٪ نسل زد، در حالی که حمایتِ قاطع از «غیرقانونی یا به‌شدت محدود» فقط از ۹٪ به ۱۳٪ می‌رسد. در آمریکا دو نسل برابرند (۶۰٪ و ۵۹٪) و جوان‌های آمریکایی کمتر قاطعانه مخالف‌اند (۱۶٪، در برابر ۲۷٪ بومرها).",
    },
  },
  reading: {
    kicker: "۰۵ · برداشت ما",
    title: "اگر به جوان‌ها چیزی می‌فروشید، استخدامشان می‌کنید یا سازماندهی‌شان می‌کنید",
    lead: "این بخش برداشت ماست، نه حرف گزارش.",
    items: [
      { t: "بسته‌ی کامل نفروشید", b: "در مخاطب مسن‌تر، دانستن یک نظر خوشه‌ای از نظرهای دیگر را پیش‌بینی می‌کند. در نسل زد خیلی کمتر. برندی که یک بسته‌ی کامل از ارزش‌ها را علامت می‌دهد، به جوان‌های بیشتری برمی‌خورد که فقط با نصفش موافق‌اند." },
      { t: "بر اساس رفتار بخش‌بندی کنید، نه سال تولد", b: "اگر «نسل» میان جوان‌ها چیز کمتری را توضیح می‌دهد، پرسونای «نسل زد» میانگینِ آدم‌هایی است که با هم مخالف‌اند. رفتار، نیاز و موقعیت بهتر از سال تولد بخش‌بندی می‌کنند." },
      { t: "راستِ جوان را کپیِ راستِ مسن ندانید", b: "راست‌های جوان ترکیبی تقریباً برابر از نظرها دارند و به‌ندرت مجموعه‌ی کاملی را با هم شریک‌اند. پیامی که برای محافظه‌کارهای مسن نوشته شده، بیشترشان را از دست می‌دهد." },
      { t: "پرسش‌به‌پرسش آزمایش کنید", b: "چون اکثریت در بیشتر پرسش‌ها هم‌نظرند و فقط در شدت فرق دارند، پرسشِ مفید به‌ندرت «چپ یا راست؟» است. پرسش این است: «روی همین موضوع، چقدر قاطع؟»" },
    ],
  },
}

export const COPY: Record<Locale, Copy> = { en, fa }
