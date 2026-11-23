// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/part3/copy.ts
// Why: Every word of report 13 (Gen Z series, part 3) in both locales: how
//      people say their trust has changed, the trust that holds up, the
//      "broadcast account" and where the survey's data stop, the feed
//      experiments, and what follows. Figures from Electric Twin, "Gen Z is
//      Unbound" (Oct 2026), quoted as printed — except the trust-change
//      values, which the report draws without labels and we read off its
//      chart (said wherever they appear). The founders' reading is ours and
//      labelled.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { Institution, Platform } from "../data"

export type StudyKey = "guess" | "nyhan" | "piccardi"
export type FactorKey = "platforms" | "hours" | "posting" | "algorithms" | "creators" | "celebrities" | "vote"
export const FACTOR_KEYS: FactorKey[] = ["platforms", "hours", "posting", "algorithms", "creators", "celebrities", "vote"]

/**
 * The three experiments the report cites (p. 13), and whether changing the
 * feed moved the outcome measured. Local to part 3: not survey data.
 */
export const STUDIES: { key: StudyKey; changed: boolean }[] = [
  { key: "guess", changed: false },
  { key: "nyhan", changed: false },
  { key: "piccardi", changed: true },
]

const en = {
  interp: "The authors' interpretation",
  hero: {
    lead:
      "Asked how their trust in ten institutions has changed, every generation in every country reports a net decline, and people report the steepest falls for politicians and government. What holds up is trust people can check for themselves: their own doctor, their friends and family. The report's explanation is the end of a shared national broadcast culture, and it is candid that this is still an explanation, not a finding.",
    kpis: [
      { n: "87%", l: "trust their own doctor a lot or completely", d: "The most trusted of 15 sources the survey asked about." },
      { n: "83%", l: "trust friends and family a lot or completely", d: "Second of 15. Both are sources people can check." },
      { n: "6.2", l: "platforms Gen Z use each week, of 21", d: "Boomers: 3.0. Twice as many feeds." },
      { n: "A fifth", l: "of the bundling gap that everything measured explains", d: "Wave 2. Four fifths remain unexplained." },
    ],
    medals: "Four figures below are interactive. Each one you try adds a badge to the series case, bottom corner.",
  },
  trust: {
    kicker: "01 · The ledger",
    title: "What happened to trust",
    lead: "People were asked how their trust in each institution has changed, from −2 (much less) to +2 (much more). Every generation in every country reports a net decline.",
    sortLabel: "Sort by",
    sorts: { report: "The report's order", boomers: "Boomers' fall", gap: "Generation gap" },
    gens: { genz: "Gen Z", boomers: "Boomers" },
    noChange: "No change",
    axis: { less: "Less trust", more: "More trust" },
    names: {
      medicine: "Medicine",
      academia: "Academia",
      tech: "Tech",
      banks: "Banks",
      schools: "Schools",
      news: "News media",
      police: "Police",
      religious: "Religious institutions",
      government: "Government",
      politicians: "Politicians",
    } as Record<Institution, string>,
    caption: (p: string) =>
      `Mean self-reported change in trust, −2 (much less) to +2 (much more), excluding “never trusted”; pooled across countries and waves. The report draws this chart without printing its values: we read them off the chart, accurate to about ±${p}. Source: Electric Twin survey.`,
    body: [
      "The largest reported falls are for politicians and government, and among Boomers and Gen X. Gen Z report the smallest. The report says very few people trust politicians completely: between 1% and 7%, depending on generation.",
      "Medicine is the only one of the ten institutions where people report trust rising, slightly, in every generation. On our reading of the chart, only Gen Z report rising trust in academia.",
    ],
    callout: {
      title: "A memory of decline, not a measured one",
      body:
        "These are people's own accounts of how their trust has changed. The report says that over the two months between its waves, measured trust did not fall. What people describe is a loss of confidence that built up over years, and recollections of change are a weaker kind of evidence than repeated measurement.",
    },
  },
  check: {
    kicker: "02 · What holds",
    title: "Trust people can check",
    lead: "Asked to pick the main reason they trust institutions less, the generations largely agree.",
    reasons: [
      { n: "≈3 in 10", t: "say institutions care only about money or power" },
      { n: "≈3 in 10", t: "say institutions aren't honest with the public" },
      { n: "21%", t: "of Boomers add that institutions take political sides, more than younger people" },
    ],
    trusted: { doctor: "Trust their own doctor a lot or completely", family: "Trust friends and family a lot or completely" },
    body: [
      "Your own doctor is the most trusted of the 15 sources the survey asked about (a separate list from the ten institutions above); friends and family come second. Doctors and medicine are also the one institution where people in every generation report trust rising.",
    ],
    interp:
      "Those are the failings people would notice once they can see and compare what institutions do for themselves. Trust that rests on what people can see for themselves is holding up; trust that rested on being people's main source of information is not.",
  },
  broadcast: {
    kicker: "03 · Why?",
    title: "The broadcast account",
    lead: "So much for what the survey found. Why it is happening is harder to show. The report's most natural explanation runs through how information travels.",
    body: [
      "For six or seven decades, from network television in the 1950s to the algorithmic feed in the 2010s, culture flowed through a handful of national channels. The report's image for that era is Walter Cronkite, the CBS anchor often called “the most trusted man in America”, a label from a 1972 poll that CBS then used in its advertising. Mass media created common knowledge at the scale of nations, institutions built their authority on it, and political positions travelled as national packages because the channels that carried them were national.",
      "On this account, the internet broke that. If culture now reaches the young through feeds that cross borders and are cut for each person, you would expect what parts 1 and 2 of this series found: national differences shrinking, and the packages that bundled positions together coming loose.",
    ],
    chartTitle: "Where each generation spends its week",
    sortLabel: "Sort by",
    sorts: { genz: "Gen Z use", boomers: "Boomers' use", gap: "Gap" },
    gens: { genz: "Gen Z", boomers: "Boomers" },
    count: (z: string, b: string, of: string) => `Gen Z use ${z} of ${of} platforms weekly on average; Boomers ${b}.`,
    algo: (v: string) => `The report says about a third (${v}) of “highly online” Gen Z, a subgroup it does not define, say algorithms shape their interests, beliefs or identity a lot.`,
    facebook: "Facebook is the only one of the six that Boomers use more.",
    caption:
      "% using each platform at least weekly; equally weighted across the four countries, both waves pooled. Six of the 21 platforms asked about. Source: Electric Twin survey.",
    platformNote: {} as Partial<Record<Platform, string>>,
  },
  unexplained: {
    kicker: "04 · Honest limits",
    title: "Where the data stop",
    lead: "How much of the broadcast account can the survey actually show? Add the things it measured and see how far they get.",
    factors: {
      platforms: "Platforms used (21)",
      hours: "Hours online",
      posting: "How much people post and comment",
      algorithms: "Whether they think algorithms shape them",
      creators: "Which creators influence their politics",
      celebrities: "Which celebrities they follow",
      vote: "How they vote",
    } as Record<FactorKey, string>,
    added: (n: string, of: string) => `${n} of ${of} measures added`,
    partial: "Somewhere in here. The report gives only the combined figure, not each measure's share.",
    all: "All measured together",
    explained: "Explained: about a fifth (wave 2)",
    rest: "Unexplained: four fifths",
    addAll: "Add all",
    clear: "Clear",
    hours: "The report says hours online explain almost nothing, though they vary widely: Americans in their forties report as much time online as Germans in their twenties.",
    caption:
      "Share of the Boomer–Gen Z gap in how tightly positions are bundled that all measures together explain, including national vote: 20%, wave 2. The report does not split this between measures. Source: Electric Twin survey.",
    body: [
      "What the survey did not measure is what people actually see inside those platforms: the posts, videos and debates in their feeds. That is where the broadcast account says the action is, and where the next study needs to look.",
      "Nor can a single snapshot separate cause from selection: the platforms people choose may reflect who they already are.",
    ],
    verdict: "“The broadcast account is our best explanation. It is not yet a finding.”",
    verdictBy: "Electric Twin, in the report",
  },
  studies: {
    kicker: "05 · The experiments",
    title: "Expecting to be checked",
    lead: "When institutions lose the room, a common response is more fact-checking, moderation and clearer official messaging. Whether that works depends on whether people are shaped by what they are shown. Guess before you flip each card: did changing the feed change minds?",
    ask: "Did changing the feed change the outcome?",
    yes: "Yes",
    no: "No",
    right: "Right.",
    wrong: "Not quite.",
    score: (n: string, of: string) => `${n} of ${of}`,
    items: {
      guess: {
        cite: "Guess et al., Science 381, 2023",
        setup: "For three months around the 2020 US election, some Facebook and Instagram users saw a chronological feed instead of the ranked one.",
        result: "No significant change in polarisation or political attitudes.",
      },
      nyhan: {
        cite: "Nyhan et al., Nature 620, 2023",
        setup: "In the same election, 23,377 Facebook users took part; for some, content from like-minded sources was cut back sharply.",
        result: "No measurable effect on any of eight attitude measures, polarisation among them.",
      },
      piccardi: {
        cite: "Piccardi et al., Science 390, 2025",
        setup: "For 10 days, a browser extension reranked the X feeds of 1,256 people to show more or fewer posts expressing partisan hostility.",
        result: "Feelings toward the other side moved with the feed, in both directions: about 2 points on a 100-point scale. Small, but real.",
      },
    } as Record<StudyKey, { cite: string; setup: string; result: string }>,
    body: [
      "The experimental evidence is mixed: what people are shown and what they go looking for both seem to matter. Campaigns that work tend to activate values people already hold.",
      "Texas's transport department launched “Don't Mess with Texas” in 1986; it cut highway litter by recasting it as an insult to Texans' pride. The UK's March 2020 message, “Stay at home, protect the NHS, save lives”, drew in the same way on the public's regard for the NHS.",
    ],
    pull: "The same technologies that dissolved centralised authority also make verification possible.",
    callout: {
      title: "Earn it in front of people who can check",
      body:
        "The report's conclusion: trust at scale is more likely to be rebuilt by institutions that expect to be checked, against competing accounts, in front of an audience that can check their work. Those that organise themselves around being worthy of that scrutiny will rebuild it. Those that rely on their position alone risk losing the room.",
    },
  },
  follows: {
    kicker: "06 · What follows",
    title: "The Great Unbundling",
    lead: "If the broadcast account is right, Gen Z is not a generation with a distinctive bundle of values. It is the first cohort to grow up without a shared national information system.",
    body: [
      "For most of history, the culture people learned from was local. For most of the last century it was national, carried by a handful of broadcasters. For Gen Z it is online: shared across borders, but cut differently for each person. The same environment that gives young people in four countries the same references also lets each of them assemble their own politics from it. The report calls this the Great Unbundling: a more global culture, with more microcultures inside it. It may also mean that “Gen Z” does not exist as a group the way “Boomers” did.",
    ],
    consequencesTitle: "Three consequences the report draws",
    consequences: [
      { t: "Brands", b: "Chasing “the Gen Z consumer” means chasing an average that describes few young people. Demographic labels are a weaker guide to younger people's views than to older people's." },
      { t: "Institutions", b: "Rebuilding trust only by improving the product risks a category error. Trust never rested on quality alone; it also rested on a central place in a shared information system, and that place has changed." },
      { t: "Researchers and pollsters", b: "Expect generation to explain less among the young than among older people." },
    ],
    room: {
      title: "A different room",
      body: [
        "In 1840 Alexis de Tocqueville described a problem of societies of equals: scattered individuals “cannot see, and know not where to find, one another” (Democracy in America, vol. 2). They need something to coordinate them, and for him it was the newspaper, which did more than offer opinions. It let readers discover that strangers thought what they thought, and that they were not alone.",
        "For most of the last century that room was national. For the young it may no longer be: their views are less tied to their own country, more shared with peers abroad, and less divided into two camps. Whether a room like that can support the coordination a society needs, and whether the young sort themselves into camps as they age, are the questions the report leaves to the next decade.",
      ],
    },
  },
  reading: {
    kicker: "07 · Our reading",
    title: "What this means if you are building something",
    lead: "This part is ours, not the report's.",
    items: [
      { t: "Make your claims checkable", b: "The trust that holds up is the kind people can verify. Show the work: real numbers, receipts, named customers, reviews you didn't curate, a changelog. Being the official source counts for less than it did." },
      { t: "Don't plan on being the channel", b: "No single feed reaches everyone, and none is national. Assume your message arrives in many places, next to competing accounts, and will be compared with them." },
      { t: "Lead with a value people already hold", b: "The campaigns that worked recruited pride and loyalty people already had. Find the one value you genuinely share with your audience instead of asking them to adopt yours." },
      { t: "Treat “Gen Z” as an average, not a person", b: "Across all three parts of this series, generation explains less among the young. Segment by what people do and need; test across borders, since what lands with the young in one country is likelier to land in the others." },
    ],
  },
}

