// ============================================================================
// File Path: src/components/v3/playbooks/science-explainer/data.ts
// Why: The facts behind playbook 02: the prompt's palette, the two voice
//      paths, the mix levels, the narrative arc, the science checks and the
//      sources, with short labels in both languages beside the facts they
//      describe. Prose lives in copy.ts. Checked on VERIFIED against the
//      pages listed in SOURCES.
// ============================================================================

import type { Locale } from "@/lib/nav"

export const VERIFIED = "2026-10-26"

type L = Record<Locale, string>

// ── The palette, exactly as the prompt specifies it ─────────────────────────

export type Swatch = { hex: string; name: L; alpha?: string }
export const PALETTE: { id: string; title: L; swatches: Swatch[] }[] = [
  {
    id: "space",
    title: { en: "Space", fa: "فضا" },
    swatches: [
      { hex: "#081d2c", name: { en: "Sky top", fa: "بالای آسمان" } },
      { hex: "#102348", name: { en: "Sky bottom", fa: "پایین آسمان" } },
      { hex: "#1896a0", name: { en: "Teal nebula", fa: "سحابی فیروزه‌ای" }, alpha: "20%" },
      { hex: "#285fc3", name: { en: "Blue nebula", fa: "سحابی آبی" }, alpha: "16%" },
      { hex: "#dc5f6e", name: { en: "Coral nebula", fa: "سحابی مرجانی" }, alpha: "10%" },
      { hex: "#3c46af", name: { en: "Indigo nebula", fa: "سحابی نیلی" }, alpha: "15%" },
    ],
  },
  {
    id: "sun",
    title: { en: "Sun", fa: "خورشید" },
    swatches: [
      { hex: "#fff7dc", name: { en: "Core", fa: "مرکز" } },
      { hex: "#ffc857", name: { en: "Body", fa: "بدنه" } },
      { hex: "#ff8f4a", name: { en: "Limb", fa: "لبه" } },
    ],
  },
  {
    id: "earth",
    title: { en: "Earth", fa: "زمین" },
    swatches: [
      { hex: "#4dc7eb", name: { en: "Shallow ocean", fa: "اقیانوس کم‌عمق" } },
      { hex: "#1a66b8", name: { en: "Deep ocean", fa: "اقیانوس عمیق" } },
      { hex: "#5fc47a", name: { en: "Land", fa: "خشکی" } },
      { hex: "#48ad6b", name: { en: "Forest", fa: "جنگل" } },
      { hex: "#3a9d62", name: { en: "Rainforest", fa: "جنگل بارانی" } },
      { hex: "#f5c75f", name: { en: "Desert", fa: "بیابان" } },
      { hex: "#f1f8ff", name: { en: "Ice", fa: "یخ" } },
    ],
  },
  {
    id: "mascot",
    title: { en: "Mascot and type", fa: "کاراکتر و نوشته" },
    swatches: [
      { hex: "#f3f7fb", name: { en: "Suit", fa: "لباس" } },
      { hex: "#ff8f4a", name: { en: "Boots", fa: "چکمه" } },
      { hex: "#1f5a73", name: { en: "Visor top", fa: "بالای کلاه شیشه‌ای" } },
      { hex: "#0a1c2c", name: { en: "Visor bottom", fa: "پایین کلاه شیشه‌ای" } },
      { hex: "#8fd8e6", name: { en: "Teal caption", fa: "نوشته‌ی فیروزه‌ای" } },
      { hex: "#ffd98a", name: { en: "Gold caption", fa: "نوشته‌ی طلایی" } },
    ],
  },
]

// ── The workflow, with the two approval gates ───────────────────────────────

