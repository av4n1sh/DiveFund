'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { SpatialTiltCard } from '@/components/landing/SpatialTiltCard'
import { cn } from '@/lib/utils'

export type MaritimeArtifactType = 'helmet' | 'submarine' | 'anchor'

export interface SimpleMaritimeCharacterProps {
  name: string
  role: string
  specialty: string
  depthZone: string
  artifact: MaritimeArtifactType
  selected?: boolean
  onSelect?: () => void
}

/**
 * 1. Matte Old-School Diver's Helmet (Warm terracotta-bronze clay & brushed pewter)
 */
function VintageHelmetArtifact() {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Main Helmet Dome */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshStandardMaterial color="#b88655" roughness={0.74} metalness={0.22} />
      </mesh>
      {/* Flanged Neck Collar / Corselet */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.56, 0.78, 0.26, 28]} />
        <meshStandardMaterial color="#9c6d3e" roughness={0.78} metalness={0.2} />
      </mesh>
      {/* Front Circular Viewport Rim */}
      <mesh position={[0, 0.14, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.16, 24]} />
        <meshStandardMaterial color="#84592f" roughness={0.7} metalness={0.28} />
      </mesh>
      {/* Matte Slate Viewport Face */}
      <mesh position={[0, 0.14, 0.67]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 24]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.55} metalness={0.15} />
      </mesh>
      {/* Protective Cross Grille */}
      <mesh position={[0, 0.14, 0.7]}>
        <boxGeometry args={[0.48, 0.045, 0.03]} />
        <meshStandardMaterial color="#c49463" roughness={0.68} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.14, 0.7]}>
        <boxGeometry args={[0.045, 0.48, 0.03]} />
        <meshStandardMaterial color="#c49463" roughness={0.68} metalness={0.25} />
      </mesh>
      {/* Side Porthole Rims */}
      <mesh position={[-0.62, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 20]} />
        <meshStandardMaterial color="#84592f" roughness={0.72} metalness={0.25} />
      </mesh>
      <mesh position={[0.62, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 20]} />
        <meshStandardMaterial color="#84592f" roughness={0.72} metalness={0.25} />
      </mesh>
    </group>
  )
}

/**
 * 2. Minimalist Submarine Silhouette (Tactile matte sea-clay & warm ochre accents)
 */
function SubmarineArtifact() {
  return (
    <group rotation={[0, -0.35, 0.08]}>
      {/* Main Streamlined Hull */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.38, 1.05, 16, 28]} />
        <meshStandardMaterial color="#647886" roughness={0.78} metalness={0.15} />
      </mesh>
      {/* Conning Tower / Sail */}
      <mesh position={[0.08, 0.42, 0]}>
        <boxGeometry args={[0.42, 0.36, 0.22]} />
        <meshStandardMaterial color="#526573" roughness={0.8} metalness={0.15} />
      </mesh>
      {/* Periscope Mast */}
      <mesh position={[0.12, 0.7, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.28, 12]} />
        <meshStandardMaterial color="#b88655" roughness={0.65} metalness={0.3} />
      </mesh>
      <mesh position={[0.18, 0.82, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.12, 12]} />
        <meshStandardMaterial color="#b88655" roughness={0.65} metalness={0.3} />
      </mesh>
      {/* Forward Viewport Porthole */}
      <mesh position={[0.52, 0.05, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.06, 18]} />
        <meshStandardMaterial color="#b88655" roughness={0.68} metalness={0.25} />
      </mesh>
      {/* Stern Stabilizer Fins & Propeller Shroud */}
      <mesh position={[-0.78, 0, 0]}>
        <boxGeometry args={[0.22, 0.58, 0.05]} />
        <meshStandardMaterial color="#475866" roughness={0.8} metalness={0.15} />
      </mesh>
      <mesh position={[-0.78, 0, 0]}>
        <boxGeometry args={[0.22, 0.05, 0.58]} />
        <meshStandardMaterial color="#475866" roughness={0.8} metalness={0.15} />
      </mesh>
      <mesh position={[-0.92, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.16, 0.035, 12, 24]} />
        <meshStandardMaterial color="#b88655" roughness={0.7} metalness={0.25} />
      </mesh>
    </group>
  )
}

/**
 * 3. Classic Maritime Anchor & Driftwood Stock (Brushed sea-pewter & warm teak wood)
 */
