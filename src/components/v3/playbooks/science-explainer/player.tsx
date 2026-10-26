"use client"

// ============================================================================
// File Path: src/components/v3/playbooks/science-explainer/player.tsx
// Why: The live version of the playbook's method: a player around
//      ./scene.ts with play/pause, a scrubber, the 18 beats as markers and a
//      list, and the camera's zoom curve with the playhead on it. Because the
//      scene is a pure function of time, seeking is just drawing another t.
//      The clock only exists here, in the player; the scene never sees it.
// Env / Identity: Client Component
// ============================================================================

import { Pause, Play, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Locale } from "@/lib/nav"
import { localDigits } from "@/lib/digits"
import { fredoka } from "./fonts"
import { BEATS, DURATION, H, W, drawFrame, storyTime, zoomCurve } from "./scene"


const T = {
  en: { play: "Play", pause: "Pause", restart: "Restart", time: "Time", beats: "The beats", zoom: "Camera zoom over time (log scale)", story: "story clock", hint: "Drag the timeline, or click a beat. Every frame is drawn from the time alone." },
  fa: { play: "پخش", pause: "توقف", restart: "از اول", time: "زمان", beats: "ضرب‌آهنگ‌ها", zoom: "بزرگ‌نمایی دوربین در طول زمان (مقیاس لگاریتمی)", story: "ساعت داستان", hint: "تایم‌لاین را بکش، یا روی یک ضرب‌آهنگ بزن. هر فریم فقط از روی زمان کشیده می‌شود." },
}