export type FlowStep = { id: string; gate?: boolean; name: L; does: L }
export const FLOW: FlowStep[] = [
  { id: "ask", name: { en: "Three questions", fa: "سه سؤال" }, does: { en: "Topic, length, ElevenLabs key or not", fa: "موضوع، طول، کلید ElevenLabs یا نه" } },
  { id: "script", name: { en: "Narration and timeline", fa: "نریشن و زمان‌بندی" }, does: { en: "Each word tied to the beat it triggers", fa: "هر کلمه به اتفاقی که راه می‌اندازد وصل است" } },
  { id: "gate1", gate: true, name: { en: "You approve", fa: "تأیید تو" }, does: { en: "Script and beats", fa: "متن و ضرب‌آهنگ‌ها" } },
  { id: "build", name: { en: "One HTML file", fa: "یک فایل HTML" }, does: { en: "Canvas, WebGL, seek(t)", fa: "Canvas، WebGL، تابع seek(t)" } },
  { id: "sheet", name: { en: "Contact sheet", fa: "کانتکت شیت" }, does: { en: "One still per beat", fa: "یک فریم برای هر ضرب‌آهنگ" } },
  { id: "gate2", gate: true, name: { en: "You approve", fa: "تأیید تو" }, does: { en: "Before the long render", fa: "قبل از رندر طولانی" } },
  { id: "render", name: { en: "Render and mix", fa: "رندر و میکس" }, does: { en: "Frames, voice, sound, -14 LUFS", fa: "فریم‌ها، صدا، افکت، منفی ۱۴ LUFS" } },
]

// ── The narrative shape that works for any topic ────────────────────────────

export const ARC: { id: string; name: L; example: L; zoom: number }[] = [
  { id: "event", name: { en: "The event, on its word", fa: "اتفاق اصلی، روی کلمه‌ی خودش" }, example: { en: "The Sun vanishes", fa: "خورشید ناپدید می‌شود" }, zoom: 2.25 },
  { id: "scale", name: { en: "Pull back for scale", fa: "عقب رفتن برای مقیاس" }, example: { en: "Earth, still lit", fa: "زمین، هنوز روشن" }, zoom: 1 },
  { id: "you", name: { en: "Dive in: make it personal", fa: "شیرجه: شخصی کردنش" }, example: { en: "YOU, and the light reaching you", fa: "YOU، و نوری که به تو می‌رسد" }, zoom: 2.3 },
  { id: "out", name: { en: "Pull back out", fa: "دوباره عقب" }, example: { en: "The orbit, and GRAVITY", fa: "مدار، و GRAVITY" }, zoom: 0.3 },
  { id: "counter", name: { en: "Consequences on a live counter", fa: "پیامدها با شمارنده‌ی زنده" }, example: { en: "8:20 ticking to 0:00", fa: "۸:۲۰ تا ۰:۰۰" }, zoom: 0.3 },
  { id: "escalate", name: { en: "Escalate", fa: "تشدید" }, example: { en: "Earth flies off, freezes", fa: "زمین می‌رود و یخ می‌زند" }, zoom: 0.26 },
  { id: "joke", name: { en: "A mascot joke", fa: "شوخی کاراکتر" }, example: { en: "Sunglasses, in the dark", fa: "عینک آفتابی، در تاریکی" }, zoom: 1.25 },
  { id: "callback", name: { en: "Callback", fa: "بازگشت به تصویر قبلی" }, example: { en: "The 8:20-old photon", fa: "فوتون ۸:۲۰ ساله" }, zoom: 1 },
  { id: "title", name: { en: "The title", fa: "عنوان" }, example: { en: "WHAT IF THE SUN VANISHED", fa: "اگر خورشید ناپدید می‌شد" }, zoom: 1 },
]

// ── Voice: two paths ────────────────────────────────────────────────────────

export const VOICES: { id: "eleven" | "local"; name: string; parts: string[]; cost: L; timing: L; note: L }[] = [
  {
    id: "eleven",
    name: "ElevenLabs",
    parts: ["eleven_v4", "stability 0.5", "similarity 0.75", "with-timestamps"],
    cost: { en: "Paid past the free quota, per character", fa: "بعد از سهمیه‌ی رایگان، به ازای هر کاراکتر" },
    timing: { en: "Timestamps per character; group them into words", fa: "زمان‌بندی کاراکتری؛ باید به کلمه تبدیلش کرد" },
    note: { en: "Most natural voice, needs an API key", fa: "طبیعی‌ترین صدا، کلید API می‌خواهد" },
  },
  {
    id: "local",
    name: "kokoro-onnx + faster-whisper",
    parts: ["Kokoro-82M", "ONNX on CPU", "word_timestamps=True"],
    cost: { en: "Free, runs on your machine", fa: "رایگان، روی سیستم خودت" },
    timing: { en: "Whisper listens back and returns word times", fa: "Whisper صدا را دوباره گوش می‌دهد و زمان کلمه‌ها را می‌دهد" },
    note: { en: "About 300 MB of model files, no key", fa: "حدود ۳۰۰ مگابایت فایل مدل، بدون کلید" },
  },
]

