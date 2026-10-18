"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";

interface DiverPlungeLoaderProps {
  onComplete: () => void;
  durationMs?: number;
}

/**
 * VintageHeavyDiver (Captain Silas)
 * Authentic historical heavy-suit scaphander diver:
 * - Bulky canvas diving dress (matte olive/ochre heavy fabric)
 * - Heavy leather & lead chest/back weights with shoulder straps
 * - Weighted lead-soled brass safety boots
 * - Signature bronze/copper 3-bolt rounded scaphander helmet with grated viewports
 * - Driven by depth progress: helmet viewports & safety gauges ignite with vibrant
 *   neon-cyan (#00f0ff) bioluminescence (.emissiveIntensity up to 2.5) as depth crosses 1,000m -> 2,500m.
 */
function VintageHeavyDiver({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const diverGroupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // Refs for bioluminescent materials and point lights (Viewports + Safety Gauges)
  const frontViewportMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const leftViewportMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const rightViewportMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const chestGaugeMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wristGaugeMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const helmetGlowLightRef = useRef<THREE.PointLight>(null);

  const materials = useMemo(() => {
    const bronze = new THREE.MeshStandardMaterial({
      color: "#b87333",
      metalness: 0.78,
      roughness: 0.32,
    });
    const agedBrass = new THREE.MeshStandardMaterial({
      color: "#c59b27",
      metalness: 0.82,
      roughness: 0.28,
    });
    const canvasSuit = new THREE.MeshStandardMaterial({
      color: "#5c5346",
      metalness: 0.08,
      roughness: 0.88,
    });
    const heavyLeather = new THREE.MeshStandardMaterial({
      color: "#2b1d14",
      metalness: 0.15,
      roughness: 0.75,
    });
    const leadWeight = new THREE.MeshStandardMaterial({
      color: "#2f353b",
      metalness: 0.65,
      roughness: 0.48,
    });

    return {
      bronze,
      agedBrass,
      canvasSuit,
      heavyLeather,
      leadWeight,
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const progress = progressRef.current; // 0 -> 1 (0m -> 2,500m)

    if (diverGroupRef.current) {
      // Subtle suspended deep-water drift — diver stays centered in wide-angle frame
      diverGroupRef.current.position.y = Math.sin(t * 1.4) * 0.08;
      diverGroupRef.current.position.x = Math.cos(t * 0.9) * 0.04;
      diverGroupRef.current.rotation.y = Math.sin(t * 0.6) * 0.22;
      diverGroupRef.current.rotation.z = Math.cos(t * 0.8) * 0.04;
      diverGroupRef.current.rotation.x = 0.08 + Math.sin(t * 1.1) * 0.03;
    }

    // Slow underwater limb articulation
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = 0.28 + Math.sin(t * 1.5) * 0.08;
      leftArmRef.current.rotation.x = -0.18 + Math.cos(t * 1.2) * 0.08;
      rightArmRef.current.rotation.z = -0.28 - Math.sin(t * 1.5) * 0.08;
      rightArmRef.current.rotation.x = -0.25 - Math.cos(t * 1.2) * 0.08;
    }
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t * 1.5) * 0.12;
      rightLegRef.current.rotation.x = -Math.sin(t * 1.5) * 0.12;
    }

    // ABYSSAL BIOLUMINESCENT GLOW:
    // Ramps up smoothly as diver crosses 1,000m (progress = 0.4) down to 2,500m (progress = 1.0)
    const glowFactor = THREE.MathUtils.smoothstep(progress, 0.32, 0.92);
    const pulse = 1 + Math.sin(t * 4.0) * 0.12;
    const emissiveIntensity = glowFactor * 2.5 * pulse;

    const biolumColor = new THREE.Color("#00f0ff");
    const baseGlassColor = new THREE.Color("#0f2942").lerp(
      biolumColor,
      glowFactor
    );

    const mats = [
      frontViewportMatRef.current,
      leftViewportMatRef.current,
      rightViewportMatRef.current,
      chestGaugeMatRef.current,
      wristGaugeMatRef.current,
    ];

    for (const mat of mats) {
      if (mat) {
        mat.color.copy(baseGlassColor);
        mat.emissive.copy(biolumColor);
        mat.emissiveIntensity = emissiveIntensity;
      }
    }

    if (helmetGlowLightRef.current) {
      helmetGlowLightRef.current.intensity = glowFactor * 3.8 * pulse;
    }
  });

  return (
    <group ref={diverGroupRef} scale={0.78} position={[0, 0.1, 0]}>
      {/* Dynamic point light cast from the glowing scaphander helmet into the abyss */}
      <pointLight
        ref={helmetGlowLightRef}
        position={[0, 1.45, 0.85]}
        color="#00f0ff"
        intensity={0}
        distance={6}
        decay={2}
      />

      {/* ============================================================
          1. THREE-BOLT BRONZE SCAPHANDER HELMET & CORSELET
         ============================================================ */}
      <group position={[0, 1.45, 0]}>
        {/* Domed Copper/Bronze Scaphander Sphere */}
        <mesh material={materials.bronze} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
        </mesh>

        {/* Moulded Bronze Corselet (Shoulder Breastplate) */}
        <mesh
          position={[0, -0.42, 0]}
          material={materials.bronze}
          castShadow
        >
          <cylinderGeometry args={[0.38, 0.62, 0.3, 28]} />
        </mesh>

        {/* Three Signature Heavy Hex Bolts on Front Corselet Rim */}
        {[-0.26, 0, 0.26].map((xPos, idx) => (
          <mesh
            key={idx}
            position={[xPos, -0.45, 0.48 - Math.abs(xPos) * 0.25]}
            rotation={[0.3, 0, 0]}
            material={materials.agedBrass}
          >
            <cylinderGeometry args={[0.045, 0.045, 0.08, 6]} />
          </mesh>
        ))}

        {/* Front Faceplate Viewport Housing */}
        <group position={[0, 0.02, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.agedBrass}>
            <cylinderGeometry args={[0.24, 0.26, 0.12, 24]} />
          </mesh>
          {/* Glowing Bioluminescent Viewport Glass */}
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.02, 24]} />
            <meshStandardMaterial
              ref={frontViewportMatRef}
              color="#0f2942"
              emissive="#00f0ff"
              emissiveIntensity={0}
              roughness={0.15}
              metalness={0.2}
            />
          </mesh>
          {/* Grated Brass Protection Bars (Horizontal & Vertical) */}
          {[-0.09, 0, 0.09].map((offset, i) => (
            <React.Fragment key={i}>
              <mesh
                position={[offset, 0.07, 0]}
                rotation={[0, 0, Math.PI / 2]}
                material={materials.agedBrass}
              >
                <cylinderGeometry args={[0.014, 0.014, 0.4, 8]} />
              </mesh>
              <mesh
                position={[0, 0.07, offset]}
                material={materials.agedBrass}
              >
                <cylinderGeometry args={[0.014, 0.014, 0.4, 8]} />
              </mesh>
            </React.Fragment>
          ))}
        </group>

        {/* Left & Right Side Grated Viewports */}
        {[-1, 1].map((side) => (
          <group
            key={side}
            position={[side * 0.47, 0.04, 0]}
            rotation={[0, 0, -side * (Math.PI / 2)]}
          >
            <mesh material={materials.agedBrass}>
              <cylinderGeometry args={[0.17, 0.19, 0.1, 20]} />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.02, 20]} />
              <meshStandardMaterial
                ref={side === -1 ? leftViewportMatRef : rightViewportMatRef}
                color="#0f2942"
                emissive="#00f0ff"
                emissiveIntensity={0}
                roughness={0.15}
                metalness={0.2}
              />
            </mesh>
            {[-0.05, 0.05].map((bar, bIdx) => (
              <mesh
                key={bIdx}
                position={[bar, 0.06, 0]}
                rotation={[0, 0, Math.PI / 2]}
                material={materials.agedBrass}
              >
                <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Air Hose Intake Manifold & Regulating Exhaust Valve */}
        <mesh
          position={[0.38, -0.15, -0.25]}
          rotation={[0.4, 0, -0.5]}
          material={materials.agedBrass}
        >
          <cylinderGeometry args={[0.06, 0.06, 0.28, 12]} />
        </mesh>
      </group>

      {/* ============================================================
          2. BULKY CANVAS DIVING DRESS TORSO & CHEST WEIGHTS
         ============================================================ */}
      <group position={[0, 0.22, 0]}>
        {/* Heavy Canvas Torso */}
        <mesh material={materials.canvasSuit} castShadow>
          <cylinderGeometry args={[0.52, 0.46, 1.5, 24]} />
        </mesh>

        {/* Leather Harness Straps over Shoulders */}
        {[-0.28, 0.28].map((xOffset, idx) => (
          <mesh
            key={idx}
            position={[xOffset, 0.25, 0]}
            material={materials.heavyLeather}
          >
            <boxGeometry args={[0.12, 1.05, 0.98]} />
          </mesh>
        ))}

        {/* Heavy Front Lead Chest Weight + Illuminated Pressure Gauge */}
        <group position={[0, 0.2, 0.5]}>
          <mesh material={materials.leadWeight} castShadow>
            <boxGeometry args={[0.54, 0.44, 0.14]} />
          </mesh>
          {/* Circular Brass Safety Depth/Pressure Gauge on Chest Weight */}
          <group position={[0.14, 0.06, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh material={materials.agedBrass}>
              <cylinderGeometry args={[0.1, 0.1, 0.04, 20]} />
            </mesh>
            <mesh position={[0, 0.022, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.01, 20]} />
              <meshStandardMaterial
                ref={chestGaugeMatRef}
                color="#0f2942"
                emissive="#00f0ff"
                emissiveIntensity={0}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>

        {/* Heavy Back Lead Ballast Weight */}
        <mesh
          position={[0, 0.2, -0.5]}
          material={materials.leadWeight}
          castShadow
        >
          <boxGeometry args={[0.54, 0.44, 0.14]} />
        </mesh>

        {/* Heavy Leather Waist Belt & Brass Buckle */}
        <mesh position={[0, -0.52, 0]} material={materials.heavyLeather}>
          <cylinderGeometry args={[0.49, 0.49, 0.18, 24]} />
        </mesh>
        <mesh position={[0, -0.52, 0.49]} material={materials.agedBrass}>
          <boxGeometry args={[0.18, 0.2, 0.06]} />
        </mesh>
      </group>

      {/* ============================================================
          3. ARTICULATED ARMS, BRASS CUFFS & WRIST SAFETY GAUGE
         ============================================================ */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.64, 0.78, 0]}>
        <mesh position={[0, -0.35, 0]} material={materials.canvasSuit}>
          <cylinderGeometry args={[0.17, 0.15, 0.75, 16]} />
        </mesh>
        <mesh position={[0, -0.85, 0.06]} material={materials.canvasSuit}>
          <cylinderGeometry args={[0.15, 0.13, 0.65, 16]} />
        </mesh>
        {/* Brass Wrist Cuff Ring */}
        <mesh position={[0, -1.12, 0.06]} material={materials.agedBrass}>
          <cylinderGeometry args={[0.145, 0.145, 0.1, 16]} />
        </mesh>
        {/* Glowing Bioluminescent Wrist Decompression Gauge */}
        <group
          position={[-0.14, -1.02, 0.12]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <mesh material={materials.agedBrass}>
            <cylinderGeometry args={[0.075, 0.075, 0.04, 16]} />
          </mesh>
          <mesh position={[0, 0.022, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
            <meshStandardMaterial
              ref={wristGaugeMatRef}
              color="#0f2942"
              emissive="#00f0ff"
              emissiveIntensity={0}
              roughness={0.2}
            />
          </mesh>
        </group>
        {/* Heavy Canvas & Leather Three-Fingered Diving Mitt */}
        <mesh position={[0, -1.28, 0.06]} material={materials.heavyLeather}>
          <sphereGeometry args={[0.15, 16, 16]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.64, 0.78, 0]}>
        <mesh position={[0, -0.35, 0]} material={materials.canvasSuit}>
          <cylinderGeometry args={[0.17, 0.15, 0.75, 16]} />
        </mesh>
        <mesh position={[0, -0.85, 0.06]} material={materials.canvasSuit}>
          <cylinderGeometry args={[0.15, 0.13, 0.65, 16]} />
        </mesh>
        <mesh position={[0, -1.12, 0.06]} material={materials.agedBrass}>
          <cylinderGeometry args={[0.145, 0.145, 0.1, 16]} />
        </mesh>
        <mesh position={[0, -1.28, 0.06]} material={materials.heavyLeather}>
          <sphereGeometry args={[0.15, 16, 16]} />
        </mesh>
      </group>

      {/* ============================================================
          4. HEAVY CANVAS LEGS & LEAD-SOLED BRASS SAFETY BOOTS
         ============================================================ */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.24, -0.52, 0]}>
        <mesh position={[0, -0.45, 0]} material={materials.canvasSuit}>
          <cylinderGeometry args={[0.21, 0.18, 0.9, 16]} />
        </mesh>
        <mesh position={[0, -1.05, 0]} material={materials.canvasSuit}>
          <cylinderGeometry args={[0.18, 0.16, 0.75, 16]} />
        </mesh>
        {/* Leather Knee Reinforcement Patch */}
        <mesh position={[0, -0.75, 0.16]} material={materials.heavyLeather}>
          <boxGeometry args={[0.22, 0.24, 0.06]} />
        </mesh>
        {/* Weighted Safety Boot with Brass Toe Cap & Lead Sole */}
        <group position={[0, -1.5, 0.08]}>
          <mesh material={materials.heavyLeather}>
            <boxGeometry args={[0.26, 0.24, 0.46]} />
          </mesh>
          <mesh position={[0, -0.02, 0.18]} material={materials.agedBrass}>
            <sphereGeometry args={[0.14, 16, 16]} />
          </mesh>
          <mesh position={[0, -0.14, 0]} material={materials.leadWeight}>
            <boxGeometry args={[0.28, 0.07, 0.5]} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.24, -0.52, 0]}>
        <mesh position={[0, -0.45, 0]} material={materials.canvasSuit}>
          <cylinderGeometry args={[0.21, 0.18, 0.9, 16]} />
        </mesh>
        <mesh position={[0, -1.05, 0]} material={materials.canvasSuit}>
          <cylinderGeometry args={[0.18, 0.16, 0.75, 16]} />
        </mesh>
        <mesh position={[0, -0.75, 0.16]} material={materials.heavyLeather}>
          <boxGeometry args={[0.22, 0.24, 0.06]} />
        </mesh>
        <group position={[0, -1.5, 0.08]}>
          <mesh material={materials.heavyLeather}>
            <boxGeometry args={[0.26, 0.24, 0.46]} />
          </mesh>
          <mesh position={[0, -0.02, 0.18]} material={materials.agedBrass}>
            <sphereGeometry args={[0.14, 16, 16]} />
          </mesh>
          <mesh position={[0, -0.14, 0]} material={materials.leadWeight}>
            <boxGeometry args={[0.28, 0.07, 0.5]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * AscendingWaterColumnParticles
 * Streams marine particles & micro-bubbles rapidly upward past the diver
 * to create the sensation of a 2,500m vertical plunge while the wide-angle
 * camera stays permanently locked on the full body.
 */
function AscendingWaterColumnParticles({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const count = 420;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const speed = 5.5 + progressRef.current * 4.5;

    for (let i = 0; i < count; i++) {
      const yIdx = i * 3 + 1;
      array[yIdx] += speed * delta;
      if (array[yIdx] > 7) {
        array[yIdx] = -7;
      }
    }
    posAttr.needsUpdate = true;

    if (matRef.current) {
      const glowFactor = THREE.MathUtils.smoothstep(
        progressRef.current,
        0.35,
        0.95
      );
      matRef.current.color.lerpColors(
        new THREE.Color("#7dd3fc"),
        new THREE.Color("#00f0ff"),
        glowFactor
      );
      matRef.current.opacity = 0.45 + glowFactor * 0.35;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.055}
        color="#7dd3fc"
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * AbyssalSceneController
 * Permanently locks the wide-angle camera at [0, 0, 7.5] (FOV 45)
 * and transitions the water background and fog from deep navy (#020617)
 * into pitch-black abyssal darkness (#000000) as depth reaches 2,500m.
 */
function AbyssalSceneController({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  const surfaceColor = useMemo(() => new THREE.Color("#020617"), []);
  const abyssColor = useMemo(() => new THREE.Color("#000000"), []);
  const currentBgColor = useMemo(() => new THREE.Color("#020617"), []);

  useFrame((state) => {
    const progress = progressRef.current;

    // Permanently zoomed-out wide-angle framing of the full vintage suit
    state.camera.position.set(0, 0, 7.5);
    state.camera.lookAt(0, 0, 0);

    // Darken background from #020617 to pitch black #000000 past 1,000m
    const darknessMix = THREE.MathUtils.smoothstep(progress, 0.25, 0.85);
    currentBgColor.lerpColors(surfaceColor, abyssColor, darknessMix);
    state.scene.background = currentBgColor;

    if (state.scene.fog instanceof THREE.Fog) {
      state.scene.fog.color.copy(currentBgColor);
    }

    // Dim surface sunlight as we enter the midnight trench so the #00f0ff helmet glow dominates
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        0.75,
        0.14,
        darknessMix
      );
    }
    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.lerp(
        1.6,
        0.25,
        darknessMix
      );
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        0.9,
        1.4,
        darknessMix
      );
    }
  });

  return (
    <>
      <fog attach="fog" args={["#020617", 5, 16]} />
      <ambientLight ref={ambientRef} intensity={0.75} />
      <directionalLight
        ref={keyLightRef}
        position={[3, 6, 5]}
        intensity={1.6}
        color="#bae6fd"
      />
      <directionalLight
        ref={rimLightRef}
        position={[-4, 2, -3]}
        intensity={0.9}
        color="#00f0ff"
      />
    </>
  );
}

export function DiverPlungeLoader({
  onComplete,
  durationMs = 5500,
}: DiverPlungeLoaderProps) {
  const progressRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);
  const [depthMeters, setDepthMeters] = useState<number>(0);
  const [exiting, setExiting] = useState<boolean>(false);

  useEffect(() => {
    // Lock page scroll while the 5.5s full-screen intro sequence is mounted
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, Math.max(0, elapsed / durationMs));
      // Smooth cubic ease-in-out for depth counter (0m -> 2,500m)
      const eased =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      progressRef.current = eased;
      setDepthMeters(Math.round(eased * 2500));

      if (elapsed < durationMs) {
        rafId = requestAnimationFrame(tick);
      } else {
        // At exactly 5.5 seconds, trigger Framer Motion exit animation
        setExiting(true);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [durationMs]);

  const finalizeUnmount = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    document.body.style.overflow = "unset";
    document.documentElement.style.overflow = "unset";
    onComplete();
  };

  const handleSkip = () => {
    setExiting(true);
    finalizeUnmount();
  };

  const isAbyssal = depthMeters >= 1000;

  return (
    <AnimatePresence onExitComplete={finalizeUnmount}>
      {!exiting && (
        <motion.div
          key="diver-plunge-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 w-screen h-screen z-50 overflow-hidden bg-slate-950"
        >
          {/* Full-Viewport 3D Canvas */}
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 45 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            className="h-full w-full"
          >
            <AbyssalSceneController progressRef={progressRef} />
            <VintageHeavyDiver progressRef={progressRef} />
            <AscendingWaterColumnParticles progressRef={progressRef} />
            <Environment preset="night" />
          </Canvas>

          {/* HUD Telemetry Overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
            {/* Top Bar: DiveFund Identity + Skip Control */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 rounded-full border border-slate-800/80 bg-slate-950/75 px-4 py-2 backdrop-blur-md">
                <span
                  className={`h-2 w-2 rounded-full transition-colors duration-500 ${
                    isAbyssal
                      ? "bg-cyan-400 shadow-[0_0_12px_#00f0ff]"
                      : "bg-sky-400"
                  }`}
                />
                <span className="font-mono text-xs tracking-[0.22em] text-slate-200 uppercase">
                  DiveFund • Captain Silas Descent Telemetry
                </span>
              </div>

              <button
                type="button"
                onClick={handleSkip}
                className="pointer-events-auto cursor-pointer rounded-full border border-slate-800/80 bg-slate-950/75 px-4 py-2 font-mono text-xs tracking-wider text-slate-300 uppercase backdrop-blur-md transition-colors hover:border-cyan-400/60 hover:text-white"
              >
                Surface Skip →
              </button>
            </div>

            {/* Bottom Telemetry Readout: Real-time Depth Counter & Bioluminescence Status */}
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/75 p-5 backdrop-blur-md">
                <span className="font-mono text-xs tracking-[0.2em] text-slate-400 uppercase">
                  {depthMeters < 300
                    ? "Zone I • Sunlit Shallows"
                    : depthMeters < 1000
                      ? "Zone II • Mesopelagic Twilight"
                      : "Zone III • Abyssal Bioluminescent Trench"}
                </span>
                <div className="flex items-baseline gap-3">
                  <span
                    className={`font-mono text-4xl font-bold tabular-nums transition-colors duration-500 sm:text-5xl ${
                      isAbyssal
                        ? "text-cyan-300 drop-shadow-[0_0_18px_rgba(0,240,255,0.55)]"
                        : "text-white"
                    }`}
                  >
                    {depthMeters.toLocaleString()}m
                  </span>
                  <span className="font-mono text-xs text-slate-400 uppercase">
                    / 2,500m Target
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-1 h-1.5 w-60 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 transition-all duration-75"
                    style={{
                      width: `${Math.min(100, (depthMeters / 2500) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/75 px-4 py-3 font-mono text-xs text-slate-300 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">LEAD DIVER:</span>
                  <span className="text-white font-semibold">CAPTAIN SILAS</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">HELMET LUMEN:</span>
                  <span
                    className={
                      isAbyssal
                        ? "text-cyan-300 font-semibold"
                        : "text-slate-400"
                    }
                  >
                    {isAbyssal
                      ? "BIOLUMINESCENT ACTIVE (#00F0FF)"
                      : "STANDBY (<1,000m)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DiverPlungeLoader;

