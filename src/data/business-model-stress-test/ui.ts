// UI strings for the Business Model Stress Test components, per locale.

import { BmLocale } from "./config";
import { faDigits } from "./config.fa";

export interface BmUiStrings {
    // Shell
    backToTools: string;
    toolsHref: string;

    // Intro
    kicker: string;
    introTitleLead: string;
    introTitleAccent: string;
    introLead: string;
    startButton: string;
    introMeta: string;
    methodTitle: string;
    methodSource: string;
    sixSteps: string[];
    introCards: { title: string; body: string }[];

    // Step chrome
    stepModel: string;
    stepFactors: string;
    stepRun: string;
    modelTitle: string;
    modelLead: string;
    factorsTitle: string;
    factorsLead: (min: number, max: number) => string;
    runTitle: string;
    runLead: string;

    // Step 1 — business model
    required: string;
    optional: string;
    describedCount: (described: number, total: number) => string;
    componentsDescribedLabel: string;
    stillNeeded: (components: string[]) => string;
    describeAtLeast: (min: number) => string;
    chooseFactors: string;

    // Step 2 — stress factors
    factorAria: (name: string) => string;
    removeFactorAria: (name: string) => string;
    selectedCount: (selected: number, max: number) => string;
    selectedLabel: string;
    selectAtLeast: (min: number) => string;
    back: string;
    continue: string;
    addCustomToggle: string;
    addCustomTitle: string;
    cancel: string;
    customNameLabel: string;
    perspectiveLabel: string;
    customOutcomeALabel: string;
    customOutcomeBLabel: string;
    addUncertainty: string;

    // Step 3 — lead + run
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    runButton: string;
    runningButton: string;
    loadingStages: string[];
    loadingNote: string;
    backToFactors: string;
    whatWillBeTested: string;
    componentsToTest: (count: number) => string;
    cellsToMap: (count: number) => string;
    genericError: string;

    // Result chrome
    resultKicker: string;
    resultTitle: string;
    robustnessTitle: string;
    testAnother: string;
    statShowstoppers: string;
    statWarnings: string;
    statHoldsUp: string;
    statAssessed: string;

    // Result sections
    step4Label: string;
    step4Title: string;
    step4Lead: string;
    step5aLabel: string;
    componentsTitle: string;
    componentsLead: string;
    outcomesTitle: string;
    outcomesLead: string;
    step5bLabel: string;
    patternsTitle: string;
    patternsLead: string;
    step6Label: string;
    actionsTitle: string;
    actionsLead: string;
    patternLabels: {
        "double-red": string;
        "double-green": string;
        inconsistency: string;
        "preferred-outcome": string;
    };
    componentUntouched: string;
    componentUntested: string;
    componentCounts: (red: number, orange: number, green: number) => string;
    outcomeNoImpact: string;
    outOf100: (value: number) => string;

    // Heat map
    heatMapColumnHeader: string;
    severityRed: string;
    severityRedMeaning: string;
    severityOrange: string;
    severityOrangeMeaning: string;
    severityGreen: string;
    severityGreenMeaning: string;
    severityGrey: string;
    severityGreyMeaning: string;
    cellAria: (component: string, factor: string, outcome: string, severity: string) => string;
    under: string;
    reasoningPlaceholder: string;

    // Closing
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    bookingHref: string;
    methodLabel: string;
    methodBodyPrefix: string;
    readPaper: string;
    methodBodySuffix: string;
    oursLabel: string;
    oursBody: string;
    limitsLabel: string;
    limitsBody: string;
}

