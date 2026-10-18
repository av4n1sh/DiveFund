'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import * as THREE from 'three'

export interface DiverLoaderProps {
  isLoaded: boolean
  onComplete: () => void
  /** Duration of the plunge sequence in milliseconds (default: 2500) */
  durationMs?: number
}

/**
 * Stylized low-poly 3D Cyber-Diver model diving head-first into the abyssal void,
 * accompanied by a fast-forwarding camera rig and rushing slipstream particles.
 */
function PlungingDiverScene() {
  const diverGroupRef = useRef<THREE.Group>(null)
  const leftFinRef = useRef<THREE.Mesh>(null)
  const rightFinRef = useRef<THREE.Mesh>(null)
  const wakeRing1Ref = useRef<THREE.Mesh>(null)
  const wakeRing2Ref = useRef<THREE.Mesh>(null)
  const rushParticlesRef = useRef<THREE.Points>(null)

  const particleCount = 650
  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const spd = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14
      spd[i] = 16 + Math.random() * 22
    }
    return { positions: pos, speeds: spd }
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    // Normalized 0 -> 1 progress over the 2.5s plunge
    const plungeProgress = Math.min(1, t / 2.5)
    // Exponential acceleration curve
    const diveDepthY = -Math.pow(plungeProgress, 1.45) * 36

    if (diverGroupRef.current) {
      // Diver plunges downward along Y with subtle hydrodynamic banking
      diverGroupRef.current.position.y = diveDepthY
      diverGroupRef.current.position.x = Math.sin(t * 3.2) * 0.22
      diverGroupRef.current.rotation.z = Math.sin(t * 3.2) * 0.14
      diverGroupRef.current.rotation.y = t * 0.85
    }

    // Flutter kick animation on the diver's hydro-fins
    if (leftFinRef.current && rightFinRef.current) {
      leftFinRef.current.rotation.x = Math.sin(t * 18) * 0.42
      rightFinRef.current.rotation.x = -Math.sin(t * 18) * 0.42
    }

    // Expanding hydrodynamic shockwave rings trailing the diver
    if (wakeRing1Ref.current && wakeRing2Ref.current) {
      const cycle1 = (t * 2.4) % 1
      wakeRing1Ref.current.position.y = 0.8 + cycle1 * 2.4
      wakeRing1Ref.current.scale.setScalar(1 - cycle1 * 0.65)

      const cycle2 = ((t * 2.4) + 0.5) % 1
      wakeRing2Ref.current.position.y = 0.8 + cycle2 * 2.4
      wakeRing2Ref.current.scale.setScalar(1 - cycle2 * 0.65)
    }

    // Fast-forward camera downward alongside the diver into the oceanic void
    const targetCamY = diveDepthY + 1.35 - plungeProgress * 0.9
    const targetCamZ = 4.6 - plungeProgress * 1.45
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, 0.18)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.14)
    state.camera.position.x = Math.sin(t * 2.1) * 0.15
    state.camera.lookAt(0, diveDepthY - 1.2, 0)

    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = THREE.MathUtils.lerp(52, 74, plungeProgress)
      state.camera.updateProjectionMatrix()
    }

    // Rushing slipstream bubbles & depth streaks flying upward past the camera
    if (rushParticlesRef.current) {
      const posAttr = rushParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 1] += speeds[i] * delta
        if (arr[i * 3 + 1] > diveDepthY + 12) {
          arr[i * 3 + 1] = diveDepthY - 24
        }
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <>
      <fog attach="fog" args={['#020617', 3, 22]} />
      <ambientLight intensity={0.6} color="#0f172a" />
      <directionalLight position={[-5, 12, 6]} intensity={2.8} color="#22d3ee" />
      <pointLight position={[0, -6, 3]} intensity={2.2} color="#3b82f6" />

      {/* Stylized 3D Cyber-Diver Rig (Oriented Head-Down for the Plunge) */}
      <group ref={diverGroupRef} position={[0, 0, 0]}>
        {/* Diving Helmet & Glowing Cyan Visor (Bottom / Leading Edge of Plunge) */}
        <mesh position={[0, -0.85, 0]}>
          <octahedronGeometry args={[0.32, 2]} />
          <meshPhysicalMaterial
            color="#0f172a"
            metalness={0.85}
            roughness={0.15}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, -0.9, 0.18]} rotation={[0.25, 0, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#06b6d4"
            emissiveIntensity={2.8}
            roughness={0.1}
          />
        </mesh>

        {/* Hydrodynamic Armored Torso (Tapered Low-Poly Cone) */}
        <mesh position={[0, -0.22, 0]}>
          <coneGeometry args={[0.38, 1.05, 6]} />
          <meshPhysicalMaterial
            color="#1e293b"
            emissive="#083344"
            emissiveIntensity={0.45}
            metalness={0.8}
            roughness={0.22}
            clearcoat={0.9}
          />
        </mesh>

        {/* Twin Dorsal Oxygen & Hydro-Thruster Cylinders */}
        <mesh position={[-0.14, -0.18, -0.24]}>
          <cylinderGeometry args={[0.08, 0.08, 0.68, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} metalness={0.9} />
        </mesh>
        <mesh position={[0.14, -0.18, -0.24]}>
          <cylinderGeometry args={[0.08, 0.08, 0.68, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} metalness={0.9} />
        </mesh>

        {/* Swept-Back Streamlined Arms */}
        <mesh position={[-0.36, -0.32, 0]} rotation={[0, 0, -0.28]}>
          <capsuleGeometry args={[0.075, 0.58, 4, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.75} roughness={0.3} />
        </mesh>
        <mesh position={[0.36, -0.32, 0]} rotation={[0, 0, 0.28]}>
          <capsuleGeometry args={[0.075, 0.58, 4, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.75} roughness={0.3} />
        </mesh>

        {/* Articulated Legs & Glowing Cyan Hydro-Fins (Trailing Edge) */}
        <mesh ref={leftFinRef} position={[-0.16, 0.68, 0]}>
          <boxGeometry args={[0.18, 0.75, 0.04]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={1.6}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        <mesh ref={rightFinRef} position={[0.16, 0.68, 0]}>
          <boxGeometry args={[0.18, 0.75, 0.04]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={1.6}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Slipstream Shockwave Rings */}
        <mesh ref={wakeRing1Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.65, 0.018, 16, 64]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.65} />
        </mesh>
        <mesh ref={wakeRing2Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.014, 16, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
        </mesh>
      </group>

      {/* High-Velocity Vertical Slipstream Particles */}
      <points ref={rushParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#67e8f9"
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

export function DiverLoader({ isLoaded, onComplete, durationMs = 2500 }: DiverLoaderProps) {
  const [depthMeters, setDepthMeters] = useState(0)

  useEffect(() => {
    if (isLoaded) return

    const startTime = performance.now()
    let rafId = 0

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / durationMs)
      // Rapid depth counter: 0m -> 200m -> 1000m
      const eased = 1 - Math.pow(1 - progress, 2.2)
      setDepthMeters(Math.round(eased * 1000))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        onComplete()
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isLoaded, durationMs, onComplete])

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="deepfin-diver-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-slate-950 p-8 text-slate-100 select-none"
        >
          {/* Full-screen 3D Plunge Canvas */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <Canvas
              camera={{ position: [0, 1.5, 4.6], fov: 52 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: false }}
            >
              <color attach="background" args={['#020617']} />
              <PlungingDiverScene />
            </Canvas>
          </div>

          {/* Radial Vignette & Caustic Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(2,6,23,0.88)_100%)]"
          />

          {/* Top DEEPFIN Brand Header */}
          <div className="flex w-full max-w-5xl items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="size-2.5 animate-ping rounded-full bg-cyan-400" />
              <span className="font-heading text-sm font-extrabold tracking-[0.32em] text-cyan-300">
                DEEPFIN // TELEMETRY LINK
              </span>
            </div>
            <span className="font-mono text-xs text-slate-400">HYDRO-PRESSURE: NOMINAL</span>
          </div>

          {/* Center Digital Depth Meter & Status */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full border border-cyan-500/30 bg-slate-900/75 px-4 py-1 font-mono text-xs tracking-[0.28em] text-cyan-300 uppercase shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md">
              DESCENDING TO CORE...
            </div>
            <div className="font-heading text-7xl font-black tracking-tighter text-white tabular-nums drop-shadow-[0_0_35px_rgba(34,211,238,0.55)] sm:text-8xl">
              {depthMeters}
              <span className="ml-1 text-3xl font-bold text-cyan-400 sm:text-4xl">m</span>
            </div>
            <div className="h-1.5 w-64 overflow-hidden rounded-full border border-slate-800 bg-slate-900/90">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-75"
                style={{ width: `${Math.min(100, (depthMeters / 1000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="flex w-full max-w-5xl items-center justify-between border-t border-slate-800/80 pt-4 font-mono text-xs text-slate-400">
            <span>ZONE: {depthMeters < 200 ? 'EPIPELAGIC SHALLOWS' : depthMeters < 700 ? 'MESOPELAGIC TWILIGHT' : 'ABYSSAL TRENCH'}</span>
            <button
              type="button"
              onClick={onComplete}
              className="pointer-events-auto rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1 text-slate-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
            >
              SKIP PLUNGE →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