/** The sample read used by the word-sync demo: each word, its time, and the event it fires. */
export const READ: { w: string; t: number; fire?: L }[] = [
  { w: "What", t: 0 },
  { w: "if", t: 0.22 },
  { w: "the", t: 0.36 },
  { w: "Sun", t: 0.5 },
  { w: "just", t: 0.86 },
  { w: "vanished?", t: 1.08, fire: { en: "Sun collapses", fa: "خورشید فرو می‌ریزد" } },
  { w: "For", t: 2.2 },
  { w: "eight", t: 2.42, fire: { en: "8:20 slams in", fa: "۸:۲۰ با ضربه می‌آید" } },
  { w: "minutes,", t: 2.74 },
  { w: "nothing.", t: 3.3, fire: { en: "Dotted circle", fa: "دایره‌ی نقطه‌چین" } },
  { w: "Then", t: 4.3 },
  { w: "the", t: 4.5 },
  { w: "dark", t: 4.64 },
  { w: "hits", t: 4.96, fire: { en: "Night sweeps Earth", fa: "شب از زمین می‌گذرد" } },
  { w: "you.", t: 5.2, fire: { en: "YOU pin drops", fa: "سنجاق YOU" } },
]
export const READ_LENGTH = 6.4

// ── Sound: the mix, in dB relative to the voice ─────────────────────────────

export const MIX: { id: string; name: L; db: number; range?: [number, number] }[] = [
  { id: "voice", name: { en: "Voice", fa: "نریشن" }, db: 0 },
  { id: "sfx", name: { en: "Sound effects", fa: "افکت‌ها" }, db: -7, range: [-10, -4] },
  { id: "music", name: { en: "Music bed", fa: "موسیقی زمینه" }, db: -7 },
  { id: "title", name: { en: "Music under the title", fa: "موسیقی زیر عنوان" }, db: -2 },
]

export const SFX: L[] = [
  { en: "collapse", fa: "فروپاشی" },
  { en: "impact", fa: "ضربه" },
  { en: "whoosh", fa: "ووش" },
  { en: "tick", fa: "تیک" },
  { en: "dive", fa: "شیرجه" },
  { en: "pin tap", fa: "ضربه‌ی سنجاق" },
  { en: "photon", fa: "فوتون" },
  { en: "play click", fa: "کلیک پخش" },
  { en: "light hit", fa: "برخورد نور" },
  { en: "reveal", fa: "آشکار شدن" },
  { en: "frost", fa: "یخ‌زدگی" },
  { en: "rewind", fa: "برگشت" },
]

// ── The science in the sample script ────────────────────────────────────────

