"use client"

// ============================================================================
// File Path: src/components/v3/reports/direct-to-cell/globe.tsx
// Why: The report's map, as a globe. Countries where Starlink Direct to Cell
//      runs through a partner operator are lit; Iran is marked; a shell of
//      satellites circles overhead. The point it makes in one look: the
//      satellites pass over every country, but the service is switched on
//      country by country, through an operator.
//
//      Country shapes come from Natural Earth via world-atlas (public domain)
//      and are painted onto an equirectangular canvas that becomes the
//      sphere's texture — no projection library needed, and the texture is
//      repainted when the light/dark theme changes. three and the map data
//      are both imported lazily, only when the globe nears the viewport.
// Env / Identity: Client Component (three.js, lazy)
// ============================================================================

import { useEffect, useRef, useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import { PARTNERS, IRAN_ID, type FocusKey } from "./data"

type Ring = [number, number][]

const FOCUS: Record<FocusKey, { lon: number; lat: number }> = {
  iran: { lon: 53, lat: 32 },
  kazakhstan: { lon: 67, lat: 48 },
  americas: { lon: -98, lat: 40 },
  pacific: { lon: 150, lat: -30 },
}

function cssColor(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export function DtcGlobe({ locale }: { locale: Locale }) {
  const t = COPY[locale].globe
  const wrap = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const focusRef = useRef<(k: FocusKey) => void>(() => {})
  const [focus, setFocus] = useState<FocusKey>("iran")
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const box = wrap.current
    const el = host.current
    if (!box || !el) return
    let disposed = false
    let cleanup: (() => void) | undefined

    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting) || cleanup || disposed) return
        io.disconnect()
        try {
          const [THREE, topo, world] = await Promise.all([
            import("three"),
            import("topojson-client"),
            import("world-atlas/countries-110m.json"),
          ])
          if (disposed) return
          cleanup = start(THREE, topo, (world as { default?: unknown }).default ?? world)
          setLoaded(true)
        } catch {
          setFailed(true)
        }
      },
      { rootMargin: "300px 0px" },
    )
    io.observe(box)

    function start(THREE: typeof import("three"), topo: typeof import("topojson-client"), world: unknown) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch {
        setFailed(true)
        return () => {}
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      el!.appendChild(renderer.domElement)
      Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%", touchAction: "pan-y" })

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
      camera.position.set(0, 0, 9)

      const globe = new THREE.Group()
      scene.add(globe)

      // ── Country shapes → rings of [lon, lat].
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const topology = world as any
      const fc = topo.feature(topology, topology.objects.countries) as unknown as {
        features: { id: string; geometry: { type: string; coordinates: unknown } | null }[]
      }
      const shapes = fc.features.map((f) => {
        const polys: Ring[][] = !f.geometry
          ? []
          : f.geometry.type === "Polygon"
            ? [f.geometry.coordinates as Ring[]]
            : (f.geometry.coordinates as Ring[][])
        return { id: String(f.id), polys }
      })
      const partnerIds = new Set(PARTNERS.filter((p) => p.status === "live").map((p) => p.id))
      const plannedIds = new Set(PARTNERS.filter((p) => p.status !== "live").map((p) => p.id))

      // ── Paint the texture. Equirectangular: x is longitude, y is latitude,
      // so a polygon is drawn with plain canvas paths. Rings that cross the
      // antimeridian are unwrapped and drawn again one world to each side.
      const W = 2048
      const H = 1024
      const canvas = document.createElement("canvas")
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext("2d")!
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 4

      const px = (lon: number) => ((lon + 180) / 360) * W
      const py = (lat: number) => ((90 - lat) / 180) * H

      const trace = (ring: Ring, shift: number) => {
        let prev = ring[0][0]
        let off = 0
        ring.forEach(([lon, lat], i) => {
          if (i > 0) {
            const d = lon - prev
            if (d > 180) off -= 360
            else if (d < -180) off += 360
          }
          prev = lon
          const x = px(lon + off + shift)
          const y = py(lat)
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.closePath()
      }

      const paint = () => {
        const ink = cssColor("--v3-raise", "#1f1d1b")
        const land = cssColor("--v3-line", "#33302c")
        const edge = cssColor("--v3-ink", "#141312")
        const accent = cssColor("--v3-accent", "#e8c48a")
        const bone = cssColor("--v3-bone", "#ede8df")
        ctx.fillStyle = ink
        ctx.fillRect(0, 0, W, H)
        // Faint graticule.
        ctx.strokeStyle = land
        ctx.globalAlpha = 0.35
        ctx.lineWidth = 1
        for (let lon = -180; lon <= 180; lon += 30) {
          ctx.beginPath()
          ctx.moveTo(px(lon), 0)
          ctx.lineTo(px(lon), H)
          ctx.stroke()
        }
        for (let lat = -60; lat <= 60; lat += 30) {
          ctx.beginPath()
          ctx.moveTo(0, py(lat))
          ctx.lineTo(W, py(lat))
          ctx.stroke()
        }
        ctx.globalAlpha = 1
        for (const s of shapes) {
          const live = partnerIds.has(s.id)
          const planned = plannedIds.has(s.id)
          const iran = s.id === IRAN_ID
          ctx.fillStyle = live ? accent : planned ? accent : iran ? bone : land
          ctx.globalAlpha = live ? 1 : planned ? 0.45 : iran ? 0.9 : 1
          for (const shift of [-360, 0, 360]) {
            ctx.beginPath()
            for (const poly of s.polys) for (const ring of poly) trace(ring, shift)
            ctx.fill("evenodd")
            ctx.globalAlpha = 1
            ctx.strokeStyle = edge
            ctx.lineWidth = 1.2
            ctx.stroke()
          }
        }
        tex.needsUpdate = true
      }
      paint()

      const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 96, 64), new THREE.MeshBasicMaterial({ map: tex }))
      globe.add(sphere)

      // Thin atmosphere rim.
      const rim = new THREE.Mesh(
        new THREE.SphereGeometry(2.04, 64, 48),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.08, side: THREE.BackSide }),
      )
      globe.add(rim)

      // ── The satellite shell: points on inclined circular orbits, a little
      // above the surface. Illustrative, not an ephemeris.
      const planes = 24
      const perPlane = 28
      const satCount = planes * perPlane
      const satGeo = new THREE.BufferGeometry()
      const satPos = new Float32Array(satCount * 3)
      satGeo.setAttribute("position", new THREE.BufferAttribute(satPos, 3))
      const satMat = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.9, depthWrite: false })
      const sats = new THREE.Points(satGeo, satMat)
      scene.add(sats)
      const R = 2.22
      const incl = (53 * Math.PI) / 180
      const placeSats = (time: number) => {
        let k = 0
        for (let p = 0; p < planes; p++) {
          const raan = (p / planes) * Math.PI * 2
          for (let s = 0; s < perPlane; s++) {
            const u = (s / perPlane) * Math.PI * 2 + time * 0.12 + p * 0.37
            // Position in the orbital plane, then tilt by inclination and
            // turn by the ascending node.
            const x0 = R * Math.cos(u)
            const y0 = R * Math.sin(u) * Math.sin(incl)
            const z0 = R * Math.sin(u) * Math.cos(incl)
            satPos[k++] = x0 * Math.cos(raan) - z0 * Math.sin(raan)
            satPos[k++] = y0
            satPos[k++] = x0 * Math.sin(raan) + z0 * Math.cos(raan)
          }
        }
        satGeo.attributes.position.needsUpdate = true
      }
      placeSats(0)

      // Iran marker: a ring that pulses, placed on the surface.
      const toVec = (lon: number, lat: number, r: number) => {
        const phi = ((90 - lat) * Math.PI) / 180
        const theta = ((lon + 180) * Math.PI) / 180
        return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
      }
      const iranPos = toVec(53, 32.5, 2.01)
      const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })
      const marker = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.085, 40), ringMat)
      marker.position.copy(iranPos)
      marker.lookAt(iranPos.clone().multiplyScalar(2))
      globe.add(marker)

      const recolor = () => {
        paint()
        const accent = new THREE.Color(cssColor("--v3-accent", "#e8c48a"))
        const bone = new THREE.Color(cssColor("--v3-bone", "#ede8df"))
        satMat.color.copy(bone)
        ;(rim.material as InstanceType<typeof THREE.MeshBasicMaterial>).color.copy(accent)
        ringMat.color.copy(bone)
      }
      recolor()
      const themeObs = new MutationObserver(recolor)
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] })

      // ── Size.
      const resize = () => {
        const w = el!.clientWidth
        const h = el!.clientHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.position.z = w < 520 ? 11 : 9
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(el!)

      // ── Rotation: the globe turns to bring a focus point to face us.
      // Yaw/pitch target such that the point sits at the front-centre.
      let yaw = 0
      let pitch = 0
      let tYaw = 0
      let tPitch = 0
      let auto = !reduce
      const aim = (k: FocusKey) => {
        const f = FOCUS[k]
        tYaw = -((f.lon + 90) * Math.PI) / 180
        tPitch = (f.lat * Math.PI) / 180 * 0.85
        // Take the short way round.
        while (tYaw - yaw > Math.PI) tYaw -= Math.PI * 2
        while (tYaw - yaw < -Math.PI) tYaw += Math.PI * 2
        auto = false
      }
      focusRef.current = aim
      aim("iran")
      yaw = tYaw
      pitch = tPitch

      let dragging = false
      let lx = 0
      let ly = 0
      const down = (e: PointerEvent) => {
        dragging = true
        auto = false
        lx = e.clientX
        ly = e.clientY
      }
      const move = (e: PointerEvent) => {
        if (!dragging) return
        tYaw += (e.clientX - lx) * 0.006
        tPitch = Math.max(-1.1, Math.min(1.1, tPitch + (e.clientY - ly) * 0.004))
        yaw = tYaw
        pitch = tPitch
        lx = e.clientX
        ly = e.clientY
      }
      const up = () => (dragging = false)
      renderer.domElement.addEventListener("pointerdown", down)
      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)

      let visible = true
      const vis = new IntersectionObserver((es) => (visible = es.some((x) => x.isIntersecting)))
      vis.observe(box!)
      const clock = new THREE.Clock()
      const v = new THREE.Vector3()
      let raf = 0
      const frame = () => {
        raf = requestAnimationFrame(frame)
        if (!visible) return
        const dt = Math.min(clock.getDelta(), 0.05)
        const time = clock.elapsedTime
        if (auto) tYaw += dt * 0.08
        yaw += (tYaw - yaw) * Math.min(1, dt * 3)
        pitch += (tPitch - pitch) * Math.min(1, dt * 3)
        globe.rotation.set(pitch, yaw, 0, "XYZ")
        if (!reduce) placeSats(time)
        sats.rotation.y = yaw * 0.3
        const pulse = reduce ? 1 : 1 + Math.sin(time * 2.6) * 0.25
        marker.scale.setScalar(pulse)

        // Iran label follows the marker on screen; fades when it is behind.
        v.copy(iranPos).applyMatrix4(globe.matrixWorld)
        const front = v.z > 0.3
        v.project(camera)
        if (label.current) {
          const w = el!.clientWidth
          const h = el!.clientHeight
          label.current.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px)`
          label.current.style.opacity = front ? "1" : "0"
        }
        renderer.render(scene, camera)
      }
      frame()

      return () => {
        cancelAnimationFrame(raf)
        vis.disconnect()
        ro.disconnect()
        themeObs.disconnect()
        renderer.domElement.removeEventListener("pointerdown", down)
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", up)
        sphere.geometry.dispose()
        ;(sphere.material as InstanceType<typeof THREE.MeshBasicMaterial>).dispose()
        rim.geometry.dispose()
        ;(rim.material as InstanceType<typeof THREE.MeshBasicMaterial>).dispose()
        tex.dispose()
        satGeo.dispose()
        satMat.dispose()
        marker.geometry.dispose()
        ringMat.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    return () => {
      disposed = true
      io.disconnect()
      cleanup?.()
    }
  }, [])

  const choose = (k: FocusKey) => {
    setFocus(k)
    focusRef.current(k)
  }

  const live = PARTNERS.filter((p) => p.status === "live")
  const planned = PARTNERS.filter((p) => p.status !== "live")

  return (
    <div ref={wrap} role="group" aria-label={t.title} className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <div className="relative min-w-0 lg:col-span-7">
        <div
          ref={host}
          aria-hidden
          className="relative aspect-square w-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_50%,rgb(var(--v3-glow)/0.10),transparent_62%)]"
        >
          <span
            ref={label}
            dir={locale === "fa" ? "rtl" : "ltr"}
            className={`pointer-events-none absolute left-0 top-0 ms-4 -translate-y-1/2 whitespace-nowrap rounded-full border border-v3-bone/40 bg-v3-ink/80 px-3 py-1 text-xs text-v3-bone backdrop-blur-sm transition-opacity duration-300 ${loaded ? "" : "opacity-0"}`}
            style={{ transform: "translate(-999px,-999px)" }}
          >
            {t.iranLabel}
          </span>
        </div>
        {failed && <p className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-v3-mute">{t.noWebgl}</p>}
        <p className="mt-3 text-center text-xs text-v3-mute">{t.hint}</p>
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
        <div role="group" aria-label={t.focusLabel} className="flex flex-wrap gap-2">
          {(Object.keys(FOCUS) as FocusKey[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={focus === k}
              onClick={() => choose(k)}
              className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${
                focus === k ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light hover:text-v3-light"
              }`}
            >
              {t.focus[k]}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3" aria-live="polite">
          <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose">{t.readings[focus]}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-v3-mute">
            <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-v3-light" />{t.legendLive}</span>
            {planned.length > 0 && <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-v3-light/45" />{t.legendPlanned}</span>}
            <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-v3-bone" />{t.legendIran}</span>
            <span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-v3-bone" />{t.legendSats}</span>
          </div>
          <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {live.map((p) => (
              <li key={`${p.code}-${p.operator}`} className="flex items-baseline justify-between gap-3 border-b border-v3-line/50 py-2 text-sm">
                <span className="text-v3-bone">{t.countries[p.code] ?? p.code}</span>
                <span dir="ltr" className="text-v3-mute">{p.operator}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
