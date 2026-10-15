import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export type ParticleIntro = 'none' | 'swirl' | 'burst' | 'rain' | 'scatter' | 'sweep'

export interface ParticleImageProps {
  src: string
  /** World-space width of the image */
  width?: number
  /** World-space diameter of each particle */
  particleSize?: number
  /** Sample every Nth pixel (1 = every pixel, higher = fewer particles) */
  density?: number
  interactionRadius?: number
  interactionStrength?: number
  returnSpeed?: number
  /** Velocity retained per frame at 60fps (0–1). Lower = more damping */
  friction?: number
  opacity?: number
  /** How far particles drift while idle, in world units. 0 disables floating */
  floatAmount?: number
  /** Speed of the idle floating motion */
  floatSpeed?: number
  /** Entry animation. Changing it (or `src`) replays the intro */
  intro?: ParticleIntro
  /** Total intro length in seconds */
  introDuration?: number
  /** Seconds to wait before the intro starts */
  introDelay?: number
}

interface ParticleData {
  positions: Float32Array
  originals: Float32Array
  velocities: Float32Array
  colors: Float32Array
  phases: Float32Array
}

interface IntroData {
  variant: Exclude<ParticleIntro, 'none'>
  /** xyz start position per particle */
  starts: Float32Array
  /** 0–1 start offset per particle (fraction of the intro) */
  delays: Float32Array
  /** swirl only: radius, angle, extra start radius per particle */
  aux: Float32Array | null
}

const REPULSION_SCALE = 0.1
const MAX_DIMENSION = 500
const TAU = Math.PI * 2

/** Portion of the intro used to stagger particle start times */
const INTRO_SPREAD = 0.4
const SWIRL_TURNS = 1.25

/* ------------------------------------------------------------------ */
/* Easing                                                              */
/* ------------------------------------------------------------------ */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const easeOutBounce = (t: number) => {
  const n = 7.5625
  const d = 2.75
  if (t < 1 / d) return n * t * t
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375
  return n * (t -= 2.625 / d) * t + 0.984375
}

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */
const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uScale;
  uniform float uOrtho;

  attribute vec3 aColor;
  attribute float aProgress;
  varying vec3 vColor;
  varying float vReveal;

  void main() {
    vColor = aColor;
    // Particles pop in (size + alpha) as their intro progress begins
    vReveal = smoothstep(0.0, 0.2, aProgress);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = uOrtho > 0.5
      ? uSize * uScale
      : uSize * uScale / -mvPosition.z;

    gl_PointSize = size * vReveal;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vReveal;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    float alpha = smoothstep(0.5, 0.35, d) * uOpacity * vReveal;
    gl_FragColor = vec4(vColor, alpha);
  }