export type Verdict = "true" | "approx" | "estimate"
export const SCIENCE: { claim: L; verdict: Verdict; detail: L; href: string }[] = [
  {
    claim: { en: "Sunlight takes 8 min 20 s to reach us", fa: "نور خورشید ۸ دقیقه و ۲۰ ثانیه طول می‌کشد تا برسد" },
    verdict: "true",
    detail: { en: "1 AU ÷ c ≈ 499 s, so 8 min 19 s.", fa: "یک واحد نجومی تقسیم بر سرعت نور، حدود ۴۹۹ ثانیه؛ یعنی ۸ دقیقه و ۱۹ ثانیه." },
    href: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html",
  },
  {
    claim: { en: "Earth keeps orbiting for those 8 minutes too", fa: "زمین در همان ۸ دقیقه هم به مدارش ادامه می‌دهد" },
    verdict: "true",
    detail: {
      en: "Changes in gravity travel at the speed of light; the 2017 neutron-star merger GW170817 pinned the difference below one part in 10^15.",
      fa: "تغییر گرانش با سرعت نور منتقل می‌شود؛ ادغام ستاره‌های نوترونی GW170817 در ۲۰۱۷ اختلاف این دو را کمتر از یک در ۱۰ به توان ۱۵ نشان داد.",
    },
    href: "https://arxiv.org/abs/1710.05834",
  },
  {
    claim: { en: "Then Earth flies off in a straight line at 30 km/s", fa: "بعد زمین با ۳۰ کیلومتر بر ثانیه در خط راست می‌رود" },
    verdict: "true",
    detail: { en: "Mean orbital speed 29.78 km/s; with no central pull, it continues along the tangent.", fa: "سرعت میانگین مداری ۲۹٫۷۸ کیلومتر بر ثانیه است؛ بدون کشش مرکزی، در امتداد خط مماس ادامه می‌دهد." },
    href: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html",
  },
  {
    claim: { en: "Jupiter stays visible for 1 hour+", fa: "مشتری بیش از یک ساعت دیده می‌شود" },
    verdict: "true",
    detail: {
      en: "Light needs ~43 min to reach Jupiter and 33–54 min to come back to us: Jupiter stays lit 67–87 min after our sky goes dark.",
      fa: "نور حدود ۴۳ دقیقه تا مشتری راه دارد و ۳۳ تا ۵۴ دقیقه تا برگشت به ما؛ پس مشتری ۶۷ تا ۸۷ دقیقه بعد از تاریک شدن آسمان ما هنوز روشن است.",
    },
    href: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html",
  },
  {
    claim: { en: "Temperature falls from 15 to -70°C", fa: "دما از ۱۵ به منفی ۷۰ درجه می‌رسد" },
    verdict: "estimate",
    detail: {
      en: "Popular estimates: about -18°C within a week, about -73°C within a year. The video squeezes a year into 1.4 seconds; label it.",
      fa: "تخمین‌های رایج: حدود منفی ۱۸ درجه در یک هفته و حدود منفی ۷۳ درجه در یک سال. ویدیو یک سال را در ۱٫۴ ثانیه فشرده می‌کند؛ این را روی تصویر بگو.",
    },
    href: "https://www.popsci.com/science/article/2013-07/if-sun-went-out-how-long-could-life-earth-survive/",
  },
  {
    claim: { en: "City lights come on as the dark arrives", fa: "با رسیدن تاریکی چراغ‌های شهر روشن می‌شوند" },
    verdict: "approx",
    detail: { en: "Poetic, not literal: the lights are always on at night, as NASA's Black Marble shows.", fa: "شاعرانه است، نه دقیق: چراغ‌ها شب همیشه روشن‌اند، همان‌طور که Black Marble ناسا نشان می‌دهد." },
    href: "https://www.earthdata.nasa.gov/data/projects/black-marble",
  },
]

