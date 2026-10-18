'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface SpatialTiltCardProps {
  children: ReactNode
  className?: string
  /** Multiplier for 3D tilt rotation in degrees (default: 7.5) */
  tiltIntensity?: number
  /** Multiplier for subtle X/Y parallax translation in pixels (default: 10) */
  shiftIntensity?: number
  /** Z-axis pop-forward distance in pixels when hovered (default: 50) */
  hoverTranslateZ?: number
  /** Resting Z-axis offset in pixels to stagger elements in 3D space (default: 0) */
  baseTranslateZ?: number
  /** Whether hover-to-foreground lift and shadow expansion is enabled (default: true) */
  interactiveHover?: boolean
}

/**
 * Total 3D Depth Perception Utility (<SpatialTiltCard>):
 * Wraps UI cards, typography blocks, and interactive assets inside a 1200px CSS 3D perspective.
 * On hover, physically pops the element forward in Z-space (translateZ(50px)) and tilts
 * realistically toward the normalized cursor position while casting a glowing ambient shadow.
 */
export function SpatialTiltCard({
  children,
  className,
  tiltIntensity = 7.5,
  shiftIntensity = 10,
  hoverTranslateZ = 50,
  baseTranslateZ = 0,
  interactiveHover = true,
}: SpatialTiltCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Normalized viewport mouse coordinates (-1 to 1)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring-smoothed coordinates for weighted physical inertia
  const smoothX = useSpring(mouseX, { stiffness: 130, damping: 24, mass: 0.6 })
  const smoothY = useSpring(mouseY, { stiffness: 130, damping: 24, mass: 0.6 })

  // Real-time 3D rotation & positional parallax
  const rotateX = useTransform(smoothY, [-1, 1], [tiltIntensity, -tiltIntensity])
  const rotateY = useTransform(smoothX, [-1, 1], [-tiltIntensity, tiltIntensity])
  const x = useTransform(smoothX, [-1, 1], [-shiftIntensity, shiftIntensity])
  const y = useTransform(smoothY, [-1, 1], [-shiftIntensity, shiftIntensity])

  // Z-space elevation spring (Hover-to-Foreground translateZ(50px))
  const targetZ = useSpring(baseTranslateZ, { stiffness: 280, damping: 22, mass: 0.5 })
  const scale = useSpring(1, { stiffness: 280, damping: 22, mass: 0.5 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1
      const normalizedY = (event.clientY / window.innerHeight) * 2 - 1
      mouseX.set(normalizedX)
      mouseY.set(normalizedY)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    if (!interactiveHover) return
    targetZ.set(isHovered ? baseTranslateZ + hoverTranslateZ : baseTranslateZ)
    scale.set(isHovered ? 1.03 : 1)
  }, [isHovered, interactiveHover, baseTranslateZ, hoverTranslateZ, targetZ, scale])

  return (
    <div style={{ perspective: '1200px' }} className="perspective-[1200px] transform-3d">
      <motion.div
        onMouseEnter={() => interactiveHover && setIsHovered(true)}
        onMouseLeave={() => interactiveHover && setIsHovered(false)}
        style={{
          rotateX,
          rotateY,
          x,
          y,
          z: targetZ,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          'relative transition-[box-shadow,border-color] duration-300 will-change-transform',
          interactiveHover &&
            (isHovered
              ? 'z-30 border-cyan-400/50 shadow-[0_32px_70px_-12px_rgba(6,182,212,0.32),0_18px_36px_-18px_rgba(0,0,0,0.85)]'
              : 'z-10 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.65)]'),
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  )
}
