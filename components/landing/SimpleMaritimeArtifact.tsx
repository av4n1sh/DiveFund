'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { SpatialTiltCard } from '@/components/landing/SpatialTiltCard'
import { cn } from '@/lib/utils'

export type MaritimeArtifactVariant = 'helmet' | 'anchor' | 'compass'

export interface SimpleMaritimeArtifactProps {
  name: string
  role: string
  specialty: string
  depthZone: string
  artifact: MaritimeArtifactVariant
  selected?: boolean
  onSelect?: () => void
}

/**
 * 1. Simple Vintage Diving Helmet on a Matte Marine-Wood Plinth
 */
function VintageHelmetBaseMesh() {
  return (
    <group position={[0, -0.08, 0]}>
      {/* Turned Marine-Wood Display Plinth */}
      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[0.62, 0.72, 0.16, 24]} />
        <meshStandardMaterial color="#5c4028" roughness={0.85} metalness={0.08} />
      </mesh>
      {/* Brushed Antiqued Bronze Corselet Collar */}
      <mesh position={[0, -0.36, 0]}>
        <cylinderGeometry args={[0.5, 0.64, 0.24, 24]} />
        <meshStandardMaterial color="#96683c" roughness={0.65} metalness={0.38} />
      </mesh>
      {/* Rounded Scaphander Helmet Dome */}
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.62, 28, 28]} />
        <meshStandardMaterial color="#a87646" roughness={0.62} metalness={0.42} />
      </mesh>
      {/* Front Viewport Bezel & Diagonal X-Grille */}
      <group position={[0, 0.18, 0.54]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.31, 0.33, 0.14, 20]} />
          <meshStandardMaterial color="#c49555" roughness={0.55} metalness={0.48} />
        </mesh>
        <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.03, 20]} />
          <meshStandardMaterial color="#253542" roughness={0.45} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.08]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.44, 0.04, 0.025]} />
          <meshStandardMaterial color="#c49555" roughness={0.55} metalness={0.48} />
        </mesh>
        <mesh position={[0, 0, 0.08]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.44, 0.04, 0.025]} />
          <meshStandardMaterial color="#c49555" roughness={0.55} metalness={0.48} />
        </mesh>
      </group>
      {/* Top Crown Viewport */}
      <mesh position={[0, 0.64, 0.34]} rotation={[-0.7, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.1, 18]} />
        <meshStandardMaterial color="#c49555" roughness={0.55} metalness={0.48} />
      </mesh>
    </group>
  )
}

/**
 * 2. Smooth, Clean Admiralty Anchor Artifact (Matte Sea-Clay & Teak Stock)
 */
function CleanAnchorMesh() {
  return (
    <group position={[0, 0.04, 0]}>
      {/* Top Shackle Ring */}
      <mesh position={[0, 0.76, 0]}>
        <torusGeometry args={[0.16, 0.045, 14, 28]} />
        <meshStandardMaterial color="#b58952" roughness={0.62} metalness={0.35} />
      </mesh>
      {/* Horizontal Marine-Wood Stock */}
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.92, 16]} />
        <meshStandardMaterial color="#7a5434" roughness={0.82} metalness={0.08} />
      </mesh>
      {/* Vertical Shank */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.075, 0.095, 1.3, 18]} />
        <meshStandardMaterial color="#6e7f8c" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Curved Crown Arms */}
      <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.52, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#6e7f8c" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Twin Pointed Flukes */}
      <mesh position={[-0.52, -0.14, 0]} rotation={[0, 0, 0.25]}>
        <coneGeometry args={[0.16, 0.32, 4]} />
        <meshStandardMaterial color="#6e7f8c" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0.52, -0.14, 0]} rotation={[0, 0, -0.25]}>
        <coneGeometry args={[0.16, 0.32, 4]} />
        <meshStandardMaterial color="#6e7f8c" roughness={0.7} metalness={0.3} />
      </mesh>
    </group>
  )
}

/**
 * 3. Traditional Maritime Pocket Compass (Brushed Antiqued Brass & Warm Parchment Dial)
 */
