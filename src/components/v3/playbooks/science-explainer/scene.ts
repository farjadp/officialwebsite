// ============================================================================
// File Path: src/components/v3/playbooks/science-explainer/scene.ts
// Why: A small, honest version of the playbook's own method, running on the
//      page: the 30-second "What if the Sun vanished?" script drawn on one 2D
//      canvas, where every frame is a pure function of time. drawFrame(ctx, t)
//      paints second t and nothing else; there are no timers, no stored state,
//      so the player can seek anywhere, forwards or back, and get the same
//      picture. That is the `window.seek(t)` idea the prompt is built on.
//
//      Simplified on purpose: Earth is a shaded 2D disc rather than a WebGL
//      sphere, there is no audio, no motion blur and no film grain beyond a
//      light tiled noise. The colours are the prompt's own palette, which is
//      why they are literals here rather than site theme tokens: this is the
//      video's picture, not the site's chrome, and it is the same in both
//      themes.
// Env / Identity: plain module (no React), used by ./player.tsx
// ============================================================================

export const DURATION = 30
export const W = 1920
export const H = 1080

// ── Easing and time helpers ────────────────────────────────────────────────

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
export const easeInOutCubic = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
const easeOutQuint = (k: number) => 1 - Math.pow(1 - k, 5)
const easeInCubic = (k: number) => k * k * k

/** A damped spring settling from 0 to 1: the "pop" the prompt asks for. */
export function spring(k: number, damping = 0.45, freq = 14) {
  if (k <= 0) return 0
  const w = freq
  const z = damping
  const wd = w * Math.sqrt(1 - z * z)
  return 1 - Math.exp(-z * w * k) * (Math.cos(wd * k) + ((z * w) / wd) * Math.sin(wd * k))
}

/**
 * Two clocks. Ambient time drives twinkle, spin and the astronaut's bob and
 * never runs backwards. Story time drives the narrative, and at 24.3s it
 * rewinds for 0.8s. Keeping them apart is why the stars do not stutter
 * when the story jumps back.
 */
export function storyTime(t: number) {
  if (t < 24.3) return t
  if (t < 25.1) return 24.3 - (t - 24.3) * 2 // back 1.6s in 0.8s
  return 22.7 + (t - 25.1) // then carry on from where it rewound to
}

// ── Seeded randomness, so every frame draws the same stars ─────────────────

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

type Star = { x: number; y: number; r: number; ph: number; rate: number; sparkle: boolean }
const LAYERS: { depth: number; stars: Star[] }[] = [0.12, 0.35, 0.6].map((depth, li) => {
  const r = rng(11 + li * 97)
  const n = [220, 120, 60][li]
  return {
    depth,
    stars: Array.from({ length: n }, () => ({
      x: r() * 5200 - 1600,
      y: r() * 3600 - 1260,
      r: [0.9, 1.4, 2.2][li] * (0.6 + r() * 0.8),
      ph: r() * Math.PI * 2,
      rate: 0.6 + r() * 1.8,
      sparkle: li === 2 && r() < 0.4,
    })),
  }
})

const NEBULAE = [
  { x: 300, y: 200, r: 900, c: "24,150,160", a: 0.2, d: 0.08 },
  { x: 1500, y: 300, r: 800, c: "40,95,195", a: 0.16, d: 0.12 },
  { x: 1200, y: 900, r: 700, c: "220,95,110", a: 0.1, d: 0.18 },
  { x: -200, y: 900, r: 1000, c: "60,70,175", a: 0.15, d: 0.1 },
  { x: 2200, y: 700, r: 900, c: "24,150,160", a: 0.12, d: 0.15 },
]

const CITY = (() => {
  const r = rng(404)
  return Array.from({ length: 380 }, () => {
    // Bias toward the land bands so the lights sit on "continents".
    const lat = (r() - 0.5) * 1.6
    return { lon: r() * Math.PI * 2, lat, s: 0.6 + r() * 1.4 }
  })
})()

// ── World layout (in 1920x1080 world units) ────────────────────────────────

const SUN = { x: 0, y: 540, r: 300 }
const EARTH0 = { x: 1350, y: 560, r: 130 }
const ORBIT = Math.hypot(EARTH0.x - SUN.x, EARTH0.y - SUN.y)
const JUPITER = { x: -2600, y: -900, r: 300 }

/** Where Earth is: on its orbit until gravity "turns off", then along the tangent. */
function earthPos(st: number) {
  const angle = Math.atan2(EARTH0.y - SUN.y, EARTH0.x - SUN.x)
  // Gravity reaches Earth at the same moment as the dark: story 15.8s.
  if (st < 15.8) return { x: EARTH0.x, y: EARTH0.y }
  const k = st - 15.8
  // 30 km/s straight off, drawn as a steady drift along the tangent.
  const tx = -Math.sin(angle)
  const ty = Math.cos(angle)
  const d = k * 90
  return { x: EARTH0.x - tx * d, y: EARTH0.y - ty * d }
}

// ── Camera keyframes: centre and zoom, zoom eased in log space ──────────────

