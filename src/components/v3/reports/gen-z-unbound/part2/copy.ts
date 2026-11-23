// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/part2/copy.ts
// Why: Every word of report 12 (Gen Z series, part 2) in both locales: how
//      much the four countries differ per question, guessing a country from
//      someone's views, cultural distance (CFST), finding a match abroad and
//      the shared stars. Figures from Electric Twin, "Gen Z is Unbound"
//      (Oct 2026), quoted as printed. The founders' reading is ours and
//      labelled.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { CfstKey, Country, Gen } from "../data"

const en = {
  hero: {
    lead:
      "Young Americans, Britons, French and Germans hold remarkably similar mixes of political views. Among their grandparents, the differences between the four countries are about three times as large. Gen Z still use national platforms and follow national creators, but they share more of the same culture, and their politics has followed.",
    kpis: [
      { n: "4", l: "points between countries per question, Gen Z", d: "Share taking each side, averaged over 13 questions." },
      { n: "11", l: "points between countries per question, Boomers", d: "About three times the Gen Z gap." },
      { n: "29%", l: "accuracy guessing a young person's country", d: "Chance is 25%. Boomers: 42%." },
      { n: "46%", l: "of Gen Z's celebrity answers name someone given in all four", d: "Boomers: 17%. Wave 2 only." },
    ],
    medals: "Four figures below are interactive. Each one you try adds a badge to the series case, bottom corner.",
  },
  spread: {
    kicker: "01 · Borders",
    title: "Eleven points apart, or four",
    lead: "Take any of the 13 policy questions and look at the share of each country's people on each side. How far apart are the four countries?",
    gens: { boomers: "Boomers", genz: "Gen Z" },
    unit: "points between countries, per question",
    caption: "Average difference between the four countries in the share taking each side, across 13 policy questions. Source: Electric Twin survey, two waves (Jan–Apr 2026), 51,929 survey responses.",
    body: [
      "If Gen Z were simply scattered, young people in different countries would scatter in different directions. They don't. Boomers hold recognisably national sets of positions; Gen Z hold much the same mix wherever they live.",
      "That is the second finding of the survey, and it sits next to the first (part 1): the young are less tied together within each person, and less tied to their own country.",
    ],
  },
  guess: {
    kicker: "02 · Guess the country",
    title: "Can you tell where someone lives from their politics?",
    lead: "A model was trained to guess a person's country from their 13 policy answers. With four countries, blind guessing scores 25%. Before you look: how well does it do for Gen Z?",
    predict: "Your guess for Gen Z",
    reveal: "Show the answer",
    yours: (v: string) => `You guessed ${v}`,
    off: (v: string) => `Off by ${v} points`,
    gens: { boomers: "Boomers", genx: "Gen X", millennials: "Millennials", genz: "Gen Z" } as Record<Gen, string>,
    chance: "Chance: 25%",
    label: "% correctly guessing country from 13 positions",
    caption: "Cross-validated accuracy of a model guessing a participant's country from their 13 policy positions, countries balanced. Source: Electric Twin survey.",
    body: [
      "For Boomers the model gets it right 42% of the time. For Gen Z, 29%, barely better than picking one of the four countries at random (25%).",
      "The report says the pattern holds for men and women separately, and when people who rushed through the survey are set aside. It also says that among Gen Z, men and women differ more from each other than one country's young people differ from another's; it does not print the numbers behind that. For trust in sources the convergence is weaker, but it runs the same way.",
    ],
  },
  distance: {
    kicker: "03 · Cultural distance",
    title: "National differences shrink most in politics",
    lead: "The report measures how different two countries' answers are with a number borrowed from population genetics. 0 means identical answers.",
    pick: "Measure",
    keys: { policy: "Policy positions", trust: "Trust in sources", platforms: "Platforms used" } as Record<CfstKey, string>,
    gens: { boomers: "Boomers", genz: "Gen Z" },
    smaller: (v: string) => `Distance ratio: ${v}× smaller for Gen Z`,
    caption: "Cultural distance between countries (CFST, 0 = identical answers), mean of the six country pairs, corrected for sampling noise. The ratio is of a variance-based distance: it grows roughly with the square of the gaps, so 11× does not mean eleven times less different. Source: Electric Twin survey.",
    what: {
      title: "What CFST is",
      body:
        "Geneticists use FST to measure how different two populations are. Michael Muthukrishna and colleagues (2020) adapted it to survey answers: the share of all variation in answers that lies between countries rather than within them. A small number means the people of two countries answer much like each other.",
    },
    body: [
      "On policy, the CFST between countries is about eleven times smaller among Gen Z than among Boomers; on trust in sources, 2.3 times; on the platforms people use, only 1.2 times. Because CFST is built from variances, it shrinks roughly with the square of the gaps. In plain percentage points, the four countries sit about 11 points apart per question among Boomers and about 4 among Gen Z: roughly three times closer, not eleven.",
      "So young people don't use the same platforms everywhere: their platform mixes remain nearly as national as older people's. What they share more is culture.",
    ],
  },
  abroad: {
    kicker: "04 · A match abroad",
    title: "Abroad, Gen Z lose far fewer matches",
    lead: "Fill a room of 99 with people of the same generation, but from another country. Does anyone share all 13 of your answers?",
    pick: "Show",
    gens: { boomers: "Boomers", genz: "Gen Z" },
    countries: { us: "US", uk: "UK", fr: "France", de: "Germany" } as Record<Country, string>,
    person: "Person from",
    room: "Room from",
    own: "Outlined: own country.",
    lostTitle: "Matches lost in another country's room",
    lost: (v: string) => `${v} lost`,
    lostGens: { genz: "Gen Z", millennials: "Millennials", genx: "Gen X", boomers: "Boomers" } as Record<Gen, string>,
    caption: "% of people (rows) who find someone with exactly their 13 policy answers in a room of 99 drawn from each country's same generation (columns). Both waves pooled, survey-weighted. The report's tables give the own-country Boomer average as 17.4–17.6 depending on the table; the summary uses 17.5. Source: Electric Twin, appendix.",
    body: [
      "In another country's room, Boomers lose 28% of their matches (17.5% at home, 12.6% abroad) and Gen Z 9% (95% interval 3 to 15). The difference, 19 points, has a 95% interval of 12 to 26.",
      "The report says the Boomer loss is about single questions, not combinations: chance falls abroad by the same proportion, so Boomers match at about 4.5 times chance both at home and abroad (the report rounds it to 4.6). Boomers in each country lean differently on single questions; Gen Z lean much the same way everywhere. Every whole-generation room, all 144, matches above chance, at 2.8 to 7.2 times the chance rate.",
    ],
  },
  stars: {
    kicker: "05 · Shared stars",
    title: "Same stars, national screens",
    lead: "People were asked which celebrities most people their age would know. Six names given in all four countries. Who named which?",
    sortInto: "Named by",
    gens: { boomers: "Boomers", genz: "Gen Z" },
    check: "Check",
    score: (n: string) => `${n} of 6 right`,
    again: "Try again",
    resultTitle: "Celebrity answers naming someone given in all four countries",
    caption: "Wave 2 only (22–26 April 2026), mentions equalised across countries. Names ranked by their share in their weakest country. Source: Electric Twin survey.",
    body: [
      "In the second wave, 46% of Gen Z's answers name someone given in all four countries, against 17% of Boomers'. The people they personally follow are still mostly national: French Gen Z, for instance, favour French YouTubers.",
    ],
  },
  means: {
    title: "The authors' reading: a national conversation is less national than it looks",
    body:
      "This is the report's interpretation, not a measured result. National platforms, the authors write, but more and more of the same stars, jokes and arguments on them; political debates may travel the same way, starting in one country and argued in all four. If so, a message that lands with young people in one country is more likely to land in the others.",
  },
  reading: {
    kicker: "06 · Our reading",
    title: "What this means if you launch across borders",
    lead: "This part is ours, not the report's.",
    items: [
      { t: "A youth campaign can travel", b: "If young audiences in four countries hold much the same mix of views and know the same names, a message that works with one is a fair bet for the others. With older audiences, plan on a national version." },
      { t: "Localise the channel, not the message", b: "Platform mixes stay almost as national as before. Keep the idea, move it to where each country's young actually are." },
      { t: "Don't split the young by country first", b: "For under-30s, gender and behaviour may separate people more than nationality does. Build segments that cross borders." },
      { t: "Test in one market, expect transfer, then check", b: "This is a hypothesis from one survey of four rich democracies, not a law. Run the first test where it is cheapest, then confirm before you scale." },
    ],
  },
}