const en: BmUiStrings = {
    backToTools: "Back to Tools Library",
    toolsHref: "/tools",

    kicker: "Scenario diagnostic",
    introTitleLead: "Would your business model",
    introTitleAccent: "survive?",
    introLead:
        "Most business models are validated against today. This one puts yours against the futures that could break it — one component at a time — and shows you exactly where it snaps.",
    startButton: "Start the stress test",
    introMeta: "Takes about 10 minutes to fill in · Free · No account needed",
    methodTitle: "Peer-reviewed method",
    methodSource: "Haaker et al., Futures (2017)",
    sixSteps: [
        "Describe your business model",
        "Pick 3-5 uncertainties",
        "Map what each one touches",
        "Build the heat map",
        "Read the patterns",
        "Fix what breaks",
    ],
    introCards: [
        {
            title: "It tests components, not vibes",
            body: "Your revenue streams, channels, key partners and cost structure are each judged separately. A model rarely fails everywhere at once — it fails at one joint.",
        },
        {
            title: "Both extremes, every time",
            body: "Each uncertainty is tested at both ends. When a component fails at both ends, no scenario saves you: that is a redesign you already owe yourself.",
        },
        {
            title: "Impact, not prediction",
            body: "The method deliberately ignores how likely a future is. It asks what happens to you if it arrives — which is the part you can act on.",
        },
    ],

    stepModel: "1 · Business model",
    stepFactors: "2 · Stress factors",
    stepRun: "3 · Run the test",
    modelTitle: "Describe the business model",
    modelLead:
        "Be specific and honest — the test can only stress what you actually write down. Vague answers produce a vague heat map.",
    factorsTitle: "Choose what to stress it with",
    factorsLead: (min, max) =>
        `Pick the ${min}-${max} uncertainties with the highest impact on your model. Each one is tested at both extremes, because a future that only ever goes your way is not a test.`,
    runTitle: "Run the stress test",
    runLead: "Your heat map takes up to a minute to build. Tell us where to say it is ready.",

    required: "Required",
    optional: "Optional",
    describedCount: (described, total) => `${described}/${total}`,
    componentsDescribedLabel: "components described",
    stillNeeded: (components) =>
        `Still needed: ${components.map((item) => item.toLowerCase()).join(", ")}.`,
    describeAtLeast: (min) => `Describe at least ${min} components to run a meaningful test.`,
    chooseFactors: "Choose stress factors",

    factorAria: (name) => `Stress factor: ${name}`,
    removeFactorAria: (name) => `Remove ${name}`,
    selectedCount: (selected, max) => `${selected}/${max}`,
    selectedLabel: "selected",
    selectAtLeast: (min) => `Select at least ${min}.`,
    back: "Back",
    continue: "Continue",
    addCustomToggle: "Add an uncertainty specific to your business",
    addCustomTitle: "Add your own uncertainty",
    cancel: "Cancel",
    customNameLabel: "What is uncertain? e.g. Our largest client's renewal policy",
    perspectiveLabel: "Perspective",
    customOutcomeALabel: "Extreme outcome 1 — e.g. They renew at current volume",
    customOutcomeBLabel: "Extreme outcome 2 — e.g. They leave entirely",
    addUncertainty: "Add uncertainty",

    nameLabel: "First name (optional)",
    namePlaceholder: "Sara",
    emailLabel: "Work email",
    emailPlaceholder: "sara@company.com",
    runButton: "Run the stress test",
    runningButton: "Building your heat map…",
    loadingStages: [
        "Reading your business model…",
        "Mapping which components each uncertainty actually touches…",
        "Colouring the heat map, outcome by outcome…",
        "Looking for double-red and inconsistent patterns…",
        "Writing the redesign actions…",
    ],
    loadingNote: "This usually takes 30-60 seconds. Please keep this tab open.",
    backToFactors: "Back to stress factors",
    whatWillBeTested: "What will be tested",
    componentsToTest: (count) => `${count} business model components`,
    cellsToMap: (count) => `${count} cells will be mapped and coloured.`,
    genericError: "The stress test could not be completed.",

    resultKicker: "Stress test complete",
    resultTitle: "Where your model breaks",
    robustnessTitle: "Business model robustness",
    testAnother: "Test another model",
    statShowstoppers: "Showstoppers",
    statWarnings: "Viability warnings",
    statHoldsUp: "Holds up",
    statAssessed: "Assessed cells",

    step4Label: "Step 4",
    step4Title: "The heat map",
    step4Lead:
        "Every business model component you described, confronted with both extreme outcomes of each stress factor.",
    step5aLabel: "Step 5a",
    componentsTitle: "Which components are weak",
    componentsLead: "Each component accumulated across every future you tested.",
    outcomesTitle: "Which futures hurt most",
    outcomesLead: "Each outcome accumulated across your whole business model.",
    step5bLabel: "Step 5b",
    patternsTitle: "Patterns in the map",
    patternsLead: "Colour patterns that say more than any single cell does.",
    step6Label: "Step 6",
    actionsTitle: "What to actually change",
    actionsLead: "Ordered by what breaks the model soonest.",
    patternLabels: {
        "double-red": "Double red",
        "double-green": "Double green",
        inconsistency: "Inconsistency",
        "preferred-outcome": "Preferred outcome",
    },
    componentUntouched: "untouched",
    componentUntested: "Untested — no selected stress factor touches this component.",
    componentCounts: (red, orange, green) =>
        `${red} showstopper${red === 1 ? "" : "s"}, ${orange} warning${orange === 1 ? "" : "s"}, ${green} favourable`,
    outcomeNoImpact: "no impact",
    outOf100: (value) => `${value}/100`,

    heatMapColumnHeader: "Business model",
    severityRed: "Not feasible",
    severityRedMeaning:
        "The component can no longer be implemented — a potential showstopper.",
    severityOrange: "Not viable",
    severityOrangeMeaning: "It can still be done, but the choices behind it no longer pay off.",
    severityGreen: "Holds up",
    severityGreenMeaning: "Affected, but not negatively — it may even get stronger.",
    severityGrey: "No impact",
    severityGreyMeaning: "No causal relationship between this outcome and this component.",
    cellAria: (component, factor, outcome, severity) =>
        `${component} under ${factor}, ${outcome}: ${severity}`,
    under: "under",
    reasoningPlaceholder:
        "Select any square to read why it was coloured that way. The reasoning behind each cell — not the colour itself — is what the redesign is built on.",

    ctaTitle: "Want a second pair of eyes on the redesign?",
    ctaBody:
        "The stress test tells you which components break. Deciding what to replace them with is the harder half, and it is the work I do with founders every week.",
    ctaButton: "Book a working session",
    bookingHref: "/booking",
    methodLabel: "Method: ",
    methodBodyPrefix:
        "Haaker, T., Bouwman, H., Janssen, W., & De Reuver, M. (2017). Business model stress testing: A practical approach to test the robustness of a business model. Futures, 89, 14-25.",
    readPaper: "Read the paper",
    methodBodySuffix:
        "(open access, CC BY 4.0). The six-step method, the four-colour scheme, the sub-views and the pattern analysis are the authors’.",
    oursLabel: "What is ours: ",
    oursBody:
        "the paper’s method is qualitative and produces no score. The robustness index above is our own quantification (holds up = 1, not viable = 0.5, not feasible = 0, averaged over the cells that were assessed) so results can be compared and tracked. The heat map and the reasoning behind each cell remain the real output.",
    limitsLabel: "Limits: ",
    limitsBody:
        "the original method runs as a facilitated session with people who know the business and an outside domain expert. Here a model plays that role from your written description, so the result is only as good as that description and the factors you chose. It assesses impact, not likelihood. Treat it as a structured argument to challenge, not a verdict.",
};

