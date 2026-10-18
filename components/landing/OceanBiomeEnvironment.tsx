"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OceanBiomeEnvironmentProps {
  scrollProgress: number;
}

/**
 * MarineSnowParticles
 * Glowing abyssal marine snow drifting gently upward through the dark water column.
 */
function MarineSnowParticles({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1400;

  const { positions, speeds, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 42;
      pos[i3 + 1] = (Math.random() - 0.5) * 36;
      pos[i3 + 2] = (Math.random() - 0.5) * 28 - 4;

      spd[i] = 0.008 + Math.random() * 0.018;
      phs[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, speeds: spd, phases: phs };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3 + 1] += speeds[i] + scrollProgress * 0.012;
      array[i3] += Math.sin(t * 0.45 + phases[i]) * 0.004;

      if (array[i3 + 1] > 18) {
        array[i3 + 1] = -18;
      }
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.012;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#38bdf8"
        transparent
        opacity={0.48}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface FishConfig {
  id: number;
  startY: number;
  z: number;
  speed: number;
  direction: 1 | -1;
  scale: number;
  phase: number;
}

/**
 * SparseFishSilhouettes
 * Sparse silhouettes of small deep-water fish swimming horizontally across the background water columns.
 */
function SparseFishSilhouettes({ scrollProgress }: { scrollProgress: number }) {
  const fishGroupRef = useRef<THREE.Group>(null);
  const fishRefs = useRef<(THREE.Group | null)[]>([]);
  const tailRefs = useRef<(THREE.Mesh | null)[]>([]);

  const fleet = useMemo<FishConfig[]>(
    () => [
      { id: 0, startY: 4.2, z: -8.5, speed: 0.9, direction: 1, scale: 0.42, phase: 0.4 },
      { id: 1, startY: 2.1, z: -12.0, speed: 0.65, direction: -1, scale: 0.34, phase: 1.7 },
      { id: 2, startY: -0.6, z: -9.8, speed: 1.05, direction: 1, scale: 0.38, phase: 3.1 },
      { id: 3, startY: -3.2, z: -14.2, speed: 0.72, direction: -1, scale: 0.48, phase: 4.5 },
      { id: 4, startY: 0.9, z: -11.4, speed: 0.84, direction: 1, scale: 0.3, phase: 5.2 },
      { id: 5, startY: -5.4, z: -10.5, speed: 0.78, direction: -1, scale: 0.36, phase: 2.3 },
      { id: 6, startY: 5.8, z: -13.5, speed: 0.6, direction: 1, scale: 0.4, phase: 0.9 },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    fleet.forEach((fish, idx) => {
      const node = fishRefs.current[idx];
      const tail = tailRefs.current[idx];
      if (!node) return;

      const span = 34;
      const rawX = ((t * fish.speed + fish.phase * 4) % span) - span / 2;
      node.position.x = rawX * fish.direction;
      node.position.y =
        fish.startY +
        Math.sin(t * 1.2 + fish.phase) * 0.28 +
        scrollProgress * 3.5;
      node.position.z = fish.z;

      node.rotation.y = fish.direction === 1 ? 0 : Math.PI;
      node.rotation.z = Math.sin(t * 2.2 + fish.phase) * 0.04;

      if (tail) {
        tail.rotation.y = Math.sin(t * 7.5 + fish.phase) * 0.32;
      }
    });
  });

  return (
    <group ref={fishGroupRef}>
      {fleet.map((fish, idx) => (
        <group
          key={fish.id}
          ref={(el) => {
            fishRefs.current[idx] = el;
          }}
          scale={fish.scale}
        >
          {/* Streamlined fish silhouette body */}
          <mesh scale={[1.65, 0.52, 0.28]}>
            <sphereGeometry args={[0.5, 16, 12]} />
            <meshStandardMaterial
              color="#040d1a"
              roughness={0.85}
              metalness={0.15}
              emissive="#082f49"
              emissiveIntensity={0.22}
            />
          </mesh>

          {/* Dorsal fin silhouette */}
          <mesh position={[-0.1, 0.26, 0]} rotation={[0, 0, 0.45]}>
            <coneGeometry args={[0.14, 0.35, 4]} />
            <meshStandardMaterial
              color="#030914"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>

          {/* Animated caudal tail fin */}
          <mesh
            ref={(el) => {
              tailRefs.current[idx] = el;
            }}
            position={[-0.85, 0, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            scale={[1, 1, 0.25]}
          >
            <coneGeometry args={[0.32, 0.48, 3]} />
            <meshStandardMaterial
              color="#030914"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>

          {/* Subtle bioluminescent lateral eye */}
          <mesh position={[0.52, 0.06, 0.12]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.9}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * AbyssalAnglerfish
 * Floating in the pitch-black abyssal zone at the bottom of the page scroll.
 * Features a built-in glowing bioluminescent lure (pointLight + high emissiveIntensity mesh)
 * that dynamically illuminates the dark water and its menacing deep-sea silhouette.
 */
function AbyssalAnglerfish({ scrollProgress }: { scrollProgress: number }) {
  const anglerGroupRef = useRef<THREE.Group>(null);
  const lureGroupRef = useRef<THREE.Group>(null);
  const lureMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const lureLightRef = useRef<THREE.PointLight>(null);
  const jawRef = useRef<THREE.Group>(null);

  const illiciumCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, 0.52, 0),
      new THREE.Vector3(0.75, 1.15, 0.05),
      new THREE.Vector3(1.38, 1.05, 0.08),
      new THREE.Vector3(1.68, 0.58, 0.06),
    ]);
  }, []);

  useFrame((state) => {
    if (!anglerGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Smoothly rises into view as user scrolls into the deep abyssal zone (0.45 -> 1.0)
    const abyssFactor = THREE.MathUtils.smoothstep(scrollProgress, 0.35, 0.92);
    const targetY = THREE.MathUtils.lerp(-9.5, -1.15, abyssFactor);
    const targetX = THREE.MathUtils.lerp(4.2, 2.35, abyssFactor);

    anglerGroupRef.current.position.x =
      THREE.MathUtils.lerp(anglerGroupRef.current.position.x, targetX, 0.05) +
      Math.sin(t * 0.45) * 0.02;
    anglerGroupRef.current.position.y =
      THREE.MathUtils.lerp(anglerGroupRef.current.position.y, targetY, 0.05) +
      Math.cos(t * 0.65) * 0.015;
    anglerGroupRef.current.position.z = -4.8;

    // Orient slightly toward the center viewer
    anglerGroupRef.current.rotation.y =
      Math.PI - 0.38 + Math.sin(t * 0.35) * 0.08;
    anglerGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.04;

    // Subtle organic breathing of the lower jaw
    if (jawRef.current) {
      jawRef.current.rotation.z = -0.28 + Math.sin(t * 1.4) * 0.06;
    }

    // Pulsating bioluminescent esca lure
    const pulse = 2.4 + Math.sin(t * 3.2) * 0.65;
    if (lureMatRef.current) {
      lureMatRef.current.emissiveIntensity = pulse;
    }
    if (lureLightRef.current) {
      lureLightRef.current.intensity = (2.8 + Math.sin(t * 3.2) * 0.9) * (0.35 + abyssFactor * 0.85);
    }
    if (lureGroupRef.current) {
      lureGroupRef.current.position.y = 0.58 + Math.sin(t * 2.4) * 0.04;
    }
  });

  return (
    <group ref={anglerGroupRef} position={[3.2, -9.5, -4.8]} scale={1.15}>
      {/* Heavy bulbous abyssal anglerfish silhouette body */}
      <mesh scale={[1.38, 1.05, 0.82]}>
        <sphereGeometry args={[0.92, 28, 24]} />
        <meshStandardMaterial
          color="#02060d"
          roughness={0.78}
          metalness={0.22}
          emissive="#031824"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Dorsal ridges */}
      {[-0.25, -0.55, -0.82].map((xOffset, i) => (
        <mesh
          key={i}
          position={[xOffset, 0.78 - i * 0.14, 0]}
          rotation={[0, 0, 0.45]}
        >
          <coneGeometry args={[0.14 - i * 0.02, 0.48 - i * 0.06, 5]} />
          <meshStandardMaterial color="#02050a" roughness={0.85} metalness={0.15} />
        </mesh>
      ))}

      {/* Caudal tail fin */}
      <mesh
        position={[-1.42, -0.05, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[1, 1, 0.22]}
      >
        <coneGeometry args={[0.58, 0.82, 4]} />
        <meshStandardMaterial color="#02050a" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Pectoral side fins */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[-0.1, -0.18, side * 0.72]}
          rotation={[side * 0.45, -side * 0.35, -0.2]}
          scale={[0.45, 0.25, 0.08]}
        >
          <sphereGeometry args={[0.6, 12, 10]} />
          <meshStandardMaterial color="#030812" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}

      {/* Upper jaw ridge & needle teeth */}
      <group position={[0.78, 0.06, 0]}>
        {[-0.26, -0.14, 0, 0.14, 0.26].map((zOff, i) => (
          <mesh
            key={i}
            position={[0.32 - Math.abs(zOff) * 0.45, -0.12, zOff]}
            rotation={[0, 0, Math.PI - 0.18]}
          >
            <coneGeometry args={[0.026, 0.22, 6]} />
            <meshStandardMaterial
              color="#94a3b8"
              roughness={0.35}
              metalness={0.4}
              emissive="#00f0ff"
              emissiveIntensity={0.18}
            />
          </mesh>
        ))}
      </group>

      {/*Protruding articulated lower jaw & upward needle fangs */}
      <group ref={jawRef} position={[0.55, -0.35, 0]} rotation={[0, 0, -0.28]}>
        <mesh position={[0.35, -0.08, 0]} scale={[0.72, 0.28, 0.56]}>
          <sphereGeometry args={[0.65, 18, 14]} />
          <meshStandardMaterial
            color="#02060d"
            roughness={0.76}
            metalness={0.25}
          />
        </mesh>
        {[-0.28, -0.15, 0, 0.15, 0.28].map((zOff, i) => (
          <mesh
            key={i}
            position={[0.68 - Math.abs(zOff) * 0.45, 0.14, zOff]}
            rotation={[0, 0, 0.22]}
          >
            <coneGeometry args={[0.03, 0.28, 6]} />
            <meshStandardMaterial
              color="#cbd5e1"
              roughness={0.3}
              metalness={0.45}
              emissive="#00f0ff"
              emissiveIntensity={0.24}
            />
          </mesh>
        ))}
      </group>

      {/* Pale milky abyssal eyes */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.72, 0.34, side * 0.46]}>
          <sphereGeometry args={[0.075, 14, 14]} />
          <meshStandardMaterial
            color="#bae6fd"
            emissive="#00f0ff"
            emissiveIntensity={0.85}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Arched Illicium Rod (fishing stalk) */}
      <mesh>
        <tubeGeometry args={[illiciumCurve, 28, 0.028, 10, false]} />
        <meshStandardMaterial
          color="#041322"
          roughness={0.65}
          metalness={0.3}
          emissive="#00f0ff"
          emissiveIntensity={0.22}
        />
      </mesh>

      {/* Bioluminescent Esca Lure (Built-in glowing light source + high emissive mesh) */}
      <group ref={lureGroupRef} position={[1.68, 0.58, 0.06]}>
        {/* Primary glowing lure core */}
        <mesh>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial
            ref={lureMatRef}
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={2.8}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>

        {/* Translucent outer bioluminescent aura */}
        <mesh>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#00f0ff"
            emissiveIntensity={1.2}
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>

        {/* Delicate glowing lure filaments */}
        {[-0.06, 0, 0.06].map((offset, idx) => (
          <mesh key={idx} position={[offset, -0.18, 0]} rotation={[0, 0, offset * 2]}>
            <cylinderGeometry args={[0.008, 0.002, 0.22, 6]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={2.0}
              transparent
              opacity={0.75}
            />
          </mesh>
        ))}

        {/* Dynamic pointLight illuminating the anglerfish jaws, silhouette, and surrounding dark water */}
        <pointLight
          ref={lureLightRef}
          color="#00f0ff"
          intensity={3.2}
          distance={9.5}
          decay={1.8}
        />
      </group>
    </group>
  );
}

/**
 * WaterColumnAtmosphere
 * Continuously shifts the background color and volumetric fog from deep ocean blue
 * to pitch-black abyssal depths as the user scrolls down the page.
 */
function WaterColumnAtmosphere({ scrollProgress }: { scrollProgress: number }) {
  const topColor = useMemo(() => new THREE.Color("#132c44"), []);
  const midColor = useMemo(() => new THREE.Color("#071526"), []);
  const abyssColor = useMemo(() => new THREE.Color("#000000"), []);
  const currentColor = useMemo(() => new THREE.Color("#132c44"), []);

  useFrame((state) => {
    if (scrollProgress < 0.5) {
      currentColor.lerpColors(topColor, midColor, scrollProgress * 2);
    } else {
      currentColor.lerpColors(midColor, abyssColor, (scrollProgress - 0.5) * 2);
    }

    if (state.scene.background instanceof THREE.Color) {
      state.scene.background.lerp(currentColor, 0.08);
    } else {
      state.scene.background = currentColor.clone();
    }

    if (state.scene.fog instanceof THREE.FogExp2) {
      state.scene.fog.color.lerp(currentColor, 0.08);
      state.scene.fog.density = THREE.MathUtils.lerp(
        0.042,
        0.068,
        scrollProgress
      );
    }
  });

  return (
    <>
      <color attach="background" args={["#132c44"]} />
      <fogExp2 attach="fog" args={["#132c44", 0.045]} />
      <ambientLight intensity={0.45 * (1 - scrollProgress * 0.72)} />
      <directionalLight
        position={[0, 14, 6]}
        intensity={1.15 * (1 - scrollProgress * 0.85)}
        color="#38bdf8"
      />
      <pointLight
        position={[-6, 4, -5]}
        intensity={0.65 * (1 - scrollProgress * 0.6)}
        color="#0284c7"
        distance={22}
      />
    </>
  );
}

export default function OceanBiomeEnvironment({
  scrollProgress,
}: OceanBiomeEnvironmentProps) {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #132c44 0%, #0a192f 52%, #000000 100%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <WaterColumnAtmosphere scrollProgress={scrollProgress} />
        <MarineSnowParticles scrollProgress={scrollProgress} />
        <SparseFishSilhouettes scrollProgress={scrollProgress} />
        <AbyssalAnglerfish scrollProgress={scrollProgress} />
      </Canvas>

      {/* Subtle abyssal vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_25%,rgba(0,0,0,0.72)_100%)]" />
    </div>
  );
}

