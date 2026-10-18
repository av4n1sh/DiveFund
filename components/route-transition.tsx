'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

interface DepthTransitionContextValue {
  /** Locks instant navigation, sinks current view, ripples dark-indigo caustics, and pushes route */
  navigateToDepth: (href: string) => void
  isTransitioning: boolean
}

const DepthTransitionContext = createContext<DepthTransitionContextValue>({
  navigateToDepth: () => {},
  isTransitioning: false,
})

export function useDepthTransition() {
  return useContext(DepthTransitionContext)
}

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSinking, setIsSinking] = useState(false)
  const [showCausticRipple, setShowCausticRipple] = useState(false)

  useEffect(() => {
    setIsSinking(false)
    const timer = setTimeout(() => {
      setShowCausticRipple(false)
    }, 360)
    return () => clearTimeout(timer)
  }, [pathname])

  const navigateToDepth = useCallback(
    (href: string) => {
      if (href === pathname || isSinking) return
      setIsSinking(true)
      setShowCausticRipple(true)

      setTimeout(() => {
        router.push(href)
      }, 390)
    },
    [pathname, isSinking, router]
  )

  return (
    <DepthTransitionContext.Provider value={{ navigateToDepth, isTransitioning: isSinking }}>
      {/* Low-key dark-indigo fluid caustics ripple overlay masking the client-side route swap */}
      <AnimatePresence>
        {showCausticRipple && (
          <motion.div
            key="dark-indigo-caustics-ripple"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: 'easeInOut' }}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-[#070d24]/88 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0.3, y: 50 }}
              animate={{ scale: 1.25, opacity: 0.85, y: -25 }}
              exit={{ scale: 1.45, opacity: 0 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.22)_0%,rgba(14,116,144,0.16)_42%,transparent_72%)]"
            />
            <motion.div
              initial={{ scale: 0.65, opacity: 0.45 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-1/4 rounded-full border border-indigo-400/20"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kinetic Route Container:
          - Active layout scales downward subtly (0.93) and fades away as if sinking into deep water
          - Incoming page views travel upward from the bottom boundary line (y: 56 -> 0) */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 56, scale: 0.985 }}
          animate={
            isSinking
              ? { opacity: 0, scale: 0.93, y: 18 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          exit={{ opacity: 0, scale: 0.93, y: 18 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </DepthTransitionContext.Provider>
  )
}