type Copy = typeof en

const fa: Copy = {
  hero: {
    lead:
      "جوان‌های آمریکا، بریتانیا، فرانسه و آلمان ترکیبِ بسیار مشابهی از نظرهای سیاسی دارند. میان پدربزرگ‌ها و مادربزرگ‌هایشان، فاصله‌ی این چهار کشور حدود سه برابر است. نسل زد هنوز از پلتفرم‌های ملی استفاده می‌کند و تولیدکننده‌های محتوای کشور خودش را دنبال می‌کند، اما فرهنگ مشترکِ بیشتری دارد، و سیاستش هم دنبالش آمده.",
    kpis: [
      { n: "۴", l: "امتیاز فاصله‌ی کشورها در هر پرسش، نسل زد", d: "سهمِ هر سمت، میانگینِ ۱۳ پرسش." },
      { n: "۱۱", l: "امتیاز فاصله‌ی کشورها در هر پرسش، بومرها", d: "حدود سه برابرِ فاصله‌ی نسل زد." },
      { n: "۲۹٪", l: "دقتِ حدس زدنِ کشورِ یک جوان", d: "شانس ۲۵٪ است. بومرها: ۴۲٪." },
      { n: "۴۶٪", l: "از جواب‌های سلبریتیِ نسل زد کسی است که در هر چهار کشور نام برده شده", d: "بومرها: ۱۷٪. فقط موج دوم." },
    ],
    medals: "چهار نمودار پایین تعاملی‌اند. هر کدام را امتحان کنید یک نشان به جعبه‌ی نشان‌های مجموعه، در گوشه‌ی پایین، اضافه می‌شود.",
  },
  spread: {
    kicker: "۰۱ · مرزها",
    title: "یازده امتیاز فاصله، یا چهار",
    lead: "هر کدام از ۱۳ پرسش سیاستی را بردارید و ببینید در هر کشور چند درصد در هر سمت‌اند. چهار کشور چقدر از هم دورند؟",
    gens: { boomers: "بومرها", genz: "نسل زد" },
    unit: "امتیاز فاصله‌ی کشورها، در هر پرسش",
    caption: "میانگین فاصله‌ی چهار کشور در سهمِ هر سمت، در ۱۳ پرسش سیاستی. منبع: نظرسنجی Electric Twin، دو موج (ژانویه تا آوریل ۲۰۲۶)، ۵۱٬۹۲۹ پاسخِ نظرسنجی.",
    body: [
      "اگر نسل زد فقط پراکنده بود، جوان‌های هر کشور به سمتی متفاوت پراکنده می‌شدند. این‌طور نیست. بومرها مجموعه‌ی نظرِ ملیِ قابل تشخیصی دارند؛ نسل زد هر جا زندگی کند تقریباً همان ترکیب را دارد.",
      "این یافته‌ی دوم نظرسنجی است و کنار یافته‌ی اول (بخش ۱) می‌نشیند: نظرهای جوان‌ها هم درون هر آدم کمتر به هم بسته است، هم کمتر به کشور خودشان.",
    ],
  },
  guess: {
    kicker: "۰۲ · کشور را حدس بزن",
    title: "از روی سیاستِ یک نفر می‌شود فهمید کجا زندگی می‌کند؟",
    lead: "مدلی آموزش دیده تا از روی ۱۳ جوابِ سیاستیِ هر نفر کشورش را حدس بزند. با چهار کشور، حدسِ کورکورانه ۲۵٪ درست درمی‌آید. پیش از دیدن جواب: برای نسل زد چقدر موفق است؟",
    predict: "حدسِ شما برای نسل زد",
    reveal: "جواب را نشان بده",
    yours: (v: string) => `حدس شما ${v}`,
    off: (v: string) => `${v} امتیاز اختلاف`,
    gens: { boomers: "بومرها", genx: "نسل ایکس", millennials: "میلنیال‌ها", genz: "نسل زد" } as Record<Gen, string>,
    chance: "شانس: ۲۵٪",
    label: "درصدِ حدسِ درستِ کشور از روی ۱۳ نظر",
    caption: "دقتِ اعتبارسنجی‌متقابلِ مدلی که کشورِ هر شرکت‌کننده را از روی ۱۳ نظرِ سیاستی‌اش حدس می‌زند، با کشورهای هم‌وزن. منبع: نظرسنجی Electric Twin.",
    body: [
      "برای بومرها مدل در ۴۲٪ موارد درست حدس می‌زند. برای نسل زد ۲۹٪؛ کمی بهتر از تاس انداختن میان چهار کشور.",
      "به گفته‌ی گزارش، این الگو برای مردها و زن‌ها جداگانه هم برقرار است، و وقتی کسانی را که با عجله پرسشنامه را پر کرده‌اند کنار بگذاریم هم. گزارش همچنین می‌گوید در نسل زد، فاصله‌ی مردها و زن‌ها از هم بیشتر از فاصله‌ی جوان‌های یک کشور با کشور دیگر است؛ عددهای پشتِ این حرف را منتشر نکرده. در اعتماد به منابع، همگرایی ضعیف‌تر است ولی در همان جهت.",
    ],
  },
  distance: {
    kicker: "۰۳ · فاصله‌ی فرهنگی",
    title: "فاصله‌ی ملی بیشتر از همه در سیاست کم شده",
    lead: "گزارش فاصله‌ی جواب‌های دو کشور را با عددی می‌سنجد که از ژنتیک جمعیت قرض گرفته شده. ۰ یعنی جواب‌های یکسان.",
    pick: "سنجه",
    keys: { policy: "نظرهای سیاستی", trust: "اعتماد به منابع", platforms: "پلتفرم‌های مورد استفاده" } as Record<CfstKey, string>,
    gens: { boomers: "بومرها", genz: "نسل زد" },
    smaller: (v: string) => `نسبتِ فاصله: برای نسل زد ${v} برابر کمتر`,
    caption: "فاصله‌ی فرهنگیِ کشورها (CFST؛ ۰ یعنی جواب‌های یکسان)، میانگینِ شش جفت کشور، با اصلاحِ نوفه‌ی نمونه‌گیری. این نسبت، نسبتِ یک فاصله‌ی مبتنی بر واریانس است و تقریباً با مجذورِ اختلاف‌ها بزرگ می‌شود؛ پس ۱۱ برابر یعنی یازده برابر کمتر متفاوت نیست. منبع: نظرسنجی Electric Twin.",
    what: {
      title: "CFST چیست",
      body:
        "ژنتیک‌دان‌ها با FST می‌سنجند دو جمعیت چقدر با هم فرق دارند. مایکل موتوکریشنا و همکارانش (۲۰۲۰) آن را برای جواب‌های نظرسنجی تطبیق دادند: چه سهمی از کلِ تنوعِ جواب‌ها میان کشورهاست و نه درون آن‌ها. عدد کوچک یعنی مردم دو کشور تقریباً شبیه هم جواب می‌دهند.",
    },
    body: [
      "در نظرهای سیاستی، CFSTِ کشورها میان نسل زد حدود یازده برابر کمتر از بومرهاست؛ در اعتماد به منابع ۲٫۳ برابر؛ در پلتفرم‌هایی که استفاده می‌کنند فقط ۱٫۲ برابر. چون CFST از واریانس ساخته شده، تقریباً با مجذورِ فاصله‌ها کوچک می‌شود. به زبانِ درصد، چهار کشور میان بومرها در هر پرسش حدود ۱۱ امتیاز از هم فاصله دارند و میان نسل زد حدود ۴: تقریباً سه برابر نزدیک‌تر، نه یازده.",
      "پس جوان‌ها همه‌جا از پلتفرم‌های یکسان استفاده نمی‌کنند: ترکیب پلتفرم‌هایشان تقریباً به اندازه‌ی مسن‌ترها ملی مانده. چیزی که بیشتر شریک‌اند فرهنگ است.",
    ],
  },
  abroad: {
    kicker: "۰۴ · هم‌نظر در خارج",
    title: "در خارج، نسل زد هم‌نظرهای خیلی کمتری از دست می‌دهد",
    lead: "اتاقی با ۹۹ نفر از همان نسل، ولی از کشوری دیگر، پر کنید. کسی هست که در هر ۱۳ جواب مثل شما باشد؟",
    pick: "نمایش",
    gens: { boomers: "بومرها", genz: "نسل زد" },
    countries: { us: "آمریکا", uk: "بریتانیا", fr: "فرانسه", de: "آلمان" } as Record<Country, string>,
    person: "آدمِ اهلِ",
    room: "اتاقِ اهلِ",
    own: "قاب‌دار: کشور خودِ آدم.",
    lostTitle: "هم‌نظرهایی که در اتاقِ کشوری دیگر از دست می‌روند",
    lost: (v: string) => `${v} از دست رفته`,
    lostGens: { genz: "نسل زد", millennials: "میلنیال‌ها", genx: "نسل ایکس", boomers: "بومرها" } as Record<Gen, string>,
    caption: "درصد کسانی (ردیف‌ها) که در اتاقی با ۹۹ نفر از همان نسلِ هر کشور (ستون‌ها) کسی را با دقیقاً همان ۱۳ جوابِ سیاستی پیدا می‌کنند. هر دو موج با هم، وزن‌دهی‌شده. جدول‌های گزارش میانگینِ هم‌نظریِ بومرها در کشور خودشان را بسته به جدول ۱۷٫۴ تا ۱۷٫۶ می‌دهند؛ خلاصه ۱۷٫۵ را به کار می‌برد. منبع: پیوست Electric Twin.",
    body: [
      "در اتاقِ کشوری دیگر، بومرها ۲۸٪ از هم‌نظرهایشان را از دست می‌دهند (۱۷٫۵٪ در کشور خودشان، ۱۲٫۶٪ در خارج) و نسل زد ۹٪ (بازه‌ی اطمینان ۹۵٪: ۳ تا ۱۵). این فاصله‌ی ۱۹ امتیازی بازه‌ی اطمینان ۹۵٪ از ۱۲ تا ۲۶ دارد.",
      "به گفته‌ی گزارش، ریزشِ بومرها از پرسش‌های تک‌تک است، نه از ترکیب‌ها: شانس هم در خارج به همان نسبت پایین می‌آید، پس بومرها هم در خانه و هم در خارج حدود ۴٫۵ برابرِ شانس هم‌نظر پیدا می‌کنند (گزارش آن را ۴٫۶ گرد کرده). بومرهای هر کشور روی تک‌پرسش‌ها به سمت متفاوتی متمایل‌اند؛ نسل زد همه‌جا تقریباً به یک سمت. همه‌ی ۱۴۴ اتاقِ کل‌نسلی بالاتر از شانس هم‌نظر دارند، بین ۲٫۸ تا ۷٫۲ برابرِ شانس.",
    ],
  },
  stars: {
    kicker: "۰۵ · ستاره‌های مشترک",
    title: "ستاره‌های یکسان، صفحه‌های ملی",
    lead: "از آدم‌ها پرسیدند بیشترِ هم‌سن‌هایشان کدام سلبریتی‌ها را می‌شناسند. شش نامی که در هر چهار کشور آمده. هر کدام را کدام نسل نام برده؟",
    sortInto: "نام‌برده:",
    gens: { boomers: "بومرها", genz: "نسل زد" },
    check: "بررسی",
    score: (n: string) => `${n} از ۶ درست`,
    again: "دوباره",
    resultTitle: "جواب‌هایی که سلبریتی‌ای نام می‌برند که در هر چهار کشور آمده",
    caption: "فقط موج دوم (۲۲ تا ۲۶ آوریل ۲۰۲۶)، با تعداد نام‌بردن‌های هم‌وزن میان کشورها. نام‌ها بر اساس سهمشان در ضعیف‌ترین کشور رتبه‌بندی شده‌اند. منبع: نظرسنجی Electric Twin.",
    body: [
      "در موج دوم، ۴۶٪ جواب‌های نسل زد کسی را نام می‌برند که در هر چهار کشور آمده، در برابر ۱۷٪ جواب‌های بومرها. آدم‌هایی که خودشان دنبال می‌کنند هنوز بیشتر ملی‌اند: مثلاً نسل زدِ فرانسه یوتیوبرهای فرانسوی را ترجیح می‌دهد.",
    ],
  },
  means: {
    title: "برداشتِ نویسندگان: گفت‌وگوی ملی کمتر از آنچه به نظر می‌رسد ملی است",
    body:
      "این تفسیرِ گزارش است، نه نتیجه‌ای سنجیده. به نوشته‌ی نویسندگان: پلتفرم‌های ملی، ولی روی آن‌ها هرچه بیشتر همان ستاره‌ها، همان شوخی‌ها و همان بحث‌ها؛ شاید بحث‌های سیاسی هم همین‌طور سفر کنند: در یک کشور شروع شوند و در هر چهار کشور دنبال شوند. اگر این‌طور باشد، پیامی که در یک کشور به دل جوان‌ها می‌نشیند، احتمالاً در بقیه هم می‌نشیند.",
  },
  reading: {
    kicker: "۰۶ · برداشت ما",
    title: "اگر محصولی را فراتر از یک کشور عرضه می‌کنید",
    lead: "این بخش برداشت ماست، نه حرف گزارش.",
    items: [
      { t: "کمپینِ جوان‌ها می‌تواند مرز رد کند", b: "اگر مخاطب جوانِ چهار کشور ترکیبِ نظرِ مشابهی دارد و همان نام‌ها را می‌شناسد، پیامی که در یکی جواب می‌دهد شرطِ معقولی برای بقیه است. برای مخاطبِ مسن‌تر، نسخه‌ی ملی را برنامه‌ریزی کنید." },
      { t: "کانال را محلی کنید، نه پیام را", b: "ترکیبِ پلتفرم‌ها تقریباً به همان اندازه‌ی قبل ملی مانده. ایده را نگه دارید و ببریدش جایی که جوان‌های هر کشور واقعاً هستند." },
      { t: "جوان‌ها را اول بر اساس کشور تقسیم نکنید", b: "برای زیر سی‌ساله‌ها، جنسیت و رفتار ممکن است بیشتر از ملیت آدم‌ها را از هم جدا کند. بخش‌هایی بسازید که از مرزها عبور می‌کنند." },
      { t: "در یک بازار آزمایش کنید، انتظارِ انتقال داشته باشید، بعد وارسی کنید", b: "این فرضیه‌ای است از یک نظرسنجی در چهار دموکراسی ثروتمند، نه قانون. اولین آزمایش را جایی بگذارید که ارزان‌تر است، و پیش از بزرگ کردن تأییدش کنید." },
    ],
  },
}

export const COPY: Record<Locale, Copy> = { en, fa }
