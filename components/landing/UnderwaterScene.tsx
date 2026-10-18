'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Icosahedron, Octahedron, TorusKnot } from '@react-three/drei'
import * as THREE from 'three'

export interface UnderwaterSceneProps {
  /** Normalized global page scroll progress from 0 (surface) to 1 (deep trench) */
  scrollProgress: number
}

/**
 * Primary central glowing cyber-organic "Deep Sea Vault Core / Liquid Crystal Shard"
 * constructed with high-transmission refractive MeshPhysicalMaterial and an internal
 * bioluminescent energy core so refraction bends light visibly.
 */
function LiquidCrystalVaultCore({ scrollProgress }: { scrollProgress: number }) {
  const outerShardRef = useRef<THREE.Mesh>(null)
  const innerCoreRef = useRef<THREE.Mesh>(null)
  const orbitalRingRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!outerShardRef.current || !innerCoreRef.current || !orbitalRingRef.current || !groupRef.current) return

    const t = state.clock.elapsedTime

    // Cyber-organic slow rotation + cursor responsiveness
    outerShardRef.current.rotation.y += delta * 0.28
    outerShardRef.current.rotation.x = Math.sin(t * 0.5) * 0.25 + state.pointer.y * 0.3
    outerShardRef.current.rotation.z = Math.cos(t * 0.35) * 0.18 - state.pointer.x * 0.3

    // Counter-rotating internal bioluminescent knot (visible through refractive glass)
    innerCoreRef.current.rotation.y -= delta * 0.65
    innerCoreRef.current.rotation.z += delta * 0.4

    // Subtle gyroscopic ring tilt
    orbitalRingRef.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.7) * 0.2
    orbitalRingRef.current.rotation.z += delta * 0.35

    // Slight horizontal offset reacting to pointer and scroll
    const targetX = state.pointer.x * 0.55 + Math.sin(scrollProgress * Math.PI) * 1.15
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.06)
  })

  return (
    <group ref={groupRef} position={[0.9, -0.2, 0.5]}>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.85} floatingRange={[-0.22, 0.22]}>
        {/* Outer Liquid Crystal Shard: high transmission, refraction (IOR), and clearcoat */}
        <Octahedron ref={outerShardRef} args={[1.65, 2]}>
          <meshPhysicalMaterial
            color="#e0f2fe"
            emissive="#0369a1"
            emissiveIntensity={0.22}
            transmission={0.94}
            opacity={1}
            transparent
            ior={1.48}
            thickness={2.4}
            roughness={0.07}
            metalness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.06}
            iridescence={0.65}
            iridescenceIOR={1.35}
            attenuationColor="#0284c7"
            attenuationDistance={1.9}
          />
        </Octahedron>

        {/* Inner Bioluminescent Cyber-Organic Vault Core (refracted by outer crystal) */}
        <TorusKnot ref={innerCoreRef} args={[0.58, 0.17, 128, 24]}>
          <meshStandardMaterial
            color="#2dd4bf"
            emissive="#14b8a6"
            emissiveIntensity={1.6}
            roughness={0.2}
            metalness={0.85}
          />
        </TorusKnot>

        {/* Precision Hydro-Halo Ring */}
        <mesh ref={orbitalRingRef}>
          <torusGeometry args={[2.25, 0.025, 20, 120]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.1}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      </Float>
    </group>
  )
}

/**
 * Secondary deeper crystalline shards stationed along the camera's descent path
 * so diving down passes multiple spatial depth beacons.
 */
function DeepTrenchWaypoints() {
  const waypoints = useMemo(
    () => [
      { position: [-2.8, -3.6, -2.5] as [number, number, number], scale: 0.65, speed: 1.5 },
      { position: [2.9, -6.8, -4.8] as [number, number, number], scale: 0.85, speed: 1.2 },
      { position: [-2.1, -9.8, -7.2] as [number, number, number], scale: 0.72, speed: 1.7 },
      { position: [1.8, -12.6, -9.5] as [number, number, number], scale: 0.9, speed: 1.4 },
    ],
    []
  )

  return (
    <group>
      {waypoints.map((wp, idx) => (
        <Float key={idx} speed={wp.speed} rotationIntensity={0.8} floatIntensity={1.1}>
          <Icosahedron position={wp.position} args={[wp.scale, 1]}>
            <meshPhysicalMaterial
              color="#7dd3fc"
              emissive="#0e7490"
              emissiveIntensity={0.35}
              transmission={0.88}
              transparent
              ior={1.42}
              thickness={1.5}
              roughness={0.12}
              clearcoat={1}
            />
          </Icosahedron>
        </Float>
      ))}
    </group>
  )
}