const fa: BmUiStrings = {
    backToTools: "بازگشت به کتابخانه‌ی ابزارها",
    toolsHref: "/fa/tools",

    kicker: "تشخیص سناریویی",
    introTitleLead: "آیا مدل کسب‌وکار شما",
    introTitleAccent: "دوام می‌آورد؟",
    introLead:
        "بیشتر مدل‌های کسب‌وکار فقط در برابر امروز اعتبارسنجی می‌شوند. این ابزار مدل شما را جزء‌به‌جزء در برابر آینده‌هایی می‌گذارد که می‌توانند آن را بشکنند و دقیقاً نشان می‌دهد کجا می‌شکند.",
    startButton: "شروع تست فشار",
    introMeta: "حدود ۱۰ دقیقه برای تکمیل · رایگان · بدون نیاز به حساب کاربری",
    methodTitle: "روشی داوری‌شده",
    methodSource: "Haaker و همکاران، Futures (۲۰۱۷)",
    sixSteps: [
        "مدل کسب‌وکارتان را توصیف کنید",
        "۳ تا ۵ عدم‌قطعیت انتخاب کنید",
        "مشخص کنید هرکدام چه چیزی را لمس می‌کند",
        "نقشه‌ی حرارتی را بسازید",
        "الگوها را بخوانید",
        "آنچه می‌شکند را درست کنید",
    ],
    introCards: [
        {
            title: "اجزا را می‌سنجد، نه حس کلی را",
            body: "جریان‌های درآمد، کانال‌ها، شرکای کلیدی و ساختار هزینه هرکدام جداگانه داوری می‌شوند. یک مدل به‌ندرت یکباره همه‌جا از کار می‌افتد؛ از یک مفصل می‌شکند.",
        },
        {
            title: "هر بار، هر دو سرِ طیف",
            body: "هر عدم‌قطعیت در هر دو سرِ افراطی آزموده می‌شود. وقتی جزئی در هر دو سر از کار بیفتد، هیچ سناریویی نجاتتان نمی‌دهد: این بازطراحی‌ای است که از پیش به خودتان بدهکارید.",
        },
        {
            title: "اثر، نه پیش‌بینی",
            body: "این روش عمداً به احتمالِ وقوع یک آینده کاری ندارد. می‌پرسد اگر آن آینده برسد چه بر سر شما می‌آید؛ یعنی همان بخشی که می‌توانید رویش کاری بکنید.",
        },
    ],

    stepModel: "۱ · مدل کسب‌وکار",
    stepFactors: "۲ · عوامل فشار",
    stepRun: "۳ · اجرای تست",
    modelTitle: "مدل کسب‌وکار را توصیف کنید",
    modelLead:
        "دقیق و صادق بنویسید؛ تست فقط چیزی را می‌تواند تحت فشار بگذارد که واقعاً نوشته‌اید. پاسخ مبهم، نقشه‌ی حرارتی مبهم می‌سازد.",
    factorsTitle: "انتخاب کنید با چه چیزی فشار بیاورید",
    factorsLead: (min, max) =>
        `${faDigits(min)} تا ${faDigits(max)} عدم‌قطعیتی را انتخاب کنید که بیشترین اثر را بر مدل شما دارند. هرکدام در هر دو سرِ افراطی آزموده می‌شود، چون آینده‌ای که همیشه به سود شما پیش برود اصلاً تست نیست.`,
    runTitle: "تست فشار را اجرا کنید",
    runLead:
        "ساخت نقشه‌ی حرارتی تا یک دقیقه طول می‌کشد. بگویید آماده‌شدنش را کجا اطلاع دهیم.",

    required: "الزامی",
    optional: "اختیاری",
    describedCount: (described, total) => `${faDigits(described)}/${faDigits(total)}`,
    componentsDescribedLabel: "جزء توصیف‌شده",
    stillNeeded: (components) => `هنوز لازم است: ${components.join("، ")}.`,
    describeAtLeast: (min) =>
        `برای اجرای تستی معنادار، دست‌کم ${faDigits(min)} جزء را توصیف کنید.`,
    chooseFactors: "انتخاب عوامل فشار",

    factorAria: (name) => `عامل فشار: ${name}`,
    removeFactorAria: (name) => `حذف ${name}`,
    selectedCount: (selected, max) => `${faDigits(selected)}/${faDigits(max)}`,
    selectedLabel: "انتخاب‌شده",
    selectAtLeast: (min) => `دست‌کم ${faDigits(min)} مورد انتخاب کنید.`,
    back: "بازگشت",
    continue: "ادامه",
    addCustomToggle: "افزودن عدم‌قطعیتی ویژه‌ی کسب‌وکار خودتان",
    addCustomTitle: "عدم‌قطعیت خودتان را اضافه کنید",
    cancel: "انصراف",
    customNameLabel: "چه چیزی نامعلوم است؟ مثلاً تمدید قرارداد بزرگ‌ترین مشتری ما",
    perspectiveLabel: "منظر",
    customOutcomeALabel: "سرانجام افراطی ۱، مثلاً با همین حجم تمدید می‌کنند",
    customOutcomeBLabel: "سرانجام افراطی ۲، مثلاً کاملاً می‌روند",
    addUncertainty: "افزودن عدم‌قطعیت",

    nameLabel: "نام (اختیاری)",
    namePlaceholder: "سارا",
    emailLabel: "ایمیل کاری",
    emailPlaceholder: "sara@company.com",
    runButton: "اجرای تست فشار",
    runningButton: "در حال ساخت نقشه‌ی حرارتی…",
    loadingStages: [
        "در حال خواندن مدل کسب‌وکار شما…",
        "در حال تعیین اینکه هر عدم‌قطعیت واقعاً چه اجزایی را لمس می‌کند…",
        "در حال رنگ‌آمیزی نقشه‌ی حرارتی، سرانجام به سرانجام…",
        "در حال جست‌وجوی الگوهای دوگانه‌ی بحرانی و ناسازگار…",
        "در حال نوشتن اقدام‌های بازطراحی…",
    ],
    loadingNote: "این کار معمولاً ۳۰ تا ۶۰ ثانیه طول می‌کشد. لطفاً این صفحه را باز نگه دارید.",
    backToFactors: "بازگشت به عوامل فشار",
    whatWillBeTested: "چه چیزی آزموده می‌شود",
    componentsToTest: (count) => `${faDigits(count)} جزء از مدل کسب‌وکار`,
    cellsToMap: (count) => `${faDigits(count)} خانه نگاشت و رنگ‌آمیزی می‌شود.`,
    genericError: "تست فشار کامل نشد.",

    resultKicker: "تست فشار کامل شد",
    resultTitle: "مدل شما کجا می‌شکند",
    robustnessTitle: "استحکام مدل کسب‌وکار",
    testAnother: "آزمودن یک مدل دیگر",
    statShowstoppers: "توقف‌های کامل",
    statWarnings: "هشدارهای سودآوری",
    statHoldsUp: "دوام می‌آورد",
    statAssessed: "خانه‌های ارزیابی‌شده",

    step4Label: "گام ۴",
    step4Title: "نقشه‌ی حرارتی",
    step4Lead:
        "هر جزئی از مدل کسب‌وکار که توصیف کرده‌اید، رودررو با هر دو سرانجام افراطی هر عامل فشار.",
    step5aLabel: "گام ۵الف",
    componentsTitle: "کدام اجزا ضعیف‌اند",
    componentsLead: "هر جزء، جمع‌بسته در میان همه‌ی آینده‌هایی که آزمودید.",
    outcomesTitle: "کدام آینده‌ها بیشترین آسیب را می‌زنند",
    outcomesLead: "هر سرانجام، جمع‌بسته در سراسر مدل کسب‌وکار شما.",
    step5bLabel: "گام ۵ب",
    patternsTitle: "الگوهای نقشه",
    patternsLead: "الگوهای رنگی‌ای که بیش از هر خانه‌ی تکی حرف دارند.",
    step6Label: "گام ۶",
    actionsTitle: "واقعاً چه چیزی را تغییر دهید",
    actionsLead: "به ترتیب آنچه زودتر از همه مدل را می‌شکند.",
    patternLabels: {
        "double-red": "بحرانی دوگانه",
        "double-green": "سالم دوگانه",
        inconsistency: "ناسازگاری",
        "preferred-outcome": "سرانجام ترجیح‌داده‌شده",
    },
    componentUntouched: "لمس‌نشده",
    componentUntested: "آزموده نشد؛ هیچ عامل فشار انتخابی این جزء را لمس نمی‌کند.",
    componentCounts: (red, orange, green) =>
        `${faDigits(red)} توقف کامل، ${faDigits(orange)} هشدار، ${faDigits(green)} مساعد`,
    outcomeNoImpact: "بدون اثر",
    outOf100: (value) => `${faDigits(value)}/${faDigits(100)}`,

    heatMapColumnHeader: "مدل کسب‌وکار",
    severityRed: "شدنی نیست",
    severityRedMeaning: "این جزء دیگر اصلاً قابل اجرا نیست؛ یک توقف کامل بالقوه.",
    severityOrange: "به‌صرفه نیست",
    severityOrangeMeaning: "هنوز شدنی است، اما انتخاب‌های پشت آن دیگر جواب نمی‌دهد.",
    severityGreen: "دوام می‌آورد",
    severityGreenMeaning: "اثر می‌پذیرد، اما نه منفی؛ حتی ممکن است قوی‌تر شود.",
    severityGrey: "بدون اثر",
    severityGreyMeaning: "میان این سرانجام و این جزء رابطه‌ی علّی‌ای نیست.",
    cellAria: (component, factor, outcome, severity) =>
        `${component} زیر ${factor}، ${outcome}: ${severity}`,
    under: "زیر",
    reasoningPlaceholder:
        "روی هر خانه بزنید تا بخوانید چرا آن رنگ را گرفته است. استدلال پشت هر خانه، نه خودِ رنگ، چیزی است که بازطراحی بر آن ساخته می‌شود.",

    ctaTitle: "برای بازطراحی، یک جفت چشم دیگر می‌خواهید؟",
    ctaBody:
        "تست فشار به شما می‌گوید کدام اجزا می‌شکند. تصمیم درباره‌ی اینکه جایشان چه بگذارید نیمه‌ی سخت‌تر کار است و همان کاری است که هر هفته با بنیان‌گذاران انجام می‌دهم.",
    ctaButton: "رزرو یک جلسه‌ی کاری",
    bookingHref: "/fa/booking",
    methodLabel: "روش: ",
    methodBodyPrefix:
        "Haaker, T., Bouwman, H., Janssen, W., & De Reuver, M. (2017). Business model stress testing: A practical approach to test the robustness of a business model. Futures, 89, 14-25.",
    readPaper: "خواندن مقاله",
    methodBodySuffix:
        "(دسترسی آزاد، CC BY 4.0). روش شش‌گامی، طرح چهاررنگ، زیرنماها و تحلیل الگوها از آنِ نویسندگان مقاله است.",
    oursLabel: "آنچه از ماست: ",
    oursBody:
        "روش مقاله کیفی است و هیچ امتیازی تولید نمی‌کند. شاخص استحکام بالا کمّی‌سازی خود ماست (دوام می‌آورد = ۱، به‌صرفه نیست = ۰٫۵، شدنی نیست = ۰، میانگین‌گرفته روی خانه‌های ارزیابی‌شده) تا بتوان نتایج را مقایسه و در طول زمان دنبال کرد. خروجی واقعی همچنان نقشه‌ی حرارتی و استدلال پشت هر خانه است.",
    limitsLabel: "محدودیت‌ها: ",
    limitsBody:
        "روش اصلی در قالب جلسه‌ای تسهیل‌شده با آدم‌هایی اجرا می‌شود که کسب‌وکار را می‌شناسند، به‌همراه یک متخصص بیرونی. اینجا یک مدل زبانی از روی توصیف نوشته‌ی شما این نقش را بازی می‌کند، پس نتیجه دقیقاً به‌اندازه‌ی همان توصیف و عامل‌هایی که انتخاب کرده‌اید ارزش دارد. این ابزار اثر را می‌سنجد، نه احتمال را. آن را استدلالی ساختارمند برای به‌چالش‌کشیدن بدانید، نه یک حکم.",
};

export function getBmUiStrings(locale: BmLocale): BmUiStrings {
    return locale === "fa" ? fa : en;
}