function AnchorArtifact() {
  return (
    <group position={[0, 0.04, 0]}>
      {/* Top Shackle Ring */}
      <mesh position={[0, 0.78, 0]}>
        <torusGeometry args={[0.16, 0.045, 14, 28]} />
        <meshStandardMaterial color="#b88655" roughness={0.68} metalness={0.28} />
      </mesh>
      {/* Horizontal Carved Wood Stock */}
      <mesh position={[0, 0.46, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.92, 16]} />
        <meshStandardMaterial color="#9c6d3e" roughness={0.82} metalness={0.1} />
      </mesh>
      {/* Central Vertical Shank */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.075, 0.095, 1.32, 18]} />
        <meshStandardMaterial color="#738491" roughness={0.72} metalness={0.28} />
      </mesh>
      {/* Curved Bottom Crown Arc */}
      <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.52, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#738491" roughness={0.72} metalness={0.28} />
      </mesh>
      {/* Left & Right Flukes */}
      <mesh position={[-0.52, -0.14, 0]} rotation={[0, 0, 0.25]}>
        <coneGeometry args={[0.16, 0.32, 4]} />
        <meshStandardMaterial color="#738491" roughness={0.72} metalness={0.28} />
      </mesh>
      <mesh position={[0.52, -0.14, 0]} rotation={[0, 0, -0.25]}>
        <coneGeometry args={[0.16, 0.32, 4]} />
        <meshStandardMaterial color="#738491" roughness={0.72} metalness={0.28} />
      </mesh>
    </group>
  )
}

function TactileArtifactMesh({
  artifact,
  hovered,
  mouseRef,
}: {
  artifact: MaritimeArtifactType
  hovered: boolean
  mouseRef: React.RefObject<{ x: number; y: number }>
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Gentle, understated cursor-tracking tilt + slow idle rotation
    const targetRotY = mouseRef.current.x * 0.45 + (hovered ? 0.35 : 0)
    const targetRotX = -mouseRef.current.y * 0.3

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y + delta * 0.15,
      targetRotY,
      0.08
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08)

    const targetScale = hovered ? 1.08 : 0.96
    const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
    groupRef.current.scale.setScalar(nextScale)
  })

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef}>
        {artifact === 'helmet' && <VintageHelmetArtifact />}
        {artifact === 'submarine' && <SubmarineArtifact />}
        {artifact === 'anchor' && <AnchorArtifact />}
      </group>
    </Float>
  )
}

/**
 * SimpleMaritimeCharacter:
 * Pairs an understated, tactile matte maritime artifact (helmet, submarine, or anchor)
 * tightly integrated beside clean editorial profile typography.
 */
export function SimpleMaritimeCharacter({
  name,
  role,
  specialty,
  depthZone,
  artifact,
  selected = false,
  onSelect,
}: SimpleMaritimeCharacterProps) {
  const [hovered, setHovered] = useState(false)
  const mouseRef = useRef({ x: 0, y: 0 })

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

  return (
    <SpatialTiltCard
      tiltIntensity={5}
      shiftIntensity={7}
      hoverTranslateZ={36}
      className={cn(
        'rounded-2xl border bg-slate-900/65 p-5 backdrop-blur-md transition-colors',
        selected ? 'border-sky-300/60 bg-slate-900/85' : 'border-slate-800/80'
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect?.()
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex cursor-pointer items-center gap-4 text-left select-none"
      >
        {/* Compact, Understated Tactile Maritime Artifact */}
        <div className="relative size-22 shrink-0 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950/70">
          <Canvas camera={{ position: [0, 0, 2.75], fov: 38 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={1.1} color="#e2e8f0" />
            <directionalLight position={[3, 5, 4]} intensity={1.6} color="#fff7ed" />
            <directionalLight position={[-3, -2, 2]} intensity={0.6} color="#94a3b8" />
            <TactileArtifactMesh artifact={artifact} hovered={hovered || selected} mouseRef={mouseRef} />
          </Canvas>
        </div>

        {/* Tightly Integrated Profile Text Layout */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] tracking-wider text-sky-300/80 uppercase">{depthZone}</span>
            <span className="text-xs font-medium text-slate-400">{role}</span>
          </div>
          <h3 className="font-heading text-lg font-bold tracking-tight text-white">{name}</h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">{specialty}</p>
        </div>
      </div>
    </SpatialTiltCard>
  )
}

