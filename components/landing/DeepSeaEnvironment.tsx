'use client'

import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'

function OrganicRisingBubbles({
  count = 480,
  scrollProgress,
}: {
  count?: number
  scrollProgress: number
}) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = Math.random() * 28 - 20
      pos[i * 3 + 2] = Math.random() * 18 - 12
      spd[i] = 0.14 + Math.random() * 0.32
    }

    return { positions: pos, speeds: spd }
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const array = posAttr.array as Float32Array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      array[idx + 1] += speeds[i] * delta
      array[idx] += Math.sin(t * 0.35 + i) * 0.0018

      if (array[idx + 1] > 8) {
        array[idx + 1] = -20
      }
    }
    posAttr.needsUpdate = true

    // Gentle camera descent through the water column
    const targetY = -scrollProgress * 8.5 + state.pointer.y * 0.2
    const targetX = state.pointer.x * 0.25
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#bae6fd"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/**
 * Clean Underwater Ambience:
 * Smoothly shifts from sun-bleached coastal ocean navy at the surface,
 * through saturated twilight blue at mid-depth, to velvety midnight black in the abyssal zone,
 * accompanied by faint, organic rising bubbles.
 */
export function DeepSeaEnvironment() {
  const { scrollYProgress } = useScroll()
  const [scrollProgress, setScrollProgress] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(Math.min(1, Math.max(0, latest)))
  })

  // Surface (0): Crisp, sun-bleached coastal ocean navy (#132c44)
  // Mid-depth (0.5): Saturated twilight blue (#0a192f)
  // Abyssal Zone (1.0): Deep, velvety midnight black (#03060c)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#132c44', '#0a192f', '#03060c']
  )

  const sunlitSurfaceOpacity = useTransform(scrollYProgress, [0, 0.45, 0.85], [0.75, 0.2, 0])

  return (
    <motion.div
      aria-hidden="true"
      style={{ backgroundColor }}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-colors duration-200"
    >
      {/* Sun-Bleached Coastal Surface Light Bleed */}
      <motion.div
        style={{ opacity: sunlitSurfaceOpacity }}
        className="absolute inset-x-0 -top-32 h-[540px] bg-[radial-gradient(ellipse_at_top,rgba(186,230,253,0.22)_0%,rgba(56,189,248,0.08)_50%,transparent_80%)]"
      />

      {/* Faint, Organic Rising Bubbles */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <OrganicRisingBubbles count={480} scrollProgress={scrollProgress} />
      </Canvas>
    </motion.div>
  )
}