type Copy = typeof en

const fa: Copy = {
  interp: "برداشتِ نویسندگانِ گزارش",
  hero: {
    lead:
      "وقتی پرسیده شد اعتمادشان به ده نهاد چه تغییری کرده، همه‌ی نسل‌ها در هر چهار کشور از کاهش خالص خبر دادند، و بیشترین کاهشی که گزارش کردند برای سیاستمدارها و دولت بود. آنچه سر پا مانده اعتمادی است که آدم‌ها خودشان می‌توانند وارسی‌اش کنند: پزشک خودشان، دوستان و خانواده‌شان. توضیح گزارش پایانِ یک فرهنگِ پخشِ ملیِ مشترک است، و صادقانه می‌گوید این هنوز یک توضیح است، نه یافته.",
    kpis: [
      { n: "۸۷٪", l: "به پزشک خودشان زیاد یا کاملاً اعتماد دارند", d: "مورد اعتمادترین منبع، از ۱۵ منبعی که پرسیده شد." },
      { n: "۸۳٪", l: "به دوستان و خانواده زیاد یا کاملاً اعتماد دارند", d: "دوم از ۱۵. هر دو منبع‌هایی‌اند که می‌شود وارسی‌شان کرد." },
      { n: "۶٫۲", l: "پلتفرمی که نسل زد هر هفته استفاده می‌کند، از ۲۱", d: "بومرها: ۳٫۰. دو برابر فید." },
      { n: "یک پنجم", l: "از فاصله‌ی «بسته‌بودن» نظرها که همه‌ی سنجه‌ها توضیح می‌دهند", d: "موج دوم. چهار پنجم بی‌توضیح می‌ماند." },
    ],
    medals: "چهار نمودار پایین تعاملی‌اند. هر کدام را امتحان کنید یک نشان به جعبه‌ی نشان‌های مجموعه، در گوشه‌ی پایین، اضافه می‌شود.",
  },
  trust: {
    kicker: "۰۱ · دفتر حساب",
    title: "سر اعتماد چه آمد",
    lead: "از آدم‌ها پرسیده شد اعتمادشان به هر نهاد چه تغییری کرده، از ۲− (خیلی کمتر) تا ۲+ (خیلی بیشتر). همه‌ی نسل‌ها در همه‌ی کشورها از کاهش خالص خبر می‌دهند.",
    sortLabel: "مرتب‌سازی بر اساس",
    sorts: { report: "ترتیب گزارش", boomers: "افت بومرها", gap: "فاصله‌ی دو نسل" },
    gens: { genz: "نسل زد", boomers: "بومرها" },
    noChange: "بدون تغییر",
    axis: { less: "اعتماد کمتر", more: "اعتماد بیشتر" },
    names: {
      medicine: "پزشکی",
      academia: "دانشگاه",
      tech: "شرکت‌های فناوری",
      banks: "بانک‌ها",
      schools: "مدرسه‌ها",
      news: "رسانه‌های خبری",
      police: "پلیس",
      religious: "نهادهای دینی",
      government: "دولت",
      politicians: "سیاستمدارها",
    } as Record<Institution, string>,
    caption: (p: string) =>
      `میانگینِ تغییرِ اعتماد به گفته‌ی خود افراد، از ۲− (خیلی کمتر) تا ۲+ (خیلی بیشتر)، بدون کسانی که «هرگز اعتماد نداشتند»؛ همه‌ی کشورها و هر دو موج با هم. گزارش این نمودار را بدون چاپ عددها کشیده: ما عددها را از روی نمودار خوانده‌ایم، با دقتِ حدود ±${p}. منبع: نظرسنجی Electric Twin.`,
    body: [
      "بیشترین کاهش‌ها برای سیاستمدارها و دولت است، و در میان بومرها و نسل ایکس. نسل زد کمترین کاهش را گزارش می‌کند. به گفته‌ی گزارش، خیلی کم کسی به سیاستمدارها کاملاً اعتماد دارد: بسته به نسل، بین ۱٪ تا ۷٪.",
      "پزشکی تنها نهاد از این ده نهاد است که آدم‌ها در همه‌ی نسل‌ها از کمی افزایشِ اعتماد به آن خبر می‌دهند. طبق خوانشِ ما از نمودار، فقط نسل زد از بالا رفتنِ اعتمادش به دانشگاه خبر می‌دهد.",
    ],
    callout: {
      title: "خاطره‌ی افت، نه افتِ اندازه‌گیری‌شده",
      body:
        "این‌ها روایتِ خودِ آدم‌ها از تغییرِ اعتمادشان است. به گفته‌ی گزارش، در دو ماهِ فاصله‌ی دو موجِ نظرسنجی، اعتمادِ اندازه‌گیری‌شده پایین نیامد. آنچه آدم‌ها توصیف می‌کنند از دست رفتنِ اطمینانی است که طی سال‌ها جمع شده؛ و به‌یادآوردنِ تغییر، شاهدِ ضعیف‌تری است تا اندازه‌گیریِ تکراری.",
    },
  },
  check: {
    kicker: "۰۲ · آنچه می‌ماند",
    title: "اعتمادی که آدم‌ها می‌توانند وارسی کنند",
    lead: "وقتی خواسته شد دلیل اصلیِ کم شدن اعتمادشان به نهادها را انتخاب کنند، نسل‌ها تا حد زیادی هم‌نظرند.",
    reasons: [
      { n: "حدود ۳ از ۱۰", t: "می‌گویند نهادها فقط به پول یا قدرت اهمیت می‌دهند" },
      { n: "حدود ۳ از ۱۰", t: "می‌گویند نهادها با مردم صادق نیستند" },
      { n: "۲۱٪", t: "از بومرها اضافه می‌کنند که نهادها طرفِ یک جناح سیاسی را می‌گیرند؛ بیشتر از جوان‌ترها" },
    ],
    trusted: { doctor: "به پزشک خودشان زیاد یا کاملاً اعتماد دارند", family: "به دوستان و خانواده زیاد یا کاملاً اعتماد دارند" },
    body: [
      "پزشکِ خودتان مورد اعتمادترین منبع از ۱۵ منبعی است که پرسیده شد (فهرستی جدا از ده نهادِ بالا)؛ دوستان و خانواده دوم‌اند. پزشکی همچنین تنها نهادی است که آدم‌ها در همه‌ی نسل‌ها از بالا رفتنِ اعتماد به آن خبر می‌دهند.",
    ],
    interp:
      "این‌ها همان ایرادهایی‌اند که آدم‌ها وقتی خودشان بتوانند کار نهادها را ببینند و مقایسه کنند، متوجهشان می‌شوند. اعتمادی که روی آنچه آدم‌ها خودشان می‌بینند بنا شده سر پا مانده؛ اعتمادی که روی «منبع اصلیِ خبر بودن» بنا شده بود، نه.",
  },
  broadcast: {
    kicker: "۰۳ · چرا؟",
    title: "روایتِ دورانِ پخش",
    lead: "تا این‌جا آنچه نظرسنجی پیدا کرد. اینکه چرا اتفاق می‌افتد سخت‌تر نشان داده می‌شود. طبیعی‌ترین توضیحِ گزارش از مسیرِ حرکتِ اطلاعات می‌گذرد.",
    body: [
      "شش هفت دهه، از تلویزیون‌های سراسری در دهه‌ی ۱۹۵۰ تا فیدِ الگوریتمی در دهه‌ی ۲۰۱۰، فرهنگ از چند کانالِ ملیِ معدود عبور می‌کرد. تصویرِ گزارش از آن دوران والتر کرانکایت است، مجریِ خبرِ CBS که اغلب «مورد اعتمادترین مردِ آمریکا» خوانده می‌شود؛ لقبی که از یک نظرسنجیِ سال ۱۹۷۲ آمد و CBS بعد در تبلیغاتش از آن استفاده کرد. رسانه‌ی جمعی در مقیاسِ یک ملت «دانستهٔ مشترک» می‌ساخت، نهادها اعتبارشان را روی آن بنا کردند، و مواضع سیاسی به شکل بسته‌های ملی جابه‌جا می‌شد، چون کانال‌هایی که آن‌ها را می‌بردند ملی بودند.",
      "به روایتِ این توضیح، اینترنت این را شکست. اگر فرهنگ حالا از راه فیدهایی به جوان‌ها می‌رسد که از مرزها رد می‌شوند و برای هر نفر جداگانه بریده می‌شوند، باید همان چیزی را انتظار داشت که بخش‌های ۱ و ۲ این مجموعه پیدا کردند: تفاوت‌های ملی کوچک می‌شوند و بسته‌هایی که مواضع را به هم گره می‌زدند باز می‌شوند.",
    ],
    chartTitle: "هر نسل هفته‌اش را کجا می‌گذراند",
    sortLabel: "مرتب‌سازی بر اساس",
    sorts: { genz: "استفاده‌ی نسل زد", boomers: "استفاده‌ی بومرها", gap: "فاصله" },
    gens: { genz: "نسل زد", boomers: "بومرها" },
    count: (z: string, b: string, of: string) => `نسل زد به‌طور میانگین هر هفته از ${z} پلتفرم از ${of} پلتفرم استفاده می‌کند؛ بومرها از ${b}.`,
    algo: (v: string) => `به گفته‌ی گزارش، حدود یک سوم (${v}) از نسل زدِ «خیلی آنلاین»، زیرگروهی که تعریفش نکرده، می‌گویند الگوریتم‌ها علایق، باورها یا هویتشان را زیاد شکل می‌دهند.`,
    facebook: "فیسبوک تنها پلتفرم از این شش تاست که بومرها بیشتر از آن استفاده می‌کنند.",
    caption:
      "درصد کسانی که دست‌کم هفته‌ای یک بار از هر پلتفرم استفاده می‌کنند؛ میانگین هم‌وزن چهار کشور، هر دو موج با هم. شش پلتفرم از ۲۱ پلتفرمی که پرسیده شد. منبع: نظرسنجی Electric Twin.",
    platformNote: {} as Partial<Record<Platform, string>>,
  },
  unexplained: {
    kicker: "۰۴ · مرزهای صادقانه",
    title: "جایی که داده‌ها تمام می‌شوند",
    lead: "نظرسنجی واقعاً چقدر از روایتِ دورانِ پخش را می‌تواند نشان دهد؟ چیزهایی را که اندازه گرفته اضافه کنید و ببینید تا کجا می‌رسند.",
    factors: {
      platforms: "پلتفرم‌هایی که استفاده می‌کنند (۲۱)",
      hours: "ساعت‌های آنلاین بودن",
      posting: "چقدر پست و کامنت می‌گذارند",
      algorithms: "اینکه فکر می‌کنند الگوریتم‌ها شکلشان می‌دهند یا نه",
      creators: "کدام تولیدکننده‌های محتوا روی سیاستشان اثر دارند",
      celebrities: "کدام سلبریتی‌ها را دنبال می‌کنند",
      vote: "به چه کسی رأی می‌دهند",
    } as Record<FactorKey, string>,
    added: (n: string, of: string) => `${n} از ${of} سنجه اضافه شد`,
    partial: "جایی در همین محدوده. گزارش فقط عددِ مجموع را می‌دهد، نه سهمِ هر سنجه را.",
    all: "همه‌ی سنجه‌ها با هم",
    explained: "توضیح‌داده‌شده: حدود یک پنجم (موج دوم)",
    rest: "بی‌توضیح: چهار پنجم",
    addAll: "همه را اضافه کن",
    clear: "پاک کن",
    hours: "به گفته‌ی گزارش، ساعت‌های آنلاین بودن تقریباً هیچ چیز را توضیح نمی‌دهد، با اینکه خیلی متفاوت است: آمریکایی‌های چهل‌وچندساله به اندازه‌ی آلمانی‌های بیست‌وچندساله آنلاین بودن گزارش می‌کنند.",
    caption:
      "سهمی از فاصله‌ی بومرها و نسل زد در «به هم بسته بودنِ» مواضع که همه‌ی سنجه‌ها با هم، از جمله رأی ملی، توضیح می‌دهند: ۲۰٪، موج دوم. گزارش این را میان سنجه‌ها تقسیم نمی‌کند. منبع: نظرسنجی Electric Twin.",
    body: [
      "آنچه نظرسنجی اندازه نگرفت چیزی است که آدم‌ها واقعاً درون این پلتفرم‌ها می‌بینند: پست‌ها، ویدیوها و بحث‌های فیدشان. روایتِ دورانِ پخش می‌گوید اتفاقِ اصلی همان‌جاست، و پژوهشِ بعدی باید همان‌جا را نگاه کند.",
      "یک عکسِ لحظه‌ای هم نمی‌تواند علت را از انتخاب جدا کند: شاید پلتفرم‌هایی که آدم‌ها انتخاب می‌کنند بازتابِ همان کسی باشد که از قبل بوده‌اند.",
    ],
    verdict: "«روایتِ دورانِ پخش بهترین توضیحِ ماست. هنوز یافته نیست.»",
    verdictBy: "Electric Twin، در متن گزارش",
  },
  studies: {
    kicker: "۰۵ · آزمایش‌ها",
    title: "انتظارِ وارسی شدن",
    lead: "وقتی نهادها مجلس را می‌بازند، واکنشِ رایج راستی‌آزمایی، نظارت بر محتوا و پیام‌رسانیِ رسمیِ روشن‌تر است. اینکه جواب بدهد یا نه بستگی دارد به اینکه آدم‌ها از آنچه نشانشان داده می‌شود شکل می‌گیرند یا نه. پیش از برگرداندنِ هر کارت حدس بزنید: عوض کردنِ فید نظرها را عوض کرد؟",
    ask: "عوض کردنِ فید نتیجه را تغییر داد؟",
    yes: "بله",
    no: "نه",
    right: "درست.",
    wrong: "نه دقیقاً.",
    score: (n: string, of: string) => `${n} از ${of}`,
    items: {
      guess: {
        cite: "Guess و همکاران، Science، جلد ۳۸۱، ۲۰۲۳",
        setup: "سه ماه در حوالی انتخابات ۲۰۲۰ آمریکا، به بخشی از کاربرانِ فیسبوک و اینستاگرام به جای فیدِ رتبه‌بندی‌شده، فیدِ زمانی نشان داده شد.",
        result: "هیچ تغییرِ معناداری در قطبی‌شدن یا نگرش‌های سیاسی دیده نشد.",
      },
      nyhan: {
        cite: "Nyhan و همکاران، Nature، جلد ۶۲۰، ۲۰۲۳",
        setup: "در همان انتخابات ۲۳٬۳۷۷ کاربرِ فیسبوک شرکت کردند؛ برای بخشی از آن‌ها محتوای منبع‌های هم‌فکر به‌شدت کم شد.",
        result: "روی هیچ‌کدام از هشت سنجه‌ی نگرش، از جمله قطبی‌شدن، اثرِ قابل‌اندازه‌گیری نداشت.",
      },
      piccardi: {
        cite: "Piccardi و همکاران، Science، جلد ۳۹۰، ۲۰۲۵",
        setup: "ده روز، یک افزونه‌ی مرورگر فیدِ X را برای ۱٬۲۵۶ نفر طوری دوباره مرتب کرد که پست‌های پر از خصومتِ حزبی بیشتر یا کمتر دیده شوند.",
        result: "احساس به طرف مقابل همراهِ فید جابه‌جا شد، در هر دو جهت: حدود ۲ امتیاز روی مقیاسی ۱۰۰ امتیازی. کوچک، ولی واقعی.",
      },
    } as Record<StudyKey, { cite: string; setup: string; result: string }>,
    body: [
      "شواهدِ آزمایشی یک‌دست نیست: هم آنچه به آدم‌ها نشان داده می‌شود مهم به نظر می‌رسد و هم آنچه خودشان دنبالش می‌گردند. کارزارهایی که جواب می‌دهند معمولاً ارزش‌هایی را بیدار می‌کنند که آدم‌ها از قبل دارند.",
      "اداره‌ی راه‌وترابریِ تگزاس کارزارِ «Don't Mess with Texas» (با تگزاس درنیفت) را در ۱۹۸۶ راه انداخت؛ زباله ریختن در جاده‌ها را به توهین به غرورِ تگزاسی‌ها تبدیل کرد و آن را کم کرد. پیامِ مارس ۲۰۲۰ بریتانیا، «در خانه بمانید، از NHS محافظت کنید، جان‌ها را نجات دهید»، به همین شکل از احترامِ مردم به نظامِ سلامتِ ملی کمک گرفت.",
    ],
    pull: "همان فناوری‌هایی که اقتدارِ متمرکز را حل کردند، وارسی را هم ممکن می‌کنند.",
    callout: {
      title: "اعتماد را جلوی چشمِ کسانی بسازید که می‌توانند وارسی کنند",
      body:
        "نتیجه‌گیریِ گزارش: اعتماد در مقیاسِ بزرگ به احتمالِ بیشتر به دستِ نهادهایی دوباره ساخته می‌شود که انتظارِ وارسی شدن دارند، کنارِ روایت‌های رقیب، جلوی مخاطبی که می‌تواند کارشان را بسنجد. آن‌هایی که خودشان را حولِ شایستگیِ این وارسی سازمان می‌دهند اعتماد را دوباره می‌سازند. آن‌هایی که فقط به جایگاهشان تکیه می‌کنند، ممکن است مجلس را ببازند.",
    },
  },
  follows: {
    kicker: "۰۶ · آنچه در پی می‌آید",
    title: "باز شدنِ بزرگِ بسته‌ها",
    lead: "اگر روایتِ دورانِ پخش درست باشد، نسل زد نسلی با یک بسته‌ی ارزشیِ خاص نیست. نخستین نسلی است که بدون یک نظامِ اطلاعاتیِ ملیِ مشترک بزرگ شده.",
    body: [
      "در بیشترِ تاریخ، فرهنگی که آدم‌ها از آن یاد می‌گرفتند محلی بود. در بیشترِ قرنِ گذشته ملی بود و چند پخش‌کننده آن را می‌بردند. برای نسل زد آنلاین است: میانِ مرزها مشترک، ولی برای هر نفر جداگانه بریده‌شده. همان محیطی که به جوان‌های چهار کشور ارجاع‌های مشترک می‌دهد، به هر کدامشان اجازه می‌دهد سیاستِ خودش را از آن سرِهم کند. گزارش اسمش را «باز شدنِ بزرگِ بسته‌ها» (Great Unbundling) گذاشته: فرهنگی جهانی‌تر، با خرده‌فرهنگ‌های بیشتر درونش. شاید هم معنایش این باشد که «نسل زد» آن‌طور که «بومرها» یک گروه بودند، گروه نیست.",
    ],
    consequencesTitle: "سه پیامدی که گزارش می‌گیرد",
    consequences: [
      { t: "برندها", b: "دنبال کردنِ «مصرف‌کننده‌ی نسل زد» یعنی دنبال کردنِ میانگینی که کمتر جوانی را توصیف می‌کند. برچسب‌های جمعیتی برای نظرِ جوان‌ترها راهنمای ضعیف‌تری‌اند تا برای مسن‌ترها." },
      { t: "نهادها", b: "بازسازیِ اعتماد فقط با بهتر کردنِ محصول، خطرِ یک اشتباهِ مقوله‌ای دارد. اعتماد هیچ‌وقت فقط روی کیفیت بنا نشده بود؛ روی جایگاهِ مرکزی در یک نظامِ اطلاعاتیِ مشترک هم بنا شده بود، و آن جایگاه عوض شده." },
      { t: "پژوهشگرها و نظرسنج‌ها", b: "انتظار داشته باشید «نسل» میانِ جوان‌ها چیزِ کمتری را توضیح دهد تا میانِ مسن‌ترها." },
    ],
    room: {
      title: "مجلسی دیگر",
      body: [
        "آلکسی دو توکویل در ۱۸۴۰، در جلد دوم «دموکراسی در آمریکا»، مسئله‌ای از جامعه‌های برابر را توصیف کرد: آدم‌های پراکنده «نه یکدیگر را می‌بینند و نه می‌دانند کجا پیدایش کنند». به چیزی نیاز دارند که هماهنگشان کند، و برای او این چیز روزنامه بود؛ روزنامه فقط نظر عرضه نمی‌کرد، به خواننده‌ها نشان می‌داد غریبه‌ها هم همان‌طور فکر می‌کنند و تنها نیستند.",
        "در بیشترِ قرنِ گذشته این مجلس ملی بود. برای جوان‌ها شاید دیگر نباشد: نظرهایشان کمتر به کشورِ خودشان گره خورده، بیشتر با هم‌نسل‌هایشان در خارج مشترک است، و کمتر به دو اردوگاه تقسیم شده. اینکه چنین مجلسی می‌تواند هماهنگیِ لازمِ یک جامعه را تأمین کند یا نه، و اینکه جوان‌ها با بالا رفتنِ سن در اردوگاه‌ها جا می‌گیرند یا نه، پرسش‌هایی است که گزارش به دهه‌ی آینده می‌سپارد.",
      ],
    },
  },
  reading: {
    kicker: "۰۷ · برداشت ما",
    title: "اگر دارید چیزی می‌سازید، این یعنی چه",
    lead: "این بخش برداشت ماست، نه حرف گزارش.",
    items: [
      { t: "ادعاهایتان را وارسی‌پذیر کنید", b: "اعتمادی که سر پا مانده همان است که آدم‌ها می‌توانند بسنجند. کار را نشان دهید: عددهای واقعی، رسید، مشتری‌های با نام، نظرهایی که دست‌چین نکرده‌اید، تاریخچه‌ی تغییرات. «منبعِ رسمی بودن» کمتر از گذشته وزن دارد." },
      { t: "روی «کانال بودن» حساب نکنید", b: "هیچ فیدی به همه نمی‌رسد و هیچ‌کدام ملی نیست. فرض کنید پیامتان در جاهای زیادی، کنارِ روایت‌های رقیب، می‌رسد و با آن‌ها مقایسه می‌شود." },
      { t: "با ارزشی شروع کنید که مخاطب از قبل دارد", b: "کارزارهای موفق غرور و وفاداری‌ای را به کار گرفتند که آدم‌ها از قبل داشتند. آن یک ارزشی را پیدا کنید که واقعاً با مخاطبتان مشترک است، به جای اینکه از او بخواهید ارزش‌های شما را بپذیرد." },
      { t: "«نسل زد» را میانگین بدانید، نه یک آدم", b: "در هر سه بخشِ این مجموعه، «نسل» میانِ جوان‌ها چیزِ کمتری را توضیح می‌دهد. بر اساسِ رفتار و نیاز بخش‌بندی کنید؛ و میانِ کشورها آزمایش کنید، چون آنچه در یک کشور به دلِ جوان‌ها می‌نشیند احتمالِ بیشتری دارد در کشورهای دیگر هم بنشیند." },
    ],
  },
}

export const COPY: Record<Locale, Copy> = { en, fa }