`

/* ------------------------------------------------------------------ */
/* Intro: writes one particle's position for progress p (0–1)          */
/* ------------------------------------------------------------------ */
function writeIntro(
  data: IntroData,
  p: number,
  j: number,
  i: number,
  ox: number,
  oy: number,
  tx: number,
  ty: number,
  tz: number,
  out: Float32Array
) {
  const s = data.starts
  const sx = s[i]
  const sy = s[i + 1]
  const sz = s[i + 2]

  let e: number

  switch (data.variant) {
    case 'swirl': {
      e = easeOutCubic(p)
      const aux = data.aux
      if (aux) {
        const r = aux[j * 3] + aux[j * 3 + 2] * (1 - e)
        const a = aux[j * 3 + 1] + (1 - e) * SWIRL_TURNS * TAU
        // Spiral position + the same idle drift the target has
        out[i] = Math.cos(a) * r + (tx - ox)
        out[i + 1] = Math.sin(a) * r + (ty - oy)
        out[i + 2] = sz + (tz - sz) * e
        return
      }
      break
    }
    case 'burst':
      e = easeOutExpo(p)
      break
    case 'rain':
      e = easeOutBounce(p)
      break
    case 'scatter':
      e = easeOutQuart(p)
      break
    case 'sweep':
    default:
      e = easeOutCubic(p)
      break
  }

  out[i] = sx + (tx - sx) * e
  out[i + 1] = sy + (ty - sy) * e
  out[i + 2] = sz + (tz - sz) * e
}

export function ParticleImage({
  src,
  width = 5,
  particleSize = 0.035,
  density = 3,
  interactionRadius = 0.8,
  interactionStrength = 0.5,
  returnSpeed = 0.08,
  friction = 0.85,
  opacity = 1,
  floatAmount = 0.04,
  floatSpeed = 0.6,
  intro = 'swirl',
  introDuration = 2.5,
  introDelay = 0,
}: ParticleImageProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { gl, camera, pointer, size } = useThree()

  const [image, setImage] = useState<HTMLImageElement | null>(null)

  /* ---------------------------------------------------------------- */
  /* Load image                                                        */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (!cancelled) setImage(img)
    }
    img.src = src

    return () => {
      cancelled = true
      img.onload = null
    }
  }, [src])

  /* ---------------------------------------------------------------- */
  /* Image → particle data                                             */
  /* ---------------------------------------------------------------- */
  const particleData = useMemo<ParticleData | null>(() => {
    if (!image) return null

    const aspect = image.width / image.height

    let canvasWidth = MAX_DIMENSION
    let canvasHeight = Math.round(MAX_DIMENSION / aspect)

    if (image.height > image.width) {
      canvasHeight = MAX_DIMENSION
      canvasWidth = Math.round(MAX_DIMENSION * aspect)
    }

    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null

    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
    const pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data

    const worldHeight = width / aspect
    const pixelW = width / canvasWidth
    const pixelH = worldHeight / canvasHeight
    const step = Math.max(1, Math.floor(density))

    const positions: number[] = []
    const colors: number[] = []
    const phases: number[] = []

    for (let y = 0; y < canvasHeight; y += step) {
      for (let x = 0; x < canvasWidth; x += step) {
        const i = (y * canvasWidth + x) * 4
        if (pixels[i + 3] < 30) continue

        positions.push((x - canvasWidth / 2) * pixelW, (canvasHeight / 2 - y) * pixelH, 0)
        colors.push(pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255)
        phases.push(Math.random() * TAU)
      }
    }

    const positionArray = new Float32Array(positions)

    return {
      positions: positionArray,
      originals: new Float32Array(positionArray),
      velocities: new Float32Array(positionArray.length),
      colors: new Float32Array(colors),
      phases: new Float32Array(phases),
    }
  }, [image, width, density])

  /* ---------------------------------------------------------------- */
  /* Intro data (start positions + stagger per particle)               */
  /* ---------------------------------------------------------------- */
  const introData = useMemo<IntroData | null>(() => {
    if (!particleData || intro === 'none') return null

    const { originals } = particleData
    const n = originals.length / 3

    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    let maxR = 0

    for (let i = 0; i < originals.length; i += 3) {
      const x = originals[i]
      const y = originals[i + 1]
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
      maxR = Math.max(maxR, Math.hypot(x, y))
    }

    const rangeX = maxX - minX || 1
    const rangeY = maxY - minY || 1
    maxR = maxR || 1

    const starts = new Float32Array(n * 3)
    const delays = new Float32Array(n)
    const aux = intro === 'swirl' ? new Float32Array(n * 3) : null

    for (let j = 0; j < n; j++) {
      const i = j * 3
      const ox = originals[i]
      const oy = originals[i + 1]
      const nx = (ox - minX) / rangeX
      const ny = (oy - minY) / rangeY
      const nr = Math.hypot(ox, oy) / maxR
      const rand = Math.random()

      switch (intro) {
        case 'swirl': {
          // Spiral in from a wide ring; the core forms first
          if (aux) {
            aux[i] = Math.hypot(ox, oy)
            aux[i + 1] = Math.atan2(oy, ox)
            aux[i + 2] = 1.5 + Math.random() * 2
          }
          starts[i + 2] = (Math.random() - 0.5) * 3
          delays[j] = nr * 0.8 + rand * 0.2
          break
        }
        case 'burst': {
          // Everything starts at the centre and shoots outward
          starts[i] = (Math.random() - 0.5) * 0.1
          starts[i + 1] = (Math.random() - 0.5) * 0.1
          starts[i + 2] = 0
          delays[j] = nr * 0.3 + rand * 0.1
          break
        }
        case 'rain': {
          // Fall from above and bounce into place, bottom rows first
          starts[i] = ox + (Math.random() - 0.5) * 0.3
          starts[i + 1] = oy + 4 + Math.random() * 2
          starts[i + 2] = 0
          delays[j] = (1 - ny) * 0.5 + rand * 0.2
          break
        }
        case 'scatter': {
          // Drift in from random points in space
          starts[i] = (Math.random() - 0.5) * rangeX * 2.2
          starts[i + 1] = (Math.random() - 0.5) * rangeY * 2.2
          starts[i + 2] = (Math.random() - 0.5) * 4
          delays[j] = rand
          break
        }
        case 'sweep': {
          // Slide in from the left, revealed as a wave
          starts[i] = ox - 2.5
          starts[i + 1] = oy + (Math.random() - 0.5) * 0.8
          starts[i + 2] = (Math.random() - 0.5) * 0.5
          delays[j] = nx * 0.85 + rand * 0.15
          break
        }
      }
    }

    return { variant: intro, starts, delays, aux }
  }, [particleData, intro])

  /* ---------------------------------------------------------------- */
  /* Geometry + material                                               */
  /* ---------------------------------------------------------------- */
  const geometry = useMemo(() => {
    if (!particleData) return null

    const geo = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(particleData.positions, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)

    const progAttr = new THREE.BufferAttribute(
      new Float32Array(particleData.positions.length / 3),
      1
    )
    progAttr.setUsage(THREE.DynamicDrawUsage)

    geo.setAttribute('position', posAttr)
    geo.setAttribute('aColor', new THREE.BufferAttribute(particleData.colors, 3))
    geo.setAttribute('aProgress', progAttr) // starts at 0 = hidden
    return geo
  }, [particleData])

  useEffect(() => () => geometry?.dispose(), [geometry])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uSize: { value: particleSize },
          uScale: { value: 1 },
          uOrtho: { value: 0 },
          uOpacity: { value: opacity },
        },
        vertexShader,
        fragmentShader,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => () => material.dispose(), [material])

  /* ---------------------------------------------------------------- */
  /* Intro state                                                       */
  /* ---------------------------------------------------------------- */
  const introStart = useRef<number | null>(null)
  const introDone = useRef(false)
  const progressReady = useRef(false)

  // Replay whenever the geometry or the chosen intro changes
  useEffect(() => {
    introStart.current = null
    introDone.current = false
    progressReady.current = false
  }, [geometry, introData])

  /* ---------------------------------------------------------------- */
  /* Pointer handling                                                  */
  /* ---------------------------------------------------------------- */
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const mouse = useMemo(() => new THREE.Vector3(), [])

  const pointerActive = useRef(false)

  useEffect(() => {
    const el = gl.domElement

    const enter = () => {
      pointerActive.current = true
    }
    const leave = () => {
      pointerActive.current = false
    }
    const up = (e: PointerEvent) => {
      if (e.pointerType === 'touch') pointerActive.current = false
    }

    el.addEventListener('pointermove', enter)
    el.addEventListener('pointerdown', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointercancel', leave)
    el.addEventListener('pointerup', up)

    return () => {
      el.removeEventListener('pointermove', enter)
      el.removeEventListener('pointerdown', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointercancel', leave)
      el.removeEventListener('pointerup', up)
    }
  }, [gl])

  /* ---------------------------------------------------------------- */
  /* Simulation                                                        */
  /* ---------------------------------------------------------------- */
  useFrame((state, delta) => {
    const points = pointsRef.current
    if (!points || !particleData || !geometry) return

    /* Sync uniforms */
    const pixelRatio = gl.getPixelRatio()
    const u = material.uniforms

    u.uSize.value = particleSize
    u.uOpacity.value = opacity

    if ((camera as THREE.OrthographicCamera).isOrthographicCamera) {
      u.uOrtho.value = 1
      u.uScale.value = (camera as THREE.OrthographicCamera).zoom * pixelRatio
    } else {
      const fov = (camera as THREE.PerspectiveCamera).fov
      u.uOrtho.value = 0
      u.uScale.value =
        (size.height * pixelRatio) / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2))
    }

    /* Intro bookkeeping */
    const progAttr = geometry.attributes.aProgress as THREE.BufferAttribute
    const progress = progAttr.array as Float32Array

    if (!introData && !progressReady.current) {
      progress.fill(1)
      progAttr.needsUpdate = true
      progressReady.current = true
    }

    let introing = false
    let tt = 0

    if (introData && !introDone.current) {
      if (introStart.current === null) {
        introStart.current = state.clock.elapsedTime + introDelay
      }
      tt = (state.clock.elapsedTime - introStart.current) / Math.max(introDuration, 0.01)
      introing = true
    }

    /* Pointer → local space */
    const active = pointerActive.current && !introing

    if (active) {
      raycaster.setFromCamera(pointer, camera)
      if (raycaster.ray.intersectPlane(plane, hit)) {
        mouse.copy(hit)
        points.worldToLocal(mouse)
      }
    }

    const { positions, originals, velocities, phases } = particleData
    const radius = interactionRadius
    const radiusSq = radius * radius

    const k = Math.min(delta, 0.033) * 60
    const damping = Math.pow(friction, k)
    const spring = returnSpeed * k

    const t = state.clock.elapsedTime * floatSpeed
    const amp = floatAmount
    const jitter = amp * 0.25

    for (let i = 0, j = 0; i < positions.length; i += 3, j++) {
      const ox = originals[i]
      const oy = originals[i + 1]
      const phase = phases[j]

      const driftX =
        Math.sin(oy * 1.1 + t) * amp +
        Math.sin(ox * 0.7 - t * 0.6) * amp * 0.5 +
        Math.sin(t * 1.3 + phase) * jitter

      const driftY =
        Math.cos(ox * 1.2 + t * 0.9) * amp +
        Math.cos(oy * 0.8 + t * 0.5) * amp * 0.5 +
        Math.cos(t * 1.1 + phase) * jitter

      const driftZ = Math.sin(ox * 0.9 + oy * 0.9 + t * 0.8) * amp * 2

      const targetX = ox + driftX
      const targetY = oy + driftY

      /* Intro: this particle is still on its entry path */
      if (introing && introData) {
        const p = Math.min(
          1,
          Math.max(0, (tt - introData.delays[j] * INTRO_SPREAD) / (1 - INTRO_SPREAD))
        )
        progress[j] = p

        if (p < 1) {
          writeIntro(introData, p, j, i, ox, oy, targetX, targetY, driftZ, positions)
          velocities[i] = 0
          velocities[i + 1] = 0
          continue
        }
      }

      /* Normal physics */
      const x = positions[i]
      const y = positions[i + 1]

      let vx = velocities[i]
      let vy = velocities[i + 1]

      if (active) {
        const dx = x - mouse.x
        const dy = y - mouse.y
        const distSq = dx * dx + dy * dy

        if (distSq < radiusSq && distSq > 1e-8) {
          const dist = Math.sqrt(distSq)
          const influence = 1 - dist / radius
          const force = influence * influence * interactionStrength * REPULSION_SCALE * k

          vx += (dx / dist) * force
          vy += (dy / dist) * force
        }
      }

      vx += (targetX - x) * spring
      vy += (targetY - y) * spring

      vx *= damping
      vy *= damping

      velocities[i] = vx
      velocities[i + 1] = vy

      positions[i] = x + vx * k
      positions[i + 1] = y + vy * k
      positions[i + 2] = driftZ
    }

    if (introing) {
      progAttr.needsUpdate = true
      if (tt >= 1) introDone.current = true
    }

    geometry.attributes.position.needsUpdate = true
  })

  if (!geometry) return null

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
}
