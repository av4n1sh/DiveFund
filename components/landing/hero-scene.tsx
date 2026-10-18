'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, OrbitControls, TorusKnot, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

export interface HeroSceneProps {
  /** Normalized scroll progress within the hero section (0 at top, 1 when scrolled through) */
  scrollProgress?: number
}

function FundArtifactMesh({ scrollProgress = 0 }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const knotRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { viewport } = useThree()

  useFrame((state, delta) => {
    if (!groupRef.current || !knotRef.current || !ringRef.current) return

    // 1. Subtle mouse parallax (pointer values are normalized between -1 and 1)
    const parallaxX = state.pointer.x * 0.45
    const parallaxY = state.pointer.y * 0.35

    // 2. Scroll-driven horizontal slide to the right side of the viewport
    // Starts near center and glides smoothly to the right as scrollProgress moves 0 -> 1
    const baseOffset = viewport.width > 6 ? 0.45 : 0
    const maxRightOffset = Math.min(viewport.width * 0.28, 2.35)
    const targetX = baseOffset + scrollProgress * maxRightOffset + parallaxX * 0.35
    const targetY = parallaxY * 0.35

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.08)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08)

    // 3. Scroll-driven Y-axis rotation + mouse parallax tilt
    const targetRotationY = scrollProgress * Math.PI * 2.5 + parallaxX * 0.6
    const targetRotationX = -parallaxY * 0.5 + scrollProgress * 0.35

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.08)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.08)

    // Continuous subtle ambient rotation on the inner TorusKnot and outer coin ring
    knotRef.current.rotation.z += delta * 0.25
    ringRef.current.rotation.z -= delta * 0.18

    // 4. Smooth scale interpolation on hover
    const targetScale = hovered ? 1.16 : 1
    const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
    groupRef.current.scale.setScalar(nextScale)
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.35} floatIntensity={0.75} floatingRange={[-0.12, 0.12]}>
        <group
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Core abstract TorusKnot representing compounding & interconnected ETFs */}
          <TorusKnot ref={knotRef} args={[0.85, 0.26, 160, 32]} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={hovered ? '#5eead4' : '#38bdf8'}
              emissive="#0c4a6e"
              emissiveIntensity={hovered ? 0.55 : 0.3}
              roughness={0.18}
              metalness={0.75}
              clearcoat={1}
              clearcoatRoughness={0.12}
            />
          </TorusKnot>

          {/* Outer stylized coin/compass ring representing the "Fund" vessel */}
          <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.55, 0.06, 24, 96]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#78350f"
              emissiveIntensity={0.35}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>
      </Float>
    </group>
  )
}

export default function HeroScene({ scrollProgress = 0 }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      {/* Environment & directional lighting matching the deep-ocean aesthetic */}
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#bae6fd', '#082f49', 0.85]} />
      <directionalLight position={[10, 10, 5]} intensity={1.8} color="#e0f2fe" />
      <directionalLight position={[-8, -6, -4]} intensity={0.9} color="#2dd4bf" />
      <pointLight position={[0, 3, 3]} intensity={1.1} color="#fbbf24" />

      <FundArtifactMesh scrollProgress={scrollProgress} />

      <ContactShadows position={[0, -2.1, 0]} opacity={0.35} scale={10} blur={2.4} far={4} />

      {/* OrbitControls with zoom disabled so scroll wheel drives page scroll smoothly */}
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} />
    </Canvas>
  )
}
