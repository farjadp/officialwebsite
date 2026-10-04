// ============================================================================
// File Path: src/components/v3/reports/deep-time-pain/copy.ts
// Why: Every word of report 02 in both locales, one structure for both so the
//      English and Persian pages cannot drift apart.
//
//      The report is about evolutionary biology and palaeoanthropology, where
//      the line between what is measured and what is inferred matters. The
//      wording keeps that line visible: hormones do not fossilise, dates are
//      given as ranges where the literature disagrees, and the closing section
//      says plainly what bone cannot tell us.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { CircuitKey, EventKey, InjuryKey } from "./data"

type Copy = {
  events: Record<EventKey, { name: string; note?: string }>
  hero: {
    kicker: string
    hook: string[]
    summary: string
    mega: string
    megaUnit: string
    megaLabel: string
    asOf: string
  }
  findings: { kicker: string; title: string; items: string[] }
  spiral: {
    title: string
    lead: string
    hint: string
    selected: string
    onClock: string
    caption: string
    noWebgl: string
  }
  scale: {
    kicker: string
    title: string
    lead: string
    dayLabel: string
    nowLabel: string
    birthLabel: string
    zoomHint: string
    stages: Record<"day" | "minute" | "second" | "tenth", { name: string; reading: string }>
    perSecond: string
    rulerTitle: string
    rulerLead: string
    rulerUnits: Record<EventKey, string>
    rulerNote: string
  }
  circuits: {
    kicker: string
    title: string
    lead: string
    hint: string
    fire: string
    reset: string
    arrives: string
    lanes: Record<
      CircuitKey,
      { name: string; timing: string; chain: string[]; body: string; note?: string }
    >
  }
  beecher: {
    kicker: string
    title: string
    lead: string
    soldiers: string
    civilians: string
    reading: string
    caveat: string
  }
  fossils: { kicker: string; title: string; lead: string; ages: Record<string, string>; cases: Record<string, { place: string; title: string; body: string }> }
  shanidar: {
    kicker: string
    title: string
    lead: string
    hint: string
    injuries: Record<InjuryKey, { short: string; body: string }>
    caveat: string
  }
  limits: {
    kicker: string
    title: string
    canTitle: string
    can: string[]
    cannotTitle: string
    cannot: string[]
    closing: string
  }
  method: {
    kicker: string
    title: string
    notes: string[]
    sourcesTitle: string
    sources: { label: string; href: string }[]
  }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

export const COPY: Record<Locale, Copy> = {
  en: {
    events: {
      earth: { name: "Earth forms", note: "4.54 billion years ago" },
      cambrian: { name: "Cambrian begins", note: "the explosion of animal body plans unfolds over the next 20–25 million years" },
      lamprey: { name: "The lamprey line splits from ours", note: "the stress axis is already there" },
      kpg: { name: "Non-bird dinosaurs die out" },
      split: { name: "Human and chimp lineages split", note: "most estimates 6.5–10 million years" },
      dmanisi: { name: "Dmanisi, Georgia", note: "the toothless skull" },
      sapiens: { name: "Earliest Homo sapiens fossils", note: "Jebel Irhoud, about 315,000 years" },
      maba: { name: "Maba cranium, China", note: "dated 130,000–230,000 years" },
      qafzeh: { name: "Qafzeh 11, the injured teenager" },
      shanidar: { name: "Shanidar 1, “Nandy”", note: "about 55,000–45,000 years" },
      writing: { name: "Writing is invented", note: "a little over 5,000 years ago" },
      you: { name: "One human life", note: "about 80 years" },
    },
    hero: {
      kicker: "Report 02",
      hook: [
        "Your body can hold pain back for a few minutes. Soldiers walk off wounds that would floor them at home.",
        "That trick is not a human invention. It is far older than us — and on its own it does not explain how the badly injured stayed alive for years.",
      ],
      summary:
        "The hormonal stress axis shared by vertebrates is very old: the line leading to lampreys — jawless fish — split from ours more than 500 million years ago, and lampreys still run a version of it. Hormones buy minutes. The fossils of hominins who lived on for years after crushing injuries are consistent with something else: other people.",
      mega: "500",
      megaUnit: "million years",
      megaLabel: "at least this long vertebrates have carried the same hormonal stress axis",
      asOf: "Dates follow the published literature; where it disagrees, the range is given.",
    },
    findings: {
      kicker: "What the evidence says",
      title: "Five findings",
      items: [
        "The hormonal stress axis predates jaws. Sea lampreys, whose line split from ours more than 500 million years ago, run the same hypothalamus–pituitary–interrenal pattern (the interrenal is the fish counterpart of the adrenal) with a different steroid, 11-deoxycortisol. In stressed lamprey larvae it rose about fifteen-fold within six hours, and blood sugar about three-fold.",
        "“Fight or flight” is not one circuit but three, running at different speeds: adrenaline in seconds, cortisol over minutes to hours, and a separate pain-suppressing pathway in between.",
        "Henry Beecher found that badly wounded soldiers asked for narcotics far less often than civilians with comparable surgical wounds — about 32% against 83%. The size of the wound was not what set the pain.",
        "The same descending pathway can turn pain down or up. Acute stress tends to suppress pain; prolonged stress tends to do the opposite and raise pain sensitivity.",
        "Shanidar 1 lived to roughly 40–50 with a crushed left eye socket, one deaf ear, an arm lost above the elbow and a damaged leg. Hormones explain the first minutes. Years of that are consistent with a group that did not abandon him.",
      ],
    },
    spiral: {
      title: "The spiral of deep time",
      lead: "Wind the whole of Earth's history into a rising spiral, and space it so that every step up is ten times closer to now. On a scale like this, the last few hundred thousand years stop being a rounding error and get as much room as the first billion.",
      hint: "Drag to turn the spiral. Choose an event to bring it to the front.",
      selected: "Selected",
      onClock: "On the 24-hour clock:",
      caption: "The spacing is logarithmic: each marked step is ten times more recent than the one below it. That is the only way 4.54 billion years and a single human life can share one picture. The flat clock below shows the same events at true proportion.",
      noWebgl: "This browser cannot draw the 3D spiral. The list beside it carries the same events.",
    },
    scale: {
      kicker: "The scale",
      title: "What does 500 million years even mean?",
      lead: "Large numbers do not land. So compress the whole age of the Earth into a single 24-hour day: the planet forms at midnight, and right now it is midnight again. Then zoom in, one magnification at a time, and watch our entire species shrink to a rounding error.",
      dayLabel: "The 24-hour day",
      nowLabel: "now",
      birthLabel: "Earth forms",
      zoomHint: "Zoom in. Each step magnifies the sliver at the end of the one before it.",
      stages: {
        day: { name: "The whole day", reading: "The Earth's entire history, compressed into 24 hours. One second here is about 52,500 years." },
        minute: { name: "The last minute", reading: "The last minute of that day is about 3.2 million years — roughly the whole span of the genus Homo." },
        second: { name: "The last 6 seconds", reading: "Everything Homo sapiens has ever been fits into the last six seconds before midnight." },
        tenth: { name: "The final split second", reading: "Writing appears about a tenth of a second before midnight. Every empire, every city and every book comes after it." },
      },
      perSecond: "one second =",
      rulerTitle: "Another scale: one year, one millimetre",
      rulerLead: "Lay time out as a road instead. Every year that passes is one millimetre of walking.",
      rulerUnits: {
        you: "about the length of a finger",
        writing: "the length of a room",
        shanidar: "half a football pitch",
        sapiens: "about three football pitches end to end",
        dmanisi: "a twenty-minute walk",
        lamprey: "about Toronto to Montreal as the crow flies",
        earth: "",
        cambrian: "",
        kpg: "",
        split: "",
        maba: "",
        qafzeh: "",
      },
      rulerNote:
        "Walk out of your front door in Toronto heading for Montreal, and the Shanidar Neanderthal is 50 metres behind you. The stress system he was using was built somewhere near Montreal.",
    },
    circuits: {
      kicker: "The mechanism",
      title: "Three circuits, not one",
      lead: "What we call “fight or flight” — Walter Cannon described it in 1915 as “the necessities of fighting or flight” — is several systems firing at once at different speeds. Keeping them apart matters, because the deep-time evidence applies to only one of them.",
      hint: "Fire a circuit and watch the signal travel. The timings are real; the animation is compressed.",
      fire: "Fire",
      reset: "Reset",
      arrives: "reaches the body in",
      lanes: {
        adrenaline: {
          name: "The fast circuit: adrenaline",
          timing: "seconds",
          chain: ["Threat", "Amygdala", "Hypothalamus", "Sympathetic nerve", "Adrenal medulla", "Adrenaline"],
          body: "Heart rate and blood pressure rise, sugar is released into the blood, pupils widen and attention narrows.",
        },
        cortisol: {
          name: "The slow circuit: cortisol",
          timing: "minutes to hours",
          chain: ["Hypothalamus · CRH", "Pituitary · ACTH", "Adrenal cortex", "Cortisol"],
          body: "Supplies the energy to keep going and holds inflammation down.",
          note: "This is where the deep-time evidence sits. The sea lamprey runs the same axis with a different steroid, 11-deoxycortisol. In stressed larvae it rose about fifteen-fold within six hours and blood sugar about three-fold. The axis is conserved; the hormone is not.",
        },
        analgesia: {
          name: "The pain-suppressing circuit",
          timing: "minutes",
          chain: ["Fear or severe stress", "Periaqueductal grey", "Rostral ventromedial medulla", "Spinal dorsal horn", "Pain signal falls"],
          body: "Carried by the body's own opioids and endocannabinoids, with monoamine, GABA and glutamate systems involved too. The effect has a name: stress-induced analgesia. The same pathway can also turn pain up.",
        },
      },
    },
    beecher: {
      kicker: "The modern human",
      title: "Analgesia on the battlefield",
      lead: "In the Second World War, an anaesthetist named Henry Beecher studied 215 badly wounded soldiers on the Italian front, Anzio among them; most said their pain was not bad enough to want anything for it. A decade later he put the question to civilians with comparable surgical wounds and compared the two: do you want a narcotic for the pain?",
      soldiers: "Badly wounded soldiers who wanted a narcotic",
      civilians: "Civilians with comparable wounds",
      reading:
        "Beecher's reading: pain is not simply the size of the wound. What the situation means changes it. For the soldier, the wound meant survival and a ticket away from the front.",
      caveat:
        "Two caveats popular retellings drop. The study was observational and unblinded, and the groups were not matched in advance, so treat the numbers as striking, not precise. And the effect is short-lived: prolonged, chronic stress often works the other way and makes people more sensitive to pain. The mechanism is built for the critical few minutes, not for a life lived under pressure.",
    },
    fossils: {
      kicker: "The fossil evidence",
      title: "Bones that healed",
      lead: "Healed bone means the individual lived on — weeks, months, sometimes years — after the injury. Four of them, oldest first.",
      ages: { dmanisi: "1.77 million years", maba: "130–230 thousand", qafzeh: "90–100 thousand", shanidar: "55–45 thousand" },
      cases: {
        dmanisi: {
          place: "Dmanisi, Georgia",
          title: "The toothless individual",
          body: "All the teeth but one were lost years before death, and the sockets had fully closed over. Without effective chewing, someone may have been providing soft or prepared food. It is the oldest candidate for care in our lineage — and only a candidate: the original authors also allowed that the individual could have survived unaided on soft plants and marrow, and a wild toothless bonobo has since been seen surviving long-term on its own.",
        },
        maba: {
          place: "Maba, southern China",
          title: "A healed dent in the skull",
          body: "A crescent-shaped depression about 1.4 centimetres long on the right forehead, with healed margins — blunt-force trauma, possibly delivered by another hominin, though the cause cannot be known. The individual survived it. The date is unresolved: somewhere between about 130,000 and 230,000 years.",
        },
        qafzeh: {
          place: "Qafzeh Cave, Lower Galilee, near Nazareth",
          title: "The injured teenager",
          body: "A Homo sapiens of twelve or thirteen, about 90,000–100,000 years ago, with a healed depressed fracture of the right forehead that very probably caused personality and neurological problems. Two deer antlers lay on the chest, read as a funerary offering. Injury, survival and deliberate burial in a single individual.",
        },
        shanidar: {
          place: "Shanidar Cave, Iraqi Kurdistan",
          title: "Shanidar 1, “Nandy”",
          body: "A Neanderthal who reached roughly 40 to 50 — old age for a Neanderthal — carrying a set of injuries that would be severe today. Excavated by Ralph Solecki in 1957; recent re-excavation dates him to about 55,000–45,000 years ago. See below.",
        },
      },
    },
    shanidar: {
      kicker: "One individual",
      title: "Shanidar 1",
      lead: "Of all the fossils in this report, this is the one that makes the argument. Not because of what his hormones did in the first minutes, but because of what the next few decades required.",
      hint: "Choose an injury.",
      injuries: {
        face: {
          short: "Crushing trauma to the face",
          body: "A heavy blow to the left side of the face, taking in the left eye socket. Vision in that eye was probably reduced or lost.",
        },
        ear: {
          short: "Deafness in the right ear",
          body: "Bony growths in both ear canals; on the right they bridge across the opening. Erik Trinkaus recorded them in the late 1970s, but their effect on hearing was only assessed in 2017: he was probably effectively deaf on the right, with at least partial loss on the left. On a landscape with predators, someone who cannot hear depends on others hearing for him.",
        },
        arm: {
          short: "A withered right arm",
          body: "The right arm is markedly atrophied, ending in a weakened stump just above the elbow. The forearm and hand were lost long before death, most likely by amputation above the elbow after a fracture that never healed (Trinkaus & Villotte 2017). An older reading blamed nerve damage instead.",
        },
        leg: {
          short: "Damage to the right knee and foot",
          body: "Injury and degenerative change in the right knee and foot. He probably walked with an abnormal gait.",
        },
      },
      caveat:
        "The diagram is schematic, not a reconstruction of the skeleton. What caused the injuries is unknown — a hunting accident and violence are both possible — and so is the order in which they happened.",
    },
    limits: {
      kicker: "Reading it honestly",
      title: "What bone says, and what it does not",
      canTitle: "Can be said with confidence",
      can: [
        "The hormonal stress axis is shared across vertebrates, from fish to humans, and is very old — though the hormone it runs on differs between lineages.",
        "Stress-induced analgesia is well documented in mammals, and opioid systems are present across vertebrates.",
        "Ancient hominins survived very severe injuries, in some cases for years.",
      ],
      cannotTitle: "Cannot be read from a fossil",
      cannot: [
        "Whether Nandy had adrenaline in his blood at the moment of the blow, or whether his pain was suppressed. Hormones do not fossilise. That part is inference from living biology, not evidence from the bone.",
        "Whether he was cared for. Fight or flight may have carried him through the first minutes; surviving years with one arm, one damaged eye and one deaf ear is consistent with a group that kept him — not proof of it. Every case in this report is debated on exactly this point.",
      ],
      closing:
        "The body postpones pain for a few critical minutes; that is an inheritance shared across vertebrates. Hormones buy minutes, and healing takes years. The bones that healed are consistent with the thing hormones cannot supply: people who did not leave the injured behind.",
    },
    method: {
      kicker: "Method and sources",
      title: "How this was put together",
      notes: [
        "The 24-hour clock uses 4.54 billion years for the age of the Earth. Every time on it is computed from that figure, not placed by eye.",
        "Where a date is contested — Maba in particular, and the Shanidar layers — the text gives the range; the clock, the ruler and the spiral need one point, so they use a value inside it.",
        "Divergence dates are estimates. The 500-million-year figure is a floor for the split between the line leading to lampreys and ours, not the age of lampreys themselves; published estimates run from about 500 to over 560 million years. Human–chimpanzee estimates run from about 6.5 to 10 million years, some as far as 13; the clock uses 7.",
        "Whether the lamprey system shows the ancestral vertebrate state is itself argued over (Thornton & Carroll 2011, with a reply from Close and colleagues).",
        "Hormones and soft tissue do not fossilise. Every statement about what an ancient individual felt is inference from living species, and is marked as such.",
        "This is a summary for general readers, written from the published literature. It is not a clinical or academic source, and nothing here is medical advice.",
      ],
      sourcesTitle: "Sources",
      sources: [
        { label: "Close DA et al. (2010). 11-Deoxycortisol is a corticosteroid hormone in the lamprey. PNAS 107(31)", href: "https://doi.org/10.1073/pnas.0914026107" },
        { label: "Shaughnessy CA, McCormick SD (2021). 11-Deoxycortisol is a stress responsive and gluconeogenic hormone in a jawless vertebrate, the sea lamprey. J Exp Biol 224(11)", href: "https://doi.org/10.1242/jeb.241943" },
        { label: "Thornton JW, Carroll SM (2011). Lamprey endocrinology is not ancestral. PNAS 108(2)", href: "https://doi.org/10.1073/pnas.1014896108" },
        { label: "Close DA et al. (2011). Reply to Thornton and Carroll: Lamprey endocrinology. PNAS 108(2)", href: "https://doi.org/10.1073/pnas.1015112108" },
        { label: "Beecher HK (1946). Pain in men wounded in battle. Annals of Surgery 123(1)", href: "https://doi.org/10.1097/00000658-194601000-00008" },
        { label: "Beecher HK (1956). Relationship of significance of wound to pain experienced. JAMA 161(17)", href: "https://doi.org/10.1001/jama.1956.02970170005002" },
        { label: "Butler RK, Finn DP (2009). Stress-induced analgesia. Progress in Neurobiology 88(3)", href: "https://doi.org/10.1016/j.pneurobio.2009.04.003" },
        { label: "Jennings EM et al. (2014). Stress-induced hyperalgesia. Progress in Neurobiology 121", href: "https://doi.org/10.1016/j.pneurobio.2014.06.003" },
        { label: "Trinkaus E, Villotte S (2017). External auditory exostoses and hearing loss in the Shanidar 1 Neandertal. PLOS ONE 12(10)", href: "https://doi.org/10.1371/journal.pone.0186684" },
        { label: "Wu X-J et al. (2011). Antemortem trauma and survival in the late Middle Pleistocene human cranium from Maba. PNAS 108(49)", href: "https://doi.org/10.1073/pnas.1117113108" },
        { label: "Coqueugniot H et al. (2014). Earliest cranio-encephalic trauma from the Levantine Middle Palaeolithic. PLOS ONE 9(7)", href: "https://doi.org/10.1371/journal.pone.0102822" },
        { label: "Lordkipanidze D et al. (2005). The earliest toothless hominin skull. Nature 434", href: "https://doi.org/10.1038/434717b" },
        { label: "Surbeck M et al. (2020). A toothless bonobo skull challenges the notion of alternative subsistence strategies in early Homo. J Hum Evol 147", href: "https://doi.org/10.1016/j.jhevol.2020.102871" },
        { label: "Richter D et al. (2017). The age of the hominin fossils from Jebel Irhoud, Morocco. Nature 546", href: "https://doi.org/10.1038/nature22335" },
        { label: "Hublin J-J et al. (2017). New fossils from Jebel Irhoud, Morocco. Nature 546", href: "https://doi.org/10.1038/nature22336" },
        { label: "International Commission on Stratigraphy. International Chronostratigraphic Chart", href: "https://stratigraphy.org/chart" },
      ],
    },
    colophon: {
      shareTitle: "A body that postpones pain · 500 million years of the stress response",
      disclaimer: "This is a summary for general readers, not a clinical or academic source, and not medical advice.",
      cta: "Work with me",
    },
  },

  fa: {
    events: {
      earth: { name: "شکل‌گیری زمین", note: "۴٫۵۴ میلیارد سال پیش" },
      cambrian: { name: "آغاز کامبرین", note: "انفجار طرح‌های بدنی جانوران در ۲۰ تا ۲۵ میلیون سال بعد رخ می‌دهد" },
      lamprey: { name: "جدا شدن خط لامپری‌ها از خط ما", note: "محور استرس از همان زمان وجود داشته است" },
      kpg: { name: "انقراض دایناسورهای غیرپرنده" },
      split: { name: "جدا شدن خط انسان و شامپانزه", note: "بیشتر برآوردها ۶٫۵ تا ۱۰ میلیون سال" },
      dmanisi: { name: "دمانیسی، گرجستان", note: "جمجمه‌ی بی‌دندان" },
      sapiens: { name: "قدیمی‌ترین فسیل‌های انسان خردمند", note: "جبل ایرهود، حدود ۳۱۵ هزار سال" },
      maba: { name: "جمجمه‌ی مابا، چین", note: "بین ۱۳۰ تا ۲۳۰ هزار سال" },
      qafzeh: { name: "قفزه ۱۱، نوجوان آسیب‌دیده" },
      shanidar: { name: "شانیدار ۱، «نَندی»", note: "حدود ۵۵ تا ۴۵ هزار سال" },
      writing: { name: "اختراع خط", note: "کمی بیش از ۵ هزار سال پیش" },
      you: { name: "یک عمر انسان", note: "حدود ۸۰ سال" },
    },
    hero: {
      kicker: "گزارش ۰۲",
      hook: [
        "بدن شما می‌تواند درد را چند دقیقه عقب بیندازد. سربازی با زخم سنگین راه می‌رود، در حالی که همان زخم در خانه او را از پا می‌انداخت.",
        "این ترفند اختراع انسان نیست. خیلی قدیمی‌تر از ماست — و به‌تنهایی توضیح نمی‌دهد آدم‌های به‌شدت زخمی چطور سال‌ها زنده ماندند.",
      ],
      summary:
        "محور هورمونی استرس که مهره‌داران در آن شریک‌اند بسیار کهن است: خطی که به لامپری‌ها — ماهی‌های بی‌آرواره — می‌رسد بیش از ۵۰۰ میلیون سال پیش از خط ما جدا شد و لامپری‌ها هنوز نسخه‌ای از آن را دارند. هورمون چند دقیقه وقت می‌خرد. فسیل انسان‌تبارهایی که سال‌ها پس از آسیب‌های خردکننده زنده ماندند، با چیز دیگری سازگار است: آدم‌های دیگر.",
      mega: "۵۰۰",
      megaUnit: "میلیون سال",
      megaLabel: "دست‌کم این مدت است که مهره‌داران همین محور هورمونی استرس را با خود دارند",
      asOf: "تاریخ‌ها بر پایه‌ی پژوهش‌های منتشرشده است؛ هر جا اختلاف هست، بازه آمده است.",
    },
    findings: {
      kicker: "شواهد چه می‌گویند",
      title: "پنج یافته",
      items: [
        "محور هورمونی استرس از آرواره قدیمی‌تر است. لامپری دریایی، که خطش بیش از ۵۰۰ میلیون سال پیش از خط ما جدا شد، همان الگوی هیپوتالاموس–هیپوفیز–اینتررنال (معادل فوق‌کلیه در ماهی‌ها) را با استروئیدی دیگر به نام ۱۱-دئوکسی‌کورتیزول اجرا می‌کند. در لاروهای لامپری زیر استرس، این هورمون ظرف شش ساعت حدود پانزده برابر و قند خون حدود سه برابر شد.",
        "«جنگ یا گریز» یک مدار نیست، سه مدار است با سه سرعت: آدرنالین در چند ثانیه، کورتیزول در چند دقیقه تا چند ساعت، و مداری جداگانه برای مهار درد در میانه‌ی این دو.",
        "هنری بیچر دید سربازان به‌شدت زخمی خیلی کمتر از غیرنظامیانی با جراحت مشابه مسکّن اپیوئیدی (مثل مورفین) می‌خواهند؛ حدود ۳۲ درصد در برابر ۸۳ درصد. اندازه‌ی زخم تعیین‌کننده‌ی درد نبود.",
        "همان مسیر نزولی مهار درد می‌تواند درد را کم یا زیاد کند. استرس حاد معمولاً درد را مهار می‌کند؛ استرس طولانی معمولاً برعکس عمل می‌کند و حساسیت به درد را بالا می‌برد.",
        "شانیدار ۱ با کاسه‌ی چشم چپِ خردشده، یک گوش ناشنوا، بازویی که بالای آرنج از دست رفته بود و پای آسیب‌دیده تا حدود ۴۰ تا ۵۰ سالگی زندگی کرد. هورمون دقایق اول را توضیح می‌دهد. سال‌ها دوام آوردن با گروهی سازگار است که رهایش نکرد.",
      ],
    },
    spiral: {
      title: "مارپیچ زمان ژرف",
      lead: "کل تاریخ زمین را در یک مارپیچ رو به بالا بپیچید و فاصله‌ها را طوری بگذارید که هر پله‌ی بالاتر ده برابر به امروز نزدیک‌تر باشد. در چنین مقیاسی، چند صد هزار سال اخیر دیگر خطای گردکردن نیست و به اندازه‌ی یک میلیارد سال اول جا می‌گیرد.",
      hint: "برای چرخاندن مارپیچ بکشید. یک رویداد را انتخاب کنید تا رو به شما بچرخد.",
      selected: "انتخاب‌شده",
      onClock: "روی ساعت ۲۴ ساعته:",
      caption: "فاصله‌ها لگاریتمی‌اند: هر پله‌ی علامت‌دار ده برابر از پله‌ی پایینی به امروز نزدیک‌تر است. فقط این‌طور است که ۴٫۵۴ میلیارد سال و یک عمر انسان در یک تصویر جا می‌شوند. ساعت تخت پایین همین رویدادها را با نسبت واقعی نشان می‌دهد.",
      noWebgl: "این مرورگر نمی‌تواند مارپیچ سه‌بعدی را نشان دهد. فهرست کنارش همان رویدادها را دارد.",
    },
    scale: {
      kicker: "مقیاس",
      title: "۵۰۰ میلیون سال اصلاً یعنی چقدر؟",
      lead: "عددهای بزرگ برای ذهن ما معنا ندارند. پس کل عمر زمین را در یک شبانه‌روز ۲۴ ساعته فشرده می‌کنیم: سیاره ساعت ۰۰:۰۰ شکل می‌گیرد و «الان» دقیقاً نیمه‌شب است. بعد مرحله‌به‌مرحله بزرگ‌نمایی کنید و ببینید کل گونه‌ی ما چطور به یک خطای گردکردن تبدیل می‌شود.",
      dayLabel: "شبانه‌روز ۲۴ ساعته",
      nowLabel: "الان",
      birthLabel: "تولد زمین",
      zoomHint: "بزرگ‌نمایی کنید. هر مرحله، باریکه‌ی انتهای مرحله‌ی قبل را باز می‌کند.",
      stages: {
        day: { name: "کل شبانه‌روز", reading: "کل تاریخ زمین، فشرده در ۲۴ ساعت. یک ثانیه در این مقیاس حدود ۵۲٬۵۰۰ سال است." },
        minute: { name: "آخرین دقیقه", reading: "آخرین دقیقه‌ی این شبانه‌روز حدود ۳٫۲ میلیون سال است؛ تقریباً کل عمر سرده‌ی انسان." },
        second: { name: "آخرین ۶ ثانیه", reading: "هر چه انسان خردمند بوده و کرده، در ۶ ثانیه‌ی آخر پیش از نیمه‌شب جا می‌شود." },
        tenth: { name: "آخرین کسر ثانیه", reading: "خط حدود یک‌دهم ثانیه پیش از نیمه‌شب پیدا می‌شود. هر امپراتوری، هر شهر و هر کتابی بعد از آن آمده است." },
      },
      perSecond: "یک ثانیه =",
      rulerTitle: "یک مقیاس دیگر: هر سال، یک میلی‌متر",
      rulerLead: "این بار زمان را مثل یک جاده بچینیم. هر سالی که می‌گذرد، یک میلی‌متر راه رفتن است.",
      rulerUnits: {
        you: "تقریباً اندازه‌ی یک انگشت",
        writing: "طول یک اتاق",
        shanidar: "نصف زمین فوتبال",
        sapiens: "حدود سه زمین فوتبال پشت سر هم",
        dmanisi: "حدود بیست دقیقه پیاده‌روی",
        lamprey: "حدود جاده‌ی تهران تا اصفهان، به‌علاوه‌ی ۷۰ کیلومتر",
        earth: "",
        cambrian: "",
        kpg: "",
        split: "",
        maba: "",
        qafzeh: "",
      },
      rulerNote:
        "یعنی اگر از در خانه‌تان در تهران به سمت اصفهان راه بیفتید، نئاندرتالِ شانیدار فقط ۵۰ متر پشت سر شماست. سامانه‌ی استرسی که او به کار می‌برد، آن سر جاده ساخته شده بود.",
    },
    circuits: {
      kicker: "سازوکار",
      title: "سه مدار، نه یک مدار",
      lead: "آنچه «جنگ یا گریز» می‌نامیم — والتر کانن در ۱۹۱۵ آن را «ضرورت‌های جنگیدن یا گریختن» توصیف کرد — در واقع چند سامانه است که هم‌زمان و با سرعت‌های متفاوت کار می‌کنند. تفکیکشان مهم است، چون شواهد زمان ژرف فقط به یکی از آن‌ها مربوط‌اند.",
      hint: "یک مدار را فعال کنید و مسیر سیگنال را ببینید. زمان‌ها واقعی‌اند؛ انیمیشن فشرده است.",
      fire: "فعال کنید",
      reset: "از نو",
      arrives: "زمان رسیدن به بدن:",
      lanes: {
        adrenaline: {
          name: "مدار سریع: آدرنالین",
          timing: "چند ثانیه",
          chain: ["تهدید", "آمیگدالا", "هیپوتالاموس", "عصب سمپاتیک", "بخش مرکزی غده‌ی فوق‌کلیه", "آدرنالین"],
          body: "ضربان و فشار خون بالا می‌رود، قند در خون آزاد می‌شود، مردمک‌ها گشاد می‌شوند و توجه متمرکز می‌شود.",
        },
        cortisol: {
          name: "مدار کند: کورتیزول",
          timing: "چند دقیقه تا چند ساعت",
          chain: ["هیپوتالاموس · CRH", "هیپوفیز · ACTH", "قشر غده‌ی فوق‌کلیه", "کورتیزول"],
          body: "انرژی لازم برای ادامه دادن را تأمین می‌کند و التهاب را مهار می‌کند.",
          note: "شواهد زمان ژرف اینجاست. لامپری دریایی همین محور را با استروئیدی دیگر، ۱۱-دئوکسی‌کورتیزول، اجرا می‌کند. در لاروهای زیر استرس این هورمون ظرف شش ساعت حدود پانزده برابر و قند خون حدود سه برابر شد. محور حفظ شده است؛ خود هورمون نه.",
        },
        analgesia: {
          name: "مدار مهار درد",
          timing: "چند دقیقه",
          chain: ["ترس یا استرس شدید", "ماده‌ی خاکستری دورقناتی (PAG)", "بخش شکمی‌میانیِ منقاری بصل‌النخاع (RVM)", "شاخ خلفی نخاع", "سیگنال درد کم می‌شود"],
          body: "به‌واسطه‌ی اپیوئیدهای درون‌زاد و اندوکانابینوئیدها انجام می‌شود و سامانه‌های مونوآمین، گابا و گلوتامات هم درگیرند. نام این پدیده «بی‌دردی ناشی از استرس» است. همین مسیر می‌تواند درد را بیشتر هم بکند.",
        },
      },
    },
    beecher: {
      kicker: "انسان امروزی",
      title: "بی‌دردی در میدان جنگ",
      lead: "در جنگ جهانی دوم، متخصص بیهوشی‌ای به نام هنری بیچر ۲۱۵ سرباز به‌شدت زخمی را در جبهه‌ی ایتالیا، از جمله آنزیو، بررسی کرد؛ بیشترشان گفتند دردشان آن‌قدر شدید نیست که چیزی برایش بخواهند. یک دهه بعد همین پرسش را از غیرنظامیانی با جراحت جراحی مشابه پرسید و دو گروه را مقایسه کرد: برای درد مسکّن اپیوئیدی می‌خواهید؟",
      soldiers: "سربازان به‌شدت زخمی که مسکّن اپیوئیدی خواستند",
      civilians: "غیرنظامیان با جراحت مشابه",
      reading:
        "برداشت بیچر: درد صرفاً اندازه‌ی زخم نیست. معنای موقعیت آن را تغییر می‌دهد. برای سرباز، زخم یعنی «زنده ماندم و از جبهه دور می‌شوم».",
      caveat:
        "دو نکته که بازگویی‌های عامه حذف می‌کنند. این مطالعه مشاهده‌ای و بدون کورسازی بود و گروه‌ها از پیش همسان نشده بودند؛ پس عددها را چشمگیر بدانید، نه دقیق. و اثر کوتاه‌مدت است: استرس طولانی و مزمن اغلب برعکس عمل می‌کند و آدم را به درد حساس‌تر می‌کند. این سازوکار برای چند دقیقه‌ی بحرانی ساخته شده، نه برای عمری که زیر فشار می‌گذرد.",
    },
    fossils: {
      kicker: "شواهد فسیلی",
      title: "استخوان‌هایی که جوش خوردند",
      lead: "استخوان جوش‌خورده یعنی فرد بعد از آسیب زنده مانده؛ هفته‌ها، ماه‌ها، گاهی سال‌ها. چهار نمونه، از قدیم به جدید.",
      ages: { dmanisi: "۱٫۷۷ میلیون سال", maba: "۱۳۰ تا ۲۳۰ هزار", qafzeh: "۹۰ تا ۱۰۰ هزار", shanidar: "۵۵ تا ۴۵ هزار" },
      cases: {
        dmanisi: {
          place: "دمانیسی، گرجستان",
          title: "فرد بی‌دندان",
          body: "همه‌ی دندان‌ها به‌جز یکی سال‌ها پیش از مرگ از دست رفته بودند و حفره‌ها کاملاً بسته شده بودند. بدون جویدن مؤثر، شاید کسی غذای نرم یا آماده به او می‌رسانده. قدیمی‌ترین نامزد «مراقبت» در تبار انسان است — و فقط یک نامزد: خود نویسندگان اصلی هم احتمال دادند او با گیاهان نرم و مغز استخوان بی‌کمک دوام آورده باشد، و بعدها یک بونوبوی وحشی بی‌دندان دیده شد که مدت‌ها به‌تنهایی زنده ماند.",
        },
        maba: {
          place: "مابا، جنوب چین",
          title: "فرورفتگی جوش‌خورده در جمجمه",
          body: "فرورفتگی هلالی به طول حدود ۱٫۴ سانتی‌متر در پیشانی سمت راست با لبه‌های ترمیم‌شده؛ ضربه با جسم کُند که شاید کار انسان‌تبار دیگری بوده، هرچند علتش را نمی‌شود دانست. فرد زنده ماند. تاریخ هنوز قطعی نیست: جایی بین حدود ۱۳۰ تا ۲۳۰ هزار سال.",
        },
        qafzeh: {
          place: "غار قفزه، جلیل سفلی، نزدیک ناصره",
          title: "نوجوان آسیب‌دیده",
          body: "انسان خردمندی دوازده یا سیزده ساله، حدود ۹۰ تا ۱۰۰ هزار سال پیش، با شکستگی فرورفته‌ی جوش‌خورده در پیشانی سمت راست که به احتمال زیاد مشکلات شخصیتی و عصبی به‌همراه داشته است. دو شاخ گوزن روی سینه‌اش بود که پیشکشی تدفینی تعبیر می‌شود. آسیب، بقا و تدفین عامدانه در یک فرد.",
        },
        shanidar: {
          place: "غار شانیدار، کردستان عراق",
          title: "شانیدار ۱، «نَندی»",
          body: "نئاندرتالی که به حدود ۴۰ تا ۵۰ سالگی رسید — برای نئاندرتال سن بالایی است — با مجموعه‌ای از آسیب‌ها که امروز هم سنگین شمرده می‌شوند. کاوش: رالف سولکی، ۱۹۵۷؛ کاوش‌های تازه او را حدود ۵۵ تا ۴۵ هزار سال پیش تاریخ‌گذاری می‌کنند. پایین‌تر ببینید.",
        },
      },
    },
    shanidar: {
      kicker: "یک نفر",
      title: "شانیدار ۱",
      lead: "از میان همه‌ی فسیل‌های این گزارش، همین یکی استدلال را می‌سازد. نه به‌خاطر کاری که هورمون‌هایش در دقایق اول کردند، بلکه به‌خاطر چیزی که دهه‌های بعد لازم داشت.",
      hint: "یک آسیب را انتخاب کنید.",
      injuries: {
        face: {
          short: "ضربه‌ی خردکننده به صورت",
          body: "ضربه‌ای سنگین به سمت چپ صورت که کاسه‌ی چشم چپ را هم گرفته است. بینایی آن چشم احتمالاً کم شده یا از دست رفته بود.",
        },
        ear: {
          short: "ناشنوایی گوش راست",
          body: "زائده‌های استخوانی در هر دو مجرای گوش؛ در گوش راست دهانه‌ی مجرا را سرتاسر پل زده‌اند. اریک ترینکاوس این زائده‌ها را اواخر دهه‌ی ۱۹۷۰ ثبت کرده بود، اما اثرشان بر شنوایی تازه در ۲۰۱۷ بررسی شد: احتمالاً از گوش راست عملاً ناشنوا بوده و دست‌کم بخشی از شنوایی گوش چپ را هم از دست داده بود. در سرزمینی پر از شکارچی، کسی که نمی‌شنود به شنیدنِ دیگران وابسته است.",
        },
        arm: {
          short: "بازوی راست تحلیل‌رفته",
          body: "بازوی راست به‌وضوح تحلیل رفته و به باقی‌مانده‌ای ضعیف از بازو کمی بالای آرنج ختم می‌شود. ساعد و دست مدت‌ها پیش از مرگ از دست رفته بودند؛ به احتمال زیاد با قطع عضو بالای آرنج، پس از شکستگی‌ای که جوش نخورد (ترینکاوس و ویلوت ۲۰۱۷). برداشتی قدیمی‌تر آن را به آسیب عصبی نسبت می‌داد.",
        },
        leg: {
          short: "آسیب زانو و پای راست",
          body: "آسیب و تغییرات دژنراتیو در زانو و پای راست. احتمالاً با راه رفتنی غیرعادی حرکت می‌کرده است.",
        },
      },
      caveat:
        "طرح شماتیک است، نه بازسازی اسکلت. علت آسیب‌ها معلوم نیست — حادثه‌ی شکار و خشونت هر دو ممکن‌اند — و ترتیب رخ دادنشان هم معلوم نیست.",
    },
    limits: {
      kicker: "خوانش صادقانه",
      title: "استخوان چه می‌گوید و چه نمی‌گوید",
      canTitle: "با اطمینان می‌شود گفت",
      can: [
        "محور هورمونی استرس میان مهره‌داران، از ماهی تا انسان، مشترک و بسیار کهن است — هرچند هورمونی که با آن کار می‌کند در خط‌های مختلف فرق دارد.",
        "بی‌دردی ناشی از استرس در پستانداران به‌خوبی مستند است و سامانه‌های اوپیوئیدی در مهره‌داران دیگر هم وجود دارند.",
        "انسان‌تبارهای کهن آسیب‌های بسیار سنگین را تاب آورده‌اند، در مواردی سال‌ها.",
      ],
      cannotTitle: "از فسیل نمی‌شود خواند",
      cannot: [
        "اینکه نَندی در لحظه‌ی ضربه آدرنالین در خون داشته یا دردش سرکوب شده بوده. هورمون فسیل نمی‌شود. این بخش استنتاج از زیست‌شناسی امروز است، نه شاهدی که استخوان بدهد.",
        "اینکه از او مراقبت شده یا نه. «جنگ یا گریز» شاید او را در دقایق اول نگه داشته باشد؛ سال‌ها زندگی با یک دست، یک چشم آسیب‌دیده و یک گوش ناشنوا با گروهی سازگار است که رهایش نکرد — نه اثبات آن. همه‌ی نمونه‌های این گزارش دقیقاً سر همین نکته محل بحث‌اند.",
      ],
      closing:
        "بدن ما درد را برای چند دقیقه‌ی بحرانی عقب می‌اندازد؛ این میراثی است که مهره‌داران در آن شریک‌اند. هورمون چند دقیقه وقت می‌خرد و جوش خوردن سال‌ها طول می‌کشد. استخوان‌هایی که جوش خوردند با همان چیزی سازگارند که هورمون نمی‌تواند فراهم کند: آدم‌هایی که زخمی را تنها نگذاشتند.",
    },
    method: {
      kicker: "روش و منابع",
      title: "این گزارش چطور ساخته شد",
      notes: [
        "ساعت ۲۴ ساعته عمر زمین را ۴٫۵۴ میلیارد سال می‌گیرد. هر زمانی روی آن از همین عدد محاسبه شده، نه با تخمین چشمی.",
        "هر جا تاریخ محل اختلاف است — به‌ویژه مابا و لایه‌های شانیدار — متن بازه را می‌آورد؛ ساعت، خط‌کش و مارپیچ به یک نقطه نیاز دارند و مقداری درون همان بازه را به کار می‌برند.",
        "تاریخ‌های واگرایی تخمینی‌اند. عدد ۵۰۰ میلیون سال کفِ برآورد جدایی خطی است که به لامپری‌ها می‌رسد از خط ما، نه سن خود لامپری‌ها؛ برآوردهای منتشرشده از حدود ۵۰۰ تا بیش از ۵۶۰ میلیون سال است. برآوردهای جدایی انسان و شامپانزه از حدود ۶٫۵ تا ۱۰ میلیون سال است و بعضی تا ۱۳؛ ساعت عدد ۷ را به کار می‌برد.",
        "اینکه سامانه‌ی لامپری حالت اجدادی مهره‌داران را نشان می‌دهد یا نه، خودش محل بحث است (تورنتون و کرول ۲۰۱۱، و پاسخ کلوز و همکاران).",
        "هورمون و بافت نرم فسیل نمی‌شوند. هر جمله‌ای درباره‌ی احساس یک فرد کهن، استنتاج از گونه‌های زنده‌ی امروز است و همان‌جا مشخص شده.",
        "این یک خلاصه برای خواننده‌ی عمومی است که بر پایه‌ی پژوهش‌های منتشرشده نوشته شده. منبع بالینی یا آکادمیک نیست و هیچ‌چیز آن توصیه‌ی پزشکی نیست.",
      ],
      sourcesTitle: "منابع",
      sources: [
        { label: "Close DA et al. (2010). 11-Deoxycortisol is a corticosteroid hormone in the lamprey. PNAS 107(31)", href: "https://doi.org/10.1073/pnas.0914026107" },
        { label: "Shaughnessy CA, McCormick SD (2021). 11-Deoxycortisol is a stress responsive and gluconeogenic hormone in a jawless vertebrate, the sea lamprey. J Exp Biol 224(11)", href: "https://doi.org/10.1242/jeb.241943" },
        { label: "Thornton JW, Carroll SM (2011). Lamprey endocrinology is not ancestral. PNAS 108(2)", href: "https://doi.org/10.1073/pnas.1014896108" },
        { label: "Close DA et al. (2011). Reply to Thornton and Carroll: Lamprey endocrinology. PNAS 108(2)", href: "https://doi.org/10.1073/pnas.1015112108" },
        { label: "Beecher HK (1946). Pain in men wounded in battle. Annals of Surgery 123(1)", href: "https://doi.org/10.1097/00000658-194601000-00008" },
        { label: "Beecher HK (1956). Relationship of significance of wound to pain experienced. JAMA 161(17)", href: "https://doi.org/10.1001/jama.1956.02970170005002" },
        { label: "Butler RK, Finn DP (2009). Stress-induced analgesia. Progress in Neurobiology 88(3)", href: "https://doi.org/10.1016/j.pneurobio.2009.04.003" },
        { label: "Jennings EM et al. (2014). Stress-induced hyperalgesia. Progress in Neurobiology 121", href: "https://doi.org/10.1016/j.pneurobio.2014.06.003" },
        { label: "Trinkaus E, Villotte S (2017). External auditory exostoses and hearing loss in the Shanidar 1 Neandertal. PLOS ONE 12(10)", href: "https://doi.org/10.1371/journal.pone.0186684" },
        { label: "Wu X-J et al. (2011). Antemortem trauma and survival in the late Middle Pleistocene human cranium from Maba. PNAS 108(49)", href: "https://doi.org/10.1073/pnas.1117113108" },
        { label: "Coqueugniot H et al. (2014). Earliest cranio-encephalic trauma from the Levantine Middle Palaeolithic. PLOS ONE 9(7)", href: "https://doi.org/10.1371/journal.pone.0102822" },
        { label: "Lordkipanidze D et al. (2005). The earliest toothless hominin skull. Nature 434", href: "https://doi.org/10.1038/434717b" },
        { label: "Surbeck M et al. (2020). A toothless bonobo skull challenges the notion of alternative subsistence strategies in early Homo. J Hum Evol 147", href: "https://doi.org/10.1016/j.jhevol.2020.102871" },
        { label: "Richter D et al. (2017). The age of the hominin fossils from Jebel Irhoud, Morocco. Nature 546", href: "https://doi.org/10.1038/nature22335" },
        { label: "Hublin J-J et al. (2017). New fossils from Jebel Irhoud, Morocco. Nature 546", href: "https://doi.org/10.1038/nature22336" },
        { label: "International Commission on Stratigraphy. International Chronostratigraphic Chart", href: "https://stratigraphy.org/chart" },
      ],
    },
    colophon: {
      shareTitle: "بدنی که درد را عقب می‌اندازد · ۵۰۰ میلیون سال واکنش استرس",
      disclaimer: "این یک خلاصه برای خواننده‌ی عمومی است، نه منبع بالینی یا آکادمیک، و توصیه‌ی پزشکی نیست.",
      cta: "با من کار کنید",
    },
  },
}