export function ExplainerPlayer({ locale }: { locale: Locale }) {
  const t = T[locale]
  const fa = locale === "fa"
  const canvas = useRef<HTMLCanvasElement>(null)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const started = useRef(false)
  const timeRef = useRef(0)
  timeRef.current = time

  // Draw whenever time changes: the whole render is drawFrame(t).
  const paint = useCallback(
    (tt: number) => {
      const c = canvas.current
      const ctx = c?.getContext("2d")
      if (!c || !ctx) return
      const scale = c.width / W
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      drawFrame(ctx, tt, { display: fredoka.style.fontFamily })
    },
    [],
  )

  // Size the backing store to the element and the screen, capped for speed.
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const fit = () => {
      const w = Math.min(1600, Math.round(c.clientWidth * Math.min(window.devicePixelRatio || 1, 2)))
      c.width = w
      c.height = Math.round((w * H) / W)
      paint(timeRef.current)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(c)
    // Fredoka must be loaded before the first captions are measured.
    document.fonts
      ?.load(`700 40px ${fredoka.style.fontFamily}`)
      .then(() => {
        setReady(true)
        paint(timeRef.current)
      })
      .catch(() => setReady(true))
    return () => ro.disconnect()
  }, [paint])

  useEffect(() => paint(time), [time, paint])

  // The only clock: advance time while playing.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setTime((v) => {
        const nv = v + dt
        if (nv >= DURATION) {
          setPlaying(false)
          return DURATION
        }
        return nv
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  // Start once, when the player first scrolls into view, unless the reader
  // prefers less motion.
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setTime(7.6)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          setPlaying(true)
        }
      },
      { threshold: 0.5 },
    )
    io.observe(c)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    if (time >= DURATION) setTime(0)
    setPlaying((p) => !p)
  }

  const current = useMemo(() => {
    let i = 0
    while (i < BEATS.length - 1 && BEATS[i + 1].t <= time) i++
    return i
  }, [time])

  // Keep the current beat in view inside the list, without moving the page.
  const list = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const ol = list.current
    const li = ol?.children[current] as HTMLElement | undefined
    if (!ol || !li) return
    const top = li.offsetTop - ol.clientHeight / 2 + li.clientHeight / 2
    ol.scrollTo({ top, behavior: "smooth" })
  }, [current])

  const curve = useMemo(() => zoomCurve(300), [])
  // Chart geometry: x = time, y = log zoom between 0.2 and 3.
  const CW = 600
  const CH = 140
  // Rounded: Node and the browser disagree in the last digits of Math.log,
  // which would make the server HTML and the client render differ.
  const zy = (z: number) => Math.round((CH - ((Math.log(z) - Math.log(0.2)) / (Math.log(3) - Math.log(0.2))) * (CH - 16) - 8) * 100) / 100
  const path = curve.map((p, i) => `${i ? "L" : "M"}${((p.t / DURATION) * CW).toFixed(1)},${zy(p.z).toFixed(1)}`).join(" ")
  const st = storyTime(time)
  const clock = (v: number) => localDigits(v.toFixed(1), locale).replace(".", fa ? "٫" : ".")

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-2xl border border-v3-line/80 bg-[#081d2c] shadow-[0_30px_120px_-40px_rgba(77,199,235,0.45)]">
        <canvas
          ref={canvas}
          className={`block aspect-video w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          role="img"
          aria-label={fa ? "انیمیشن «اگر خورشید ناپدید می‌شد»، کشیده‌شده با کد در همین صفحه" : "The 'What if the Sun vanished?' animation, drawn in code on this page"}
        />
        {/* Controls stay left-to-right in both languages: it is a timeline. */}
        <div dir="ltr" className="flex flex-col gap-3 border-t border-white/10 bg-[#06121f] px-4 py-3 text-[#cfe9f2]">
          <div className="relative h-8">
            <input
              type="range"
              min={0}
              max={DURATION}
              step={0.01}
              value={time}
              onChange={(e) => {
                setPlaying(false)
                setTime(Number(e.target.value))
              }}
              aria-label={t.time}
              className="absolute inset-0 z-10 h-8 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#ffd98a] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ffd98a] [&::-webkit-slider-thumb]:shadow-[0_0_14px_#ffd98a]"
            />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-linear-to-r from-[#4dc7eb] via-[#ffd98a] to-[#ff8f4a]" style={{ width: `${(time / DURATION) * 100}%` }} />
            </div>
            {BEATS.map((b) => (
              <span
                key={b.t}
                aria-hidden
                className={`pointer-events-none absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full ${b.word ? "bg-[#ffd98a]" : "bg-white/40"}`}
                style={{ left: `${(b.t / DURATION) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#ffd98a] px-4 text-sm font-semibold text-[#081d2c] transition-transform hover:scale-105"
            >
              {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              {playing ? t.pause : t.play}
            </button>
            <button
              type="button"
              onClick={() => {
                setTime(0)
                setPlaying(true)
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-sm transition-colors hover:border-[#8fd8e6] hover:text-[#8fd8e6]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              {t.restart}
            </button>
            {/* Digits in monospace (inline, so the Persian face cannot take them
                over); the Persian label stays in the page's own face. */}
            <span className="ms-auto flex items-baseline gap-3 text-sm tabular-nums">
              <span className="text-[#8fd8e6]" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                {time.toFixed(2)}s
              </span>
              <span className="text-white/50">
                <span dir={fa ? "rtl" : "ltr"}>{t.story}</span>{" "}
                <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{st.toFixed(2)}s</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-v3-mute">{t.hint}</p>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* The beats, as a clickable list that follows the playhead. */}
        <div className="flex min-w-0 flex-col gap-3 lg:col-span-7">
          <h3 className="text-sm text-v3-mute">{t.beats}</h3>
          <ol ref={list} className="relative flex max-h-[26rem] flex-col overflow-y-auto rounded-2xl border border-v3-line/80">
            {BEATS.map((b, i) => (
              <li key={b.t}>
                <button
                  type="button"
                  onClick={() => {
                    setTime(b.t + 0.02)
                    setPlaying(true)
                  }}
                  className={`grid w-full grid-cols-[4.5rem_1fr] items-baseline gap-3 border-b border-v3-line/50 px-4 py-2.5 text-start transition-colors last:border-b-0 ${i === current ? "bg-v3-raise shadow-[inset_3px_0_0_rgb(var(--v3-glow))] rtl:shadow-[inset_-3px_0_0_rgb(var(--v3-glow))]" : "hover:bg-v3-raise/60"}`}
                >
                  <span className={`text-sm tabular-nums ${i === current ? "text-v3-light" : "text-v3-mute"}`} dir="ltr" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    {b.t.toFixed(1)}s
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className={`leading-relaxed rtl:leading-loose ${i === current ? "text-v3-bone" : "text-v3-soft"}`}>{b[locale]}</span>
                    {b.word && (
                      <span className="text-xs text-v3-mute">
                        {fa ? "روی کلمه‌ی" : "on the word"}{" "}
                        <bdi dir="ltr" className="font-(family-name:--font-instrument)! text-v3-light">
                          “{b.word}”
                        </bdi>
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* The camera curve: zoom in log space, with the playhead on it. */}
        <div className="flex min-w-0 flex-col gap-3 lg:col-span-5">
          <h3 className="text-sm text-v3-mute">{t.zoom}</h3>
          <div className="rounded-2xl border border-v3-line/80 bg-[#081d2c] p-4" dir="ltr">
            <svg viewBox={`0 0 ${CW} ${CH + 24}`} className="w-full" role="img" aria-label={t.zoom} style={{ fontFamily: fredoka.style.fontFamily }}>
              <defs>
                <linearGradient id="zoomline" x1="0" x2="1">
                  <stop offset="0" stopColor="#4dc7eb" />
                  <stop offset="0.5" stopColor="#ffd98a" />
                  <stop offset="1" stopColor="#ff8f4a" />
                </linearGradient>
              </defs>
              {[0.3, 1, 2.25].map((z) => (
                <g key={z}>
                  <line x1={0} x2={CW} y1={zy(z)} y2={zy(z)} stroke="rgba(255,255,255,0.08)" />
                  <text x={4} y={zy(z) - 4} fill="rgba(207,233,242,0.55)" fontSize={11}>
                    {z}x
                  </text>
                </g>
              ))}
              <path d={path} fill="none" stroke="url(#zoomline)" strokeWidth={3} strokeLinejoin="round" />
              <line x1={(time / DURATION) * CW} x2={(time / DURATION) * CW} y1={0} y2={CH} stroke="#ffd98a" strokeWidth={1.5} />
              <circle cx={(time / DURATION) * CW} cy={zy(curve[Math.round((time / DURATION) * 300)]?.z ?? 1)} r={5} fill="#ffd98a" />
              {[0, 10, 20, 30].map((s) => (
                <text key={s} x={(s / DURATION) * CW} y={CH + 18} fill="rgba(207,233,242,0.55)" fontSize={11} textAnchor={s === 0 ? "start" : s === 30 ? "end" : "middle"}>
                  {s}s
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
