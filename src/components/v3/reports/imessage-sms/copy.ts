// ============================================================================
// File Path: src/components/v3/reports/imessage-sms/copy.ts
// Why: Every word of report 04 in both locales, one structure for both. The
//      Persian is Farjad's own fact-check, set for the site; the English says
//      the same thing. Claims are attributed to where they appeared (a tweet,
//      a Telegram screenshot, the author's own group messages), not to named
//      private individuals.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { LaneKey, Verdict, VisibilityKey } from "./data"

type Copy = {
  hero: {
    kicker: string
    lead: string
    verdictTitle: string
    verdict: { kind: Verdict | "info"; label: string; text: string }[]
    mega: string
    megaUnit: string
    megaLabel: string
    asOf: string
  }
  paths: {
    kicker: string
    title: string
    lead: string
    hint: string
    lanes: Record<LaneKey, { name: string; hops: { t: string; s: string }[]; note: string }>
    caption: string
  }
  loop: { kicker: string; title: string; lead: string; steps: string[]; caption: string; hypothesis: { title: string; body: string } }
  sim: {
    kicker: string
    title: string
    lead: string
    retriesLabel: string
    daysLabel: string
    tariffLabel: string
    presets: { low: string; high: string; mci: string }
    perDay: string
    smsCount: string
    bill: string
    toman: string
    toReach: (sms: string, toman: string) => string
    caveat: string
    arithmetic: { title: string; lead: string; cards: { label: string; eq: string; res: string }[]; conclusion: string }
  }
  claims: {
    kicker: string
    title: string
    hint: string
    claimLabel: string
    verdictLabel: string
    verdicts: Record<Verdict, string>
    items: { claim: string; who: string; why: string }[]
  }
  visibility: {
    kicker: string
    title: string
    lead: string
    toggle: { imessage: string; sms: string }
    levels: { full: string; high: string; medium: string; low: string; none: string }
    rows: Record<VisibilityKey, { name: string; sub: string; note: string }>
  }
  fix: {
    kicker: string
    title: string
    lead: string
    steps: { title: string; path?: string; body: string }[]
    done: string
    progress: (n: string, total: string) => string
    mock: { title: string; section: string; number: string; email: string; on: string; off: string; hint: string }
  }
  review: { kicker: string; title: string; lead: string; ok: { title: string; items: string[] }; no: { title: string; items: string[] } }
  post: { kicker: string; title: string; lead: string; text: string; copy: string; copied: string }
  method: { kicker: string; title: string; notes: string[]; sourcesTitle: string; sources: { grade: string; label: string; href: string }[] }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

export const COPY: Record<Locale, Copy> = {
  en: {
    hero: {
      kicker: "Report 04",
      lead: "A fact-check of claims that went round Twitter and Telegram — and of the technical explanation that travelled with them — against Apple's own documentation, encyclopaedic sources and peer-reviewed papers.",
      verdictTitle: "The verdict in four lines",
      verdict: [
        { kind: "true", label: "True", text: "The cost is real. To activate iMessage and FaceTime with a phone number, an iPhone sends a hidden international text message to Apple, and Apple itself says the operator may charge for it." },
        { kind: "half", label: "The real cause", text: "If activation of a +98 number fails, the phone tries again and again — and every try is one international SMS." },
        { kind: "false", label: "False", text: "The operator does not count iMessage messages one by one and bill them as texts. The messages themselves travel over data, end-to-end encrypted." },
        { kind: "info", label: "The fix", text: "Remove the phone number from iMessage and FaceTime (keep the Apple ID email), and block international SMS with the operator. Turning off “Send as Text Message” alone is not enough." },
      ],
      mega: "1",
      megaUnit: "hidden text message",
      megaLabel: "per activation attempt — sent to an Apple number abroad, and sent again every time activation fails",
      asOf: "Report dated 11 October 2026. Operator tariffs and Apple's behaviour can change; every figure carries its source.",
    },
    paths: {
      kicker: "The mechanism",
      title: "Two completely separate paths",
      lead: "Most of the confusion comes from treating two different paths as one. The first only registers your number, and it goes over the SMS network. The second carries the messages themselves, and it goes over the internet.",
      hint: "Scroll, and watch each path draw itself in.",
      lanes: {
        activation: {
          name: "Path 1 · Registering the number (SMS)",
          hops: [
            { t: "Your iPhone", s: "SIM +98" },
            { t: "Operator's SMS centre", s: "SMSC · MCI" },
            { t: "International gateway", s: "SS7 / MAP" },
            { t: "Apple's number abroad", s: "+44 · per user reports" },
          ],
          note: "Billable as an international SMS · the SMS content is not end-to-end encrypted",
        },
        messaging: {
          name: "Path 2 · Sending messages and calls (data)",
          hops: [
            { t: "Your iPhone", s: "iMessage / FaceTime" },
            { t: "Operator's data core", s: "P-GW / UPF · DPI" },
            { t: "The internet", s: "TLS · TCP 5223/443" },
            { t: "Apple's servers", s: "APNs · 17.0.0.0/8" },
          ],
          note: "Only data volume is counted · content is end-to-end encrypted",
        },
      },
      caption: "The registration path is SMS and it costs money; the message path is data. The addresses and ports come from Apple's guide for network administrators, and the roles of APNs and IDS from Apple's security guide. Apple does not publish where the activation SMS goes; users and several carriers report a UK (+44) number.",
    },
    loop: {
      kicker: "Why the bill climbs",
      title: "The retry loop",
      lead: "Apple's own support page says: “you need SMS messaging to activate your phone number with iMessage and FaceTime” and “depending on your carrier, you might be charged for this SMS” — and tells you to make sure you can send international SMS. The same page lists errors such as “Waiting for activation” and says the device “automatically attempts to verify your phone number”. How often it retries, Apple does not say.",
      steps: ["iMessage / FaceTime switched on with a phone number", "Hidden SMS sent to Apple", "Activation fails — “Waiting for activation”", "Try again = another SMS"],
      caption: "Every turn of this loop is one international text message. Apple does not document the retry interval. Users report the texts repeating daily on carriers Apple does not partner with (Apple Community, 2020), and on every restart (iFixit, 2018). Those are user reports, not official documents.",
      hypothesis: {
        title: "One thing that has to stay separate",
        body: "Whether Apple accepts +98 numbers for iMessage at all is neither confirmed nor denied in any official Apple source I found. So “activation fails in Iran” is a reasonable hypothesis that fits the pattern of reports — not an established fact. What is documented is the charge itself: MCI's own international-services page names iMessage, FaceTime and Xiaomi Cloud as the apps that “may send numerous international text messages without the subscriber's knowledge and increase the bill”, and the Iranian press reported operators tracing exactly these charges to iMessage and FaceTime back in 2017.",
      },
    },
    sim: {
      kicker: "Try it",
      title: "How a bill like this grows",
      lead: "The tweets quoted 167 and 447 rial per message. MCI's own tariff page, checked on 11 October 2026, lists 45,000 toman — 450,000 rial — for one SMS to a UK mobile. Set your own: how often the phone retries, for how many days, at which rate.",
      retriesLabel: "Retries per day",
      daysLabel: "Days",
      tariffLabel: "Rial per international SMS",
      presets: { low: "167 (tweet)", high: "447 (tweet)", mci: "450,000 · MCI official" },
      perDay: "a day",
      smsCount: "Text messages sent",
      bill: "On the bill",
      toman: "toman",
      toReach: (sms, toman) => `At this rate, the ${toman} toman in the tweet is about ${sms} messages.`,
      caveat: "A simple model: retries × days × tariff. Real retry intervals are not documented by Apple and vary with signal and settings. The point is the shape of the number, not a prediction of your bill.",
      arithmetic: {
        title: "The tweet's per-message figures do not match the official tariff",
        lead: "The author of the thread said “nearly 100,000 toman” and also “90 text messages”, and quoted 167 and 447 rial per message. MCI's official rate for an SMS to a UK mobile is 45,000 toman. Simple arithmetic:",
        cards: [
          { label: "The tweet's own figures", eq: "100,000 ÷ 90 ≈ 1,111 toman each", res: "matches neither 167 nor 447 rial" },
          { label: "At 447 rial (the second tweet)", eq: "90 × 447 = 40,230 IRR", res: "≈ 4,023 toman, not 100,000" },
          { label: "At MCI's official 45,000 toman", eq: "100,000 ÷ 45,000 ≈ 2.2", res: "two or three messages" },
        ],
        conclusion: "The bill is plausible; the per-message figures circulating with it are not. At the official rate, 100,000 toman is two or three activation attempts, not ninety — and a phone that keeps retrying can cost far more than the tweet feared.",
      },
    },
    claims: {
      kicker: "Claim by claim",
      title: "Eight claims, checked",
      hint: "Tap a card for the verdict and the source.",
      claimLabel: "The claim",
      verdictLabel: "Verdict",
      verdicts: { true: "True", likely: "Likely", half: "Half true", false: "False" },
      items: [
        { claim: "To activate iMessage and FaceTime, an SMS is sent to Apple.", who: "Twitter thread", why: "Apple states plainly that activating a number needs an SMS and may be charged for." },
        { claim: "MCI charges iPhone users for international SMS.", who: "Twitter thread", why: "The mechanism is documented. I have not seen the user's own bill." },
        { claim: "Every iMessage is confirmed, counted and billed by the operator.", who: "Twitter thread", why: "iMessage runs over APNs with end-to-end encrypted content, and Apple does not retain it. The traffic goes over the internet, not the SMS network." },
        { claim: "FaceTime is billed per minute, like an international call.", who: "Twitter thread", why: "FaceTime also uses APNs to set up the connection and Apple's relay servers to carry it; audio and video are end-to-end encrypted. To the operator it is data traffic, not a voice call. Any cost is the activation SMS — which FaceTime needs too — not minutes." },
        { claim: "Blocking international calls and SMS in the operator's app solves it.", who: "Twitter thread", why: "With outgoing international SMS blocked, the activation message is never sent and nothing is billed. The number is not activated either." },
        { claim: "Turning off “Send as Text Message” fixes it.", who: "Telegram screenshot", why: "Apple describes that setting as making Messages try SMS automatically when iMessage is unavailable, at messaging rates. Turning it off closes that cost. The activation SMS is a separate matter: by Apple's own account it is tied to iMessage and FaceTime being switched on, and an Apple Community answer says signing out of both — not just toggling — is what stops the texts." },
        { claim: "The operator can tell how much data each subscriber used for which service.", who: "The author, in a Telegram group", why: "ISPs use deep packet inspection for traffic management, service bundles and lawful intercept. Research shows encrypted traffic can be classified without decrypting it. Not with 100% accuracy." },
        { claim: "The message text itself cannot be read.", who: "The author, in a Telegram group", why: "True for iMessage. Not true for ordinary SMS: GSM encryption only covers the link between phone and tower, and weakly." },
      ],
    },
    visibility: {
      kicker: "What the operator sees",
      title: "Visibility to the operator",
      lead: "Built from Apple's documented architecture and the traffic-classification literature. The levels are qualitative, not measured. Switch between an iMessage and an ordinary SMS and watch the last rows change.",
      toggle: { imessage: "An iMessage", sms: "An ordinary SMS" },
      levels: { full: "Full", high: "High", medium: "Medium", low: "Low", none: "None (from the network)" },
      rows: {
        subscriber: { name: "Which subscriber is connected", sub: "MSISDN / IMSI ↔ IP", note: "The operator ties every data session to a SIM; that is the basis of usage accounting." },
        appleServers: { name: "A connection to Apple's servers", sub: "dst 17.0.0.0/8 · port 5223", note: "Apple itself publishes the IP block and ports for network administrators." },
        volume: { name: "Volume and timing of traffic", sub: "flow metadata", note: "Packet sizes, timing and duration of a flow are visible in any case." },
        service: { name: "iMessage, or another Apple service?", sub: "service classification", note: "APNs is shared between several Apple services; telling them apart needs pattern analysis." },
        recipient: { name: "The recipient's number or Apple ID", sub: "recipient identity", note: "The recipient's address is inside the encrypted traffic to Apple's server, not in a packet header." },
        content: { name: "The text of the message", sub: "message content", note: "End-to-end encrypted for iMessage. Spyware on the phone or an unencrypted backup are a separate matter. An SMS passes through and is stored at the operator's SMS centre, with no end-to-end encryption." },
      },
    },
    fix: {
      kicker: "The fix",
      title: "The right fix, in order",
      lead: "Five steps. Tick them off as you go.",
      steps: [
        { title: "Remove the number from iMessage", path: "Settings › Apps › Messages › Send & Receive", body: "Untick the +98 number and keep only the Apple ID email. Apple names email as the official alternative." },
        { title: "Do the same for FaceTime", path: "Settings › Apps › FaceTime › You Can Be Reached By", body: "Remove the number, or switch FaceTime off." },
        { title: "Switch off fallback to SMS", path: "Settings › Apps › Messages › Send as Text Message", body: "This stops a failed message from quietly becoming a paid text. It does not touch the activation SMS, which is why the first two steps come first." },
        { title: "Block international SMS with the operator", path: "My MCI app › Services", body: "The strongest layer. Even if the phone retries, no message leaves and nothing is billed." },
        { title: "Check the itemised bill", body: "Look for repeated texts to one fixed foreign number. That pattern is the signature of the activation loop." },
      ],
      done: "Done",
      progress: (n, total) => `${n} of ${total} done`,
      mock: { title: "iMessage", section: "Send & Receive", number: "+98 912 ··· ··· ·", email: "name@icloud.com", on: "The number is ticked: activation SMS can still be sent.", off: "Number removed: no activation SMS is sent.", hint: "Tap the number to see what changes." },
    },
    review: {
      kicker: "The first technical answer",
      title: "What the technical answer got right, and what it missed",
      lead: "A technical explanation circulated alongside the thread, and it is worth reviewing on its own: it is a good example of an answer that is correct about the protocols and still misses the point.",
      ok: {
        title: "What it got right",
        items: [
          "The distinction between content, metadata and traffic classification is correct.",
          "Its explanation of DPI, SNI, flow analysis and the effect of a VPN is accurate; SNI is sent in the clear by default.",
          "“Content security is not the same as anonymity” is the right conclusion.",
        ],
      },
      no: {
        title: "What was wrong or missing",
        items: [
          "It took a sentence about “which number uses which service” to mean identifying the recipient, and “corrected” it. The original was right.",
          "It accepted the “hiding from surveillance” framing without checking. The group's question was about cost.",
          "In a long analysis of DPI it never mentioned the activation SMS — the one thing that explains the whole story.",
          "Its suggested text for the group did not say how to avoid the charge.",
        ],
      },
    },
    post: {
      kicker: "Ready to post",
      title: "The short version, for the group",
      lead: "If you want to settle it in a chat without the diagrams.",
      text: `The charges are real, but they have nothing to do with iMessage being read.

To activate iMessage and FaceTime with a phone number, the iPhone sends a hidden text message to an Apple number abroad. If activation fails, the phone tries again and again, and the operator bills each try as an international SMS. The iMessages themselves travel over data and are not billed separately.

The fix:
1. Settings › Messages › Send & Receive: remove the number (keep the Apple ID email)
2. Settings › FaceTime: the same
3. Turn off Send as Text Message
4. Block international SMS with the operator`,
      copy: "Copy the text",
      copied: "Copied",
    },
    method: {
      kicker: "Method and sources",
      title: "How this was put together",
      notes: [
        "Dated 11 October 2026. The 167 and 447 rial figures are the tweets' own. MCI's official rate for an SMS to a UK mobile, 45,000 toman, was read from the tariff tool on mci.ir/international-call the same day; rates to other countries differ.",
        "Whether Apple accepts +98 numbers for iMessage activation was not confirmed or denied by any official source found. The report treats a failing activation as a hypothesis.",
        "The forum threads cited are user reports and carry less weight than Apple's documents. Apple does not publish the destination of the activation SMS or how often it is retried.",
        "The visibility levels are drawn from the documented architecture, not measured.",
        "This is analysis for general readers. It is not advice from the operator or from Apple, and settings may differ by iOS version.",
      ],
      sourcesTitle: "Sources",
      sources: [
        { grade: "A", label: "Apple Support · If you can't turn on or sign in to iMessage or FaceTime on your iPhone (119859)", href: "https://support.apple.com/en-us/119859" },
        { grade: "A", label: "Apple Support · If you can't send or receive messages on your iPhone or iPad — “Send as Text Message” (118433)", href: "https://support.apple.com/en-us/118433" },
        { grade: "A", label: "Apple Support · Use Apple products on enterprise networks — APNs hosts, ports and 17.0.0.0/8 (101555)", href: "https://support.apple.com/en-us/101555" },
        { grade: "A", label: "Apple Platform Security · iMessage security overview (APNs, IDS, end-to-end encryption)", href: "https://support.apple.com/guide/security/imessage-security-overview-secd9764312f/web" },
        { grade: "A", label: "Apple Platform Security · FaceTime security (relay servers, end-to-end encryption)", href: "https://support.apple.com/guide/security/facetime-security-seca331c55cd/web" },
        { grade: "A", label: "MCI (Hamrah-e Aval) · International calls and SMS — tariff tool and the warning that names iMessage, FaceTime and Xiaomi Cloud", href: "https://mci.ir/international-call" },
        { grade: "A", label: "RFC 9849 · TLS Encrypted Client Hello", href: "https://www.rfc-editor.org/rfc/rfc9849" },
        { grade: "B", label: "Mashregh News · Services that raise bills or drain credit — operators trace charges to iMessage and FaceTime (13 Aug 2017)", href: "https://www.mashreghnews.ir/news/761609" },
        { grade: "B", label: "Digikala Mag · If you have an iPhone, watch your bill (Dec 2015)", href: "https://www.digikala.com/mag/آیفون-قبض‌-موبایل-اپل/" },
        { grade: "C", label: "Apple Community · “Your carrier may charge for SMS messages used to activate iMessage” (2020, user reports)", href: "https://discussions.apple.com/thread/251322848" },
        { grade: "C", label: "iFixit Answers · Carrier charges for the activation SMS on every restart (2018, user reports)", href: "https://www.ifixit.com/Answers/View/487661" },
      ],
    },
    colophon: {
      shareTitle: "The hidden cost of iMessage on an Iranian phone bill · a fact-check",
      disclaimer: "Analysis for general readers; not advice from the operator or Apple.",
      cta: "Talk to me about technology strategy",
    },
  },

  fa: {
    hero: {
      kicker: "گزارش ۰۴",
      lead: "راستی‌آزمایی ادعاهایی که در توییتر و تلگرام دست‌به‌دست شد، و توضیح فنی‌ای که همراهش می‌چرخید، بر پایه‌ی مستندات رسمی اپل، منابع دانشنامه‌ای و مقالات داوری‌شده.",
      verdictTitle: "حکم نهایی در چهار خط",
      verdict: [
        { kind: "true", label: "درست", text: "هزینه واقعی است. آیفون برای فعال‌سازی iMessage و FaceTime با شماره تلفن، یک پیامک پنهان بین‌الملل به اپل می‌فرستد و خود اپل می‌گوید اپراتور ممکن است برای آن هزینه بگیرد." },
        { kind: "half", label: "علت اصلی", text: "اگر فعال‌سازی شماره‌ی +98 شکست بخورد، گوشی بارها دوباره تلاش می‌کند و هر تلاش یک پیامک بین‌الملل است." },
        { kind: "false", label: "نادرست", text: "اپراتور پیام‌های iMessage را یکی‌یکی نمی‌شمارد و به‌عنوان پیامک فاکتور نمی‌کند. خود پیام‌ها از مسیر دیتا و با رمزنگاری سرتاسری می‌روند." },
        { kind: "info", label: "راه‌حل", text: "شماره را از iMessage و FaceTime بردارید (ایمیل Apple ID بماند) و پیامک بین‌الملل را نزد اپراتور ببندید. خاموش کردن «Send as Text Message» به‌تنهایی کافی نیست." },
      ],
      mega: "۱",
      megaUnit: "پیامک پنهان",
      megaLabel: "در هر تلاش برای فعال‌سازی؛ به شماره‌ی اپل در خارج فرستاده می‌شود و با هر شکست، دوباره",
      asOf: "تاریخ گزارش: ۱۱ اکتبر ۲۰۲۶. تعرفه‌ی اپراتور و رفتار اپل ممکن است تغییر کند؛ کنار هر عدد منبعش آمده است.",
    },
    paths: {
      kicker: "سازوکار",
      title: "دو مسیر کاملاً جدا",
      lead: "بیشتر سردرگمی این بحث از اینجاست که دو مسیر متفاوت یکی فرض شده‌اند. مسیر اول فقط برای ثبت شماره است و از شبکه‌ی پیامک می‌گذرد. مسیر دوم، ارسال خود پیام است و از اینترنت می‌گذرد.",
      hint: "اسکرول کنید و ببینید هر مسیر چطور کشیده می‌شود.",
      lanes: {
        activation: {
          name: "مسیر ۱ · ثبت شماره (پیامک)",
          hops: [
            { t: "آیفون شما", s: "SIM +98" },
            { t: "مرکز پیامک اپراتور", s: "SMSC · MCI" },
            { t: "درگاه بین‌الملل", s: "SS7 / MAP" },
            { t: "شماره‌ی اپل در خارج", s: "+44 · طبق گزارش کاربران" },
          ],
          note: "قابل شارژ به‌عنوان پیامک بین‌الملل · محتوای پیامک رمزنگاری سرتاسری ندارد",
        },
        messaging: {
          name: "مسیر ۲ · ارسال پیام و تماس (دیتا)",
          hops: [
            { t: "آیفون شما", s: "iMessage / FaceTime" },
            { t: "هسته‌ی دیتای اپراتور", s: "P-GW / UPF · DPI" },
            { t: "اینترنت", s: "TLS · TCP 5223/443" },
            { t: "سرورهای اپل", s: "APNs · 17.0.0.0/8" },
          ],
          note: "فقط حجم دیتا حساب می‌شود · محتوا رمزنگاری سرتاسری دارد",
        },
      },
      caption: "مسیر ثبت شماره پیامک است و هزینه دارد؛ مسیر پیام دیتاست. نشانی‌ها و پورت‌ها از راهنمای رسمی اپل برای مدیران شبکه گرفته شده‌اند و نقش APNs و IDS از راهنمای امنیتی اپل. اپل اعلام نمی‌کند پیامک فعال‌سازی به کجا می‌رود؛ کاربران و چند اپراتور شماره‌ای در بریتانیا (+44) گزارش کرده‌اند.",
    },
    loop: {
      kicker: "چرا قبض بالا می‌رود؟",
      title: "حلقه‌ی تلاش دوباره",
      lead: "اپل در صفحه‌ی پشتیبانی رسمی خود می‌گوید برای فعال کردن شماره در iMessage و FaceTime «به پیامک نیاز دارید» و «بسته به اپراتور، ممکن است برای این پیامک هزینه بپردازید»؛ و می‌گوید مطمئن شوید می‌توانید پیامک بین‌الملل بفرستید. همان صفحه خطاهایی مانند «در انتظار فعال‌سازی» را فهرست می‌کند و می‌گوید دستگاه «به‌طور خودکار برای تأیید شماره تلاش می‌کند». اینکه چند بار، اپل نمی‌گوید.",
      steps: ["روشن بودن iMessage / FaceTime با شماره", "ارسال پیامک پنهان به اپل", "فعال‌سازی ناموفق؛ «در انتظار فعال‌سازی»", "تلاش دوباره = پیامک دوباره"],
      caption: "هر دور این حلقه یک پیامک بین‌الملل است. اپل فاصله‌ی تلاش‌ها را مستند نکرده است. کاربران گزارش داده‌اند که روی اپراتورهای غیرشریک اپل این پیامک‌ها هر روز تکرار می‌شوند (انجمن اپل، ۲۰۲۰) و با هر بار روشن شدن گوشی (iFixit، ۲۰۱۸). این‌ها گزارش کاربرند، نه سند رسمی.",
      hypothesis: {
        title: "یک نکته که باید جدا بماند",
        body: "اینکه آیا اپل اصلاً شماره‌های +98 را برای iMessage می‌پذیرد یا نه، در هیچ منبع رسمی اپل که پیدا کردم تأیید یا رد نشده است. بنابراین «فعال‌سازی در ایران شکست می‌خورد» یک فرضیه‌ی منطقی است که با الگوی گزارش‌ها جور درمی‌آید، اما ثابت‌شده نیست. آنچه مستند است خود هزینه است: صفحه‌ی خدمات بین‌الملل همراه اول، iMessage و FaceTime و Xiaomi Cloud را اپلیکیشن‌هایی می‌نامد که «ممکن است به‌صورت ناخواسته پیامک‌های متعدد بین‌المللی ارسال کنند و صورت‌حساب مشترک را افزایش دهند»، و مطبوعات ایران در مرداد ۱۳۹۶ گزارش داده بودند که اپراتورها ریشه‌ی همین هزینه‌ها را در iMessage و FaceTime پیدا کرده‌اند.",
      },
    },
    sim: {
      kicker: "امتحان کنید",
      title: "قبضی مثل این چطور بزرگ می‌شود",
      lead: "توییت‌ها ۱۶۷ و ۴۴۷ ریال برای هر پیامک آورده‌اند. صفحه‌ی رسمی تعرفه‌ی همراه اول، که ۱۱ اکتبر ۲۰۲۶ بررسی شد، برای یک پیامک به موبایل بریتانیا ۴۵ هزار تومان، یعنی ۴۵۰ هزار ریال، نشان می‌دهد. خودتان تنظیم کنید: گوشی روزی چند بار دوباره تلاش می‌کند، برای چند روز، با کدام نرخ.",
      retriesLabel: "تلاش دوباره در روز",
      daysLabel: "روز",
      tariffLabel: "ریال برای هر پیامک بین‌الملل",
      presets: { low: "۱۶۷ (توییت)", high: "۴۴۷ (توییت)", mci: "۴۵۰٬۰۰۰ · رسمی همراه اول" },
      perDay: "در روز",
      smsCount: "پیامک فرستاده‌شده",
      bill: "روی قبض",
      toman: "تومان",
      toReach: (sms, toman) => `با این نرخ، ${toman} تومانِ توییت یعنی حدود ${sms} پیامک.`,
      caveat: "مدلی ساده: تلاش × روز × تعرفه. فاصله‌ی واقعی تلاش‌ها را اپل مستند نکرده و با آنتن و تنظیمات فرق می‌کند. هدف نشان دادن شکل عدد است، نه پیش‌بینی قبض شما.",
      arithmetic: {
        title: "نرخ‌های توییت با تعرفه‌ی رسمی جور نیستند",
        lead: "نویسنده‌ی رشته‌توییت هم «نزدیک ۱۰۰ هزار تومان» گفته و هم «۹۰ پیامک»، و ۱۶۷ و ۴۴۷ ریال برای هر پیامک آورده است. تعرفه‌ی رسمی همراه اول برای پیامک به موبایل بریتانیا ۴۵ هزار تومان است. حساب ساده:",
        cards: [
          { label: "اعداد خود توییت", eq: "100,000 ÷ 90 ≈ 1,111", res: "حدود ۱٬۱۱۱ تومان برای هر پیامک؛ نه ۱۶۷ ریال، نه ۴۴۷" },
          { label: "با نرخ ۴۴۷ ریال (عدد توییت دوم)", eq: "90 × 447 = 40,230 IRR", res: "≈ ۴٬۰۲۳ تومان، نه ۱۰۰ هزار" },
          { label: "با تعرفه‌ی رسمی ۴۵ هزار تومان", eq: "100,000 ÷ 45,000 ≈ 2.2", res: "دو سه پیامک" },
        ],
        conclusion: "مبلغ قبض باورپذیر است؛ نرخ‌هایی که همراهش دست‌به‌دست شده نه. با تعرفه‌ی رسمی، ۱۰۰ هزار تومان یعنی دو سه تلاش برای فعال‌سازی، نه نود تا؛ و گوشی‌ای که مدام دوباره تلاش می‌کند می‌تواند خیلی بیشتر از آنچه توییت نگرانش بود خرج بردارد.",
      },
    },
    claims: {
      kicker: "ادعا به ادعا",
      title: "هشت ادعا، بررسی‌شده",
      hint: "روی هر کارت بزنید تا حکم و منبعش را ببینید.",
      claimLabel: "ادعا",
      verdictLabel: "حکم",
      verdicts: { true: "درست", likely: "محتمل", half: "نیمه‌درست", false: "نادرست" },
      items: [
        { claim: "برای فعال کردن iMessage و FaceTime یک پیامک به اپل فرستاده می‌شود.", who: "رشته‌توییت", why: "اپل صریحاً می‌گوید فعال‌سازی شماره به پیامک نیاز دارد و ممکن است هزینه داشته باشد." },
        { claim: "همراه اول از کاربران آیفون هزینه‌ی پیامک خارجی می‌گیرد.", who: "رشته‌توییت", why: "سازوکار فنی آن مستند است. صورت‌حساب خود کاربر را ندیده‌ام." },
        { claim: "هر پیام iMessage تأیید و شمرده می‌شود و اپراتور آن را فاکتور می‌کند.", who: "رشته‌توییت", why: "iMessage روی APNs اجرا می‌شود و محتوا سرتاسری رمزنگاری است؛ اپل محتوا را نگه نمی‌دارد. ترافیک از اینترنت می‌رود، نه از شبکه‌ی پیامک." },
        { claim: "FaceTime هم دقیقه‌ای مثل تماس بین‌الملل شارژ می‌شود.", who: "رشته‌توییت", why: "FaceTime هم از APNs برای برقراری اتصال و از سرورهای رله‌ی اپل برای انتقال استفاده می‌کند؛ صدا و تصویر سرتاسری رمزنگاری است. برای اپراتور این ترافیک دیتاست، نه تماس صوتی. هزینه‌ی احتمالی مربوط به پیامک فعال‌سازی است، که FaceTime هم به آن نیاز دارد، نه دقیقه‌ی تماس." },
        { claim: "بستن تماس و پیامک بین‌الملل در اپ همراه‌من مشکل را حل می‌کند.", who: "رشته‌توییت", why: "وقتی پیامک خروجی بین‌الملل بسته باشد، پیامک فعال‌سازی ارسال نمی‌شود و هزینه‌ای هم ثبت نمی‌شود. فعال‌سازی شماره هم انجام نمی‌شود." },
        { claim: "خاموش کردن «Send as Text Message» مشکل را درست می‌کند.", who: "اسکرین‌شات تلگرام", why: "اپل این تنظیم را این‌طور توضیح می‌دهد: وقتی iMessage در دسترس نباشد، پیام‌ها خودکار با SMS و با نرخ پیامک فرستاده می‌شوند. خاموش کردنش این هزینه را می‌بندد. پیامک فعال‌سازی ماجرای جداگانه‌ای است: به گفته‌ی خود اپل به روشن بودن iMessage و FaceTime وابسته است، و یک پاسخ در انجمن اپل می‌گوید خارج شدن از حساب در هر دو سرویس، نه فقط خاموش کردن، پیامک‌ها را متوقف می‌کند." },
        { claim: "اپراتور می‌فهمد هر مشترک چه حجمی برای کدام سرویس مصرف کرده.", who: "نگارنده، در گروه تلگرام", why: "DPI در ISPها برای مدیریت ترافیک، بسته‌بندی خدمات و شنود قانونی به کار می‌رود. پژوهش‌ها نشان می‌دهند ترافیک رمزنگاری‌شده هم بدون رمزگشایی قابل طبقه‌بندی است. دقت آن ۱۰۰٪ نیست." },
        { claim: "خود متن پیام قابل خواندن نیست.", who: "نگارنده، در گروه تلگرام", why: "برای iMessage درست است. برای SMS معمولی درست نیست: رمزنگاری GSM فقط بین گوشی و دکل است و آن هم ضعیف." },
      ],
    },
    visibility: {
      kicker: "اپراتور چه می‌بیند؟",
      title: "دید اپراتور",
      lead: "بر اساس معماری مستند اپل و ادبیات طبقه‌بندی ترافیک ساخته شده است. سطح‌ها کیفی‌اند، نه اندازه‌گیری‌شده. بین یک پیام iMessage و یک پیامک معمولی جابه‌جا شوید و ببینید ردیف‌های آخر چطور عوض می‌شوند.",
      toggle: { imessage: "یک پیام iMessage", sms: "یک پیامک معمولی" },
      levels: { full: "کامل", high: "بالا", medium: "متوسط", low: "کم", none: "هیچ (از شبکه)" },
      rows: {
        subscriber: { name: "کدام مشترک وصل است", sub: "MSISDN / IMSI ↔ IP", note: "اپراتور هر نشست دیتا را به سیم‌کارت نسبت می‌دهد؛ این پایه‌ی حسابداری مصرف است." },
        appleServers: { name: "اتصال به سرورهای اپل", sub: "dst 17.0.0.0/8 · port 5223", note: "اپل خودش بلوک IP و پورت‌ها را برای مدیران شبکه منتشر کرده است." },
        volume: { name: "حجم و زمان ترافیک", sub: "flow metadata", note: "اندازه‌ی بسته‌ها، زمان و مدت جریان در هر حال دیده می‌شود." },
        service: { name: "iMessage یا سرویس دیگر اپل؟", sub: "service classification", note: "APNs بین چند سرویس اپل مشترک است؛ تفکیک قطعی نیاز به تحلیل الگو دارد." },
        recipient: { name: "شماره یا Apple ID گیرنده", sub: "recipient identity", note: "نشانی گیرنده داخل ترافیک رمزنگاری‌شده به سرور اپل است، نه در سرآیند بسته." },
        content: { name: "متن پیام", sub: "message content", note: "برای iMessage رمزنگاری سرتاسری است. جاسوس‌افزار روی گوشی یا پشتیبان بی‌رمز بحث جداگانه‌اند. پیامک معمولی از مرکز پیامک اپراتور عبور و در آن ذخیره می‌شود؛ رمزنگاری سرتاسری ندارد." },
      },
    },
    fix: {
      kicker: "راه‌حل",
      title: "راه‌حل درست، به ترتیب",
      lead: "پنج قدم. هر کدام را که انجام دادید تیک بزنید.",
      steps: [
        { title: "شماره را از iMessage بردارید", path: "Settings › Apps › Messages › Send & Receive", body: "تیک شماره‌ی +98 را بردارید و فقط ایمیل Apple ID را نگه دارید. اپل استفاده از ایمیل را به‌عنوان جایگزین رسمی ذکر کرده است." },
        { title: "همین کار را برای FaceTime انجام دهید", path: "Settings › Apps › FaceTime › You Can Be Reached By", body: "شماره را بردارید یا FaceTime را خاموش کنید." },
        { title: "ارسال جایگزین با SMS را خاموش کنید", path: "Settings › Apps › Messages › Send as Text Message", body: "این کار جلوی تبدیل خودکار پیام شکست‌خورده به پیامک پولی را می‌گیرد. به پیامک فعال‌سازی کاری ندارد؛ برای همین دو قدم اول مقدم‌اند." },
        { title: "پیامک بین‌الملل را نزد اپراتور ببندید", path: "همراه‌من › خدمات", body: "محکم‌ترین لایه است. حتی اگر گوشی دوباره تلاش کند، پیامکی خارج نمی‌شود و هزینه‌ای ثبت نمی‌شود." },
        { title: "صورت‌حساب ریز را بررسی کنید", body: "در ریز مکالمات دنبال پیامک‌های تکراری به یک شماره‌ی خارجی ثابت بگردید. این الگو، امضای حلقه‌ی فعال‌سازی است." },
      ],
      done: "انجام شد",
      progress: (n, total) => `${n} از ${total} انجام شد`,
      mock: { title: "iMessage", section: "Send & Receive", number: "+98 912 ··· ··· ·", email: "name@icloud.com", on: "شماره تیک دارد: پیامک فعال‌سازی هنوز می‌تواند فرستاده شود.", off: "شماره برداشته شد: پیامک فعال‌سازی فرستاده نمی‌شود.", hint: "روی شماره بزنید تا ببینید چه عوض می‌شود." },
    },
    review: {
      kicker: "اولین پاسخ فنی",
      title: "پاسخ فنی چه را درست گفت و چه را جا انداخت",
      lead: "همراه این رشته‌توییت یک توضیح فنی هم دست‌به‌دست می‌شد که به‌تنهایی ارزش بازبینی دارد؛ نمونه‌ی خوبی است از پاسخی که درباره‌ی پروتکل‌ها درست می‌گوید و باز هم اصل ماجرا را نمی‌بیند.",
      ok: {
        title: "آنچه درست گفت",
        items: [
          "تفکیک محتوا، فراداده و طبقه‌بندی ترافیک درست است.",
          "توضیح DPI، SNI، تحلیل جریان و اثر VPN دقیق است؛ SNI در حالت عادی بدون رمز ارسال می‌شود.",
          "«امنیت محتوا با ناشناس بودن یکی نیست» جمع‌بندی درستی است.",
        ],
      },
      no: {
        title: "آنچه اشتباه یا ناقص بود",
        items: [
          "جمله‌ای درباره‌ی «کدام شماره از کدام سرویس» را با شناسایی گیرنده اشتباه گرفت و «تصحیح» کرد. جمله‌ی اصلی درست بود.",
          "چارچوب «مخفی‌سازی از نظارت» را بدون بررسی پذیرفت. سؤال گروه درباره‌ی هزینه بود.",
          "در یک تحلیل طولانی درباره‌ی DPI، اصلاً به پیامک فعال‌سازی اشاره نکرد؛ همان چیزی که کل ماجرا را توضیح می‌دهد.",
          "متن پیشنهادی‌اش برای گروه، راه جلوگیری از هزینه را نمی‌گفت.",
        ],
      },
    },
    post: {
      kicker: "آماده برای ارسال",
      title: "نسخه‌ی کوتاه، برای گروه",
      lead: "اگر می‌خواهید بحث را در یک چت، بدون نمودار، تمام کنید.",
      text: `هزینه‌ها واقعی‌اند، اما ربطی به شنود iMessage ندارند.

آیفون برای فعال کردن iMessage و FaceTime با شماره تلفن، یک پیامک پنهان به شماره‌ی اپل در خارج می‌فرستد. اگر فعال‌سازی شکست بخورد، گوشی بارها دوباره تلاش می‌کند و اپراتور هر بار آن را پیامک بین‌الملل حساب می‌کند. خود پیام‌های iMessage از دیتا می‌روند و جداگانه فاکتور نمی‌شوند.

راه‌حل:
۱. تنظیمات › Messages › Send & Receive: شماره را بردارید (ایمیل Apple ID بماند)
۲. تنظیمات › FaceTime: همین کار
۳. Send as Text Message را خاموش کنید
۴. پیامک بین‌الملل را در همراه‌من ببندید`,
      copy: "کپی متن",
      copied: "کپی شد",
    },
    method: {
      kicker: "روش و منابع",
      title: "این گزارش چطور ساخته شد",
      notes: [
        "تاریخ گزارش ۱۱ اکتبر ۲۰۲۶. ۱۶۷ و ۴۴۷ ریال عددهای خود توییت‌هاست. تعرفه‌ی رسمی همراه اول برای پیامک به موبایل بریتانیا، ۴۵ هزار تومان، همان روز از ابزار تعرفه در mci.ir/international-call خوانده شد؛ نرخ کشورهای دیگر فرق می‌کند.",
        "اینکه اپل شماره‌های +98 را برای فعال‌سازی iMessage می‌پذیرد یا نه، هیچ منبع رسمی پیداشده‌ای تأیید یا رد نکرده است. گزارش، شکست فعال‌سازی را یک فرضیه می‌داند.",
        "رشته‌های انجمن که ارجاع داده شده گزارش کاربرند و وزن مستند رسمی اپل را ندارند. اپل نه مقصد پیامک فعال‌سازی را اعلام می‌کند و نه فاصله‌ی تلاش‌های دوباره را.",
        "سطح‌های «دید اپراتور» از معماری مستند استخراج شده‌اند، نه اندازه‌گیری.",
        "این یک تحلیل برای خواننده‌ی عمومی است؛ نه توصیه‌ی اپراتور است، نه اپل، و تنظیمات ممکن است در نسخه‌های iOS فرق کند.",
      ],
      sourcesTitle: "منابع",
      sources: [
        { grade: "A", label: "پشتیبانی اپل · اگر نمی‌توانید iMessage یا FaceTime را روشن کنید (119859)", href: "https://support.apple.com/en-us/119859" },
        { grade: "A", label: "پشتیبانی اپل · اگر نمی‌توانید پیام بفرستید یا بگیرید؛ تنظیم Send as Text Message (118433)", href: "https://support.apple.com/en-us/118433" },
        { grade: "A", label: "پشتیبانی اپل · استفاده از محصولات اپل در شبکه‌های سازمانی؛ میزبان‌ها و پورت‌های APNs و 17.0.0.0/8 (101555)", href: "https://support.apple.com/en-us/101555" },
        { grade: "A", label: "راهنمای امنیتی اپل · مرور امنیت iMessage (APNs، IDS، رمزنگاری سرتاسری)", href: "https://support.apple.com/guide/security/imessage-security-overview-secd9764312f/web" },
        { grade: "A", label: "راهنمای امنیتی اپل · امنیت FaceTime (سرورهای رله، رمزنگاری سرتاسری)", href: "https://support.apple.com/guide/security/facetime-security-seca331c55cd/web" },
        { grade: "A", label: "همراه اول · مکالمات و پیامک بین‌الملل؛ ابزار تعرفه و هشدار درباره‌ی iMessage، FaceTime و Xiaomi Cloud", href: "https://mci.ir/international-call" },
        { grade: "A", label: "RFC 9849 · TLS Encrypted Client Hello", href: "https://www.rfc-editor.org/rfc/rfc9849" },
        { grade: "B", label: "مشرق نیوز · سرویس‌هایی که موجب افزایش قبوض یا کسر شارژ می‌شود (۲۲ مرداد ۱۳۹۶)", href: "https://www.mashreghnews.ir/news/761609" },
        { grade: "B", label: "دیجی‌کالا مگ · اگر آیفون دارید، مراقب مبلغ قبض‌هایتان باشید (آذر ۱۳۹۴)", href: "https://www.digikala.com/mag/آیفون-قبض‌-موبایل-اپل/" },
        { grade: "C", label: "انجمن اپل · «اپراتور ممکن است برای پیامک فعال‌سازی iMessage هزینه بگیرد» (۲۰۲۰، گزارش کاربران)", href: "https://discussions.apple.com/thread/251322848" },
        { grade: "C", label: "iFixit · هزینه‌ی پیامک فعال‌سازی با هر بار روشن شدن گوشی (۲۰۱۸، گزارش کاربران)", href: "https://www.ifixit.com/Answers/View/487661" },
      ],
    },
    colophon: {
      shareTitle: "هزینه‌ی پنهان iMessage در قبض همراه اول · راستی‌آزمایی",
      disclaimer: "تحلیل برای خواننده‌ی عمومی؛ نه توصیه‌ی اپراتور، نه اپل.",
      cta: "درباره‌ی استراتژی فناوری با من صحبت کنید",
    },
  },
}