export const SOURCES: { label: string; href: string }[] = [
  { label: "ElevenLabs: models", href: "https://elevenlabs.io/docs/models" },
  { label: "ElevenLabs: text to speech with timestamps", href: "https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps" },
  { label: "thewh1teagle/kokoro-onnx", href: "https://github.com/thewh1teagle/kokoro-onnx" },
  { label: "hexgrad/Kokoro-82M (Apache-2.0)", href: "https://huggingface.co/hexgrad/Kokoro-82M" },
  { label: "SYSTRAN/faster-whisper", href: "https://github.com/SYSTRAN/faster-whisper" },
  { label: "Playwright: browsers and channels", href: "https://playwright.dev/docs/browsers" },
  { label: "Chrome for Developers: GPU in headless Chrome", href: "https://developer.chrome.com/blog/supercharge-web-ai-testing" },
  { label: "x264 defaults (CRF 23)", href: "https://code.videolan.org/videolan/x264/-/raw/master/common/base.c" },
  { label: "FFmpeg filters: loudnorm", href: "https://ffmpeg.org/ffmpeg-filters.html#loudnorm" },
  { label: "Spotify: loudness normalisation", href: "https://support.spotify.com/us/artists/article/loudness-normalization/" },
  { label: "Google Fonts: Fredoka (OFL)", href: "https://github.com/google/fonts/blob/main/ofl/fredoka/METADATA.pb" },
  { label: "Blender manual: motion blur shutter", href: "https://docs.blender.org/manual/en/latest/render/cycles/render_settings/motion_blur.html" },
  { label: "NASA: Earth fact sheet", href: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html" },
  { label: "NASA: Jupiter fact sheet", href: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html" },
  { label: "GW170817 and the speed of gravity (arXiv:1710.05834)", href: "https://arxiv.org/abs/1710.05834" },
  { label: "Popular Science: if the Sun went out", href: "https://www.popsci.com/science/article/2013-07/if-sun-went-out-how-long-could-life-earth-survive/" },
  { label: "NASA Earthdata: Black Marble", href: "https://www.earthdata.nasa.gov/data/projects/black-marble" },
  { label: "YouTube: impersonation policy", href: "https://support.google.com/youtube/answer/2801947" },
]

/**
 * The prompt, in English as it is meant to be pasted. Two fixes against the
 * version that circulated: `window.seek(t)` had been turned into a link
 * ("http://window.seek(t)"), and three gotchas are added from the
 * fact-check (character timestamps, headless GPU, the temperature label).
 */
export const PROMPT = `<prompt>
  <inputs>
    Ask me for:
    - One topic as a "what if" question (default: "What if the Sun vanished?")
    - The length (default: 30 seconds)
    - Whether I have an ElevenLabs API key. If not, use a free local voice.
  </inputs>

  <direction>
    A cinematic animated science explainer at 1920x1080, 30fps, drawn entirely in code: one 2D Canvas plus one WebGL Canvas for planets. Use original characters and artwork. Do not copy existing channels' characters, styles or proprietary assets.

    <space>
      Vertical gradient #081d2c to #102348.
      Five huge parallax nebula blobs: teal rgb(24,150,160) at 20%, blue rgb(40,95,195) at 16%, coral rgb(220,95,110) at 10%, indigo rgb(60,70,175) at 15%.
      Three star layers at parallax depths .12, .35, .6 that twinkle. Draw 40% of near stars as 4-point sparkles.
    </space>

    <sun>
      Radius 300px, half off the left edge.
      Radial gradient #fff7dc to #ffc857 to #ff8f4a, with an offset highlight.
      Additive halo rings at 1.23, 1.48, 1.76 and 2.1 times the radius.
      18 faint rotating ray wedges. 28 drifting glowing granules on its surface.
      Never draw prominences on the Sun's edge: no white hooks, flares or loops attached to the edge.
    </sun>

    <earth>
      Orthographic sphere in a fragment shader, 4x supersampled, from a 2048x1024 map painted from longitude/latitude polygons.
      Land #5fc47a, forest #48ad6b, desert #f5c75f, rainforest #3a9d62, ice #f1f8ff, ocean gradient #4dc7eb to #1a66b8. White capsule clouds.
      Tilt .26 rad, spin .55°/s. Recompute the light direction from Sun to Earth every frame.
      Day/night: smoothstep(-.12, .24, N·L). Navy night side with ~380 warm city lights. Coral band on the terminator.
      Cyan rim, ocean specular, atmosphere halo stronger on the lit side.
    </earth>

    <astronaut>
      Small original mascot, ~180px tall, built from rounded rectangles. Suit #f3f7fb, orange #ff8f4a boots, visor gradient #1f5a73 to #0a1c2c.
      Glowing cyan eyes that look at whatever matters. Blinking antenna light. Idle bob. Squash and stretch on every pose.
    </astronaut>

    <typography>
      Fredoka 600/700 only. Uppercase captions, 3-6px letter spacing, in teal #8fd8e6, gold #ffd98a or white.
      Rounded pills, background rgb(6,20,40) at 62%.
      Every line rises 1.3 times its own height through a clip with ease-out-quint. Never fade a whole line in at once.
    </typography>

    <finish>
      Vignette rgba(4,4,20,.45). 6% film grain, re-randomised 24 times a second.
      No static infographic strips. No full stops in on-screen text. No AI-generated images or video. No copied characters. No music with vocals, no bird sounds.
    </finish>
  </direction>

  <structure>
    For the default 30-second topic, "What if the Sun vanished?":
    0s     Tight Sun shot at 2.25x.
    1s     On "vanished": the Sun swells 6% for 0.22s, collapses over 0.33s, white flash, shockwave ring.
    1.6-3s Pull back to 1x: Earth still lit, the astronaut staring at the empty spot.
    3.2s   On "eight": an 8:20 countdown slams in from 1.7x to 1x and ticks. LAST LIGHT rides the edge of the growing dark disc.
    5.6s   Dive to 2.3x on Earth, light streaks flowing in.
    7s     On "you": a YOU pin drops.
    7.5s   On "left": a photon lands on the pin. THIS LIGHT LEFT THE SUN / 8 MIN 20 SEC AGO.
    8.8s   On "play": the pin morphs into a play button. YOU PRESSED PLAY / 15 SEC AGO.
    9.6-12.5s Pull back from 2.4x to a 0.3x orbit view. LAST LIGHT and GRAVITY ride the ring.
    13.4s  On "nothing": a dotted circle at the empty centre.
    15.8s  On "hits": darkness sweeps Earth in 0.7s, city lights pop on, the countdown turns gold at 0:00.
    17.4s  On "black": the background fades almost to black.
    17.9s  Jupiter appears: STILL SHINING FOR 1 HOUR+.
    20.8s  Zoom out, dashed tangent line: 30 KM/S. Earth flies straight off.
    22.8s  A thermometer counts from 15 to -70°C while frost grows from the poles. Label it as an estimate over about a year.
    24.3s  A 0.8s rewind on a separate story clock.
    25.2s  Sunglasses drop onto the astronaut.
    27.7s  A photon tagged 8:20 OLD, then the title.

    For any other topic, keep the shape: the event on its spoken word; pull back to show scale; dive in to make it personal ("you"); pull back out; consequences on a live counter; escalate; a funny mascot beat; a callback to an earlier visual; the title.
  </structure>

  <build>
    <architecture>
      One HTML file. Every frame is a pure function of time: window.seek(t) draws frame t. No timers, no CSS animations.
    </architecture>
    <camera>
      Camera moves use easeInOutCubic. Zoom interpolates in log space. Every pop uses a damped spring, damping .42-.5, frequency 12-16.
    </camera>
    <voice>
      With an ElevenLabs key: eleven_v4; a calm, warm, curious male voice, late 30s, crisp, light neutral European English; stability .5, similarity .75; use the with-timestamps endpoint. It returns character timings: group them into words yourself.
      Without a key: kokoro-onnx locally, then faster-whisper with word_timestamps=True for word times.
      About 165 words per minute, 0.24s between sentences, a 0.36s beat before the major reveal. Every animation event fires on its spoken word. Never pad the voice to fit the visuals; tighten the read instead.
    </voice>
    <darkness>
      Pixels within the darkness front's radius from the Sun turn to night with a 30px soft edge. Start at ~47px/s, ramp to 700px/s near Earth, tuned to cross Earth in 0.7s.
    </darkness>
    <clocks>
      Two clocks: ambient time for twinkle, spin and bob; story time for narrative events. A rewind must not corrupt ambient motion.
    </clocks>
    <rendering>
      Playwright with Microsoft Edge (channel "msedge"), headless. Headless browsers disable the GPU by default: launch with GPU flags, then read the WebGL renderer string, and tell me if it is software (SwiftShader) rather than pretend it is accelerated.
      Seek every frame at 30fps. Blend two subframes with shutter 0.6 for motion blur.
      Encode with libx264: master CRF 16, delivery CRF 20.
      Show a contact sheet of every beat before the final render.
    </rendering>
    <sound>
      A calm, royalty-free space music bed 7dB under the voice, its natural ending timed to the final title, swelling to 5dB under the voice there.
      One royalty-free effect per event type: collapse, impact, pull-back whoosh, countdown tick, dive, pin tap, photon land, play click, light hit, reveal, frost, rewind. Peak on its frame, 4-10dB under the voice.
      Master with gain and a limiter to -14 LUFS integrated, true peak -2.2dB. Verify every asset's licence before use.
    </sound>
  </build>

  <gotchas>
    Make the WebGL globe canvas at least 2 x radius x zoom x 1.18 pixels so close-ups do not clip.
    Never draw prominences on the Sun's edge; they read as white hooks.
    Never pad the voice to fit the visuals; tighten the read.
    Speed the darkness front up near Earth or it takes too long to cross.
    Keep ambient time separate from story time so a rewind stays consistent.
    ElevenLabs timestamps are per character; build word times from them.
    Check the WebGL renderer string in headless mode; software rendering is slow and may look different.
    Verify dependencies, fonts, GPU access, browser, audio and encoding tools first. Report anything unavailable instead of pretending it worked.
  </gotchas>

  <start>
    Ask me for the topic, the length and whether I have an ElevenLabs key.
    Write the narration with the beat each word triggers. Show me the narration and event timeline for approval.
    Build the HTML animation and the render pipeline. Show a contact sheet of every major beat.
    Wait for my approval, then render and give me the output files.
  </start>
</prompt>`