/**
 * Illuminated deep-sea marine snow & micro-bubble swarm (<points>)
 * distributed throughout the 3D column to give immediate parallax depth cues
 * as the camera dives past them.
 */
function MarineSnowSwarm({ count = 900 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const spd = new Float32Array(count)

    const cyan = new THREE.Color('#5eead4')
    const sky = new THREE.Color('#38bdf8')
    const royal = new THREE.Color('#60a5fa')

    for (let i = 0; i < count; i++) {
      // Spread across wide X, deep vertical Y (-20 to +8), and deep Z (-16 to +8)
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = Math.random() * 28 - 20
      pos[i * 3 + 2] = Math.random() * 24 - 16

      spd[i] = 0.15 + Math.random() * 0.45

      const c = i % 3 === 0 ? cyan : i % 3 === 1 ? sky : royal
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return { positions: pos, colors: col, speeds: spd }
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const array = posAttr.array as Float32Array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      // Gentle upward buoyancy + subtle horizontal oceanic current drift
      array[idx + 1] += speeds[i] * delta
      array[idx] += Math.sin(t * 0.4 + i) * 0.0025

      // Wrap particles that rise above the surface back to the deep trench
      if (array[idx + 1] > 8) {
        array[idx + 1] = -20
      }
    }
    posAttr.needsUpdate = true

    // Subtle rotation responding to cursor
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(
      pointsRef.current.rotation.y,
      state.pointer.x * 0.08,
      0.04
    )
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.075}
        vertexColors
        transparent
        opacity={0.78}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * Scroll-linked Camera Dive controller:
 * Synchronizes the HTML scroll position with camera.position.z and camera.position.y,
 * plunging forward and downward past the central Liquid Crystal Vault Core and marine snow.
 */
function CameraDiveRig({ scrollProgress }: { scrollProgress: number }) {
  useFrame((state) => {
    // Plunge forward on Z (from +5.4 through 0 down to -6.2) and downward on Y (0 to -11.5)
    const targetZ = 5.4 - scrollProgress * 11.6
    const targetY = -scrollProgress * 11.5 + state.pointer.y * 0.35
    const targetX = state.pointer.x * 0.45

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.07)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.07)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.07)

    // Subtle roll/pitch as the camera dives deeper
    state.camera.rotation.z = THREE.MathUtils.lerp(
      state.camera.rotation.z,
      -state.pointer.x * 0.035,
      0.06
    )
    state.camera.rotation.x = THREE.MathUtils.lerp(
      state.camera.rotation.x,
      -scrollProgress * 0.12 + state.pointer.y * 0.04,
      0.06
    )
  })

  return null
}

export default function UnderwaterScene({ scrollProgress }: UnderwaterSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 48, near: 0.1, far: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="h-full w-full"
    >
      {/* Deep abyss fog that thickens with distance for authentic underwater spatial falloff */}
      <fog attach="fog" args={['#041326', 6, 26]} />

      {/* 1. Deep royal blue ambient & bottom hemisphere fill */}
      <ambientLight intensity={0.65} color="#1e3a8a" />
      <hemisphereLight args={['#2dd4bf', '#0a1931', 1.1]} />
      <directionalLight position={[0, -14, 2]} intensity={1.4} color="#1d4ed8" />

      {/* 2. Strong teal/cyan spotlight from top-left casting light down through the water column */}
      <spotLight
        position={[-9, 14, 9]}
        angle={0.55}
        penumbra={0.85}
        intensity={4.5}
        distance={40}
        color="#2dd4bf"
      />
      <pointLight position={[-5, 8, 6]} intensity={2.6} color="#38bdf8" />
      <pointLight position={[4, -6, -3]} intensity={1.8} color="#0284c7" />

      {/* Scroll-linked Camera Dive Controller */}
      <CameraDiveRig scrollProgress={scrollProgress} />

      {/* Primary Refractive Deep Sea Vault Core */}
      <LiquidCrystalVaultCore scrollProgress={scrollProgress} />

      {/* Deeper Crystalline Waypoints along the descent */}
      <DeepTrenchWaypoints />

      {/* Illuminated Deep-Sea Marine Snow Particle Swarm */}
      <MarineSnowSwarm count={900} />
    </Canvas>
  )
}