type Key = { t: number; x: number; y: number; z: number }
const KEYS: Key[] = [
  { t: 0, x: 300, y: 540, z: 2.25 },
  { t: 1.6, x: 300, y: 540, z: 2.25 },
  { t: 3.0, x: 960, y: 540, z: 1 },
  { t: 5.6, x: 960, y: 540, z: 1 },
  { t: 6.6, x: EARTH0.x, y: EARTH0.y, z: 2.3 },
  { t: 9.6, x: EARTH0.x, y: EARTH0.y, z: 2.4 },
  { t: 12.5, x: 200, y: 400, z: 0.3 },
  { t: 17.6, x: 200, y: 400, z: 0.3 },
  { t: 18.4, x: -900, y: -100, z: 0.42 },
  { t: 20.8, x: -900, y: -100, z: 0.42 },
  { t: 21.8, x: 700, y: 100, z: 0.26 },
  { t: 22.8, x: 700, y: 100, z: 0.26 },
  { t: 23.6, x: EARTH0.x, y: 300, z: 1.25 },
  { t: 27.4, x: EARTH0.x, y: 300, z: 1.25 },
  { t: 28.4, x: 960, y: 540, z: 1 },
]

export function camera(t: number) {
  let i = 0
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++
  const a = KEYS[i]
  const b = KEYS[Math.min(i + 1, KEYS.length - 1)]
  const k = b.t === a.t ? 1 : easeInOutCubic(span(t, a.t, b.t))
  return {
    x: lerp(a.x, b.x, k),
    y: lerp(a.y, b.y, k),
    // Log space: equal steps in time feel like equal steps in scale.
    z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), k)),
  }
}

/** The camera curve, sampled, for the zoom chart beside the player. */
export function zoomCurve(steps = 240) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = (i / steps) * DURATION
    return { t, z: camera(t).z }
  })
}

// ── The beats, for the player's markers and the timeline list ───────────────

export type Beat = { t: number; word: string; en: string; fa: string }
export const BEATS: Beat[] = [
  { t: 0, word: "", en: "Tight on the Sun at 2.25x", fa: "نمای نزدیک خورشید، بزرگ‌نمایی ۲٫۲۵" },
  { t: 1, word: "vanished", en: "Swell 6%, collapse, flash, shockwave", fa: "۶٪ بزرگ می‌شود، فرو می‌ریزد، فلاش و موج ضربه" },
  { t: 1.6, word: "", en: "Pull back: Earth still lit, astronaut staring", fa: "دوربین عقب می‌رود: زمین هنوز روشن، فضانورد خیره" },
  { t: 3.2, word: "eight", en: "8:20 countdown slams in, LAST LIGHT on the dark front", fa: "شمارش ۸:۲۰ با ضربه می‌آید؛ LAST LIGHT روی لبه‌ی تاریکی" },
  { t: 5.6, word: "", en: "Dive to 2.3x on Earth", fa: "شیرجه به سمت زمین با بزرگ‌نمایی ۲٫۳" },
  { t: 7, word: "you", en: "YOU pin drops", fa: "سنجاق YOU فرود می‌آید" },
  { t: 7.5, word: "left", en: "A photon lands: this light left 8 min 20 s ago", fa: "یک فوتون می‌نشیند: این نور ۸ دقیقه و ۲۰ ثانیه پیش راه افتاده" },
  { t: 8.8, word: "play", en: "The pin becomes a play button", fa: "سنجاق تبدیل به دکمه‌ی پخش می‌شود" },
  { t: 9.6, word: "", en: "Pull back to the 0.3x orbit view", fa: "دوربین تا نمای مدار با بزرگ‌نمایی ۰٫۳ عقب می‌رود" },
  { t: 13.4, word: "nothing", en: "A dotted circle where the Sun was", fa: "دایره‌ی نقطه‌چین جای خالی خورشید" },
  { t: 15.8, word: "hits", en: "Dark sweeps Earth in 0.7s, cities light up, 0:00", fa: "تاریکی در ۰٫۷ ثانیه از زمین می‌گذرد، شهرها روشن می‌شوند، ۰:۰۰" },
  { t: 17.4, word: "black", en: "The sky falls almost to black", fa: "آسمان تقریباً سیاه می‌شود" },
  { t: 17.9, word: "", en: "Jupiter: still shining for 1 hour+", fa: "مشتری: هنوز بیش از یک ساعت می‌درخشد" },
  { t: 20.8, word: "", en: "Tangent line, 30 km/s, Earth flies off", fa: "خط مماس، ۳۰ کیلومتر بر ثانیه، زمین مستقیم می‌رود" },
  { t: 22.8, word: "", en: "Thermometer 15 to -70°C, frost from the poles", fa: "دماسنج از ۱۵ تا منفی ۷۰، یخ از قطب‌ها" },
  { t: 24.3, word: "", en: "0.8s rewind on the story clock", fa: "۰٫۸ ثانیه برگشت روی ساعت داستان" },
  { t: 25.2, word: "", en: "Sunglasses drop onto the astronaut", fa: "عینک آفتابی روی فضانورد می‌افتد" },
  { t: 27.7, word: "", en: "A photon tagged 8:20 OLD, then the title", fa: "فوتونی با برچسب ۸:۲۰ OLD، بعد عنوان" },
]

// ── Captions: every line rises through a clip, never a plain fade ──────────

