"use client"

// ============================================================================
// File Path: src/components/v3/reports/deep-time-pain/spiral.tsx
// Why: The spiral of deep time, in three.js. Earth's whole history wound into
//      a rising cone on a logarithmic scale: every full step up the axis is
//      ten times closer to the present, so the last few hundred thousand
//      years — a sliver on any linear chart — get as much room as the first
//      billion. The reader can drag it round; choosing an event turns the
//      spiral until that event faces them.
//
//      three is imported inside the effect, so it only loads when this figure
//      is near the viewport and never on the server. Colours are read from the
//      v3 theme variables and re-read when the theme switches. With reduced
//      motion the spiral holds still; without WebGL the event list below it
//      still works and says everything the picture does.
// Env / Identity: Client Component (three.js, lazy)
// ============================================================================

import { useEffect, useRef, useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import { EVENTS, type EventKey } from "./data"
import { clockTime, digits, years } from "./fmt"

const LOG_NOW = Math.log10(80)
const LOG_EARTH = Math.log10(EVENTS.find((e) => e.key === "earth")!.age)
const TURNS = 4.5
const HEIGHT = 4.6

/** Position along the spiral, 0 at Earth's formation and 1 at a human life. */
function along(age: number): number {
  return (LOG_EARTH - Math.log10(age)) / (LOG_EARTH - LOG_NOW)
}

function point(u: number): [number, number, number] {
  const angle = u * TURNS * Math.PI * 2
  const radius = 2.3 * (1 - 0.62 * u) + 0.25
  return [radius * Math.cos(angle), -HEIGHT / 2 + u * HEIGHT, radius * Math.sin(angle)]
}

/** The ten-fold steps marked on the spiral, as years before present. */
const DECADES = [1e9, 1e8, 1e7, 1e6, 1e5, 1e4, 1e3]

function cssColor(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export function TimeSpiral({ locale }: { locale: Locale }) {
  const t = COPY[locale].spiral
  const names = COPY[locale].events
  const fa = locale === "fa"
  const wrap = useRef<HTMLDivElement>(null)
  const canvasHost = useRef<HTMLDivElement>(null)
  const labels = useRef<Map<string, HTMLSpanElement>>(new Map())
  const select = useRef<(k: EventKey) => void>(() => {})
  const [active, setActive] = useState<EventKey>("lamprey")
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const host = canvasHost.current
    const box = wrap.current
    if (!host || !box) return
    let disposed = false
    let cleanup: (() => void) | undefined

    // Load and start only when the figure is about to be seen.
    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting) || cleanup || disposed) return
        io.disconnect()
        try {
          const THREE = await import("three")
          if (disposed) return
          cleanup = start(THREE)
          setLoaded(true)
        } catch {
          setFailed(true)
        }
      },
      { rootMargin: "300px 0px" },
    )
    io.observe(box)

    function start(THREE: typeof import("three")) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch {
        setFailed(true)
        return () => {}
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      host!.appendChild(renderer.domElement)
      renderer.domElement.style.display = "block"
      renderer.domElement.style.width = "100%"
      renderer.domElement.style.height = "100%"
      renderer.domElement.style.touchAction = "pan-y"

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
      camera.position.set(0, 1.2, 10.8)
      camera.lookAt(0, -0.15, 0)

      const group = new THREE.Group()
      group.rotation.x = 0.16
      scene.add(group)

      // ── The spiral itself: a thin tube whose colour warms toward now.
      const samples = 900
      const pts: InstanceType<typeof THREE.Vector3>[] = []
      for (let i = 0; i <= samples; i++) pts.push(new THREE.Vector3(...point(i / samples)))
      const curve = new THREE.CatmullRomCurve3(pts)
      const tube = new THREE.TubeGeometry(curve, samples, 0.018, 8, false)
      const colors: number[] = []
      const tubeMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 })
      const spiral = new THREE.Mesh(tube, tubeMat)
      group.add(spiral)

      // A faint central axis, so the cone reads as a solid.
      const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -HEIGHT / 2 - 0.2, 0),
        new THREE.Vector3(0, HEIGHT / 2 + 0.3, 0),
      ])
      const axisMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.25 })
      group.add(new THREE.Line(axisGeo, axisMat))

      // ── Event beads, with a soft halo on the accent ones.
      const haloTex = (() => {
        const c = document.createElement("canvas")
        c.width = c.height = 64
        const g = c.getContext("2d")!
        const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
        grd.addColorStop(0, "rgba(255,255,255,1)")
        grd.addColorStop(0.35, "rgba(255,255,255,0.35)")
        grd.addColorStop(1, "rgba(255,255,255,0)")
        g.fillStyle = grd
        g.fillRect(0, 0, 64, 64)
        return new THREE.CanvasTexture(c)
      })()

      const beadGeo = new THREE.SphereGeometry(1, 20, 14)
      const beads: { key: EventKey; mesh: InstanceType<typeof THREE.Mesh>; halo: InstanceType<typeof THREE.Sprite>; angle: number; pos: InstanceType<typeof THREE.Vector3> }[] = []
      for (const e of EVENTS) {
        const u = along(e.age)
        const [x, y, z] = point(u)
        const mat = new THREE.MeshBasicMaterial()
        const mesh = new THREE.Mesh(beadGeo, mat)
        mesh.position.set(x, y, z)
        mesh.scale.setScalar(e.accent ? 0.085 : 0.06)
        mesh.userData.key = e.key
        group.add(mesh)
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
        halo.position.copy(mesh.position)
        halo.scale.setScalar(e.accent ? 0.75 : 0.4)
        group.add(halo)
        beads.push({ key: e.key, mesh, halo, angle: u * TURNS * Math.PI * 2, pos: mesh.position.clone() })
      }

      // Small ticks at each ten-fold step, labelled in the DOM.
      const tickGeo = new THREE.SphereGeometry(1, 8, 6)
      const tickMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6 })
      const ticks = DECADES.map((age) => {
        const m = new THREE.Mesh(tickGeo, tickMat)
        m.position.set(...point(along(age)))
        m.scale.setScalar(0.03)
        group.add(m)
        return { age, mesh: m }
      })

      // ── Theme colours, re-read whenever the theme attribute changes.
      const paint = () => {
        const accent = new THREE.Color(cssColor("--v3-accent", "#e8c48a"))
        const bone = new THREE.Color(cssColor("--v3-bone", "#ede8df"))
        const line = new THREE.Color(cssColor("--v3-mute", "#a39c90"))
        colors.length = 0
        const pos = tube.attributes.position
        const tmp = new THREE.Color()
        for (let i = 0; i < pos.count; i++) {
          // TubeGeometry lays rings along the path, so the ring index is the
          // position along the spiral.
          const u = Math.floor(i / 9) / samples
          tmp.copy(line).lerp(accent, Math.pow(u, 1.6))
          colors.push(tmp.r, tmp.g, tmp.b)
        }
        tube.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
        axisMat.color.copy(line)
        tickMat.color.copy(line)
        for (const b of beads) {
          const ev = EVENTS.find((e) => e.key === b.key)!
          ;(b.mesh.material as InstanceType<typeof THREE.MeshBasicMaterial>).color.copy(ev.accent ? accent : bone)
          b.halo.material.color.copy(ev.accent ? accent : bone)
          b.halo.material.opacity = ev.accent ? 0.9 : 0.35
        }
      }
      paint()
      const themeObs = new MutationObserver(paint)
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] })

      // ── Size to the container.
      const resize = () => {
        const w = host!.clientWidth
        const h = host!.clientHeight
        // Drawing buffer follows the box; the CSS size stays fluid so the
        // canvas can never hold a grid track open wider than the screen.
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        // Pull back on narrow screens so the widest turn still fits.
        camera.position.z = w < 520 ? 14 : 10.8
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(host!)

      // ── Interaction: drag to turn, tap a bead to choose it.
      let rot = -Math.PI / 2
      let target: number | null = null
      let dragging = false
      let lastX = 0
      let moved = 0
      let selected: EventKey = "lamprey"
      const raycaster = new THREE.Raycaster()
      const ndc = new THREE.Vector2()

      const face = (k: EventKey) => {
        const b = beads.find((x) => x.key === k)
        if (!b) return
        selected = k
        // Bring the bead to the front: world angle (rot + angle) = pi/2,
        // taking the shortest way round.
        let want = Math.PI / 2 - b.angle
        const d = ((want - rot + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI
        want = rot + d
        target = want
      }
      select.current = face
      face("lamprey")

      const el = renderer.domElement
      const down = (e: PointerEvent) => {
        dragging = true
        moved = 0
        lastX = e.clientX
        target = null
      }
      const move = (e: PointerEvent) => {
        if (dragging) {
          const dx = e.clientX - lastX
          lastX = e.clientX
          moved += Math.abs(dx)
          rot += dx * 0.008
          return
        }
        const r = el.getBoundingClientRect()
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
        raycaster.setFromCamera(ndc, camera)
        const hit = raycaster.intersectObjects(beads.map((b) => b.mesh))[0]
        el.style.cursor = hit ? "pointer" : "grab"
      }
      const up = (e: PointerEvent) => {
        if (!dragging) return
        dragging = false
        if (moved > 4) return
        const r = el.getBoundingClientRect()
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
        raycaster.setFromCamera(ndc, camera)
        // Beads are small; widen the hit test a little for touch.
        raycaster.params.Points = { threshold: 0.2 }
        const hit = raycaster.intersectObjects(beads.map((b) => b.mesh))[0]
        if (hit) {
          const k = hit.object.userData.key as EventKey
          face(k)
          setActive(k)
        }
      }
      el.addEventListener("pointerdown", down)
      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)

      // ── Loop. Pauses while offscreen.
      let visible = true
      const vis = new IntersectionObserver((es) => (visible = es.some((x) => x.isIntersecting)))
      vis.observe(box!)
      const v = new THREE.Vector3()
      let raf = 0
      const clock = new THREE.Clock()

      const frame = () => {
        raf = requestAnimationFrame(frame)
        if (!visible) return
        const dt = Math.min(clock.getDelta(), 0.05)
        if (target !== null) {
          rot += (target - rot) * Math.min(1, dt * 4)
          if (Math.abs(target - rot) < 0.002) target = null
        } else if (!dragging && !reduce) {
          rot += dt * 0.12
        }
        group.rotation.y = rot
        const time = clock.elapsedTime

        // Labels: project each bead to the screen; dim the ones behind.
        const w = host!.clientWidth
        const h = host!.clientHeight
        for (const b of beads) {
          const on = b.key === selected
          const pulse = on && !reduce ? 1 + Math.sin(time * 3) * 0.18 : 1
          const base = EVENTS.find((e) => e.key === b.key)!.accent ? 0.085 : 0.06
          b.mesh.scale.setScalar(base * (on ? 1.5 : 1) * pulse)
          b.halo.scale.setScalar((on ? 1.3 : base > 0.07 ? 0.75 : 0.4) * pulse)

          v.copy(b.pos).applyMatrix4(group.matrixWorld)
          const depth = v.z
          v.project(camera)
          const label = labels.current.get(b.key)
          if (label) {
            const x = (v.x * 0.5 + 0.5) * w
            const y = (-v.y * 0.5 + 0.5) * h
            const front = depth > -0.4
            label.style.transform = `translate(${x}px, ${y}px)`
            label.style.opacity = on ? "1" : front ? "0.85" : "0.18"
            label.dataset.on = on ? "1" : "0"
          }
        }
        for (const tk of ticks) {
          v.copy(tk.mesh.position).applyMatrix4(group.matrixWorld)
          const depth = v.z
          v.project(camera)
          const label = labels.current.get(`d${tk.age}`)
          if (label) {
            label.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px)`
            label.style.opacity = depth > 0 ? "0.7" : "0.12"
          }
        }
        renderer.render(scene, camera)
      }
      frame()

      return () => {
        cancelAnimationFrame(raf)
        vis.disconnect()
        ro.disconnect()
        themeObs.disconnect()
        el.removeEventListener("pointerdown", down)
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", up)
        tube.dispose()
        tubeMat.dispose()
        axisGeo.dispose()
        axisMat.dispose()
        beadGeo.dispose()
        tickGeo.dispose()
        tickMat.dispose()
        haloTex.dispose()
        for (const b of beads) {
          ;(b.mesh.material as InstanceType<typeof THREE.MeshBasicMaterial>).dispose()
          b.halo.material.dispose()
        }
        renderer.dispose()
        el.remove()
      }
    }

    return () => {
      disposed = true
      io.disconnect()
      cleanup?.()
    }
  }, [])

  const choose = (k: EventKey) => {
    setActive(k)
    select.current(k)
  }

  const ev = EVENTS.find((e) => e.key === active)!
  const decadeLabel = (age: number) =>
    age >= 1e9 ? (fa ? "۱ میلیارد" : "1 billion") : age >= 1e6 ? `${digits(String(age / 1e6), locale)} ${fa ? "میلیون" : "million"}` : `${digits(String(age / 1e3), locale)} ${fa ? "هزار" : "thousand"}`

  return (
    <div ref={wrap} role="group" aria-label={t.title} className="grid gap-8 lg:grid-cols-12 lg:items-center">
      <div className="relative min-w-0 lg:col-span-7">
        <div
          ref={canvasHost}
          className="relative h-[26rem] w-full overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_50%_40%,rgb(var(--v3-glow)/0.10),transparent_65%)] md:h-[34rem]"
          aria-hidden
        >
          {/* DOM labels positioned by the render loop. Drawn in screen
              space, so the 3D scene never has to set type. */}
          <div className="pointer-events-none absolute inset-0" dir="ltr">
            {EVENTS.map((e) => (
              <span
                key={e.key}
                ref={(n) => {
                  if (n) labels.current.set(e.key, n)
                  else labels.current.delete(e.key)
                }}
                className={`absolute left-0 top-0 whitespace-nowrap ps-3 text-[11px] leading-none transition-opacity duration-300 data-[on=1]:text-sm data-[on=1]:font-semibold md:text-xs ${
                  e.accent ? "text-v3-light" : "text-v3-soft"
                } ${loaded ? "" : "opacity-0"}`}
                style={{ transform: "translate(-999px,-999px)" }}
                dir={fa ? "rtl" : "ltr"}
              >
                {names[e.key].name}
              </span>
            ))}
            {DECADES.map((age) => (
              <span
                key={age}
                ref={(n) => {
                  if (n) labels.current.set(`d${age}`, n)
                  else labels.current.delete(`d${age}`)
                }}
                className="absolute left-0 top-0 whitespace-nowrap ps-2 text-[10px] tabular-nums text-v3-mute"
                style={{ transform: "translate(-999px,-999px)" }}
              >
                {decadeLabel(age)}
              </span>
            ))}
          </div>
        </div>
        {failed && (
          <p className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-v3-mute">{t.noWebgl}</p>
        )}
        <p className="mt-3 text-xs text-v3-mute">{t.hint}</p>
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
        <div className="flex flex-col gap-2" aria-live="polite">
          <span className="text-sm text-v3-mute">{t.selected}</span>
          <span className={`font-v3-display text-3xl md:text-4xl ${ev.accent ? "text-v3-light" : "text-v3-bone"}`}>
            {names[active].name}
          </span>
          <span className="text-v3-soft">
            {names[active].note ?? `${years(ev.age, locale)} ${fa ? "سال پیش" : "years ago"}`}
          </span>
          <span className="text-sm text-v3-mute">
            {t.onClock} <bdi dir="ltr" className="tabular-nums text-v3-bone">{clockTime(ev.age, locale)}</bdi>
          </span>
        </div>
        <ul className="flex flex-wrap gap-2">
          {EVENTS.map((e) => {
            const on = e.key === active
            return (
              <li key={e.key}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(e.key)}
                  className={`min-h-10 rounded-full border px-3.5 text-sm transition-colors ${
                    on
                      ? "border-v3-light bg-v3-light text-v3-ink"
                      : e.accent
                        ? "border-v3-light/50 text-v3-light hover:border-v3-light"
                        : "border-v3-line text-v3-soft hover:border-v3-light/60 hover:text-v3-bone"
                  }`}
                >
                  {names[e.key].name}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.caption}</p>
      </div>
    </div>
  )
}
