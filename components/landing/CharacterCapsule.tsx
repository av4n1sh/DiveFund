'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion, useSpring } from 'framer-motion'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

export type CyberDiverVariant = 'vanguard' | 'navigator' | 'abyssal'

export interface CharacterCapsuleProps {
  codename: string
  role: string
  specialty: string
  depthRating: string
  accentColor: string
  variant: CyberDiverVariant
  selected?: boolean
  onSelect?: () => void
}

interface HelmetMeshProps {
  variant: CyberDiverVariant
  accentColor: string
  active: boolean
  burstCount: number
  mouseRef: React.RefObject<{ x: number; y: number }>
}

function CyberDiverHelmetMesh({
  variant,
  accentColor,
  active,
  burstCount,
  mouseRef,
}: HelmetMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)
  const visorRingRef = useRef<THREE.Mesh>(null)
  const innerLightRef = useRef<THREE.PointLight>(null)
  const wireMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const ringMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const burstImpulseRef = useRef(0)
  const prevBurstRef = useRef(burstCount)

  useFrame((state, delta) => {
    if (!groupRef.current || !wireframeRef.current || !visorRingRef.current) return

    if (burstCount !== prevBurstRef.current) {
      prevBurstRef.current = burstCount
      burstImpulseRef.current = 1.0
    }
    burstImpulseRef.current = THREE.MathUtils.lerp(burstImpulseRef.current, 0, 0.06)

    // 1. Mouse Tracking: subtly rotate and tilt character mesh toward the user's cursor
    const pointerX = mouseRef.current.x
    const pointerY = mouseRef.current.y
    const targetRotY = pointerX * 0.75 + burstImpulseRef.current * Math.PI * 1.5
    const targetRotX = -pointerY * 0.55

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.09)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.09)

    // 2. Click/Hover Burst in 3D Z-space and scale
    const targetZ = active ? 0.65 + burstImpulseRef.current * 0.45 : 0
    const targetScale = active ? 1.16 + burstImpulseRef.current * 0.14 : 1.0
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.12)
    const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.12)
    groupRef.current.scale.setScalar(nextScale)

    // Internal wireframe counter-rotation (accelerates during hover/click burst)
    const spinSpeed = active ? 1.8 + burstImpulseRef.current * 4.0 : 0.45
    wireframeRef.current.rotation.y += delta * spinSpeed
    wireframeRef.current.rotation.x += delta * (spinSpeed * 0.6)

    visorRingRef.current.rotation.z -= delta * (active ? 1.4 : 0.35)

    // 3. Intensify internal bioluminescent light emission on hover/click
    const targetEmissive = active ? 3.8 + burstImpulseRef.current * 3.5 : 1.35
    if (wireMatRef.current) {
      wireMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        wireMatRef.current.emissiveIntensity,
        targetEmissive,
        0.12
      )
    }
    if (ringMatRef.current) {
      ringMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        ringMatRef.current.emissiveIntensity,
        targetEmissive * 0.85,
        0.12
      )
    }
    if (innerLightRef.current) {
      innerLightRef.current.intensity = THREE.MathUtils.lerp(
        innerLightRef.current.intensity,
        active ? 6.5 + burstImpulseRef.current * 5 : 1.8,
        0.12
      )
    }
  })

  return (
    <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.55}>
      <group ref={groupRef}>
        {/* Internal Bioluminescent Point Light */}
        <pointLight ref={innerLightRef} color={accentColor} intensity={1.8} distance={5} />

        {/* Outer Refractive Glass Diving Helmet / Capsule Shell */}
        <mesh>
          <sphereGeometry args={[1.08, 48, 48]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            emissive={accentColor}
            emissiveIntensity={active ? 0.25 : 0.08}
            transmission={0.93}
            opacity={1}
            transparent
            ior={1.46}
            thickness={1.8}
            roughness={0.07}
            metalness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.05}
            iridescence={0.6}
          />
        </mesh>

        {/* Embedded Glowing Neon Internal Wireframe Core (Unique per Cyber-Diver Identity) */}
        <mesh ref={wireframeRef}>
          {variant === 'vanguard' && <icosahedronGeometry args={[0.62, 1]} />}
          {variant === 'navigator' && <torusKnotGeometry args={[0.42, 0.13, 80, 16]} />}
          {variant === 'abyssal' && <octahedronGeometry args={[0.66, 2]} />}
          <meshStandardMaterial
            ref={wireMatRef}
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1.35}
            wireframe
          />
        </mesh>

        {/* Futuristic Cyber-Diver Visor & Collar Rings */}
        <mesh ref={visorRingRef} rotation={[Math.PI / 2.2, 0.2, 0]}>
          <torusGeometry args={[1.24, 0.032, 20, 96]} />
          <meshStandardMaterial
            ref={ringMatRef}
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        <mesh position={[0, -0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.76, 0.06, 16, 64]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

/**
 * CharacterCapsule:
 * Replaces static text names/team profiles with an interactive 3D glass Cyber-Diver capsule.
 * Tracks cursor coordinates globally and triggers a spring-physics Z-space burst
 * and bioluminescent emission flare on hover or click.
 */
export function CharacterCapsule({
  codename,
  role,
  specialty,
  depthRating,
  accentColor,
  variant,
  selected = false,
  onSelect,
}: CharacterCapsuleProps) {
  const [hovered, setHovered] = useState(false)
  const [burstCount, setBurstCount] = useState(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  const active = hovered || selected

  // Spring physics for the outer capsule container pulling forward on hover/click
  const translateZ = useSpring(0, { stiffness: 280, damping: 20, mass: 0.55 })
  const scale = useSpring(1, { stiffness: 280, damping: 20, mass: 0.55 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    translateZ.set(active ? 55 : 0)
    scale.set(active ? 1.04 : 1)
  }, [active, translateZ, scale])

  const handleClick = () => {
    setBurstCount((c) => c + 1)
    translateZ.set(85)
    setTimeout(() => translateZ.set(55), 220)
    onSelect?.()
  }

  return (
    <div style={{ perspective: '1200px' }} className="perspective-[1200px]">
      <motion.div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          z: translateZ,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          'group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/65 p-6 backdrop-blur-md transition-[border-color,box-shadow] duration-300 select-none',
          active
            ? 'z-30 border-cyan-400/60 shadow-[0_32px_80px_-12px_rgba(34,211,238,0.38)]'
            : 'z-10 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.75)]'
        )}
      >
        {/* Top Status Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 font-mono text-[11px] tracking-widest text-cyan-300 uppercase">
            {depthRating}
          </span>
          <span
            className="size-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
            style={{
              backgroundColor: accentColor,
              boxShadow: active ? `0 0 16px ${accentColor}` : 'none',
            }}
          />
        </div>

        {/* Interactive 3D Cyber-Diver Helmet Canvas */}
        <div className="relative my-2 h-56 w-full">
          <Canvas camera={{ position: [0, 0, 3.5], fov: 42 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={0.7} color="#0f172a" />
            <directionalLight position={[4, 6, 5]} intensity={2.2} color="#e0f2fe" />
            <directionalLight position={[-4, -4, -2]} intensity={1.1} color={accentColor} />
            <CyberDiverHelmetMesh
              variant={variant}
              accentColor={accentColor}
              active={active}
              burstCount={burstCount}
              mouseRef={mouseRef}
            />
          </Canvas>
        </div>

        {/* Cyber-Diver Identity & Telemetry Readout */}
        <div className="mt-auto flex flex-col gap-1.5 border-t border-slate-800/80 pt-4">
          <div className="flex items-baseline justify-between">
            <h3 className="font-heading text-xl font-bold tracking-tight text-white group-hover:text-cyan-300">
              {codename}
            </h3>
            <span className="font-mono text-xs text-cyan-400/90">{role}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">{specialty}</p>
          <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-slate-500">
            <span>{active ? 'BIOLUMINESCENCE: MAX' : 'HOVER OR CLICK TO PULSE'}</span>
            <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">ENGAGE →</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