type Caption = { t0: number; t1: number; lines: string[]; color: string; x: number; y: number; size: number; screen?: boolean }
const TEAL = "#8fd8e6"
const GOLD = "#ffd98a"
const WHITE = "#ffffff"
const CAPTIONS: Caption[] = [
  { t0: 7.5, t1: 8.7, lines: ["THIS LIGHT LEFT THE SUN", "8 MIN 20 SEC AGO"], color: GOLD, x: 960, y: 860, size: 44, screen: true },
  { t0: 8.8, t1: 9.6, lines: ["YOU PRESSED PLAY", "15 SEC AGO"], color: TEAL, x: 960, y: 860, size: 44, screen: true },
  { t0: 17.9, t1: 20.6, lines: ["STILL SHINING", "FOR 1 HOUR+"], color: GOLD, x: 760, y: 300, size: 46, screen: true },
  { t0: 20.8, t1: 22.7, lines: ["30 KM/S"], color: WHITE, x: 1380, y: 220, size: 60, screen: true },
  { t0: 27.9, t1: 30, lines: ["WHAT IF THE SUN", "VANISHED"], color: WHITE, x: 960, y: 470, size: 92, screen: true },
]

// ── Drawing ─────────────────────────────────────────────────────────────────

export type Fonts = { display: string }

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  // Fully rounded on the short side, whichever way round the shape is.
  const r = Math.max(0, Math.min(w, h) / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, fonts: Fonts, rise = 1) {
  ctx.save()
  ctx.font = `700 ${size}px ${fonts.display}`
  const spacing = size * 0.09
  // letterSpacing is widely supported on canvas; older engines just ignore it.
  ;(ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${spacing}px`
  const w = ctx.measureText(text).width + size * 0.9
  const h = size * 1.5
  ctx.fillStyle = "rgba(6,20,40,0.62)"
  pill(ctx, x - w / 2, y - h / 2, w, h)
  ctx.fill()
  // The rise: the line climbs 1.3x its own height through a clip.
  ctx.beginPath()
  ctx.rect(x - w / 2, y - h / 2, w, h)
  ctx.clip()
  const off = (1 - easeOutQuint(clamp(rise))) * h * 1.3
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, x + spacing / 2, y + off + size * 0.04)
  ctx.restore()
}

function drawBackground(ctx: CanvasRenderingContext2D, amb: number, cam: { x: number; y: number; z: number }, dark: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, "#081d2c")
  g.addColorStop(1, "#102348")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  for (const n of NEBULAE) {
    const px = (n.x - cam.x) * n.d + W / 2 + (n.x - 960) * 0.4
    const py = (n.y - cam.y) * n.d + H / 2 + (n.y - 540) * 0.4
    const rg = ctx.createRadialGradient(px, py, 0, px, py, n.r)
    rg.addColorStop(0, `rgba(${n.c},${n.a * (1 - dark * 0.7)})`)
    rg.addColorStop(1, `rgba(${n.c},0)`)
    ctx.fillStyle = rg
    ctx.fillRect(0, 0, W, H)
  }

  for (const layer of LAYERS) {
    for (const s of layer.stars) {
      const x = (s.x - cam.x) * layer.depth + W / 2
      const y = (s.y - cam.y) * layer.depth + H / 2
      const xx = ((x % 2600) + 2600) % 2600 - 340
      const yy = ((y % 1800) + 1800) % 1800 - 360
      if (xx < -10 || xx > W + 10 || yy < -10 || yy > H + 10) continue
      const tw = 0.55 + 0.45 * Math.sin(amb * s.rate + s.ph)
      ctx.globalAlpha = tw
      ctx.fillStyle = "#ffffff"
      if (s.sparkle) {
        const r = s.r * 2.6
        ctx.beginPath()
        ctx.moveTo(xx, yy - r)
        ctx.quadraticCurveTo(xx, yy, xx + r, yy)
        ctx.quadraticCurveTo(xx, yy, xx, yy + r)
        ctx.quadraticCurveTo(xx, yy, xx - r, yy)
        ctx.quadraticCurveTo(xx, yy, xx, yy - r)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.arc(xx, yy, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  ctx.globalAlpha = 1

  if (dark > 0) {
    ctx.fillStyle = `rgba(2,4,10,${dark * 0.82})`
    ctx.fillRect(0, 0, W, H)
  }
}

function drawSun(ctx: CanvasRenderingContext2D, st: number, amb: number) {
  // Before 1s: shining. 1.0-1.22: swell 6%. 1.22-1.55: collapse.
  let scale = 1
  if (st >= 1 && st < 1.22) scale = 1 + 0.06 * easeOutQuint(span(st, 1, 1.22))
  else if (st >= 1.22) scale = 1.06 * (1 - easeInCubic(span(st, 1.22, 1.55)))
  if (scale <= 0.001) return
  const r = SUN.r * scale

  ctx.save()
  ctx.globalCompositeOperation = "lighter"
  for (const [m, a] of [
    [1.23, 0.22],
    [1.48, 0.14],
    [1.76, 0.09],
    [2.1, 0.06],
  ]) {
    const hg = ctx.createRadialGradient(SUN.x, SUN.y, r * 0.9, SUN.x, SUN.y, r * m)
    hg.addColorStop(0, `rgba(255,200,87,${a})`)
    hg.addColorStop(1, "rgba(255,143,74,0)")
    ctx.fillStyle = hg
    ctx.beginPath()
    ctx.arc(SUN.x, SUN.y, r * m, 0, Math.PI * 2)
    ctx.fill()
  }
  // 18 faint ray wedges, slowly turning on ambient time. They start away from
  // the limb on purpose: anything touching the edge reads as a white hook.
  ctx.translate(SUN.x, SUN.y)
  ctx.rotate(amb * 0.05)
  for (let i = 0; i < 18; i++) {
    ctx.rotate((Math.PI * 2) / 18)
    // A wedge that fades along its length and is drawn twice, wide and
    // faint then narrow, so it has no hard sides.
    for (const [wd, al] of [
      [0.2, 0.025],
      [0.09, 0.03],
    ]) {
      const wg = ctx.createLinearGradient(r * 1.1, 0, r * 2.4, 0)
      wg.addColorStop(0, `rgba(255,217,138,${al})`)
      wg.addColorStop(1, "rgba(255,217,138,0)")
      ctx.fillStyle = wg
      ctx.beginPath()
      ctx.moveTo(r * 1.1, 0)
      ctx.lineTo(r * 2.4, -r * wd)
      ctx.lineTo(r * 2.4, r * wd)
      ctx.closePath()
      ctx.fill()
    }
  }
  ctx.restore()

  const sg = ctx.createRadialGradient(SUN.x + r * 0.25, SUN.y - r * 0.25, r * 0.1, SUN.x, SUN.y, r)
  sg.addColorStop(0, "#fff7dc")
  sg.addColorStop(0.55, "#ffc857")
  sg.addColorStop(1, "#ff8f4a")
  ctx.fillStyle = sg
  ctx.beginPath()
  ctx.arc(SUN.x, SUN.y, r, 0, Math.PI * 2)
  ctx.fill()

  // 28 drifting granules.
  const gr = rng(77)
  for (let i = 0; i < 28; i++) {
    const a0 = gr() * Math.PI * 2
    const d0 = Math.sqrt(gr()) * r * 0.85
    const a = a0 + amb * 0.04 * (gr() - 0.5)
    const gx = SUN.x + Math.cos(a) * d0
    const gy = SUN.y + Math.sin(a) * d0
    const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 0.09)
    gg.addColorStop(0, "rgba(255,247,220,0.35)")
    gg.addColorStop(1, "rgba(255,247,220,0)")
    ctx.fillStyle = gg
    ctx.beginPath()
    ctx.arc(gx, gy, r * 0.09, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawShock(ctx: CanvasRenderingContext2D, st: number) {
  if (st < 1.5 || st > 3) return
  const k = span(st, 1.5, 3)
  ctx.save()
  ctx.strokeStyle = `rgba(255,247,220,${(1 - k) * 0.8})`
  ctx.lineWidth = 18 * (1 - k) + 2
  ctx.beginPath()
  ctx.arc(SUN.x, SUN.y, 80 + easeOutQuint(k) * 1100, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

/** The darkness front: everything inside its radius from the Sun is night. */
export function frontRadius(st: number) {
  if (st < 1.55) return 0
  // ~47 px/s at first, ramping hard so it crosses Earth in about 0.7s at 15.8.
  const edgeAtEarth = ORBIT - EARTH0.r
  const k = span(st, 1.55, 15.45)
  return edgeAtEarth * Math.pow(k, 3.2) + (st > 15.45 ? (st - 15.45) * 700 : 0)
}

function drawFront(ctx: CanvasRenderingContext2D, st: number, fonts: Fonts, cam: { z: number }) {
  const R = frontRadius(st)
  if (R <= 0) return
  ctx.save()
  const rg = ctx.createRadialGradient(SUN.x, SUN.y, Math.max(0, R - 30), SUN.x, SUN.y, R)
  rg.addColorStop(0, "rgba(3,6,16,0.55)")
  rg.addColorStop(1, "rgba(3,6,16,0)")
  ctx.fillStyle = rg
  ctx.beginPath()
  ctx.arc(SUN.x, SUN.y, R, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  // LAST LIGHT rides the edge from 3.2s until the front reaches Earth.
  if (st > 3.2 && st < 15.9) {
    const a = -0.35
    const x = SUN.x + Math.cos(a) * R
    const y = SUN.y + Math.sin(a) * R
    label(ctx, "LAST LIGHT", x, y, 30 / Math.max(cam.z, 0.45), GOLD, fonts, span(st, 3.2, 3.6))
  }
}

function drawEarth(ctx: CanvasRenderingContext2D, st: number, amb: number, freeze: number) {
  const p = earthPos(st)
  const r = EARTH0.r
  // Light comes from the Sun until the front passes; then night.
  const R = frontRadius(st)
  const dist = Math.hypot(p.x - SUN.x, p.y - SUN.y)
  // 0 = fully lit, 1 = fully dark, swept across the disc as the front crosses.
  const night = clamp((R - (dist - r)) / (2 * r))

  ctx.save()
  // Atmosphere halo, stronger on the lit side.
  const halo = ctx.createRadialGradient(p.x, p.y, r * 0.95, p.x, p.y, r * 1.28)
  halo.addColorStop(0, `rgba(120,220,255,${0.4 * (1 - night) + 0.08})`)
  halo.addColorStop(1, "rgba(120,220,255,0)")
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(p.x, p.y, r * 1.28, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
  ctx.clip()
  const og = ctx.createLinearGradient(p.x, p.y - r, p.x, p.y + r)
  og.addColorStop(0, "#4dc7eb")
  og.addColorStop(1, "#1a66b8")
  ctx.fillStyle = og
  ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2)

  // Continents: a few blobs drifting with the spin (0.55°/s on ambient time).
  const spin = (amb * 0.55 * Math.PI) / 180 * 18 // sped up so the page shows it
  const blobs = [
    { lon: 0.3, lat: -0.35, w: 0.55, h: 0.4, c: "#5fc47a" },
    { lon: 0.9, lat: 0.25, w: 0.4, h: 0.55, c: "#48ad6b" },
    { lon: 1.9, lat: -0.15, w: 0.5, h: 0.3, c: "#f5c75f" },
    { lon: 2.6, lat: 0.3, w: 0.35, h: 0.35, c: "#3a9d62" },
    { lon: 3.6, lat: -0.3, w: 0.6, h: 0.35, c: "#5fc47a" },
    { lon: 4.8, lat: 0.1, w: 0.45, h: 0.5, c: "#48ad6b" },
    { lon: 5.6, lat: -0.4, w: 0.3, h: 0.3, c: "#f5c75f" },
  ]
  for (const b of blobs) {
    const lon = b.lon + spin
    const c = Math.cos(lon)
    if (c < -0.1) continue
    const x = p.x + Math.sin(lon) * r * Math.cos(b.lat)
    const y = p.y + Math.sin(b.lat) * r
    ctx.fillStyle = b.c
    ctx.beginPath()
    ctx.ellipse(x, y, b.w * r * 0.5 * Math.max(c, 0.15), b.h * r * 0.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  // Ice caps, growing as the planet freezes.
  ctx.fillStyle = "#f1f8ff"
  const cap = r * (0.22 + freeze * 0.55)
  ctx.beginPath()
  ctx.ellipse(p.x, p.y - r, r * 1.1, cap, 0, 0, Math.PI * 2)
  ctx.ellipse(p.x, p.y + r, r * 1.1, cap * 0.9, 0, 0, Math.PI * 2)
  ctx.fill()
  // Capsule clouds.
  ctx.fillStyle = "rgba(255,255,255,0.85)"
  for (let i = 0; i < 6; i++) {
    const lon = i * 1.1 + spin * 1.3
    const c = Math.cos(lon)
    if (c < 0) continue
    const x = p.x + Math.sin(lon) * r * 0.85
    const y = p.y + (i % 3 - 1) * r * 0.45
    pill(ctx, x - r * 0.18 * c, y - 7, r * 0.36 * c, 14)
    ctx.fill()
  }

  // Day/night: the lit side faces the Sun (to the left), with a coral band
  // on the terminator, then the front sweeps the whole disc to night.
  const dx = SUN.x - p.x
  const dy = SUN.y - p.y
  const dl = Math.hypot(dx, dy) || 1
  const lx = dx / dl
  const ly = dy / dl
  const shade = ctx.createLinearGradient(p.x + lx * r, p.y + ly * r, p.x - lx * r, p.y - ly * r)
  // Each stop fades from a colour to itself, never from transparent navy to
  // coral: canvas mixes unpremultiplied, which paints a pale band otherwise.
  shade.addColorStop(0, "rgba(255,120,110,0)")
  shade.addColorStop(0.4, "rgba(255,120,110,0)")
  shade.addColorStop(0.5, "rgba(255,120,110,0.14)")
  shade.addColorStop(0.58, "rgba(40,30,70,0.38)")
  shade.addColorStop(0.72, "rgba(10,20,50,0.72)")
  shade.addColorStop(1, "rgba(10,20,50,0.86)")
  ctx.fillStyle = shade
  ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2)
  if (night > 0) {
    // The front arrives from the Sun's side.
    const ng = ctx.createLinearGradient(p.x + lx * r, p.y + ly * r, p.x - lx * r, p.y - ly * r)
    const edge = night * 1.15
    ng.addColorStop(0, "rgba(10,20,50,0.92)")
    ng.addColorStop(clamp(edge - 0.08), "rgba(10,20,50,0.92)")
    ng.addColorStop(clamp(edge + 0.08), "rgba(10,20,50,0)")
    ctx.fillStyle = ng
    ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2)
  }
  // City lights on whatever is night.
  const lights = night > 0 ? clamp((st - 15.9) / 0.5) : 0.15
  if (lights > 0) {
    for (const c of CITY) {
      const lon = c.lon + spin
      const cz = Math.cos(lon)
      if (cz < 0) continue
      const x = p.x + Math.sin(lon) * r * Math.cos(c.lat)
      const y = p.y + Math.sin(c.lat) * r * 0.9
      const facing = ((x - p.x) * lx + (y - p.y) * ly) / r
      const isNight = night > 0 ? true : facing < -0.15
      if (!isNight) continue
      ctx.fillStyle = `rgba(255,214,140,${0.85 * lights * cz})`
      ctx.fillRect(x, y, c.s * 1.6, c.s * 1.6)
    }
  }
  ctx.restore()

  // Cyan rim.
  ctx.save()
  ctx.strokeStyle = `rgba(150,235,255,${0.5 * (1 - night) + 0.15})`
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
  return p
}

function drawAstronaut(ctx: CanvasRenderingContext2D, x: number, y: number, amb: number, st: number, t: number, look: { x: number; y: number }, glasses: number) {
  const bob = Math.sin(amb * 1.6) * 8
  // Squash and stretch on each pose change (story beats).
  let sq = 0
  for (const bt of [1.6, 7, 15.8, 25.2]) {
    if (st >= bt && st < bt + 0.6) sq = Math.sin(span(st, bt, bt + 0.6) * Math.PI) * 0.08 * (1 - span(st, bt, bt + 0.6))
  }
  ctx.save()
  ctx.translate(x, y + bob)
  ctx.scale(1 + sq, 1 - sq)
  const suit = "#f3f7fb"
  // Legs and boots.
  ctx.fillStyle = suit
  pill(ctx, -34, 40, 26, 54)
  ctx.fill()
  pill(ctx, 8, 40, 26, 54)
  ctx.fill()
  ctx.fillStyle = "#ff8f4a"
  pill(ctx, -38, 84, 34, 20)
  ctx.fill()
  pill(ctx, 4, 84, 34, 20)
  ctx.fill()
  // Body and backpack.
  ctx.fillStyle = "#d9e3ee"
  pill(ctx, -52, -26, 104, 86)
  ctx.fill()
  ctx.fillStyle = suit
  pill(ctx, -44, -30, 88, 84)
  ctx.fill()
  // Arms.
  pill(ctx, -66, -12, 24, 58)
  ctx.fill()
  pill(ctx, 42, -12, 24, 58)
  ctx.fill()
  // Helmet.
  ctx.beginPath()
  ctx.arc(0, -72, 54, 0, Math.PI * 2)
  ctx.fill()
  const vg = ctx.createLinearGradient(0, -110, 0, -40)
  vg.addColorStop(0, "#1f5a73")
  vg.addColorStop(1, "#0a1c2c")
  ctx.fillStyle = vg
  pill(ctx, -40, -100, 80, 54)
  ctx.fill()
  // Eyes look at what matters; blink every few seconds on ambient time.
  const blink = (amb % 3.7) < 0.12 ? 0.15 : 1
  const lx = clamp((look.x - x) / 900, -1, 1) * 8
  const ly = clamp((look.y - y) / 900, -1, 1) * 5
  ctx.fillStyle = "#6ff3ff"
  ctx.shadowColor = "#6ff3ff"
  ctx.shadowBlur = 14
  for (const ex of [-14, 14]) {
    ctx.beginPath()
    ctx.ellipse(ex + lx, -74 + ly, 6, 9 * blink, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.shadowBlur = 0
  // Antenna with a blinking light.
  ctx.strokeStyle = suit
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(26, -120)
  ctx.lineTo(34, -150)
  ctx.stroke()
  const on = Math.sin(amb * 4) > 0.2
  ctx.fillStyle = on ? "#ff8f4a" : "#7a4630"
  ctx.shadowColor = "#ff8f4a"
  ctx.shadowBlur = on ? 18 : 0
  ctx.beginPath()
  ctx.arc(34, -152, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  // Sunglasses, dropping in on a spring at 25.2s.
  if (glasses > 0) {
    const drop = (1 - spring(glasses, 0.45, 14)) * -160
    ctx.fillStyle = "#0b0b12"
    pill(ctx, -38, -88 + drop, 34, 20)
    ctx.fill()
    pill(ctx, 4, -88 + drop, 34, 20)
    ctx.fill()
    ctx.fillRect(-6, -82 + drop, 12, 5)
  }
  ctx.restore()
  void t
}

function drawPin(ctx: CanvasRenderingContext2D, x: number, y: number, st: number, fonts: Fonts) {
  if (st < 7 || st > 9.8) return
  const k = spring(st - 7, 0.45, 14)
  const morph = clamp((st - 8.8) / 0.3)
  ctx.save()
  ctx.translate(x, y - (1 - k) * 220)
  if (morph < 1) {
    ctx.globalAlpha = 1 - morph
    ctx.fillStyle = TEAL
    ctx.beginPath()
    ctx.arc(0, -46, 26, Math.PI, 0)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = "#0a1c2c"
    ctx.font = `700 16px ${fonts.display}`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("YOU", 0, -48)
  }
  if (morph > 0) {
    ctx.globalAlpha = morph
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(0, -40, 30 * spring(morph, 0.45, 14), 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#0a1c2c"
    ctx.beginPath()
    ctx.moveTo(-8, -52)
    ctx.lineTo(14, -40)
    ctx.lineTo(-8, -28)
    ctx.fill()
  }
  ctx.restore()
}

function drawPhoton(ctx: CanvasRenderingContext2D, x: number, y: number, k: number) {
  ctx.save()
  ctx.globalCompositeOperation = "lighter"
  const g = ctx.createRadialGradient(x, y, 0, x, y, 30)
  g.addColorStop(0, "rgba(255,247,220,1)")
  g.addColorStop(0.3, "rgba(255,200,87,0.8)")
  g.addColorStop(1, "rgba(255,143,74,0)")
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, 30, 0, Math.PI * 2)
  ctx.fill()
  // A short trail.
  ctx.strokeStyle = `rgba(255,217,138,${0.5 * k})`
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - 160, y - 40)
  ctx.stroke()
  ctx.restore()
}

function drawJupiter(ctx: CanvasRenderingContext2D, st: number) {
  if (st < 17.9) return
  const k = spring(st - 17.9, 0.5, 12)
  const { x, y, r } = JUPITER
  ctx.save()
  ctx.globalAlpha = clamp(k)
  ctx.beginPath()
  ctx.arc(x, y, r * k, 0, Math.PI * 2)
  ctx.clip()
  const bands = ["#e8c49a", "#c98a5a", "#f0dcc0", "#b8754a", "#ead2b0", "#c98a5a", "#f3e2c8"]
  bands.forEach((c, i) => {
    ctx.fillStyle = c
    ctx.fillRect(x - r, y - r + (i * 2 * r) / bands.length, 2 * r, (2 * r) / bands.length + 1)
  })
  ctx.fillStyle = "#c0543a"
  ctx.beginPath()
  ctx.ellipse(x + r * 0.35, y + r * 0.25, r * 0.2, r * 0.11, 0, 0, Math.PI * 2)
  ctx.fill()
  const sh = ctx.createLinearGradient(x - r, y, x + r, y)
  sh.addColorStop(0, "rgba(0,0,0,0)")
  sh.addColorStop(1, "rgba(0,0,10,0.55)")
  ctx.fillStyle = sh
  ctx.fillRect(x - r, y - r, 2 * r, 2 * r)
  ctx.restore()
}

function drawCountdown(ctx: CanvasRenderingContext2D, st: number, fonts: Fonts) {
  if (st < 3.2 || st > 17.5) return
  // 500 real seconds compressed into the 12.6s between "eight" and "hits".
  const k = span(st, 3.2, 15.8)
  const secs = Math.max(0, Math.round(500 * (1 - k)))
  const text = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`
  const slam = spring(st - 3.2, 0.42, 16)
  const scale = 1.7 - 0.7 * slam
  ctx.save()
  ctx.translate(1660, 130)
  ctx.scale(scale, scale)
  ctx.font = `700 64px ${fonts.display}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillStyle = "rgba(6,20,40,0.62)"
  pill(ctx, -130, -46, 260, 92)
  ctx.fill()
  ctx.fillStyle = secs === 0 ? GOLD : WHITE
  ctx.fillText(text, 0, 4)
  ctx.restore()
}

function drawThermometer(ctx: CanvasRenderingContext2D, st: number, fonts: Fonts, t: number) {
  if (st < 22.8 || t > 27.6) return
  const k = easeInOutCubic(span(st, 22.8, 24.2))
  const temp = Math.round(lerp(15, -70, k))
  ctx.save()
  ctx.translate(1700, 600)
  ctx.fillStyle = "rgba(6,20,40,0.62)"
  pill(ctx, -40, -230, 80, 330)
  ctx.fill()
  ctx.fillStyle = "#ffffff"
  pill(ctx, -12, -200, 24, 250)
  ctx.fill()
  const fill = 200 * (1 - k * 0.85)
  ctx.fillStyle = k > 0.5 ? TEAL : "#ff8f4a"
  pill(ctx, -8, 46 - fill, 16, fill)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, 62, 26, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = `700 44px ${fonts.display}`
  ctx.textAlign = "center"
  ctx.fillStyle = WHITE
  ctx.fillText(`${temp}°C`, 0, 150)
  ctx.restore()
}

function drawGrainVignette(ctx: CanvasRenderingContext2D, t: number) {
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95)
  vg.addColorStop(0, "rgba(4,4,20,0)")
  vg.addColorStop(1, "rgba(4,4,20,0.45)")
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, W, H)
  // Grain re-seeded 24 times a second: a pure function of t, like the rest.
  const r = rng(Math.floor(t * 24) + 1)
  ctx.fillStyle = "rgba(255,255,255,0.05)"
  for (let i = 0; i < 900; i++) ctx.fillRect(r() * W, r() * H, 2, 2)
  ctx.fillStyle = "rgba(0,0,0,0.06)"
  for (let i = 0; i < 900; i++) ctx.fillRect(r() * W, r() * H, 2, 2)
}

/**
 * Draw second t of the video. Pure: same t, same picture. The canvas is
 * expected to be scaled so that 1920x1080 world units fill it.
 */
export function drawFrame(ctx: CanvasRenderingContext2D, t: number, fonts: Fonts) {
  const amb = t // ambient clock: always forward
  const st = storyTime(t)
  const cam = camera(st < t ? t : st) // the camera follows wall time through the rewind
  // From the freeze on, the camera rides with Earth as it flies off, until
  // the title pulls back to the centre.
  const follow = easeInOutCubic(span(t, 22.8, 23.6)) * (1 - easeInOutCubic(span(t, 27.4, 28.4)))
  if (follow > 0) {
    const e = earthPos(st)
    cam.x = lerp(cam.x, e.x + 120, follow)
    cam.y = lerp(cam.y, e.y + 60, follow)
  }
  const dark = clamp((st - 17.4) / 0.5) * (1 - clamp((t - 27.7) / 0.6))

  ctx.save()
  drawBackground(ctx, amb, cam, dark)

  // World space.
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.scale(cam.z, cam.z)
  ctx.translate(-cam.x, -cam.y)

  drawSun(ctx, st, amb)
  drawShock(ctx, st)
  drawFront(ctx, st, fonts, cam)

  // Orbit ring and labels in the wide shot.
  const wide = clamp((0.9 - cam.z) / 0.4)
  if (wide > 0) {
    ctx.save()
    ctx.globalAlpha = wide * 0.5
    ctx.strokeStyle = TEAL
    ctx.setLineDash([18, 22])
    ctx.lineWidth = 4 / cam.z
    ctx.beginPath()
    ctx.arc(SUN.x, SUN.y, ORBIT, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
    if (st > 9.6 && st < 15.9) label(ctx, "GRAVITY", SUN.x + Math.cos(0.9) * ORBIT, SUN.y + Math.sin(0.9) * ORBIT, 34 / cam.z, TEAL, fonts, span(st, 10.5, 11))
  }
  // The empty centre on "nothing".
  if (st > 13.4 && st < 20.8) {
    ctx.save()
    ctx.globalAlpha = clamp((st - 13.4) / 0.3)
    ctx.strokeStyle = "rgba(255,255,255,0.8)"
    ctx.setLineDash([10 / cam.z, 14 / cam.z])
    ctx.lineWidth = 4 / cam.z
    ctx.beginPath()
    ctx.arc(SUN.x, SUN.y, SUN.r * spring(st - 13.4, 0.45, 14), 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  drawJupiter(ctx, st)

  const freeze = easeInOutCubic(span(st, 22.8, 24.2))
  const ep = drawEarth(ctx, st, amb, freeze)

  // Tangent line once gravity is gone.
  if (st > 20.8 && t < 28) {
    ctx.save()
    ctx.globalAlpha = clamp((st - 20.8) / 0.4) * (1 - clamp((t - 27.4) / 0.5))
    ctx.strokeStyle = "rgba(255,255,255,0.7)"
    ctx.setLineDash([16 / cam.z, 16 / cam.z])
    ctx.lineWidth = 3 / cam.z
    ctx.beginPath()
    ctx.moveTo(EARTH0.x, EARTH0.y + 900)
    ctx.lineTo(EARTH0.x, EARTH0.y - 2600)
    ctx.stroke()
    ctx.restore()
  }

  // YOU pin and photon on Earth.
  const pinX = ep.x + 30
  const pinY = ep.y - 40
  drawPin(ctx, pinX, pinY, st, fonts)
  if (st > 7.3 && st < 8.8) {
    const k = easeOutQuint(span(st, 7.3, 7.5))
    drawPhoton(ctx, lerp(pinX - 600, pinX, k), lerp(pinY - 200, pinY - 40, k), k)
  }
  // Light streaks on the dive.
  if (st > 5.6 && st < 7.2) {
    ctx.save()
    ctx.globalCompositeOperation = "lighter"
    const sr = rng(5)
    for (let i = 0; i < 14; i++) {
      const y0 = ep.y + (sr() - 0.5) * 300
      const x0 = ep.x - 900 + ((st - 5.6) * 900 + sr() * 600) % 900
      ctx.strokeStyle = "rgba(255,217,138,0.35)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x0 + 140, y0)
      ctx.stroke()
    }
    ctx.restore()
  }

  // The astronaut floats near Earth and looks at what matters.
  const look = st < 3 ? { x: SUN.x, y: SUN.y } : st < 9.6 ? { x: ep.x, y: ep.y } : st < 20 ? { x: JUPITER.x, y: JUPITER.y } : { x: ep.x, y: ep.y - 400 }
  drawAstronaut(ctx, ep.x - 330, ep.y + 220, amb, st, t, look, t >= 25.2 ? t - 25.2 : 0)
  ctx.restore()

  // The world dims away under the title.
  const titleDim = clamp((t - 27.5) / 0.6)
  if (titleDim > 0) {
    ctx.fillStyle = `rgba(8,22,44,${titleDim * 0.92})`
    ctx.fillRect(0, 0, W, H)
  }

  // Screen space: flash, countdown, thermometer, captions, title photon.
  if (st > 1.5 && st < 2) {
    ctx.fillStyle = `rgba(255,255,255,${(1 - span(st, 1.5, 2)) * 0.9})`
    ctx.fillRect(0, 0, W, H)
  }
  drawCountdown(ctx, st, fonts)
  drawThermometer(ctx, st, fonts, t)
  if (st > 3.2 && st < 15.9) {
    // Nothing: the front's label is in world space.
  }
  if (t > 24.3 && t < 25.1) {
    // Rewind cue: a strip of reversed scan lines.
    ctx.fillStyle = "rgba(143,216,230,0.12)"
    for (let i = 0; i < 12; i++) ctx.fillRect(0, ((t * 1400 + i * 90) % H), W, 6)
    label(ctx, "◀◀", 160, 120, 40, TEAL, fonts, 1)
  }
  for (const c of CAPTIONS) {
    if (t < c.t0 || t > c.t1) continue
    c.lines.forEach((line, i) => {
      const rise = span(t, c.t0 + i * 0.12, c.t0 + i * 0.12 + 0.45)
      label(ctx, line, c.x, c.y + i * c.size * 1.7, c.size, c.color, fonts, rise)
    })
  }
  if (t > 27.7) {
    drawPhoton(ctx, 960, 760, 1)
    label(ctx, "8:20 OLD", 960, 840, 34, GOLD, fonts, span(t, 27.8, 28.2))
  }
  drawGrainVignette(ctx, t)
  ctx.restore()
}