function PocketCompassMesh() {
  return (
    <group rotation={[0.38, -0.22, 0]}>
      {/* Outer Brushed Brass Casing */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.74, 0.74, 0.22, 36]} />
        <meshStandardMaterial color="#b3864c" roughness={0.58} metalness={0.45} />
      </mesh>
      {/* Raised Brass Bezel Rim */}
      <mesh position={[0, 0, 0.11]}>
        <torusGeometry args={[0.68, 0.065, 16, 36]} />
        <meshStandardMaterial color="#9e7139" roughness={0.6} metalness={0.45} />
      </mesh>
      {/* Top Pocket-Chain Bow Ring & Crown Stem */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.16, 16]} />
        <meshStandardMaterial color="#9e7139" roughness={0.6} metalness={0.45} />
      </mesh>
      <mesh position={[0, 0.96, 0]}>
        <torusGeometry args={[0.14, 0.035, 12, 24]} />
        <meshStandardMaterial color="#b3864c" roughness={0.58} metalness={0.45} />
      </mesh>
      {/* Matte Warm Clay / Parchment Compass Dial Face */}
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.64, 0.64, 0.04, 32]} />
        <meshStandardMaterial color="#d6cbb8" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Cardinal Direction Markers */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.sin(angle) * 0.48, Math.cos(angle) * 0.48, 0.11]}
          rotation={[0, 0, -angle]}
        >
          <boxGeometry args={[0.05, 0.12, 0.02]} />
          <meshStandardMaterial color="#334155" roughness={0.75} />
        </mesh>
      ))}
      {/* Compass Needle (North Pointer + South Counterweight + Brass Pivot Cap) */}
      <group position={[0, 0, 0.13]} rotation={[0, 0, -0.45]}>
        <mesh position={[0, 0.2, 0]}>
          <coneGeometry args={[0.075, 0.42, 4]} />
          <meshStandardMaterial color="#8c3b2b" roughness={0.65} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.075, 0.42, 4]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.65} metalness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color="#b3864c" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

function ArtifactScene({
  artifact,
  hovered,
  mouseRef,
}: {
  artifact: MaritimeArtifactVariant
  hovered: boolean
  mouseRef: React.RefObject<{ x: number; y: number }>
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const targetRotY = mouseRef.current.x * 0.42 + (hovered ? 0.3 : 0)
    const targetRotX = -mouseRef.current.y * 0.28

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y + delta * 0.12,
      targetRotY,
      0.08
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08)

    const targetScale = hovered ? 1.07 : 0.96
    const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
    groupRef.current.scale.setScalar(nextScale)
  })

  return (
    <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.25}>
      <group ref={groupRef}>
        {artifact === 'helmet' && <VintageHelmetBaseMesh />}
        {artifact === 'anchor' && <CleanAnchorMesh />}
        {artifact === 'compass' && <PocketCompassMesh />}
      </group>
    </Float>
  )
}

/**
 * SimpleMaritimeArtifact:
 * Anchors a small, understated matte brass/wood/clay maritime icon
 * cleanly beside each profile text block.
 */
export function SimpleMaritimeArtifact({
  name,
  role,
  specialty,
  depthZone,
  artifact,
  selected = false,
  onSelect,
}: SimpleMaritimeArtifactProps) {
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
      tiltIntensity={4.5}
      shiftIntensity={6}
      hoverTranslateZ={32}
      className={cn(
        'rounded-2xl border bg-slate-900/65 p-5 backdrop-blur-md transition-colors',
        selected ? 'border-sky-300/55 bg-slate-900/85' : 'border-slate-800/80'
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
        {/* Small, Understated Tactile Maritime Icon */}
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950/75">
          <Canvas camera={{ position: [0, 0, 2.7], fov: 38 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={1.15} color="#f1f5f9" />
            <directionalLight position={[3, 5, 4]} intensity={1.65} color="#ffedd5" />
            <directionalLight position={[-3, -2, 2]} intensity={0.55} color="#94a3b8" />
            <ArtifactScene artifact={artifact} hovered={hovered || selected} mouseRef={mouseRef} />
          </Canvas>
        </div>

        {/* Clean Profile Typography */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] tracking-wider text-sky-300/80 uppercase">
              {depthZone}
            </span>
            <span className="text-xs font-medium text-slate-400">{role}</span>
          </div>
          <h3 className="font-heading text-lg font-bold tracking-tight text-white">{name}</h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">{specialty}</p>
        </div>
      </div>
    </SpatialTiltCard>
  )
}

